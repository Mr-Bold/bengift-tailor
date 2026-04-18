import { useState, useEffect } from 'react'
import './InstallPrompt.css'

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if user has already dismissed the prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) return

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Show the install prompt
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleContinue = () => {
    // Remember that user dismissed the prompt
    localStorage.setItem('pwa-install-dismissed', 'true')
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="install-prompt-overlay">
      <div className="install-prompt">
        <div className="install-prompt-header">
          <div className="install-prompt-icon">
            <div className="app-icon">BG</div>
          </div>
          <button 
            className="install-prompt-close" 
            onClick={handleContinue}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="install-prompt-content">
          <h2>Install BenGift Clothing</h2>
          <p className="install-prompt-subtitle">
            Get the full app experience with offline access and faster loading
          </p>

          <ul className="install-prompt-benefits">
            <li>
              <span className="benefit-icon">📱</span>
              <span>Add to home screen</span>
            </li>
            <li>
              <span className="benefit-icon">⚡</span>
              <span>Faster loading times</span>
            </li>
            <li>
              <span className="benefit-icon">📡</span>
              <span>Works offline</span>
            </li>
            <li>
              <span className="benefit-icon">🔔</span>
              <span>Push notifications</span>
            </li>
          </ul>
        </div>

        <div className="install-prompt-actions">
          <button 
            className="btn-continue" 
            onClick={handleContinue}
          >
            Continue in Browser
          </button>
          <button 
            className="btn-install" 
            onClick={handleInstall}
          >
            Install App
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstallPrompt
