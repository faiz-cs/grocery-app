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
          <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
            F
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
