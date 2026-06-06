'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Camera, Link, X, RotateCcw, Check, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  value: string
  onChange: (url: string) => void
}

type Mode = 'idle' | 'url' | 'camera' | 'preview'

export default function ImageUploader({ value, onChange }: Props) {
  const [mode, setMode] = useState<Mode>(value ? 'preview' : 'idle')
  const [urlInput, setUrlInput] = useState(value || '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [imgError, setImgError] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // ── Upload blob/file to Supabase Storage ─────────────────────────
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
    setImgError(false)
    setMode('preview')
    setUploading(false)
  }, [onChange])

  // ── File input handler ────────────────────────────────────────────
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  // ── URL submit — store as-is, use plain <img> to display ─────────
  const handleUrlSubmit = () => {
    const url = urlInput.trim()
    if (!url) return
    onChange(url)
    setImgError(false)
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
      setError('Camera access denied or not available on this device.')
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
    canvas.toBlob(blob => {
      if (!blob) return
      stopCamera()
      setMode('preview')
      uploadFile(new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' }))
    }, 'image/jpeg', 0.9)
  }

  const reset = () => {
    stopCamera()
    onChange('')
    setUrlInput('')
    setError('')
    setImgError(false)
    setMode('idle')
  }

  // ── Preview ───────────────────────────────────────────────────────
  if (mode === 'preview' && value) {
    return (
      <div className="space-y-2">
        <div className="relative w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200" style={{ minHeight: 200 }}>
          {/* Use plain <img> so any URL works without Next.js domain restrictions */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Product preview"
            onError={() => setImgError(true)}
            onLoad={() => setImgError(false)}
            className="w-full h-48 object-contain"
          />
          {imgError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400 bg-gray-50">
              <AlertCircle className="w-8 h-8" />
              <p className="text-xs text-center px-4">Image failed to load.<br/>Check the URL or try uploading instead.</p>
            </div>
          )}
          <button
            type="button"
            onClick={reset}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {uploading && (
          <p className="text-xs text-brand-600 text-center animate-pulse">⏳ Uploading to storage…</p>
        )}
        {!uploading && !imgError && (
          <p className="text-xs text-green-600 text-center flex items-center justify-center gap-1">
            <Check className="w-3 h-3" /> Image ready
          </p>
        )}

        {/* Show current URL for reference */}
        <p className="text-xs text-gray-400 truncate text-center">{value}</p>
      </div>
    )
  }

  // ── Camera view ───────────────────────────────────────────────────
  if (mode === 'camera') {
    return (
      <div className="space-y-3">
        <div className="relative rounded-xl overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={capturePhoto} className="btn-primary flex-1 py-3">
            <Camera className="w-4 h-4" /> Capture Photo
          </button>
          <button type="button" onClick={() => { stopCamera(); setMode('idle') }} className="btn-secondary px-4">
            <X className="w-4 h-4" />
          </button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }

  // ── URL input ─────────────────────────────────────────────────────
  if (mode === 'url') {
    return (
      <div className="space-y-3">
        <p className="text-xs text-gray-500">Paste any image URL from the web (Google Images, product sites, etc.)</p>
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleUrlSubmit())}
            className="input flex-1"
            placeholder="https://example.com/tomato.jpg"
            autoFocus
          />
          <button type="button" onClick={handleUrlSubmit} disabled={!urlInput.trim()} className="btn-primary px-4">
            <Check className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setMode('idle')} className="btn-secondary px-3">
            <X className="w-4 h-4" />
          </button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }

  // ── Idle ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="hidden" />
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setMode('url')}
          className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-400 hover:bg-brand-50 transition-all group"
        >
          <Link className="w-6 h-6 text-gray-400 group-hover:text-brand-600" />
          <span className="text-xs font-medium text-gray-500 group-hover:text-brand-700">Paste URL</span>
        </button>

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
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
