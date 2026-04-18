import { useState, useRef } from 'react'
import './ImageCapture.css'

function ImageCapture({ images, setImages, imageKey }) {
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      })
      setStream(mediaStream)
      setShowCamera(true)
      
      // Wait for video element to be ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      }, 100)
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Could not access camera. Please check permissions.')
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      // Set canvas size to video size
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Convert to base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8)
      
      // Update images state
      setImages(prev => ({
        ...prev,
        [imageKey]: imageData
      }))
      
      // Stop camera
      stopCamera()
    }
  }

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      // Read file as base64
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages(prev => ({
          ...prev,
          [imageKey]: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Clear image
  const clearImage = () => {
    setImages(prev => ({
      ...prev,
      [imageKey]: null
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="image-capture">
      {!images[imageKey] && !showCamera && (
        <div className="image-capture-buttons">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-upload"
          >
            📁 Hand Note
          </button>
          <button 
            type="button"
            onClick={startCamera}
            className="btn-camera"
          >
            📷 Web Cam
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {showCamera && (
        <div className="camera-view">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            className="camera-video"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div className="camera-controls">
            <button 
              type="button"
              onClick={capturePhoto}
              className="btn-capture"
            >
              📸 Capture
            </button>
            <button 
              type="button"
              onClick={stopCamera}
              className="btn-cancel-camera"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      )}

      {images[imageKey] && !showCamera && (
        <div className="image-preview">
          <img 
            src={images[imageKey]} 
            alt="Preview" 
            className="preview-image"
          />
          <button 
            type="button"
            onClick={clearImage}
            className="btn-clear-image"
          >
            ✕ Clear
          </button>
        </div>
      )}
    </div>
  )
}

export default ImageCapture
