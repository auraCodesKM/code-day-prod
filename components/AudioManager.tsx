'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export default function AudioManager() {
  const backgroundMusicRef = useRef<HTMLAudioElement>(null)
  const clickSoundRef = useRef<HTMLAudioElement>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Initialize background music
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = 0.6
      backgroundMusicRef.current.loop = true
    }

    // Initialize click sound
    if (clickSoundRef.current) {
      clickSoundRef.current.volume = 0.8
    }

    // Global click sound handler - play on ANY click
    const handleGlobalClick = (e: MouseEvent) => {
      // Play click sound on every click anywhere on the website
      playClickSound()
    }

    // Global hover sound handler for buttons
    const handleGlobalMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      if (
        target.tagName === 'BUTTON' ||
        target.closest('button')
      ) {
        playHoverSound()
      }
    }

    // Add global click and hover listeners
    document.addEventListener('click', handleGlobalClick)
    document.addEventListener('mouseenter', handleGlobalMouseEnter, true)

    // Auto-start music after user interaction (required by browsers)
    const startMusic = () => {
      if (backgroundMusicRef.current && !isPlaying) {
        backgroundMusicRef.current.play().catch(console.log)
        setIsPlaying(true)
      }
    }

    document.addEventListener('click', startMusic, { once: true })
    document.addEventListener('keydown', startMusic, { once: true })

    return () => {
      document.removeEventListener('click', handleGlobalClick)
      document.removeEventListener('mouseenter', handleGlobalMouseEnter, true)
      document.removeEventListener('click', startMusic)
      document.removeEventListener('keydown', startMusic)
    }
  }, [isPlaying])

  const playClickSound = () => {
    if (clickSoundRef.current && !isMuted) {
      clickSoundRef.current.currentTime = 0
      clickSoundRef.current.play().catch(console.log)
    }
  }

  const playHoverSound = () => {
    if (clickSoundRef.current && !isMuted) {
      // Play a softer version for hover (but still audible)
      const originalVolume = clickSoundRef.current.volume
      clickSoundRef.current.volume = 0.4
      clickSoundRef.current.currentTime = 0
      clickSoundRef.current.play().catch(console.log)
      
      // Reset volume after a short delay
      setTimeout(() => {
        if (clickSoundRef.current) {
          clickSoundRef.current.volume = originalVolume
        }
      }, 100)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.muted = !isMuted
    }
  }

  const toggleMusic = () => {
    if (backgroundMusicRef.current) {
      if (isPlaying) {
        backgroundMusicRef.current.pause()
        setIsPlaying(false)
      } else {
        backgroundMusicRef.current.play().catch(console.log)
        setIsPlaying(true)
      }
    }
  }

  return (
    <>
      {/* Background Music */}
      <audio
        ref={backgroundMusicRef}
        preload="auto"
        muted={isMuted}
      >
        <source src="/audio/Danger Storm.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Click Sound Effect */}
      <audio
        ref={clickSoundRef}
        preload="auto"
        muted={isMuted}
      >
        <source src="/audio/clickSound.wav" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>

      {/* Audio Controls */}
      <div className="fixed top-4 right-4 z-50">
        {/* Single Audio Control Button */}
        <button
          onClick={toggleMute}
          className="neon-button p-3 text-neon-blue hover:text-neon-green transition-all duration-300 backdrop-blur-sm bg-cyber-gray/20"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6" />
          ) : (
            <Volume2 className="w-6 h-6 animate-pulse" />
          )}
        </button>
      </div>

      {/* Music Status Indicator */}
      {isPlaying && !isMuted && (
        <div className="fixed bottom-4 right-4 z-40">
          <div className="bg-cyber-gray/80 border border-neon-blue p-2 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
              <span className="font-pixel text-neon-green text-xs">
                DANGER STORM
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
