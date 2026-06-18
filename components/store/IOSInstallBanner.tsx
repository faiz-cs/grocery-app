'use client'

import { useEffect, useState } from 'react'
import { X, Share } from 'lucide-react'

export default function IOSInstallBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Only show on iOS Safari
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const isSafari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const dismissed = localStorage.getItem('ios-install-dismissed')

    if (isIOS && isSafari && !isStandalone && !dismissed) {
      // Show after 3 seconds
      const t = setTimeout(() => setShow(true), 3000)
      return () => clearTimeout(t)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem('ios-install-dismissed', '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:hidden animate-in slide-in-from-bottom duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4">
        <div className="flex items-start gap-3">
          {/* App icon */}
          <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 512 512" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M140 220 L372 220 L340 360 Q336 380 316 380 L196 380 Q176 380 172 360 Z" fill="white"/>
              <path d="M190 220 Q170 160 210 130 Q240 108 256 120" stroke="white" strokeWidth="36" strokeLinecap="round"/>
              <path d="M322 220 Q342 160 302 130 Q272 108 256 120" stroke="white" strokeWidth="36" strokeLinecap="round"/>
              <line x1="200" y1="270" x2="312" y2="270" stroke="#16a34a" strokeWidth="22" strokeLinecap="round"/>
              <line x1="210" y1="310" x2="302" y2="310" stroke="#16a34a" strokeWidth="22" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm">Install FreshMart</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Tap <span className="inline-flex items-center gap-0.5 text-blue-500 font-medium">
                <Share className="w-3 h-3" /> Share
              </span> then <span className="font-medium text-gray-700">&quot;Add to Home Screen&quot;</span> for the best experience.
            </p>
          </div>
          <button onClick={dismiss} className="text-gray-400 hover:text-gray-600 shrink-0 mt-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Arrow pointing to Safari share button */}
        <div className="mt-3 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center">
              <Share className="w-3 h-3 text-white" />
            </span>
            <span>Tap Share at the bottom of Safari</span>
          </div>
        </div>

        {/* Down arrow indicator */}
        <div className="flex justify-center mt-2">
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="w-1 h-1 rounded-full bg-gray-400" />
            <div className="w-1 h-1 rounded-full bg-gray-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
