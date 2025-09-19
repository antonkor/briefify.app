import { useState, useEffect } from 'react'

const heroTexts = [
  "Extract key insights in seconds",
  "Discover hidden gems instantly",
  "The new Hello, World app!",
  "Uncover meaningful discussions",
  "Filter signal from noise"
]

/**
 * Custom hook for managing rotating hero text display
 * Automatically cycles through predefined hero texts every 3 seconds
 * @returns Object with current hero text and text index
 */
export const useHeroText = () => {
  const [heroTextIndex, setHeroTextIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTextIndex((prevIndex) => (prevIndex + 1) % heroTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return {
    currentHeroText: heroTexts[heroTextIndex],
    heroTextIndex,
    heroTexts
  }
}