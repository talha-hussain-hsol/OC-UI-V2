import React, { useState, useRef } from "react"
import { Button } from "react-bootstrap"

function CameraCapture({ onImageCapture }) {
  const [showCamera, setShowCamera] = useState(false)
  const [imageData, setImageData] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const openCamera = () => {
    setShowCamera(true)
    startCamera()
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = stream
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const captureImage = () => {
    const canvas = canvasRef.current
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext("2d")
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    const capturedImageData = canvas.toDataURL("image/png")
    setImageData(capturedImageData)
    setShowCamera(false)
    onImageCapture(capturedImageData)
  }

  const retakeImage = () => {
    setImageData(null)
    startCamera()
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  return (
    <div>
      {!showCamera && !imageData && (
        <Button onClick={openCamera}>Open Camera</Button>
      )}

      {showCamera && (
        <>
          <video
            ref={videoRef}
            autoPlay
            style={{ width: "100%", height: "auto" }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <Button
            variant="primary"
            onClick={async () => {
              const imageData = await captureImage()
              const base64Data = await convertToBase64(imageData)
              setImageData(base64Data)
            }}
          >
            Capture Image
          </Button>
        </>
      )}
      {console.log(imageData, "img data")}

      {imageData && (
        <div>
          <img src={imageData} alt="Captured" style={{ maxWidth: "100%" }} />
          <Button variant="secondary" onClick={retakeImage}>
            Retake
          </Button>
        </div>
      )}
    </div>
  )
}

export default CameraCapture
