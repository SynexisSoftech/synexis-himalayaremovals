"use client"

import Image from "next/image"
import { useState } from "react"

interface SafeImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  fallbackSrc?: string
}

export default function SafeImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  fallbackSrc,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      const defaultFallback = fill
        ? "/placeholder.svg?height=400&width=600"
        : `/placeholder.svg?height=${height || 400}&width=${width || 600}`
      setImgSrc(fallbackSrc || defaultFallback)
    }
  }

  const imageProps = {
    src: imgSrc,
    alt,
    className,
    priority,
    onError: handleError,
    ...(fill ? { fill: true } : { width, height }),
  }

  return <Image {...imageProps} />
}
