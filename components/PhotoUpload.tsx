'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Camera, Upload } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"

interface PhotoUploadProps {
  onPhotoUploaded: (url: string) => void
}

export function PhotoUpload({ onPhotoUploaded }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const processImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        // Determine the size of the square crop
        const size = Math.min(img.width, img.height)
        canvas.width = size
        canvas.height = size

        // Calculate cropping
        const xOffset = (img.width - size) / 2
        const yOffset = (img.height - size) / 2

        // Draw the cropped image
        ctx.drawImage(img, xOffset, yOffset, size, size, 0, 0, size, size)

        // Convert to Blob and then to File
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], file.name, { type: 'image/jpeg' })
            resolve(croppedFile)
          } else {
            reject(new Error('Failed to create blob'))
          }
        }, 'image/jpeg', 0.1) // Adjust quality here for compression (0.1 = 10% quality)
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  const uploadToFirebase = async (file: File): Promise<string> => {
    const storageRef = ref(storage, 'category-images/' + file.name)
    await uploadBytes(storageRef, file)
    return getDownloadURL(storageRef)
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      await handleUpload(file)
    }
  }

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const processedFile = await processImage(file)
      const url = await uploadToFirebase(processedFile)
      onPhotoUploaded(url)
      toast({ title: 'Success', description: 'Photo uploaded successfully' })
    } catch (error) {
      console.error('Upload failed:', error)
      toast({ title: 'Error', description: 'Failed to upload photo', variant: 'destructive' })
    } finally {
      setIsUploading(false)
    }
  }

  const handleCameraCapture = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cameraInputRef.current) {
      cameraInputRef.current.click()
    }
  }

  const handleFileUpload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        ref={cameraInputRef}
      />
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <Button onClick={handleCameraCapture} disabled={isUploading} className="w-full sm:w-auto" type="button">
          <Camera className="mr-2 h-4 w-4" />
          Take Photo
        </Button>
        <Button onClick={handleFileUpload} disabled={isUploading} className="w-full sm:w-auto" type="button">
          <Upload className="mr-2 h-4 w-4" />
          Upload Photo
        </Button>
      </div>
      {isUploading && <p>Uploading...</p>}
    </div>
  )
}