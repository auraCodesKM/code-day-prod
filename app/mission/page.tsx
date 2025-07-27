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
  
  // Dopamine hit states
  const [showStageComplete, setShowStageComplete] = useState(false)
  const [stagePoints, setStagePoints] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [showPointsBurst, setShowPointsBurst] = useState(false)
  const [comboMultiplier, setComboMultiplier] = useState(1)
  const [showCombo, setShowCombo] = useState(false)
  const [achievements, setAchievements] = useState<string[]>([])
  const [showAchievement, setShowAchievement] = useState('')

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

  // Handle slideshow progression with dopamine hits
  useEffect(() => {
    if (!showSlideshow) return

    const slideInterval = setInterval(() => {
      setCurrentImageIndex(prev => {
        if (prev >= MISSION_IMAGES.length - 1) {
          // Mission complete - final dopamine burst
          setShowSlideshow(false)
          const success = Math.random() > 0.5
          setMissionSuccess(success)
          
          // Final achievement and points burst
          if (success) {
            setTotalPoints(prevTotal => prevTotal + 1000)
            setShowAchievement('MISSION ACCOMPLISHED!')
            setTimeout(() => setShowAchievement(''), 3000)
          }
          
          setMissionComplete(true)
          return prev
        }
        
        // Stage completion dopamine hit
        const nextStage = prev + 1
        const stageBonus = Math.floor(Math.random() * 200) + 100 // 100-300 points
        const newMultiplier = Math.min(comboMultiplier + 0.5, 5) // Max 5x multiplier
        const finalPoints = Math.floor(stageBonus * newMultiplier)
        
        setStagePoints(finalPoints)
        setTotalPoints(prevTotal => prevTotal + finalPoints)
        setComboMultiplier(newMultiplier)
        
        // Show stage completion effects
        setShowStageComplete(true)
        setShowPointsBurst(true)
        if (newMultiplier > 1.5) setShowCombo(true)
        
        // Achievement triggers
        if (nextStage === 3) {
          setShowAchievement('DEEP SPACE EXPLORER!')
          setTimeout(() => setShowAchievement(''), 2500)
        } else if (nextStage === 6) {
          setShowAchievement('COSMIC VOYAGER!')
          setTimeout(() => setShowAchievement(''), 2500)
        } else if (nextStage === 8) {
          setShowAchievement('STELLAR NAVIGATOR!')
          setTimeout(() => setShowAchievement(''), 2500)
        }
        
        // Hide effects after animation
        setTimeout(() => {
          setShowStageComplete(false)
          setShowPointsBurst(false)
          setShowCombo(false)
        }, 1500)
        
        return nextStage
      })
    }, 3000) // 3 seconds per image

    return () => clearInterval(slideInterval)
  }, [showSlideshow, comboMultiplier])

  // Reset mission
  const resetMission = () => {
    setShowCountdown(false)
    setShowSlideshow(false)
    setMissionComplete(false)
    setCurrentImageIndex(0)
    setCountdown(3)
    
    // Reset dopamine hit states
    setShowStageComplete(false)
    setStagePoints(0)
    setTotalPoints(0)
    setShowPointsBurst(false)
    setComboMultiplier(1)
    setShowCombo(false)
    setAchievements([])
    setShowAchievement('')
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
            className="fixed inset-0 bg-black z-50 overflow-hidden"
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

            {/* Flying Rocket */}
            <motion.div
              key={`rocket-${currentImageIndex}`}
              initial={{ x: -100, y: '50%' }}
              animate={{ 
                x: windowWidth + 100,
                y: ['50%', '30%', '70%', '40%', '60%', '50%']
              }}
              transition={{ 
                duration: 3,
                ease: "easeInOut",
                y: {
                  duration: 3,
                  repeat: 0,
                  ease: "easeInOut"
                }
              }}
              className="absolute z-10 transform -translate-y-1/2"
            >
              <img
                src={selectedShip ? getShipImage(selectedShip.shipType) : '/rockets/1.svg'}
                alt="Ship"
                className="w-24 h-24 transform rotate-12 drop-shadow-lg"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))'
                }}
              />
              {/* Engine trail */}
              <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2">
                <div className="w-16 h-2 bg-gradient-to-r from-blue-400 to-transparent rounded-full opacity-80"></div>
                <div className="w-12 h-1 bg-gradient-to-r from-white to-transparent rounded-full opacity-60 mt-1"></div>
              </div>
            </motion.div>

            {/* Stage Info with Points Display */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full">
                <div className="text-white font-bold text-xl">
                  Stage {currentImageIndex + 1} of {MISSION_IMAGES.length}
                </div>
                <div className="text-center mt-2">
                  <div className="text-purple-400 font-bold text-lg">
                    {totalPoints.toLocaleString()} PTS
                  </div>
                  {comboMultiplier > 1 && (
                    <div className="text-yellow-400 text-sm font-bold">
                      {comboMultiplier.toFixed(1)}x COMBO
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stage Complete Celebration */}
            <AnimatePresence>
              {showStageComplete && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 0.6, repeat: 1 }}
                      className="text-6xl font-bold text-green-400 mb-4 drop-shadow-lg"
                    >
                      STAGE CLEAR!
                    </motion.div>
                    
                    {/* Floating particles */}
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ 
                          x: 0, 
                          y: 0, 
                          opacity: 1,
                          scale: 0
                        }}
                        animate={{ 
                          x: (Math.random() - 0.5) * 400,
                          y: (Math.random() - 0.5) * 400,
                          opacity: 0,
                          scale: 1
                        }}
                        transition={{ 
                          duration: 1.5,
                          delay: Math.random() * 0.5
                        }}
                        className="absolute w-4 h-4 bg-yellow-400 rounded-full"
                        style={{
                          left: '50%',
                          top: '50%'
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Points Burst Animation */}
            <AnimatePresence>
              {showPointsBurst && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, y: 0 }}
                  animate={{ scale: 1, opacity: 1, y: -50 }}
                  exit={{ scale: 1.5, opacity: 0, y: -100 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.3, 1],
                        textShadow: [
                          '0 0 10px rgba(147, 51, 234, 0.8)',
                          '0 0 20px rgba(147, 51, 234, 1)',
                          '0 0 10px rgba(147, 51, 234, 0.8)'
                        ]
                      }}
                      transition={{ duration: 0.8, repeat: 1 }}
                      className="text-5xl font-bold text-purple-400 mb-2"
                    >
                      +{stagePoints}
                    </motion.div>
                    <div className="text-xl text-white font-bold">
                      POINTS!
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Combo Multiplier Effect */}
            <AnimatePresence>
              {showCombo && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, rotate: -180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute top-1/4 right-8 z-30 pointer-events-none"
                >
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 0.5, repeat: 2 }}
                      className="text-2xl font-bold text-black text-center"
                    >
                      {comboMultiplier.toFixed(1)}x<br/>
                      <span className="text-sm">COMBO</span>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Achievement Popup */}
            <AnimatePresence>
              {showAchievement && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, y: -100 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0, y: -100 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none"
                >
                  <div className="bg-gradient-to-r from-gold-400 via-yellow-500 to-gold-400 p-6 rounded-xl border-4 border-yellow-300 shadow-2xl">
                    <motion.div
                      animate={{ 
                        textShadow: [
                          '0 0 10px rgba(255, 215, 0, 0.8)',
                          '0 0 20px rgba(255, 215, 0, 1)',
                          '0 0 10px rgba(255, 215, 0, 0.8)'
                        ]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-center"
                    >
                      <div className="text-3xl mb-2">🏆</div>
                      <div className="text-xl font-bold text-black mb-1">
                        ACHIEVEMENT UNLOCKED!
                      </div>
                      <div className="text-lg font-bold text-gray-800">
                        {showAchievement}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                  {/* Success Animation with Particles */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative"
                  >
                    <Trophy className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    
                    {/* Victory particles */}
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ 
                          x: 0, 
                          y: 0, 
                          opacity: 1,
                          scale: 0
                        }}
                        animate={{ 
                          x: (Math.random() - 0.5) * 300,
                          y: (Math.random() - 0.5) * 300,
                          opacity: 0,
                          scale: 1
                        }}
                        transition={{ 
                          duration: 2,
                          delay: Math.random() * 1
                        }}
                        className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                        style={{
                          left: '50%',
                          top: '50%'
                        }}
                      />
                    ))}
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="text-3xl font-bold text-white mb-4"
                  >
                    🎉 MISSION SUCCESS! 🎉
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-300 mb-6"
                  >
                    Outstanding performance, Commander! Your ship has returned victorious!
                  </motion.p>
                  
                  {/* Enhanced reward display */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 150 }}
                    className="bg-gradient-to-r from-purple-600/30 to-green-600/30 p-6 rounded-xl mb-6 border border-purple-500/50"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        textShadow: [
                          '0 0 10px rgba(168, 85, 247, 0.8)',
                          '0 0 20px rgba(168, 85, 247, 1)',
                          '0 0 10px rgba(168, 85, 247, 0.8)'
                        ]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-3xl font-bold text-purple-400 mb-2"
                    >
                      +{250 + totalPoints} GALACTIC
                    </motion.div>
                    <div className="text-sm text-gray-400 mb-2">Base Reward + Performance Bonus</div>
                    <div className="text-lg font-bold text-green-400">
                      Total Score: {totalPoints.toLocaleString()} Points!
                    </div>
                  </motion.div>
                  
                  {/* Achievement summary */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="bg-black/30 p-4 rounded-xl mb-6"
                  >
                    <div className="text-yellow-400 font-bold mb-2">🌟 Mission Stats</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-white font-bold">{MISSION_IMAGES.length}</div>
                        <div className="text-gray-400">Stages Cleared</div>
                      </div>
                      <div>
                        <div className="text-white font-bold">{comboMultiplier.toFixed(1)}x</div>
                        <div className="text-gray-400">Max Combo</div>
                      </div>
                    </div>
                  </motion.div>
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
