import { useState, useEffect } from 'react'
import './ConfirmModal.css'

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'warning' }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const handleConfirm = () => {
    setIsVisible(false)
    setTimeout(() => {
      onConfirm()
      onClose()
    }, 300)
  }

  if (!isOpen) return null

  return (
    <div className={`confirm-modal-overlay ${isVisible ? 'visible' : ''}`} onClick={handleClose}>
      <div className={`confirm-modal ${isVisible ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className={`confirm-modal-icon ${type}`}>
          {type === 'warning' && '⚠️'}
          {type === 'danger' && '🗑️'}
          {type === 'info' && 'ℹ️'}
          {type === 'success' && '✓'}
        </div>
        
        <h3 className="confirm-modal-title">{title}</h3>
        <p className="confirm-modal-message">{message}</p>
        
        <div className="confirm-modal-actions">
          <button 
            type="button"
            className="confirm-modal-btn cancel" 
            onClick={handleClose}
          >
            {cancelText}
          </button>
          <button 
            type="button"
            className={`confirm-modal-btn confirm ${type}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
