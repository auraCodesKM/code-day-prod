'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Rocket, Zap, Shield, Star, Coins, AlertTriangle, Trophy, Flame, Target } from 'lucide-react'
import Link from 'next/link'
import { useWeb3 } from '../../components/Web3Provider'
import { alchemyNFTService, SHIP_TYPES, AlchemyNFT } from '../../components/AlchemyService'
import AudioManager from '../../components/AudioManager'
import MissionGameplay from '../../components/MissionGameplay'

// Mission types with different risk/reward profiles
const MISSION_TYPES = {
  ROOKIE: {
    name: 'ROOKIE MISSION',
    description: 'Low risk, steady rewards',
    successRate: 75,
    baseReward: 50,
    color: 'neon-green',
    icon: Target,
    difficulty: 'EASY'
  },
  VETERAN: {
    name: 'VETERAN MISSION',
    description: 'Balanced risk and reward',
    successRate: 50,
    baseReward: 150,
    color: 'neon-blue',
    icon: Zap,
    difficulty: 'MEDIUM'
  },
  LEGENDARY: {
    name: 'LEGENDARY MISSION',
    description: 'High risk, massive rewards',
    successRate: 25,
    baseReward: 500,
    color: 'neon-purple',
    icon: Flame,
    difficulty: 'EXTREME'
  }
}

export default function Mission() {
  const { isConnected, account } = useWeb3()
  const [userNFTs, setUserNFTs] = useState<AlchemyNFT[]>([])
  const [selectedShip, setSelectedShip] = useState<AlchemyNFT | null>(null)
  const [selectedMission, setSelectedMission] = useState<keyof typeof MISSION_TYPES>('VETERAN')
  const [loading, setLoading] = useState(true)
  const [launching, setLaunching] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [missionResult, setMissionResult] = useState<'success' | 'failure' | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [earnedReward, setEarnedReward] = useState(0)
  const [showGameplay, setShowGameplay] = useState(false)
  const [missionDamage, setMissionDamage] = useState(0)

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
        setLoading(false)
      } catch (error) {
        console.error('Error fetching NFTs:', error)
        setUserNFTs([])
        setLoading(false)
      }
    }

    fetchUserNFTs()
  }, [isConnected, account])

  // Calculate success rate for selected ship and mission
  const calculateSuccessRate = (ship: AlchemyNFT, missionType: keyof typeof MISSION_TYPES) => {
    const mission = MISSION_TYPES[missionType]
    const baseRate = mission.successRate
    
    // Ship bonuses
    const shipData = SHIP_TYPES[ship.shipType]
    const rarityBonus = shipData.rarity === 'LEGENDARY' ? 15 : shipData.rarity === 'RARE' ? 10 : 5
    const levelBonus = ship.level * 2
    
    // Risk penalty for consecutive missions (makes it more challenging)
    const streakPenalty = ship.missions * -1
    
    return Math.min(95, Math.max(5, baseRate + rarityBonus + levelBonus + streakPenalty))
  }

  // Calculate potential reward
  const calculateReward = (ship: AlchemyNFT, missionType: keyof typeof MISSION_TYPES) => {
    const mission = MISSION_TYPES[missionType]
    const shipData = SHIP_TYPES[ship.shipType]
    const rarityMultiplier = shipData.rarity === 'LEGENDARY' ? 1.5 : shipData.rarity === 'RARE' ? 1.25 : 1
    return Math.floor(mission.baseReward * rarityMultiplier * (1 + ship.level * 0.1))
  }

  // Launch mission with cinematic gameplay
  const launchMission = async () => {
    if (!selectedShip) return

    setLaunching(true)
    setCountdown(3)

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          // Start cinematic gameplay
          setShowGameplay(true)
          setLaunching(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Handle mission completion from gameplay
  const handleMissionComplete = (success: boolean, damage: number = 0) => {
    if (!selectedShip) return

    setShowGameplay(false)
    setMissionDamage(damage)
    
    const reward = calculateReward(selectedShip, selectedMission)
    const adjustedReward = success ? Math.floor(reward * (1 - damage / 200)) : 0 // Reduce reward based on damage
    
    setMissionResult(success ? 'success' : 'failure')
    setEarnedReward(adjustedReward)
    setShowResult(true)
  }

  // Exit gameplay early
  const handleGameplayExit = () => {
    setShowGameplay(false)
    setLaunching(false)
    setCountdown(0)
  }

  // Reset mission state
  const resetMission = () => {
    setSelectedShip(null)
    setMissionResult(null)
    setShowResult(false)
    setEarnedReward(0)
    setCountdown(0)
    setLaunching(false)
    setShowGameplay(false)
    setMissionDamage(0)
  }

  // Get ship image
  const getShipImage = (shipType: keyof typeof SHIP_TYPES) => {
    const typeMap = {
      'STELLAR VOYAGER': '/rockets/1.svg',
      'NEBULA HUNTER': '/rockets/2.svg', 
      'QUANTUM DESTROYER': '/rockets/3.svg'
    }
    return typeMap[shipType] || '/rockets/1.svg'
  }

  // Get rarity color
  const getRarityColor = (shipType: keyof typeof SHIP_TYPES) => {
    const rarity = SHIP_TYPES[shipType].rarity
    return rarity === 'LEGENDARY' ? 'border-neon-purple text-neon-purple' :
           rarity === 'RARE' ? 'border-neon-blue text-neon-blue' :
           'border-neon-green text-neon-green'
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-space-dark via-cosmic-purple to-deep-space relative overflow-hidden">
        <AudioManager />
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('/stars.png')] opacity-30 animate-twinkle"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-blue/5 to-transparent animate-pulse"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cyber-gray/20 border border-neon-red/50 p-8 rounded-lg backdrop-blur-sm max-w-md mx-auto"
            >
              <AlertTriangle className="w-16 h-16 text-neon-red mx-auto mb-4 animate-pulse" />
              <h2 className="font-pixel text-2xl text-neon-red mb-4">WALLET NOT CONNECTED</h2>
              <p className="font-arcade text-gray-300 mb-6">
                Connect your wallet to access mission control and launch your fleet into the cosmos.
              </p>
              <Link href="/" className="inline-block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="font-pixel px-6 py-3 bg-neon-blue/20 border border-neon-blue text-neon-blue hover:bg-neon-blue/30 transition-all duration-300"
                >
                  RETURN TO BASE
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-space-dark via-cosmic-purple to-deep-space relative overflow-hidden">
      <AudioManager />
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/stars.png')] opacity-30 animate-twinkle"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-blue/5 to-transparent animate-pulse"></div>
      
      {/* Scan Lines */}
      <div className="absolute inset-0 bg-scan-lines opacity-10 pointer-events-none"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Enhanced Header with Epic Effects */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 relative"
        >
          {/* Back Button with Glow Effect */}
          <motion.div
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/fleet" className="flex items-center space-x-2 text-neon-blue hover:text-white transition-colors group">
              <motion.div
                animate={{ x: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowLeft className="w-5 h-5 group-hover:drop-shadow-[0_0_10px_#00f5ff]" />
              </motion.div>
              <span className="font-arcade group-hover:drop-shadow-[0_0_10px_#00f5ff]">BACK TO FLEET</span>
            </Link>
          </motion.div>
          
          {/* Epic Title with Multiple Effects */}
          <div className="text-center relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-neon-red/20 via-neon-purple/20 to-neon-red/20 blur-3xl animate-pulse" />
            
            <motion.div
              className="relative z-10"
              animate={{
                filter: [
                  'drop-shadow(0 0 20px #ff0040)',
                  'drop-shadow(0 0 40px #ff0040) drop-shadow(0 0 60px #a855f7)',
                  'drop-shadow(0 0 20px #ff0040)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.h1 
                className="font-pixel text-5xl text-neon-red mb-2 relative"
                animate={{ 
                  textShadow: [
                    '0 0 30px #ff0040, 0 0 60px #ff0040',
                    '0 0 50px #ff0040, 0 0 80px #ff0040, 0 0 100px #a855f7',
                    '0 0 30px #ff0040, 0 0 60px #ff0040'
                  ]
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <span className="relative">
                  🔥 BURN OR GLORY 🔥
                  {/* Epic Glitch Overlay */}
                  <motion.span
                    className="absolute inset-0 text-neon-purple opacity-0"
                    animate={{ 
                      opacity: [0, 0, 0, 0.4, 0, 0, 0],
                      x: [0, 3, -3, 0, 2, -2, 0],
                      y: [0, -1, 1, 0, 1, -1, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    🔥 BURN OR GLORY 🔥
                  </motion.span>
                  
                  {/* Secondary Glitch */}
                  <motion.span
                    className="absolute inset-0 text-neon-green opacity-0"
                    animate={{ 
                      opacity: [0, 0, 0.2, 0, 0],
                      x: [0, -2, 2, 0],
                      scaleX: [1, 1.02, 0.98, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                  >
                    🔥 BURN OR GLORY 🔥
                  </motion.span>
                </span>
              </motion.h1>
            </motion.div>
            
            <motion.p 
              className="font-arcade text-gray-300 relative z-10"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.span
                animate={{ 
                  color: ['#d1d5db', '#ff0040', '#a855f7', '#d1d5db']
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                Stake your ship • Risk everything • Earn GALACTIC tokens
              </motion.span>
            </motion.p>
            
            {/* Floating Danger Symbols */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-neon-red text-xl"
                style={{
                  left: `${-20 + i * 140}px`,
                  top: `${-10 + (i % 2) * 20}px`
                }}
                animate={{
                  y: [-5, 5, -5],
                  rotate: [0, 10, -10, 0],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              >
                ⚠️
              </motion.div>
            ))}
          </div>
          
          <div className="w-32"></div> {/* Spacer for centering */}
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="font-pixel text-neon-blue">LOADING FLEET DATA...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel - Ship Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-cyber-gray/20 border border-neon-blue/50 p-6 rounded-lg backdrop-blur-sm">
                <h2 className="font-pixel text-xl text-neon-blue mb-4 flex items-center">
                  <Rocket className="w-5 h-5 mr-2" />
                  SELECT YOUR SHIP
                </h2>
                
                {userNFTs.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-neon-yellow mx-auto mb-4" />
                    <p className="font-arcade text-gray-300 mb-4">No ships in your fleet</p>
                    <Link href="/marketplace">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="font-pixel px-4 py-2 bg-neon-green/20 border border-neon-green text-neon-green hover:bg-neon-green/30 transition-all duration-300"
                      >
                        ACQUIRE SHIPS
                      </motion.button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userNFTs.map((nft) => {
                      const shipData = SHIP_TYPES[nft.shipType]
                      const isSelected = selectedShip?.tokenId === nft.tokenId
                      
                      return (
                        <motion.div
                          key={nft.tokenId}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => !launching && setSelectedShip(nft)}
                          className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                            isSelected 
                              ? `border-${shipData.color} bg-${shipData.color}/10` 
                              : 'border-gray-600 bg-black/20 hover:border-gray-400'
                          } ${launching ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {/* Ship Image */}
                          <div className="relative mb-3 h-20 flex items-center justify-center">
                            <motion.img
                              src={getShipImage(nft.shipType)}
                              alt={shipData.name}
                              className="w-16 h-16 object-contain"
                              whileHover={{ rotate: [0, -5, 5, 0] }}
                              transition={{ duration: 0.5 }}
                            />
                            <div className="absolute top-0 right-0">
                              <div className={`font-pixel text-xs px-2 py-1 border ${getRarityColor(nft.shipType)} bg-black/50`}>
                                #{nft.tokenId}
                              </div>
                            </div>
                          </div>
                          
                          {/* Ship Info */}
                          <div className="text-center">
                            <h3 className={`font-pixel text-sm text-${shipData.color} mb-1`}>
                              {shipData.name}
                            </h3>
                            <div className="font-arcade text-xs text-gray-400 mb-2">
                              Level {nft.level} • {nft.missions} Missions
                            </div>
                            
                            {/* Mini Stats */}
                            <div className="flex justify-between text-xs">
                              <span className="text-yellow-400">⚡{shipData.stats.speed}</span>
                              <span className="text-blue-400">🛡️{shipData.stats.armor}</span>
                              <span className="text-green-400">🍀{shipData.stats.luck}</span>
                            </div>
                          </div>
                          
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute inset-0 border-2 border-neon-blue rounded-lg animate-pulse"
                            />
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Mission Type Selection */}
              {selectedShip && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-cyber-gray/20 border border-neon-purple/50 p-6 rounded-lg backdrop-blur-sm"
                >
                  <h2 className="font-pixel text-xl text-neon-purple mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    MISSION TYPE
                  </h2>
                  
                  <div className="space-y-3">
                    {Object.entries(MISSION_TYPES).map(([key, mission]) => {
                      const isSelected = selectedMission === key
                      const Icon = mission.icon
                      
                      return (
                        <motion.div
                          key={key}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => !launching && setSelectedMission(key as keyof typeof MISSION_TYPES)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                            isSelected 
                              ? `border-${mission.color} bg-${mission.color}/10` 
                              : 'border-gray-600 bg-black/20 hover:border-gray-400'
                          } ${launching ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Icon className={`w-6 h-6 text-${mission.color}`} />
                              <div>
                                <h3 className={`font-pixel text-sm text-${mission.color}`}>
                                  {mission.name}
                                </h3>
                                <p className="font-arcade text-xs text-gray-400">
                                  {mission.description}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-pixel text-sm text-${mission.color}`}>
                                {calculateSuccessRate(selectedShip, key as keyof typeof MISSION_TYPES)}%
                              </div>
                              <div className="font-arcade text-xs text-gray-400">Success</div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Right Panel - Mission Control */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {selectedShip ? (
                <>
                  {/* Mission Details */}
                  <div className="bg-cyber-gray/20 border border-neon-red/50 p-6 rounded-lg backdrop-blur-sm">
                    <h2 className="font-pixel text-xl text-neon-red mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      MISSION BRIEFING
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                        <span className="font-arcade text-gray-300">Selected Ship:</span>
                        <span className={`font-pixel text-${SHIP_TYPES[selectedShip.shipType].color}`}>
                          {SHIP_TYPES[selectedShip.shipType].name} #{selectedShip.tokenId}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                        <span className="font-arcade text-gray-300">Mission Type:</span>
                        <span className={`font-pixel text-${MISSION_TYPES[selectedMission].color}`}>
                          {MISSION_TYPES[selectedMission].name}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                        <span className="font-arcade text-gray-300">Success Rate:</span>
                        <span className="font-pixel text-neon-green">
                          {calculateSuccessRate(selectedShip, selectedMission)}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                        <span className="font-arcade text-gray-300">Potential Reward:</span>
                        <span className="font-pixel text-neon-purple">
                          {calculateReward(selectedShip, selectedMission)} GALACTIC
                        </span>
                      </div>
                      
                      <div className="p-4 bg-neon-red/10 border border-neon-red/50 rounded">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-neon-red" />
                          <span className="font-pixel text-neon-red">⚠️ WARNING ⚠️</span>
                        </div>
                        <p className="font-arcade text-sm text-gray-300">
                          Mission failure will result in <strong className="text-neon-red">PERMANENT NFT BURN</strong>. 
                          Your ship will be destroyed and cannot be recovered. Proceed with caution!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Launch Control */}
                  <div className="bg-cyber-gray/20 border border-neon-green/50 p-6 rounded-lg backdrop-blur-sm">
                    <h2 className="font-pixel text-xl text-neon-green mb-4 flex items-center">
                      <Rocket className="w-5 h-5 mr-2" />
                      LAUNCH CONTROL
                    </h2>
                    
                    {!launching && !showResult && (
                      <motion.div className="relative">
                        {/* Epic Launch Button with Multiple Effects */}
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-red/30 to-neon-purple/30 blur-xl animate-pulse" />
                        
                        <motion.button
                          whileHover={{ 
                            scale: 1.08,
                            boxShadow: '0 0 30px #ff0040, 0 0 60px #a855f7',
                            filter: 'brightness(1.2)'
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={launchMission}
                          className="relative w-full font-pixel text-2xl py-6 bg-gradient-to-r from-neon-red/20 via-neon-purple/20 to-neon-red/20 border-4 border-neon-red text-neon-red transition-all duration-300 overflow-hidden group"
                          animate={{
                            borderColor: ['#ff0040', '#a855f7', '#ff0040'],
                            textShadow: [
                              '0 0 20px #ff0040',
                              '0 0 40px #ff0040, 0 0 60px #a855f7',
                              '0 0 20px #ff0040'
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {/* Animated Background Sweep */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                            animate={{ x: [-200, 200] }}
                            transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                          />
                          
                          {/* Button Text with Glitch Effect */}
                          <span className="relative z-10">
                            🚀 LAUNCH MISSION 🚀
                            
                            {/* Glitch Overlay */}
                            <motion.span
                              className="absolute inset-0 text-neon-purple opacity-0"
                              animate={{
                                opacity: [0, 0, 0.3, 0, 0],
                                x: [0, 2, -2, 0]
                              }}
                              transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
                            >
                              🚀 LAUNCH MISSION 🚀
                            </motion.span>
                          </span>
                          
                          {/* Danger Particles on Hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {[...Array(8)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-neon-red rounded-full"
                                style={{
                                  left: `${10 + i * 10}%`,
                                  top: `${20 + (i % 3) * 20}%`
                                }}
                                animate={{
                                  scale: [0, 1, 0],
                                  opacity: [0, 1, 0],
                                  rotate: [0, 180, 360]
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  delay: i * 0.1
                                }}
                              />
                            ))}
                          </div>
                        </motion.button>
                        
                        {/* Warning Pulses Around Button */}
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute inset-0 border-2 border-neon-red rounded pointer-events-none"
                            animate={{
                              scale: [1, 1.1 + i * 0.1, 1],
                              opacity: [0.8, 0, 0.8]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.3
                            }}
                          />
                        ))}
                      </motion.div>
                    )}
                    
                    {launching && countdown > 0 && (
                      <div className="text-center">
                        <motion.div
                          key={countdown}
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 1.5, opacity: 0 }}
                          className="font-pixel text-6xl text-neon-red mb-4 animate-pulse"
                        >
                          {countdown}
                        </motion.div>
                        <p className="font-arcade text-gray-300">LAUNCHING IN...</p>
                      </div>
                    )}
                    
                    {launching && countdown === 0 && (
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full mx-auto mb-4"
                        />
                        <p className="font-pixel text-neon-blue">MISSION IN PROGRESS...</p>
                        <p className="font-arcade text-sm text-gray-400 mt-2">
                          Your ship is navigating the cosmic void...
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-cyber-gray/20 border border-gray-600/50 p-8 rounded-lg backdrop-blur-sm text-center">
                  <Rocket className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h2 className="font-pixel text-xl text-gray-400 mb-2">SELECT A SHIP</h2>
                  <p className="font-arcade text-gray-500">
                    Choose a spaceship from your fleet to begin the mission briefing.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Mission Result Modal */}
      <AnimatePresence>
        {showResult && (
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
              className={`max-w-md w-full p-8 rounded-lg border-2 ${
                missionResult === 'success' 
                  ? 'bg-neon-green/10 border-neon-green' 
                  : 'bg-neon-red/10 border-neon-red'
              } backdrop-blur-sm text-center`}
            >
              {missionResult === 'success' ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Trophy className="w-20 h-20 text-neon-green mx-auto mb-4" />
                  </motion.div>
                  <h2 className="font-pixel text-3xl text-neon-green mb-4">MISSION SUCCESS!</h2>
                  <p className="font-arcade text-gray-300 mb-6">
                    Your ship has returned safely from the cosmic void!
                  </p>
                  <div className="bg-black/30 p-4 rounded mb-6">
                    <div className="font-pixel text-2xl text-neon-purple mb-2">
                      +{earnedReward} GALACTIC
                    </div>
                    <div className="font-arcade text-sm text-gray-400">Reward Earned</div>
                  </div>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Flame className="w-20 h-20 text-neon-red mx-auto mb-4" />
                  </motion.div>
                  <h2 className="font-pixel text-3xl text-neon-red mb-4">MISSION FAILED!</h2>
                  <p className="font-arcade text-gray-300 mb-6">
                    Your ship was lost in the cosmic void... 
                    <br />
                    <strong className="text-neon-red">NFT BURNED</strong>
                  </p>
                  <div className="bg-black/30 p-4 rounded mb-6">
                    <div className="font-pixel text-lg text-neon-red mb-2">
                      {selectedShip && SHIP_TYPES[selectedShip.shipType].name} #{selectedShip?.tokenId}
                    </div>
                    <div className="font-arcade text-sm text-gray-400">Lost Forever</div>
                  </div>
                </>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetMission}
                className="font-pixel px-6 py-3 bg-neon-blue/20 border border-neon-blue text-neon-blue hover:bg-neon-blue/30 transition-all duration-300"
              >
                CONTINUE
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Mission Gameplay */}
      <AnimatePresence>
        {showGameplay && selectedShip && (
          <MissionGameplay
            selectedShip={selectedShip}
            missionType={selectedMission}
            onMissionComplete={handleMissionComplete}
            onExit={handleGameplayExit}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
