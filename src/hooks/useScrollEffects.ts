import { useState, useEffect } from 'react'

/**
 * Custom hook for handling scroll effects with optimized performance
 * Uses requestAnimationFrame for smooth scroll tracking
 * @returns scrollY - Current scroll position
 */
export const useScrollEffects = () => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { scrollY }
}