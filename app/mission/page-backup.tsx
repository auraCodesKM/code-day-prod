'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Rocket, Zap, Shield, Star, Coins, AlertTriangle, Trophy, Flame, Target, Play } from 'lucide-react'
import Link from 'next/link'
import { useWeb3 } from '../../components/Web3Provider'
import { alchemyNFTService, SHIP_TYPES, AlchemyNFT } from '../../components/AlchemyService'
import AudioManager from '../../components/AudioManager'
import MissionGameplay from '../../components/MissionGameplay'

// Mission types with clean design
const MISSION_TYPES = {
  ROOKIE: {
    name: 'Rookie',
    description: 'Safe passage through friendly space',
    successRate: 75,
    baseReward: 50,
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-emerald-600/20',
    border: 'border-emerald-500/50',
    icon: Target,
    difficulty: 'EASY'
  },
  VETERAN: {
    name: 'Veteran',
    description: 'Navigate through contested territory',
    successRate: 50,
    baseReward: 150,
    color: 'blue',
    gradient: 'from-blue-500/20 to-blue-600/20',
    border: 'border-blue-500/50',
    icon: Zap,
    difficulty: 'MEDIUM'
  },
  LEGENDARY: {
    name: 'Legendary',
    description: 'Venture into the cosmic abyss',
    successRate: 25,
    baseReward: 500,
    color: 'purple',
    gradient: 'from-purple-500/20 to-purple-600/20',
    border: 'border-purple-500/50',
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
    
    const shipData = SHIP_TYPES[ship.shipType]
    const rarityBonus = shipData.rarity === 'LEGENDARY' ? 15 : shipData.rarity === 'RARE' ? 10 : 5
    const levelBonus = ship.level * 2
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

  // Launch mission with full-screen countdown and cinematic gameplay
  const launchMission = async () => {
    if (!selectedShip) return

    setLaunching(true)
    setCountdown(3)

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          // Small delay then launch gameplay
          setTimeout(() => {
            setShowGameplay(true)
            setLaunching(false)
          }, 500)
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
    const adjustedReward = success ? Math.floor(reward * (1 - damage / 200)) : 0
    
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

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <AudioManager />
        
        {/* Subtle background effects */}
        <div className="absolute inset-0 bg-[url('/stars.png')] opacity-20"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl"
            >
              <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="font-pixel text-2xl text-white mb-4">Connect Wallet</h2>
              <p className="text-slate-300 mb-6">
                Connect your wallet to access mission control and launch your fleet.
              </p>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                  Return to Home
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <AudioManager />
      
      {/* Subtle background effects */}
      <div className="absolute inset-0 bg-[url('/stars.png')] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Clean Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <Link href="/fleet" className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Fleet</span>
          </Link>
          
          <div className="text-center">
            <h1 className="font-pixel text-4xl text-white mb-2">
              Mission Control
            </h1>
            <p className="text-slate-400">
              Launch your ship into the cosmic void
            </p>
          </div>
          
          <div className="w-24"></div>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-slate-400">Loading fleet data...</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Ship Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Rocket className="w-6 h-6 mr-3 text-blue-500" />
                Select Your Ship
              </h2>
              
              {userNFTs.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl text-center">
                  <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                  <p className="text-slate-300 mb-4">No ships in your fleet</p>
                  <Link href="/marketplace">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                    >
                      Acquire Ships
                    </motion.button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userNFTs.map((nft) => {
                    const shipData = SHIP_TYPES[nft.shipType]
                    const isSelected = selectedShip?.tokenId === nft.tokenId
                    
                    return (
                      <motion.div
                        key={nft.tokenId}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => !launching && setSelectedShip(nft)}
                        className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                          isSelected 
                            ? 'bg-blue-500/20 border-2 border-blue-500' 
                            : 'bg-slate-800/50 border border-slate-700 hover:border-slate-600'
                        } ${launching ? 'opacity-50 cursor-not-allowed' : ''} backdrop-blur-xl`}
                      >
                        {/* Ship Image */}
                        <div className="relative mb-4 h-24 flex items-center justify-center">
                          <img
                            src={getShipImage(nft.shipType)}
                            alt={shipData.name}
                            className="w-16 h-16 object-contain"
                          />
                          <div className="absolute top-0 right-0 bg-slate-900 px-2 py-1 rounded-lg text-xs font-mono text-slate-300">
                            #{nft.tokenId}
                          </div>
                        </div>
                        
                        {/* Ship Info */}
                        <div className="text-center">
                          <h3 className="font-bold text-white mb-1">
                            {shipData.name}
                          </h3>
                          <div className="text-sm text-slate-400 mb-3">
                            Level {nft.level} • {nft.missions} Missions
                          </div>
                          
                          {/* Stats */}
                          <div className="flex justify-between text-xs">
                            <span className="text-yellow-400">⚡{shipData.stats.speed}</span>
                            <span className="text-blue-400">🛡️{shipData.stats.armor}</span>
                            <span className="text-emerald-400">🍀{shipData.stats.luck}</span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>

            {/* Mission Selection & Launch */}
            {selectedShip && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* Mission Types */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Target className="w-6 h-6 mr-3 text-purple-500" />
                    Choose Mission
                  </h2>
                  
                  <div className="space-y-4">
                    {Object.entries(MISSION_TYPES).map(([key, mission]) => {
                      const isSelected = selectedMission === key
                      const Icon = mission.icon
                      
                      return (
                        <motion.div
                          key={key}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => !launching && setSelectedMission(key as keyof typeof MISSION_TYPES)}
                          className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-xl ${
                            isSelected 
                              ? `bg-${mission.color}-500/20 border-2 border-${mission.color}-500` 
                              : 'bg-slate-800/50 border border-slate-700 hover:border-slate-600'
                          } ${launching ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Icon className={`w-8 h-8 text-${mission.color}-500`} />
                              <div>
                                <h3 className="font-bold text-white text-lg">
                                  {mission.name}
                                </h3>
                                <p className="text-slate-400 text-sm">
                                  {mission.description}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold text-${mission.color}-500`}>
                                {calculateSuccessRate(selectedShip, key as keyof typeof MISSION_TYPES)}%
                              </div>
                              <div className="text-xs text-slate-400">Success Rate</div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Mission Control */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Rocket className="w-6 h-6 mr-3 text-red-500" />
                    Mission Control
                  </h2>
                  
                  <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-6 rounded-2xl">
                    {/* Mission Details */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Ship:</span>
                        <span className="text-white font-medium">
                          {SHIP_TYPES[selectedShip.shipType].name} #{selectedShip.tokenId}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Mission:</span>
                        <span className={`text-${MISSION_TYPES[selectedMission].color}-500 font-medium`}>
                          {MISSION_TYPES[selectedMission].name}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Success Rate:</span>
                        <span className="text-emerald-500 font-bold">
                          {calculateSuccessRate(selectedShip, selectedMission)}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Reward:</span>
                        <span className="text-purple-500 font-bold">
                          {calculateReward(selectedShip, selectedMission)} GALACTIC
                        </span>
                      </div>
                    </div>
                    
                    {/* Warning */}
                    <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <span className="font-bold text-red-500">High Risk Mission</span>
                      </div>
                      <p className="text-sm text-slate-300">
                        Mission failure will result in permanent NFT destruction. 
                        Your ship cannot be recovered if lost.
                      </p>
                    </div>

                    {/* Launch Control */}
                    {!launching && !showResult && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={launchMission}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-bold text-xl rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <Play className="w-6 h-6" />
                        <span>Launch Mission</span>
                      </motion.button>
                    )}
                    

                  </div>
                </div>
              </motion.div>
            )}
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
              className={`max-w-md w-full p-8 rounded-2xl backdrop-blur-xl text-center ${
                missionResult === 'success' 
                  ? 'bg-emerald-500/20 border-2 border-emerald-500' 
                  : 'bg-red-500/20 border-2 border-red-500'
              }`}
            >
              {missionResult === 'success' ? (
                <>
                  <Trophy className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-4">Mission Success!</h2>
                  <p className="text-slate-300 mb-6">
                    Your ship has returned safely from the cosmic void!
                  </p>
                  <div className="bg-slate-900/50 p-4 rounded-xl mb-6">
                    <div className="text-2xl font-bold text-purple-500 mb-2">
                      +{earnedReward} GALACTIC
                    </div>
                    <div className="text-sm text-slate-400">Reward Earned</div>
                  </div>
                </>
              ) : (
                <>
                  <Flame className="w-20 h-20 text-red-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-4">Mission Failed!</h2>
                  <p className="text-slate-300 mb-6">
                    Your ship was lost in the cosmic void...
                    <br />
                    <strong className="text-red-500">NFT Destroyed</strong>
                  </p>
                  <div className="bg-slate-900/50 p-4 rounded-xl mb-6">
                    <div className="text-lg font-bold text-red-500 mb-2">
                      {selectedShip && SHIP_TYPES[selectedShip.shipType].name} #{selectedShip?.tokenId}
                    </div>
                    <div className="text-sm text-slate-400">Lost Forever</div>
                  </div>
                </>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetMission}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
              >
                Continue
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen Countdown */}
      <AnimatePresence>
        {launching && countdown > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            {/* Background with your custom images */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-black/80">
              <img
                src="/images/Céu de estrelas em fundo à noite | imagem Premium gerada com IA.jpg"
                alt="Space background"
                className="w-full h-full object-cover opacity-60"
              />
            </div>
            
            {/* Countdown */}
            <motion.div
              key={countdown}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 text-center"
            >
              <div className="text-[20rem] font-bold text-white mb-8 leading-none tracking-wider">
                {countdown}
              </div>
              <div className="text-4xl font-bold text-white/80 tracking-widest">
                MISSION LAUNCHING...
              </div>
            </motion.div>
            
            {/* Particle effects */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    opacity: 0 
                  }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                  className="absolute w-2 h-2 bg-white rounded-full"
                />
              ))}
            </div>
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
