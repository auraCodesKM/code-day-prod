'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Rocket, Play, Trophy, X } from 'lucide-react'
import Link from 'next/link'
import { useWeb3 } from '../../components/Web3Provider'
import { alchemyNFTService, SHIP_TYPES, AlchemyNFT } from '../../components/AlchemyService'
import AudioManager from '../../components/AudioManager'

// Your custom background images in order (using simpler filenames)
const MISSION_IMAGES = [
  '/images/space-stars.jpg',
  '/images/cloud-sea.jpg',
  '/images/space-3.jpg',
  '/images/space-4.jpg',
  '/images/space-5.jpg',
  '/images/space-6.jpg',
  '/images/space-7.jpg',
  '/images/space-8.jpg',
  '/images/space-9.jpg'
]

// Story-driven mission stages
const MISSION_STORY = [
  {
    title: "DEPARTURE",
    text: "Your ship launches from the space station. Navigate through the starfield to begin your journey.",
    challenge: "Avoid space debris"
  },
  {
    title: "CLOUD NEBULA",
    text: "Entering the mystical cloud sea. Strange energies detected. Stay alert, pilot.",
    challenge: "Navigate through energy storms"
  },
  {
    title: "ASTEROID FIELD",
    text: "Massive asteroid field ahead. Your piloting skills will be tested here.",
    challenge: "Dodge incoming asteroids"
  },
  {
    title: "DEEP SPACE",
    text: "You've entered uncharted territory. Unknown signals detected on long-range sensors.",
    challenge: "Investigate anomalies"
  },
  {
    title: "HOSTILE SECTOR",
    text: "WARNING: Enemy ships detected! Evasive maneuvers required immediately.",
    challenge: "Outmaneuver enemy forces"
  },
  {
    title: "COSMIC STORM",
    text: "A massive cosmic storm blocks your path. Navigate carefully through the chaos.",
    challenge: "Survive the storm"
  },
  {
    title: "ALIEN TERRITORY",
    text: "You've entered alien space. Strange structures visible in the distance.",
    challenge: "Avoid detection"
  },
  {
    title: "THE GAUNTLET",
    text: "Final challenge ahead. Multiple threats converging on your position.",
    challenge: "Survive the gauntlet"
  },
  {
    title: "MISSION COMPLETE",
    text: "Congratulations, pilot! You've successfully completed the mission.",
    challenge: "Return to base"
  }
]

export default function Mission() {
  const { isConnected, account } = useWeb3()
  const [userNFTs, setUserNFTs] = useState<AlchemyNFT[]>([])
  const [selectedShip, setSelectedShip] = useState<AlchemyNFT | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Mission states
  const [showCountdown, setShowCountdown] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [showSlideshow, setShowSlideshow] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [missionComplete, setMissionComplete] = useState(false)
  const [missionSuccess, setMissionSuccess] = useState(false)
  const [windowWidth, setWindowWidth] = useState(1920)
  const [mousePosition, setMousePosition] = useState({ x: 200, y: 400 })
  const [storyText, setStoryText] = useState('')
  const [gameScore, setGameScore] = useState(0)

  // Fetch user NFTs
  useEffect(() => {
    const fetchUserNFTs = async () => {
      if (!isConnected || !account) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const nfts = await alchemyNFTService.getNFTsForOwner(account)
        setUserNFTs(nfts)
        if (nfts.length > 0) {
          setSelectedShip(nfts[0]) // Auto-select first ship
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching NFTs:', error)
        setUserNFTs([])
        setLoading(false)
      }
    }

    fetchUserNFTs()
  }, [isConnected, account])

  // Handle window width for client-side rendering
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    
    // Set initial width
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth)
      window.addEventListener('resize', handleResize)
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  // Get ship image
  const getShipImage = (shipType: keyof typeof SHIP_TYPES) => {
    const typeMap = {
      'STELLAR VOYAGER': '/rockets/1.svg',
      'NEBULA HUNTER': '/rockets/2.svg', 
      'QUANTUM DESTROYER': '/rockets/3.svg'
    }
    return typeMap[shipType] || '/rockets/1.svg'
  }

  // Launch mission
  const launchMission = () => {
    if (!selectedShip) return
    
    setShowCountdown(true)
    setCountdown(3)

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          setShowCountdown(false)
          setShowSlideshow(true)
          setCurrentImageIndex(0)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Handle slideshow progression with story
  useEffect(() => {
    if (!showSlideshow) return

    // Set initial story text
    setStoryText(MISSION_STORY[0].text)
    setGameScore(0)

    const slideInterval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const nextIndex = prev + 1
        if (nextIndex >= MISSION_IMAGES.length) {
          // Mission complete
          setShowSlideshow(false)
          setMissionComplete(true)
          setMissionSuccess(gameScore > 5000) // Success based on score
          return prev
        }
        
        // Update story text for next stage
        if (nextIndex < MISSION_STORY.length) {
          setStoryText(MISSION_STORY[nextIndex].text)
        }
        
        // Add score for surviving each stage
        setGameScore(prevScore => prevScore + 1000)
        
        return nextIndex
      })
    }, 4000) // 4 seconds per stage for better story experience

    return () => clearInterval(slideInterval)
  }, [showSlideshow, gameScore])

  // Handle mouse movement for rocket control
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!showSlideshow) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setMousePosition({ x, y })
    
    // Add score for active piloting
    setGameScore(prev => prev + 1)
  }

  // Reset mission
  const resetMission = () => {
    setShowCountdown(false)
    setShowSlideshow(false)
    setMissionComplete(false)
    setCurrentImageIndex(0)
    setCountdown(3)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <AudioManager />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Wallet</h2>
          <p className="text-gray-400 mb-6">Connect your wallet to access missions</p>
          <Link href="/">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Return Home
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative">
      <AudioManager />
      
      {/* Main Mission Interface */}
      {!showCountdown && !showSlideshow && !missionComplete && (
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <Link href="/fleet" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Fleet</span>
            </Link>
            
            <h1 className="text-4xl font-bold text-white">Mission Control</h1>
            <div className="w-20"></div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading fleet...</p>
            </div>
          ) : userNFTs.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-white mb-4">No Ships Available</h2>
              <p className="text-gray-400 mb-6">You need ships to launch missions</p>
              <Link href="/marketplace">
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Get Ships
                </button>
              </Link>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Ship Selection */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Select Your Ship</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {userNFTs.map((nft) => {
                    const shipData = SHIP_TYPES[nft.shipType]
                    const isSelected = selectedShip?.tokenId === nft.tokenId
                    
                    return (
                      <div
                        key={nft.tokenId}
                        onClick={() => setSelectedShip(nft)}
                        className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                          isSelected 
                            ? 'bg-blue-600/20 border-2 border-blue-500' 
                            : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="text-center">
                          <img
                            src={getShipImage(nft.shipType)}
                            alt={shipData.name}
                            className="w-16 h-16 mx-auto mb-4"
                          />
                          <h3 className="font-bold text-white mb-2">{shipData.name}</h3>
                          <p className="text-sm text-gray-400 mb-3">#{nft.tokenId} • Level {nft.level}</p>
                          <div className="flex justify-between text-xs">
                            <span className="text-yellow-400">⚡{shipData.stats.speed}</span>
                            <span className="text-blue-400">🛡️{shipData.stats.armor}</span>
                            <span className="text-green-400">🍀{shipData.stats.luck}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Mission Launch */}
              {selectedShip && (
                <div className="text-center">
                  <div className="bg-gray-800 rounded-xl p-8 mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">Mission Brief</h3>
                    <p className="text-gray-300 mb-6">
                      Launch your {SHIP_TYPES[selectedShip.shipType].name} on a dangerous mission through the cosmic void.
                      <br />
                      <span className="text-red-400 font-bold">Warning: Mission failure will destroy your NFT permanently.</span>
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-400">50%</div>
                        <div className="text-sm text-gray-400">Success Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400">250</div>
                        <div className="text-sm text-gray-400">GALACTIC Reward</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-400">BURN</div>
                        <div className="text-sm text-gray-400">On Failure</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={launchMission}
                    className="group relative px-12 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-xl rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
                  >
                    <Play className="w-6 h-6 inline mr-2" />
                    Launch Mission
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Full-Screen Countdown */}
      <AnimatePresence>
        {showCountdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            <div className="absolute inset-0">
              <img
                src="/images/space-stars.jpg"
                alt="Space"
                className="w-full h-full object-cover opacity-50"
                onError={(e) => {
                  console.log('Countdown background image failed to load:', e.currentTarget.src)
                  e.currentTarget.style.display = 'none'
                }}
                onLoad={() => console.log('Countdown background loaded successfully')}
              />
            </div>
            
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 text-center"
            >
              <div className="text-[25rem] font-bold text-white leading-none">
                {countdown}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen Slideshow with Flying Rocket */}
      <AnimatePresence>
        {showSlideshow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[60] overflow-hidden cursor-none"
            style={{ zIndex: 9999 }}
            onMouseMove={handleMouseMove}
          >
            {/* Background Image */}
            <motion.div
              key={currentImageIndex}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img
                src={MISSION_IMAGES[currentImageIndex]}
                alt={`Mission stage ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log(`Slideshow image ${currentImageIndex} failed to load:`, e.currentTarget.src)
                  // Fallback to a solid color background
                  e.currentTarget.style.display = 'none'
                  const parent = e.currentTarget.parentElement
                  if (parent) {
                    parent.style.background = `linear-gradient(45deg, #1a1a2e, #16213e, #0f3460)`
                  }
                }}
                onLoad={() => console.log(`Slideshow image ${currentImageIndex} loaded successfully`)}
              />
            </motion.div>

            {/* Mouse-Controlled Rocket */}
            <motion.div
              animate={{ 
                x: mousePosition.x - 24,
                y: mousePosition.y - 24
              }}
              transition={{ 
                type: "spring",
                damping: 20,
                stiffness: 300
              }}
              className="absolute z-10 pointer-events-none"
            >
              <img
                src={selectedShip ? getShipImage(selectedShip.shipType) : '/rockets/1.svg'}
                alt="Ship"
                className="w-12 h-12 transform rotate-12 drop-shadow-lg"
                style={{
                  filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.9)) drop-shadow(0 0 30px rgba(0,150,255,0.6))'
                }}
              />
              {/* Engine trail */}
              <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2">
                <div className="w-12 h-1.5 bg-gradient-to-r from-blue-400 to-transparent rounded-full opacity-90"></div>
                <div className="w-8 h-0.5 bg-gradient-to-r from-white to-transparent rounded-full opacity-70 mt-0.5"></div>
              </div>
            </motion.div>

            {/* Story UI - Top Center */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 max-w-2xl">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-black/70 backdrop-blur-md px-8 py-4 rounded-2xl border border-blue-500/30"
              >
                <div className="text-center">
                  <div className="text-blue-400 font-bold text-lg mb-2">
                    {MISSION_STORY[currentImageIndex]?.title || 'MISSION STAGE'}
                  </div>
                  <div className="text-white text-sm leading-relaxed">
                    {storyText}
                  </div>
                  <div className="text-yellow-400 text-xs mt-2 font-medium">
                    {MISSION_STORY[currentImageIndex]?.challenge || 'Navigate safely'}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Game HUD - Top Left */}
            <div className="absolute top-8 left-8 z-20">
              <div className="bg-black/70 backdrop-blur-md px-4 py-3 rounded-xl border border-green-500/30">
                <div className="text-green-400 font-bold text-sm mb-1">PILOT SCORE</div>
                <div className="text-white font-mono text-xl">{gameScore.toLocaleString()}</div>
              </div>
            </div>

            {/* Ship Status - Top Right */}
            <div className="absolute top-8 right-8 z-20">
              <div className="bg-black/70 backdrop-blur-md px-4 py-3 rounded-xl border border-purple-500/30">
                <div className="text-purple-400 font-bold text-sm mb-1">SHIP STATUS</div>
                <div className="text-white text-sm">
                  {selectedShip ? SHIP_TYPES[selectedShip.shipType].name : 'Unknown'}
                </div>
                <div className="text-green-400 text-xs">OPERATIONAL</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-80 z-20">
              <div className="bg-black/50 backdrop-blur-sm p-4 rounded-xl">
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentImageIndex + 1) / MISSION_IMAGES.length) * 100}%` }}
                  ></div>
                </div>
                <div className="text-white text-center text-sm">
                  Mission Progress: {Math.round(((currentImageIndex + 1) / MISSION_IMAGES.length) * 100)}%
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mission Complete Modal */}
      <AnimatePresence>
        {missionComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className={`max-w-md w-full p-8 rounded-2xl text-center ${
                missionSuccess 
                  ? 'bg-green-600/20 border-2 border-green-500' 
                  : 'bg-red-600/20 border-2 border-red-500'
              }`}
            >
              {missionSuccess ? (
                <>
                  <Trophy className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-4">Mission Success!</h2>
                  <p className="text-gray-300 mb-6">
                    Your ship has completed the mission successfully!
                  </p>
                  <div className="bg-black/30 p-4 rounded-xl mb-6">
                    <div className="text-2xl font-bold text-purple-400 mb-2">
                      +250 GALACTIC
                    </div>
                    <div className="text-sm text-gray-400">Reward Earned</div>
                  </div>
                </>
              ) : (
                <>
                  <X className="w-20 h-20 text-red-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-4">Mission Failed!</h2>
                  <p className="text-gray-300 mb-6">
                    Your ship was lost in the cosmic void...
                    <br />
                    <strong className="text-red-500">NFT Destroyed</strong>
                  </p>
                  <div className="bg-black/30 p-4 rounded-xl mb-6">
                    <div className="text-lg font-bold text-red-500 mb-2">
                      {selectedShip && SHIP_TYPES[selectedShip.shipType].name} #{selectedShip?.tokenId}
                    </div>
                    <div className="text-sm text-gray-400">Lost Forever</div>
                  </div>
                </>
              )}
              
              <button
                onClick={resetMission}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
