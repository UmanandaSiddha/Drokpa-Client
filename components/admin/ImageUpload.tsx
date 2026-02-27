'use client'

import { useState, useRef } from 'react'
import { useFileUpload } from '@/hooks/upload'
import { UploadType } from '@/types/upload'
import { Upload, X, AlertCircle, Check } from 'lucide-react'

interface ImageUploadProps {
    uploadType: UploadType
    contextId: string
    onUpload: (publicUrl: string) => void
    onError?: (error: string) => void
    currentImageUrl?: string
    maxSizeMB?: number
    acceptedFormats?: string[]
}

export function ImageUpload({
    uploadType,
    contextId,
    onUpload,
    onError,
    currentImageUrl,
    maxSizeMB = 5,
    acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { upload, isUploading, error } = useFileUpload()

    const handleFile = async (file: File) => {
        // Validation
        if (!acceptedFormats.includes(file.type)) {
            const errorMsg = `Invalid format. Accept: ${acceptedFormats.join(', ')}`
            onError?.(errorMsg)
            return
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            const errorMsg = `File too large. Max ${maxSizeMB}MB`
            onError?.(errorMsg)
            return
        }

        // Show preview
        const reader = new FileReader()
        reader.onload = (e) => {
            setPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)

        // Upload
        const publicUrl = await upload(
            {
                uploadType,
                contextId,
                fileName: file.name,
                fileType: file.type,
            },
            file
        )

        if (publicUrl) {
            onUpload(publicUrl)
        } else if (error) {
            onError?.(error)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const files = e.dataTransfer.files
        if (files.length > 0) {
            handleFile(files[0])
        }
    }

    return (
        <div className="image-upload">
            {preview ? (
                <div className="image-upload__preview">
                    <div className="image-upload__preview-image" style={{ backgroundImage: `url(${preview})` }} />
                    {isUploading && (
                        <div className="image-upload__overlay">
                            <div className="image-upload__spinner" />
                        </div>
                    )}
                    {!isUploading && (
                        <button
                            type="button"
                            onClick={() => {
                                setPreview(null)
                                if (fileInputRef.current) fileInputRef.current.value = ''
                            }}
                            className="image-upload__remove"
                        >
                            <X size={16} />
                        </button>
                    )}
                    {!isUploading && currentImageUrl === preview && (
                        <div className="image-upload__badge">
                            <Check size={14} />
                        </div>
                    )}
                </div>
            ) : (
                <div
                    className={`image-upload__dropzone ${isDragging ? 'image-upload__dropzone--active' : ''}`}
                    onDragOver={(e) => {
                        e.preventDefault()
                        setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload size={32} className="image-upload__icon" />
                    <p className="image-upload__title">
                        {isUploading ? 'Uploading…' : 'Drop image or click to upload'}
                    </p>
                    <p className="image-upload__subtitle">
                        Max {maxSizeMB}MB • PNG, JPG, WebP
                    </p>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats.join(',')}
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        handleFile(e.target.files[0])
                    }
                }}
                className="image-upload__input"
                disabled={isUploading}
            />

            {error && (
                <div className="image-upload__error">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}
        </div>
    )
}

// Minimal styles - add to admin.css
const styles = `
.image-upload {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.image-upload__dropzone {
    border: 2px dashed #cbd5e1;
    border-radius: 0.5rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    background: #f8fafc;
}

.image-upload__dropzone:hover {
    border-color: #94a3b8;
    background: #eef2f7;
}

.image-upload__dropzone--active {
    border-color: #0f766e;
    background: #f0fdfa;
}

.image-upload__icon {
    color: #64748b;
    margin-bottom: 0.5rem;
}

.image-upload__title {
    font-weight: 500;
    color: #1e293b;
    margin: 0;
}

.image-upload__subtitle {
    font-size: 0.85rem;
    color: #94a3b8;
    margin: 0.25rem 0 0;
}

.image-upload__input {
    display: none;
}

.image-upload__preview {
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
}

.image-upload__preview-image {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
}

.image-upload__overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.image-upload__spinner {
    width: 24px;
    height: 24px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

.image-upload__remove {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
}

.image-upload__remove:hover {
    background: rgba(0, 0, 0, 0.8);
}

.image-upload__badge {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    background: #10b981;
    color: white;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.image-upload__error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: #fef2f2;
    color: #dc2626;
    border-radius: 0.375rem;
    font-size: 0.875rem;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
`
