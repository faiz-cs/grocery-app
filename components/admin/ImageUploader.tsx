'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Camera, Link, X, RotateCcw, Check } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface Props {
  value: string
  onChange: (url: string) => void
}

type Mode = 'idle' | 'url' | 'upload' | 'camera' | 'preview'

export default function ImageUploader({ value, onChange }: Props) {
  const [mode, setMode] = useState<Mode>(value ? 'preview' : 'idle')
  const [urlInput, setUrlInput] = useState(value || '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // ── Upload file to Supabase Storage ──────────────────────────────
  const uploadFile = useCallback(async (file: File) => {
    setUploading(true)
    setError('')
    const supabase = createClient()
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(path, file, { upsert: true })
    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('images').getPublicUrl(path)
    onChange(data.publicUrl)
    setMode('preview')
    setUploading(false)
  }, [onChange])

  // ── Handle file input ─────────────────────────────────────────────
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  // ── URL submit ────────────────────────────────────────────────────
  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return
    onChange(urlInput.trim())
    setMode('preview')
  }

  // ── Camera ────────────────────────────────────────────────────────
  const startCamera = async () => {
    setError('')
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      setStream(s)
      setMode('camera')
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = s
          videoRef.current.play()
        }
      }, 100)
    } catch {
      setError('Camera access denied or not available.')
    }
  }

  const stopCamera = () => {
    stream?.getTracks().forEach(t => t.stop())
    setStream(null)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setCapturedImage(dataUrl)
    stopCamera()
    setMode('preview')
    // Convert dataURL to File and upload
    fetch(dataUrl)
      .then(r => r.blob())
      .then(blob => uploadFile(new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' })))
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    startCamera()
  }

  const reset = () => {
    stopCamera()
    setCapturedImage(null)
    onChange('')
    setUrlInput('')
    setError('')
    setMode('idle')
  }

  // ── Preview ───────────────────────────────────────────────────────
  const previewSrc = capturedImage || value

  if (mode === 'preview' && previewSrc) {
    return (
      <div className="space-y-3">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
          <Image src={previewSrc} alt="Product" fill className="object-contain" sizes="600px" />
          <button
            type="button"
            onClick={reset}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {uploading && (
          <p className="text-xs text-brand-600 text-center animate-pulse">Uploading image…</p>
        )}
        {!uploading && (
          <p className="text-xs text-green-600 text-center flex items-center justify-center gap-1">
            <Check className="w-3 h-3" /> Image ready
          </p>
        )}
      </div>
    )
  }

  // ── Camera view ───────────────────────────────────────────────────
  if (mode === 'camera') {
    return (
      <div className="space-y-3">
        <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={capturePhoto}
            className="btn-primary flex-1 py-3"
          >
            <Camera className="w-4 h-4" /> Capture Photo
          </button>
          <button
            type="button"
            onClick={() => { stopCamera(); setMode('idle') }}
            className="btn-secondary px-4"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  }

  // ── URL input mode ────────────────────────────────────────────────
  if (mode === 'url') {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleUrlSubmit())}
            className="input flex-1"
            placeholder="https://example.com/image.jpg"
            autoFocus
          />
          <button type="button" onClick={handleUrlSubmit} className="btn-primary px-4">
            <Check className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setMode('idle')} className="btn-secondary px-3">
            <X className="w-4 h-4" />
          </button>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  }

  // ── Idle — pick a method ──────────────────────────────────────────
  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="hidden" />

      {/* 3 options */}
      <div className="grid grid-cols-3 gap-3">
        {/* URL */}
        <button
          type="button"
          onClick={() => setMode('url')}
          className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-400 hover:bg-brand-50 transition-all group"
        >
          <Link className="w-6 h-6 text-gray-400 group-hover:text-brand-600" />
          <span className="text-xs font-medium text-gray-500 group-hover:text-brand-700">Paste URL</span>
        </button>

        {/* Upload */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-400 hover:bg-brand-50 transition-all group disabled:opacity-50"
        >
          <Upload className="w-6 h-6 text-gray-400 group-hover:text-brand-600" />
          <span className="text-xs font-medium text-gray-500 group-hover:text-brand-700">
            {uploading ? 'Uploading…' : 'Upload File'}
          </span>
        </button>

        {/* Camera */}
        <button
          type="button"
          onClick={startCamera}
          className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-400 hover:bg-brand-50 transition-all group"
        >
          <Camera className="w-6 h-6 text-gray-400 group-hover:text-brand-600" />
          <span className="text-xs font-medium text-gray-500 group-hover:text-brand-700">Take Photo</span>
        </button>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
