'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Rocket, Zap, Shield, Star, Coins, Trophy, Users, ArrowLeft, Sparkles, Target, Fuel } from 'lucide-react'
import Link from 'next/link'
import AudioManager from '../../components/AudioManager'
import { useWeb3 } from '../../components/Web3Provider'
import { alchemyNFTService, AlchemyNFT, SHIP_TYPES } from '../../components/AlchemyService'

// SHIP_TYPES imported from AlchemyService

export default function MyFleet() {
  const { isConnected, account } = useWeb3()
  const [userNFTs, setUserNFTs] = useState<AlchemyNFT[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedShip, setSelectedShip] = useState<AlchemyNFT | null>(null)
  const [totalStats, setTotalStats] = useState({ ships: 0, missions: 0, earnings: 0 })

  // Fetch user NFTs using Alchemy
  useEffect(() => {
    const fetchUserNFTs = async () => {
      if (!isConnected || !account) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        console.log('Fetching NFTs for account:', account)
        
        // First, test different networks to find where NFTs are located
        console.log('\n🔍 DEBUGGING: Testing all networks to find your NFTs...')
        await alchemyNFTService.testNetworksForNFTs(account)
        
        // Then fetch NFTs using current network configuration
        console.log('\n📡 Now fetching with current configuration...')
        
        // Try without contract filtering first
        console.log('🔄 Attempt 1: Fetching ALL NFTs (no contract filter)...')
        let nfts = await alchemyNFTService.getNFTsForOwner(account)
        
        if (nfts.length === 0 && process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS) {
          console.log('🔄 Attempt 2: Fetching with contract filter...')
          nfts = await alchemyNFTService.getNFTsForOwner(
            account,
            process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS
          )
        }
        
        console.log('Fetched NFTs:', nfts)
        setUserNFTs(nfts)
        
        // Calculate total stats from fetched NFTs
        const stats = nfts.reduce((acc, nft) => ({
          ships: acc.ships + 1,
          missions: acc.missions + nft.missions,
          earnings: acc.earnings + nft.earnings
        }), { ships: 0, missions: 0, earnings: 0 })
        
        setTotalStats(stats)
        setLoading(false)
        
      } catch (error) {
        console.error('Error fetching NFTs from Alchemy:', error)
        setUserNFTs([])
        setTotalStats({ ships: 0, missions: 0, earnings: 0 })
        setLoading(false)
      }
    }

    fetchUserNFTs()
  }, [isConnected, account])

  const getRarityColor = (shipType: keyof typeof SHIP_TYPES) => {
    const ship = SHIP_TYPES[shipType]
    switch (ship.rarity) {
      case 'COMMON': return 'border-neon-blue'
      case 'RARE': return 'border-neon-green'
      case 'EPIC': return 'border-neon-purple'
      default: return 'border-neon-blue'
    }
  }

  const getShipImage = (shipType: keyof typeof SHIP_TYPES) => {
    switch (shipType) {
      case 'STELLAR VOYAGER': return '/rockets/1.svg'
      case 'NEBULA HUNTER': return '/rockets/2.svg'
      case 'QUANTUM DESTROYER': return '/rockets/3.svg'
      default: return '/rockets/1.svg'
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-space-black relative overflow-hidden">
        <AudioManager />
        
        {/* Background Effects */}
        <div className="absolute inset-0 starfield opacity-30" />
        <div className="absolute inset-0 cosmic-dust opacity-20" />
        <div className="absolute inset-0 scan-lines opacity-20" />
        <div className="absolute inset-0 crt-effect" />

        {/* Main Content */}
        <main className="relative z-10 pt-24 p-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-pixel text-4xl md:text-6xl text-neon-blue mb-8 animate-glow">
                MY FLEET
              </h1>
              <div className="bg-cyber-gray/30 border border-neon-blue/50 p-8 backdrop-blur-sm">
                <Rocket className="w-16 h-16 text-neon-blue mx-auto mb-4 animate-float" />
                <p className="font-arcade text-xl text-neon-green mb-6">
                  Connect your wallet to view your fleet
                </p>
                <p className="font-arcade text-sm text-gray-400">
                  Your NFT spaceships and their mission data will appear here
                </p>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-space-black relative overflow-hidden">
      <AudioManager />
      
      {/* Background Effects */}
      <div className="absolute inset-0 starfield opacity-30" />
      <div className="absolute inset-0 cosmic-dust opacity-20" />
      <div className="absolute inset-0 scan-lines opacity-20" />
      <div className="absolute inset-0 crt-effect" />

      {/* Main Content */}
      <main className="relative z-10 pt-24 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header with Holographic Effects */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 relative"
          >
            {/* Holographic Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-blue/5 to-transparent animate-pulse" />
            <div className="absolute inset-0 bg-[url('/grid.png')] opacity-10 animate-float" />
            
            <motion.div
              className="relative z-10"
              animate={{ 
                filter: [
                  'drop-shadow(0 0 10px #00f5ff)',
                  'drop-shadow(0 0 20px #00f5ff) drop-shadow(0 0 30px #00f5ff)',
                  'drop-shadow(0 0 10px #00f5ff)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.h1 
                className="font-pixel text-6xl text-neon-blue mb-4 relative"
                animate={{ 
                  textShadow: [
                    '0 0 20px #00f5ff, 0 0 40px #00f5ff',
                    '0 0 30px #00f5ff, 0 0 60px #00f5ff, 0 0 80px #00f5ff',
                    '0 0 20px #00f5ff, 0 0 40px #00f5ff'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="relative">
                  MY FLEET
                  {/* Glitch Effect Overlay */}
                  <motion.span
                    className="absolute inset-0 text-neon-red opacity-0"
                    animate={{ 
                      opacity: [0, 0, 0, 0.3, 0, 0, 0],
                      x: [0, 2, -2, 0, 1, -1, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
                  >
                    MY FLEET
                  </motion.span>
                </span>
              </motion.h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-arcade text-lg text-gray-300 max-w-2xl mx-auto relative z-10"
            >
              <motion.span
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Command your cosmic armada. View your NFT spaceships, track 
                missions, and manage your fleet.
              </motion.span>
            </motion.p>
            
            {/* Floating Particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-neon-blue rounded-full"
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${30 + (i % 2) * 40}%`
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </motion.div>

          {loading ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block">
                <Rocket className="w-16 h-16 text-neon-blue animate-spin mb-4" />
                <p className="font-pixel text-xl text-neon-blue animate-glow">
                  SCANNING FLEET...
                </p>
                <div className="w-64 h-2 bg-cyber-gray border border-neon-blue mt-4 mx-auto">
                  <motion.div 
                    className="h-full bg-neon-blue"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              </div>
            </motion.div>
          ) : userNFTs.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-cyber-gray/30 border border-neon-blue/50 p-12 backdrop-blur-sm max-w-2xl mx-auto">
                <Sparkles className="w-16 h-16 text-neon-purple mx-auto mb-6 animate-pulse" />
                <h2 className="font-pixel text-2xl text-neon-blue mb-4">
                  FLEET EMPTY
                </h2>
                <p className="font-arcade text-lg text-gray-400 mb-8">
                  You don't have any spaceships yet. Visit the marketplace to mint your first NFT ship!
                </p>
                <Link 
                  href="/marketplace"
                  className="neon-button font-pixel px-8 py-3 text-lg text-neon-blue hover:text-neon-green inline-block"
                >
                  VISIT MARKETPLACE
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Enhanced Fleet Stats with Holographic Effects */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, staggerChildren: 0.1 }}
              >
                {/* Ships Owned Card */}
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-blue/5 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative bg-cyber-gray/40 border-2 border-neon-blue/50 p-6 text-center backdrop-blur-sm rounded-lg overflow-hidden">
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 bg-[url('/circuit.png')] opacity-5 animate-float" />
                    <motion.div
                      className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent"
                      animate={{ x: [-100, 100] }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                    />
                    
                    <motion.div
                      animate={{ 
                        rotateY: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Rocket className="w-10 h-10 text-neon-blue mx-auto mb-4" />
                    </motion.div>
                    
                    <motion.div 
                      className="font-pixel text-4xl text-neon-blue mb-2"
                      animate={{ 
                        textShadow: [
                          '0 0 10px #00f5ff',
                          '0 0 20px #00f5ff, 0 0 30px #00f5ff',
                          '0 0 10px #00f5ff'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {totalStats.ships}
                    </motion.div>
                    <div className="font-arcade text-sm text-gray-300 tracking-wider">SHIPS OWNED</div>
                    
                    {/* Hover Effect Particles */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-neon-blue rounded-full"
                          style={{
                            left: `${20 + i * 30}%`,
                            top: `${20 + i * 20}%`
                          }}
                          animate={{
                            y: [-5, 5, -5],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 2 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Missions Completed Card */}
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.05, rotateY: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-green/20 to-neon-green/5 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative bg-cyber-gray/40 border-2 border-neon-green/50 p-6 text-center backdrop-blur-sm rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/hexagon.png')] opacity-5 animate-pulse" />
                    <motion.div
                      className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent"
                      animate={{ x: [-100, 100] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
                    />
                    
                    <motion.div
                      animate={{ 
                        rotate: [0, 180, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 5, repeat: Infinity }}
                    >
                      <Target className="w-10 h-10 text-neon-green mx-auto mb-4" />
                    </motion.div>
                    
                    <motion.div 
                      className="font-pixel text-4xl text-neon-green mb-2"
                      animate={{ 
                        textShadow: [
                          '0 0 10px #00ff88',
                          '0 0 20px #00ff88, 0 0 30px #00ff88',
                          '0 0 10px #00ff88'
                        ]
                      }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                    >
                      {totalStats.missions}
                    </motion.div>
                    <div className="font-arcade text-sm text-gray-300 tracking-wider">MISSIONS COMPLETED</div>
                  </div>
                </motion.div>

                {/* Total Earnings Card */}
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-purple/5 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative bg-cyber-gray/40 border-2 border-neon-purple/50 p-6 text-center backdrop-blur-sm rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/diamond.png')] opacity-5 animate-bounce" />
                    <motion.div
                      className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-purple to-transparent"
                      animate={{ x: [-100, 100] }}
                      transition={{ duration: 3.5, repeat: Infinity, repeatType: "reverse" }}
                    />
                    
                    <motion.div
                      animate={{ 
                        rotateZ: [0, 15, -15, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Coins className="w-10 h-10 text-neon-purple mx-auto mb-4" />
                    </motion.div>
                    
                    <motion.div 
                      className="font-pixel text-4xl text-neon-purple mb-2"
                      animate={{ 
                        textShadow: [
                          '0 0 10px #a855f7',
                          '0 0 20px #a855f7, 0 0 30px #a855f7',
                          '0 0 10px #a855f7'
                        ]
                      }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    >
                      {totalStats.earnings.toFixed(2)}
                    </motion.div>
                    <div className="font-arcade text-xs text-neon-purple mb-1 tracking-wider">GALACTIC</div>
                    <div className="font-arcade text-sm text-gray-300 tracking-wider">TOTAL EARNINGS</div>
                    
                    {/* Coin Rain Effect on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-neon-purple rounded-full"
                          style={{
                            left: `${10 + i * 20}%`,
                            top: '-10px'
                          }}
                          animate={{
                            y: [0, 120],
                            opacity: [1, 0],
                            rotate: [0, 360]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "easeOut"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Fleet Grid */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {userNFTs.map((nft, index) => {
                  const shipData = SHIP_TYPES[nft.shipType]
                  return (
                    <motion.div
                      key={nft.tokenId}
                      className={`bg-cyber-gray/20 border-2 ${getRarityColor(nft.shipType)} p-6 backdrop-blur-sm hover:bg-cyber-gray/40 transition-all duration-300 cursor-pointer group`}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      onClick={() => setSelectedShip(nft)}
                    >
                      {/* Ship Image */}
                      <div className="relative mb-6 h-32 flex items-center justify-center bg-black/20 rounded-lg">
                        <motion.img
                          src={getShipImage(nft.shipType)}
                          alt={shipData.name}
                          className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-300 filter brightness-110"
                          whileHover={{ rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 0.5 }}
                          onError={(e) => {
                            // Fallback to rocket icon if SVG fails to load
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const fallback = target.nextElementSibling as HTMLElement
                            if (fallback) fallback.style.display = 'block'
                          }}
                        />
                        {/* Fallback icon */}
                        <Rocket className="w-16 h-16 text-neon-blue animate-float" style={{ display: 'none' }} />
                        <div className="absolute top-2 right-2">
                          <div className={`font-pixel text-xs px-2 py-1 border ${getRarityColor(nft.shipType)} bg-black/50`}>
                            #{nft.tokenId}
                          </div>
                        </div>
                      </div>

                      {/* Ship Info */}
                      <div className="text-center mb-4">
                        <h3 className={`font-pixel text-lg text-${shipData.color} mb-2 animate-glow`}>
                          {shipData.name}
                        </h3>
                        <div className="font-arcade text-sm text-gray-400 mb-3">
                          Level {nft.level} • {nft.experience} XP
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="font-arcade text-xs text-gray-400 flex items-center">
                            <Zap className="w-3 h-3 mr-1" /> SPEED
                          </span>
                          <span className="font-pixel text-xs text-yellow-400">{shipData.stats.speed}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-arcade text-xs text-gray-400 flex items-center">
                            <Shield className="w-3 h-3 mr-1" /> ARMOR
                          </span>
                          <span className="font-pixel text-xs text-blue-400">{shipData.stats.armor}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-arcade text-xs text-gray-400 flex items-center">
                            <Star className="w-3 h-3 mr-1" /> LUCK
                          </span>
                          <span className="font-pixel text-xs text-pink-400">{shipData.stats.luck}</span>
                        </div>
                      </div>

                      {/* Mission Stats */}
                      <div className="border-t border-gray-600 pt-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-arcade text-xs text-gray-400">Missions</span>
                          <span className="font-pixel text-xs text-neon-green">{nft.missions}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-arcade text-xs text-gray-400">Earnings</span>
                          <span className="font-pixel text-xs text-neon-purple">{nft.earnings} GALACTIC</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <motion.button
                        className="w-full mt-4 neon-button font-pixel text-xs py-2 text-neon-blue hover:text-neon-green"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        LAUNCH MISSION
                      </motion.button>
                    </motion.div>
                  )
                })}
              </motion.div>

              {/* Add More Ships CTA */}
              <motion.div 
                className="text-center mt-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="bg-cyber-gray/20 border border-neon-blue/30 p-8 backdrop-blur-sm max-w-2xl mx-auto">
                  <Sparkles className="w-12 h-12 text-neon-blue mx-auto mb-4 animate-pulse" />
                  <h3 className="font-pixel text-xl text-neon-blue mb-4">
                    EXPAND YOUR FLEET
                  </h3>
                  <p className="font-arcade text-sm text-gray-400 mb-6">
                    Acquire more spaceships to increase your cosmic dominance
                  </p>
                  <Link 
                    href="/marketplace"
                    className="neon-button font-pixel px-6 py-3 text-sm text-neon-blue hover:text-neon-green inline-block"
                  >
                    VISIT MARKETPLACE
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
