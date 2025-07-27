'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Rocket, Play, Trophy, X, Shield } from 'lucide-react'
import Link from 'next/link'
import { useWeb3 } from '../../components/Web3Provider'
import { alchemyNFTService, SHIP_TYPES, AlchemyNFT } from '../../components/AlchemyService'
import { spaceLaunchGameService } from '../../services/SpaceLaunchGameService'
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
  const [missionResult, setMissionResult] = useState<{ success: boolean; txHash: string } | null>(null)
  const [windowWidth, setWindowWidth] = useState(1920)
  const [windowHeight, setWindowHeight] = useState(1080)
  const [showParticles, setShowParticles] = useState(false)
  const [screenShake, setScreenShake] = useState(false)
  
  // Blockchain state
  const [gameSettings, setGameSettings] = useState({ rewardAmount: '100', successRate: 49 })
  const [playerStats, setPlayerStats] = useState({ successfulLaunches: 0, launchAttempts: 0, galacticWon: '0', successRate: 0 })
  const [isApproved, setIsApproved] = useState(false)
  const [approving, setApproving] = useState(false)
  const [launchingBlockchain, setLaunchingBlockchain] = useState(false)
  const [serviceInitialized, setServiceInitialized] = useState(false)

  // Fetch user NFTs
  useEffect(() => {
    const fetchUserNFTs = async () => {
      if (!isConnected || !account) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Only fetch NFTs from the new contract address
        const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS
        console.log('🎯 Fetching NFTs from contract:', contractAddress)
        const nfts = await alchemyNFTService.getNFTsForOwner(account, contractAddress)
        console.log('🎮 Found NFTs from new contract:', nfts.length)
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

  // Initialize blockchain services and fetch game data
  useEffect(() => {
    const initializeBlockchain = async () => {
      if (!isConnected || !account) {
        console.log('Skipping blockchain initialization - not connected or no account')
        return
      }

      try {
        console.log('🔗 Initializing blockchain services for account:', account)
        await spaceLaunchGameService.initialize()
        
        console.log('📊 Fetching game settings and player stats...')
        // Fetch game settings and player stats
        const [settings, stats] = await Promise.all([
          spaceLaunchGameService.getGameSettings(),
          spaceLaunchGameService.getPlayerStats(account)
        ])
        
        console.log('✅ Game settings:', settings)
        console.log('✅ Player stats:', stats)
        
        setGameSettings(settings)
        setPlayerStats(stats)
        setServiceInitialized(true)
        console.log('🎯 Service fully initialized and ready for missions')
      } catch (error) {
        console.error('❌ Error initializing blockchain services:', error)
        setServiceInitialized(false)
        // Set fallback values so UI doesn't break
        setGameSettings({ rewardAmount: '100', successRate: 49 })
        setPlayerStats({ successfulLaunches: 0, launchAttempts: 0, galacticWon: '0', successRate: 0 })
      }
    }

    initializeBlockchain()
  }, [isConnected, account])

  // Check NFT approval when ship is selected
  useEffect(() => {
    const checkApproval = async () => {
      if (!selectedShip || !account) {
        setIsApproved(false)
        return
      }

      try {
        const approved = await spaceLaunchGameService.checkNFTApproval(selectedShip.tokenId, account)
        setIsApproved(approved)
      } catch (error) {
        console.error('Error checking NFT approval:', error)
        setIsApproved(false)
      }
    }

    checkApproval()
  }, [selectedShip, account])

  // Handle window dimensions for client-side rendering
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }
    
    // Set initial dimensions
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
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

  // Handle NFT approval
  const handleApproveNFT = async () => {
    if (!selectedShip || !account) {
      console.error('❌ Cannot approve: no ship selected or account not connected')
      return
    }

    console.log('🔐 Starting NFT approval process for ship:', selectedShip.tokenId)
    setApproving(true)
    
    try {
      // Ensure service is initialized before approval
      if (!serviceInitialized || !spaceLaunchGameService.isReady()) {
        console.log('⚠️ Service not ready, initializing before approval...')
        console.log('  - serviceInitialized state:', serviceInitialized)
        console.log('  - spaceLaunchGameService.isReady():', spaceLaunchGameService.isReady())
        
        await spaceLaunchGameService.initialize()
        
        // Verify initialization was successful
        if (!spaceLaunchGameService.isReady()) {
          throw new Error('Service initialization failed - service is not ready after initialize()')
        }
        
        setServiceInitialized(true)
        console.log('✅ Service successfully initialized and ready')
      }
      
      console.log('🚀 Calling spaceLaunchGameService.approveNFT...')
      await spaceLaunchGameService.approveNFT(selectedShip.tokenId)
      
      // Verify approval was successful
      const approved = await spaceLaunchGameService.checkNFTApproval(selectedShip.tokenId, account)
      
      if (approved) {
        setIsApproved(true)
        console.log('✅ NFT approval successful!')
        alert('✅ NFT approved successfully! You can now launch the mission.')
      } else {
        console.error('❌ Approval verification failed')
        alert('❌ Approval verification failed. Please try again.')
      }
    } catch (error) {
      console.error('❌ Error approving NFT:', error)
      alert(`❌ Failed to approve NFT: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setApproving(false)
    }
  }

  // Execute the actual blockchain mission transaction and return result
  const executeMissionOnBlockchain = async (): Promise<{ success: boolean; txHash: string }> => {
    if (!selectedShip) {
      console.error('❌ No ship selected for mission')
      throw new Error('No ship selected for mission')
    }

    console.log('🎮 Executing blockchain mission for ship:', selectedShip.tokenId)
    console.log('🎮 Ship type:', selectedShip.shipType)
    console.log('🎮 Account:', account)
    console.log('🔧 Service initialized:', serviceInitialized)
    console.log('🔍 Selected ship full data:', selectedShip)
    console.log('🔍 Token ID type:', typeof selectedShip.tokenId)
    console.log('🔍 Token ID value:', JSON.stringify(selectedShip.tokenId))

    try {
      // Ensure service is initialized before mission execution
      if (!serviceInitialized || !spaceLaunchGameService.isReady()) {
        console.log('⚠️ Service not ready for mission, initializing...')
        console.log('  - serviceInitialized state:', serviceInitialized)
        console.log('  - spaceLaunchGameService.isReady():', spaceLaunchGameService.isReady())
        
        await spaceLaunchGameService.initialize()
        
        // Verify initialization was successful
        if (!spaceLaunchGameService.isReady()) {
          throw new Error('Service initialization failed - service is not ready after initialize()')
        }
        
        // Fetch fresh data after initialization
        const [settings, stats] = await Promise.all([
          spaceLaunchGameService.getGameSettings(),
          spaceLaunchGameService.getPlayerStats(account!)
        ])
        
        setGameSettings(settings)
        setPlayerStats(stats)
        setServiceInitialized(true)
        console.log('✅ Service successfully initialized and ready for mission')
      }
      
      console.log('🚀 Calling spaceLaunchGameService.launchMission...')
      // Execute the smart contract mission
      const result = await spaceLaunchGameService.launchMission(selectedShip.tokenId)
      
      console.log('✅ Mission execution result:', result)
      
      // Update player stats after mission
      if (account) {
        console.log('📊 Updating player stats after mission...')
        const updatedStats = await spaceLaunchGameService.getPlayerStats(account)
        console.log('📊 Updated stats:', updatedStats)
        setPlayerStats(updatedStats)
      }
      
      // Update NFT list if mission failed (NFT was burned)
      if (!result.success) {
        console.log('💥 Mission failed - removing ship from user NFTs')
        setUserNFTs(prev => prev.filter(nft => nft.tokenId !== selectedShip.tokenId))
      } else {
        console.log('🎉 Mission succeeded!')
      }
      
      // Return the mission result for the slideshow to use
      return result
      
    } catch (error) {
      console.error('❌ Error executing blockchain mission:', error)
      throw error // Re-throw to be handled by launchMission
    }
  }

  // Launch mission with improved UX: transaction first, then animation
  const launchMission = async () => {
    if (!selectedShip || !isApproved) return
    
    setLaunchingBlockchain(true)
    
    try {
      console.log('🚀 Starting mission: Transaction first, then animation')
      
      // Step 1: Execute blockchain transaction first
      console.log('💰 Step 1: Executing blockchain transaction...')
      const result = await executeMissionOnBlockchain()
      
      console.log('✅ Transaction completed! Result:', result)
      
      // Store the result for the slideshow to use
      setMissionResult(result)
      
      // Step 2: Now play the cinematic experience with known result
      console.log('🎬 Step 2: Starting cinematic experience...')
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
      
    } catch (error) {
      console.error('❌ Mission launch failed during transaction:', error)
      setLaunchingBlockchain(false)
      alert(`Mission failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // Handle slideshow progression with dopamine effects
  useEffect(() => {
    if (!showSlideshow) return

    const slideInterval = setInterval(() => {
      setCurrentImageIndex(prev => {
        if (prev >= MISSION_IMAGES.length - 1) {
          // Mission slideshow complete - show results (transaction already executed)
          setShowSlideshow(false)
          setShowParticles(true)
          setScreenShake(true)
          
          // Show the results from the pre-executed blockchain transaction
          setTimeout(() => {
            console.log('🎯 Showing mission results from blockchain...')
            setShowParticles(false)
            setScreenShake(false)
            setMissionComplete(true)
            setMissionSuccess(missionResult?.success || false)
            setLaunchingBlockchain(false)
            
            // Clear selected ship if mission failed (NFT was already removed from list)
            if (!missionResult?.success) {
              setSelectedShip(null)
            }
          }, 1000)
          
          return prev
        }
        
        // Trigger dopamine effects on each stage progression
        setShowParticles(true)
        setScreenShake(true)
        
        // Stop effects quickly for smooth transition
        setTimeout(() => {
          setShowParticles(false)
          setScreenShake(false)
        }, 500)
        
        return prev + 1
      })
    }, 3000) // 3 seconds per image

    return () => clearInterval(slideInterval)
  }, [showSlideshow])

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
                        <div className="text-2xl font-bold text-green-400">{gameSettings.successRate}%</div>
                        <div className="text-sm text-gray-400">Success Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400">{gameSettings.rewardAmount}</div>
                        <div className="text-sm text-gray-400">GALACTIC Reward</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-400">BURN</div>
                        <div className="text-sm text-gray-400">On Failure</div>
                      </div>
                    </div>
                    
                    {/* Player Stats */}
                    <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
                      <h4 className="text-lg font-bold text-white mb-3">Your Mission History</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Successful Missions:</span>
                          <span className="text-green-400 font-bold ml-2">{playerStats.successfulLaunches}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Total Attempts:</span>
                          <span className="text-blue-400 font-bold ml-2">{playerStats.launchAttempts}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Success Rate:</span>
                          <span className="text-yellow-400 font-bold ml-2">{playerStats.successRate.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-400">GALACTIC Earned:</span>
                          <span className="text-purple-400 font-bold ml-2">{playerStats.galacticWon}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Approval and Launch Buttons */}
                  {!isApproved ? (
                    <button
                      onClick={handleApproveNFT}
                      disabled={approving}
                      className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {approving ? (
                        <>
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin inline mr-2"></div>
                          Approving...
                        </>
                      ) : (
                        <>
                          <Shield className="w-6 h-6 inline mr-2" />
                          Approve NFT
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={launchMission}
                      disabled={launchingBlockchain}
                      className="group relative px-12 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-xl rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {launchingBlockchain ? (
                        <>
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin inline mr-2"></div>
                          Launching...
                        </>
                      ) : (
                        <>
                          <Play className="w-6 h-6 inline mr-2" />
                          Launch Mission
                        </>
                      )}
                    </button>
                  )}
                  
                  {!isApproved && (
                    <p className="text-sm text-gray-400 mt-4 text-center">
                      You must approve your NFT before launching missions
                    </p>
                  )}
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
            animate={{ 
              opacity: 1,
              scale: screenShake ? [1, 1.02, 1] : 1
            }}
            exit={{ opacity: 0 }}
            transition={{
              scale: { duration: 0.3, repeat: screenShake ? 3 : 0 }
            }}
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

            {/* Flying Rocket with Full-Page Movement */}
            <motion.div
              key={`rocket-${currentImageIndex}`}
              initial={{ x: -100, y: windowHeight * 0.5 }}
              animate={{ 
                x: windowWidth + 100,
                y: [
                  windowHeight * 0.5,  // Start center
                  windowHeight * 0.1,  // Top of screen
                  windowHeight * 0.8,  // Bottom of screen
                  windowHeight * 0.2,  // Upper area
                  windowHeight * 0.9,  // Near bottom
                  windowHeight * 0.3,  // Upper-middle
                  windowHeight * 0.7,  // Lower-middle
                  windowHeight * 0.5   // End center
                ],
                rotate: [12, 8, 16, 10, 18, 6, 14, 12],
                scale: showParticles ? [1, 1.2, 1] : 1
              }}
              transition={{ 
                duration: 3,
                ease: "easeInOut",
                y: {
                  duration: 3,
                  repeat: 0,
                  ease: "easeInOut"
                },
                rotate: {
                  duration: 3,
                  repeat: 0,
                  ease: "easeInOut"
                },
                scale: {
                  duration: 0.5,
                  repeat: showParticles ? 2 : 0
                }
              }}
              className="absolute z-10"
            >
              <img
                src={selectedShip ? getShipImage(selectedShip.shipType) : '/rockets/1.svg'}
                alt="Ship"
                className="w-24 h-24 transform rotate-12 drop-shadow-lg"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))'
                }}
              />
              {/* Enhanced Engine Trail */}
              <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2">
                <motion.div 
                  animate={{
                    scale: showParticles ? [1, 1.5, 1] : [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-20 h-3 bg-gradient-to-r from-blue-400 via-cyan-300 to-transparent rounded-full"
                />
                <motion.div 
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.1
                  }}
                  className="w-16 h-2 bg-gradient-to-r from-white via-blue-200 to-transparent rounded-full mt-1"
                />
                <motion.div 
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{
                    duration: 0.15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2
                  }}
                  className="w-12 h-1 bg-gradient-to-r from-yellow-300 to-transparent rounded-full mt-1"
                />
              </div>
            </motion.div>

            {/* Stage Info */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full">
                <div className="text-white font-bold text-xl">
                  Stage {currentImageIndex + 1} of {MISSION_IMAGES.length}
                </div>
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
