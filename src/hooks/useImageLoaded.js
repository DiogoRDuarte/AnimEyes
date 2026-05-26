import { useState, useEffect } from 'react'

export function useImageLoaded(src) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!src) {
      setLoaded(false)
      return
    }

    setLoaded(false)
    const img = new Image()
    img.onload = () => setLoaded(true)
    img.onerror = () => setLoaded(true)
    img.src = src

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  return loaded
}
