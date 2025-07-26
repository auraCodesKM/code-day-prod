'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Wallet, Zap, Shield, Star, Coins, Rocket, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import AudioManager from '../../components/AudioManager'

interface Rocket {
  id: number
  name: string
  image: string
  price: string
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary'
  stats: {
    speed: number
    armor: number
    luck: number
  }
  description: string
}

const rockets: Rocket[] = [
  {
    id: 1,
    name: "STELLAR VOYAGER",
    image: "/rockets/1.svg",
    price: "0.01",
    rarity: "Common",
    stats: { speed: 65, armor: 45, luck: 30 },
    description: "A reliable starter ship for cosmic adventures"
  },
  {
    id: 2,
    name: "NEBULA HUNTER",
    image: "/rockets/2.svg", 
    price: "0.025",
    rarity: "Rare",
    stats: { speed: 80, armor: 60, luck: 55 },
    description: "Enhanced propulsion for deep space missions"
  },
  {
    id: 3,
    name: "QUANTUM DESTROYER",
    image: "/rockets/3.svg",
    price: "0.05",
    rarity: "Epic",
    stats: { speed: 95, armor: 85, luck: 75 },
    description: "Elite warship with quantum-enhanced capabilities"
  }
]

const rarityColors = {
  Common: 'text-neon-blue border-neon-blue',
  Rare: 'text-neon-green border-neon-green',
  Epic: 'text-neon-purple border-neon-purple',
  Legendary: 'text-neon-yellow border-neon-yellow'
}

export default function Marketplace() {
  const [selectedRocket, setSelectedRocket] = useState<Rocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [isMinting, setIsMinting] = useState(false)
  const [mintSuccess, setMintSuccess] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [hoveredRocket, setHoveredRocket] = useState<number | null>(null)
  const [launchingRockets, setLaunchingRockets] = useState<number[]>([])
  const [roamingRockets, setRoamingRockets] = useState<number[]>([])

  const playLaunchSound = () => {
    const audio = new Audio('/audio/launch-sound.mp3')
    audio.volume = 0.7
    audio.play().catch(console.log)
  }

  const launchAllRockets = () => {
    playLaunchSound()
    setLaunchingRockets([1, 2, 3])
    
    // Reset after animation
    setTimeout(() => {
      setLaunchingRockets([])
    }, 3000)
  }

  const launchSingleRocket = (rocketId: number) => {
    if (launchingRockets.includes(rocketId) || roamingRockets.includes(rocketId)) return
    
    playLaunchSound()
    setLaunchingRockets(prev => [...prev, rocketId])
    
    // After launch, start roaming
    setTimeout(() => {
      setLaunchingRockets(prev => prev.filter(id => id !== rocketId))
      setRoamingRockets(prev => [...prev, rocketId])
      
      // Stop roaming after pattern completion
      setTimeout(() => {
        setRoamingRockets(prev => prev.filter(id => id !== rocketId))
      }, 8000)
    }, 2000)
  }

  const connectWallet = async () => {
    // Simulate wallet connection
    setIsConnected(true)
    setWalletAddress('0x1234...abcd')
  }

  const mintNFT = async (rocket: Rocket) => {
    if (!isConnected) {
      await connectWallet()
      return
    }

    setIsMinting(true)
    setSelectedRocket(rocket)
    
    // Simulate blockchain transaction
    setTimeout(() => {
      setIsMinting(false)
      setMintSuccess(true)
      setTimeout(() => setMintSuccess(false), 3000)
    }, 3000)
  }

  // Launch all rockets when page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true)
      launchAllRockets()
    }, 1000) // Delay to let page settle
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-space-black relative overflow-hidden">
      {/* Audio Manager */}
      <AudioManager />
      
      {/* Background Effects */}
      <div className="absolute inset-0 starfield opacity-40" />
      <div className="absolute inset-0 cosmic-dust opacity-20" />
      <div className="absolute inset-0 scan-lines opacity-20" />
      <div className="absolute inset-0 crt-effect" />

      {/* Header */}
      <header className="relative z-10 p-4 border-b border-neon-blue/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 hover:text-neon-green transition-colors duration-300">
            <ArrowLeft className="w-6 h-6 text-neon-blue" />
            <span className="font-pixel text-neon-blue text-sm">BACK TO MISSION</span>
          </Link>

          <div className="flex items-center space-x-2">
            <Rocket className="w-8 h-8 text-neon-blue animate-float" />
            <span className="font-pixel text-neon-blue text-lg animate-glow">
              FLEET MARKETPLACE
            </span>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-2 bg-cyber-gray/50 border border-neon-green px-4 py-2 backdrop-blur-sm">
                <CheckCircle className="w-4 h-4 text-neon-green" />
                <span className="font-pixel text-neon-green text-xs">{walletAddress}</span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="neon-button font-pixel px-4 py-2 text-sm text-neon-blue hover:text-neon-green"
              >
                <span className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4" />
                  <span>CONNECT WALLET</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-pixel text-4xl md:text-6xl text-neon-blue mb-4 animate-glow">
              MINT YOUR FLEET
            </h1>
            <p className="font-arcade text-lg text-neon-green max-w-2xl mx-auto">
              Choose your spaceship and mint it as an NFT. Each ship has unique stats and capabilities for your cosmic missions.
            </p>
          </motion.div>

          {/* Rocket Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {rockets.map((rocket, index) => (
              <motion.div
                key={rocket.id}
                className={`bg-cyber-gray/20 border-2 ${rarityColors[rocket.rarity]} backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-all duration-500 rounded-lg`}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ 
                  boxShadow: `0 0 50px ${rocket.rarity === 'Common' ? '#00f3ff' : rocket.rarity === 'Rare' ? '#39ff14' : rocket.rarity === 'Epic' ? '#bf00ff' : '#ffff00'}, inset 0 0 20px rgba(255,255,255,0.1)`,
                  y: -10,
                  rotateX: 5
                }}
                onMouseEnter={() => {
                  setHoveredRocket(rocket.id)
                  launchSingleRocket(rocket.id)
                }}
                onMouseLeave={() => setHoveredRocket(null)}
                style={{
                  background: `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(26,26,46,0.6) 50%, rgba(0,0,0,0.8) 100%)`,
                  boxShadow: `0 0 20px ${rocket.rarity === 'Common' ? 'rgba(0,243,255,0.3)' : rocket.rarity === 'Rare' ? 'rgba(57,255,20,0.3)' : rocket.rarity === 'Epic' ? 'rgba(191,0,255,0.3)' : 'rgba(255,255,0,0.3)'}`
                }}
              >
                {/* Rarity Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 border ${rarityColors[rocket.rarity]} backdrop-blur-sm z-10`}>
                  <span className="font-pixel text-xs">{rocket.rarity.toUpperCase()}</span>
                </div>

                {/* Rocket Image */}
                <div className="p-8 flex justify-center items-center h-64 relative overflow-hidden">
                  {/* Holographic Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Rotating Ring Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-current/20 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
                  <div className="absolute inset-4 border border-transparent group-hover:border-current/10 rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
                  
                  {/* Rocket Image with Launch & Roaming Animations */}
                  <motion.img 
                    src={rocket.image} 
                    alt={rocket.name}
                    className="max-w-full max-h-full object-contain pixel-art relative z-10"
                    animate={{
                      // Launch Animation
                      ...(launchingRockets.includes(rocket.id) ? {
                        y: [-0, -50, -200, -400, -800],
                        x: [0, 10, -5, 15, 0],
                        scale: [1, 1.2, 0.8, 0.5, 0.2],
                        rotate: [0, -10, 5, -15, 0],
                        opacity: [1, 1, 0.8, 0.4, 0]
                      } : 
                      // Roaming Animation
                      roamingRockets.includes(rocket.id) ? {
                        y: [-800, -600, -400, -500, -300, -400, -200, 0],
                        x: [0, 100, -80, 150, -120, 200, -100, 0],
                        scale: [0.2, 0.4, 0.6, 0.5, 0.7, 0.6, 0.8, 1],
                        rotate: [0, 45, -30, 60, -45, 30, -15, 0],
                        opacity: [0, 0.3, 0.6, 0.8, 0.9, 0.7, 0.9, 1]
                      } : 
                      // Normal Hover Animation
                      hoveredRocket === rocket.id ? {
                        scale: 1.1,
                        rotate: [0, -2, 2, 0],
                        filter: 'drop-shadow(0 0 20px currentColor)'
                      } : {
                        scale: 1,
                        rotate: 0,
                        filter: 'none'
                      })
                    }}
                    transition={{
                      duration: launchingRockets.includes(rocket.id) ? 2 : 
                                roamingRockets.includes(rocket.id) ? 8 : 0.5,
                      ease: launchingRockets.includes(rocket.id) ? 'easeOut' : 
                            roamingRockets.includes(rocket.id) ? 'easeInOut' : 'easeInOut'
                    }}
                  />
                  
                  {/* Energy Particles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-current rounded-full"
                        style={{
                          left: `${20 + (i * 10)}%`,
                          top: `${30 + (i % 3) * 20}%`,
                        }}
                        animate={{
                          y: [-10, -20, -10],
                          opacity: [0.3, 1, 0.3],
                          scale: [1, 1.5, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Rocket Info */}
                <div className="p-6 border-t border-current/30">
                  <h3 className="font-pixel text-xl mb-2 animate-glow">{rocket.name}</h3>
                  <p className="font-arcade text-sm text-gray-300 mb-4 leading-relaxed">
                    {rocket.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <motion.div 
                      className="text-center relative group/stat"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="relative">
                        <Zap className="w-6 h-6 mx-auto mb-2 text-neon-yellow group-hover/stat:animate-pulse" />
                        <div className="absolute inset-0 bg-neon-yellow/20 rounded-full blur-md opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="font-pixel text-lg text-neon-yellow mb-1 group-hover/stat:animate-bounce">{rocket.stats.speed}</div>
                      <div className="font-arcade text-xs text-gray-400 group-hover/stat:text-neon-yellow transition-colors duration-300">SPEED</div>
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-neon-yellow"
                          initial={{ width: 0 }}
                          animate={{ width: `${rocket.stats.speed}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                    </motion.div>
                    <motion.div 
                      className="text-center relative group/stat"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="relative">
                        <Shield className="w-6 h-6 mx-auto mb-2 text-neon-blue group-hover/stat:animate-pulse" />
                        <div className="absolute inset-0 bg-neon-blue/20 rounded-full blur-md opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="font-pixel text-lg text-neon-blue mb-1 group-hover/stat:animate-bounce">{rocket.stats.armor}</div>
                      <div className="font-arcade text-xs text-gray-400 group-hover/stat:text-neon-blue transition-colors duration-300">ARMOR</div>
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-neon-blue"
                          initial={{ width: 0 }}
                          animate={{ width: `${rocket.stats.armor}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                        />
                      </div>
                    </motion.div>
                    <motion.div 
                      className="text-center relative group/stat"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="relative">
                        <Star className="w-6 h-6 mx-auto mb-2 text-neon-pink group-hover/stat:animate-pulse" />
                        <div className="absolute inset-0 bg-neon-pink/20 rounded-full blur-md opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="font-pixel text-lg text-neon-pink mb-1 group-hover/stat:animate-bounce">{rocket.stats.luck}</div>
                      <div className="font-arcade text-xs text-gray-400 group-hover/stat:text-neon-pink transition-colors duration-300">LUCK</div>
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-neon-pink"
                          initial={{ width: 0 }}
                          animate={{ width: `${rocket.stats.luck}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.4 }}
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Coins className="w-6 h-6 text-neon-yellow animate-pulse" />
                    <span className="font-pixel text-neon-yellow text-xl">{rocket.price} ETH</span>
                  </div>
                  
                  {/* Mint Button - Full Width */}
                  <button
                    onClick={() => mintNFT(rocket)}
                    disabled={isMinting && selectedRocket?.id === rocket.id}
                    className={`w-full neon-button font-pixel px-6 py-3 text-sm ${
                      isMinting && selectedRocket?.id === rocket.id 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:scale-105 hover:shadow-2xl'
                    } transition-all duration-300 relative overflow-hidden group`}
                  >
                    {/* Button Background Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    {isMinting && selectedRocket?.id === rocket.id ? (
                      <span className="flex items-center justify-center space-x-2 relative z-10">
                        <div className="w-4 h-4 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
                        <span>MINTING...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center space-x-2 relative z-10">
                        <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                        <span>MINT NFT</span>
                      </span>
                    )}
                  </button>
                </div>

                {/* Advanced Hover Effects */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                  {/* Animated Border Scan */}
                  <div className="absolute inset-0 border-2 border-transparent">
                    <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-current to-transparent animate-pulse`} />
                    <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-current to-transparent animate-pulse`} style={{ animationDelay: '0.5s' }} />
                    <div className={`absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-current to-transparent animate-pulse`} style={{ animationDelay: '0.25s' }} />
                    <div className={`absolute right-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-current to-transparent animate-pulse`} style={{ animationDelay: '0.75s' }} />
                  </div>
                  
                  {/* Holographic Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    rocket.rarity === 'Common' ? 'from-neon-blue/10 via-transparent to-neon-blue/5' :
                    rocket.rarity === 'Rare' ? 'from-neon-green/10 via-transparent to-neon-green/5' :
                    rocket.rarity === 'Epic' ? 'from-neon-purple/10 via-transparent to-neon-purple/5' : 'from-neon-yellow/10 via-transparent to-neon-yellow/5'
                  }`} />
                  
                  {/* Scanning Line Effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent h-8"
                    animate={{ y: [-32, 300] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
                
                {/* Rarity Glow Ring */}
                <div className="absolute -inset-2 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none">
                  <div className={`absolute inset-0 rounded-lg border-2 ${
                    rocket.rarity === 'Common' ? 'border-neon-blue' :
                    rocket.rarity === 'Rare' ? 'border-neon-green' :
                    rocket.rarity === 'Epic' ? 'border-neon-purple' : 'border-neon-yellow'
                  } animate-ping`} style={{ animationDuration: '2s' }} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info Section */}
          <motion.div 
            className="bg-cyber-gray/20 border border-neon-blue/30 p-8 backdrop-blur-sm"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="font-pixel text-2xl text-neon-green mb-6 text-center animate-glow">
              HOW IT WORKS
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-neon-blue rounded-full flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-neon-blue" />
                </div>
                <h3 className="font-pixel text-neon-blue mb-2">CONNECT WALLET</h3>
                <p className="font-arcade text-sm text-gray-300">
                  Connect your Ethereum wallet to start minting NFT spaceships
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-neon-green rounded-full flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-neon-green" />
                </div>
                <h3 className="font-pixel text-neon-green mb-2">CHOOSE SHIP</h3>
                <p className="font-arcade text-sm text-gray-300">
                  Select your preferred spaceship based on stats and rarity
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-neon-pink rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-neon-pink" />
                </div>
                <h3 className="font-pixel text-neon-pink mb-2">MINT & LAUNCH</h3>
                <p className="font-arcade text-sm text-gray-300">
                  Mint your NFT and use it for high-stakes cosmic missions
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Success Modal */}
      {mintSuccess && (
        <motion.div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-cyber-gray border-2 border-neon-green p-8 max-w-md mx-4 backdrop-blur-sm"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-neon-green mx-auto mb-4 animate-pulse" />
              <h3 className="font-pixel text-2xl text-neon-green mb-4">MINT SUCCESSFUL!</h3>
              <p className="font-arcade text-sm text-gray-300 mb-6">
                Your {selectedRocket?.name} has been minted successfully and added to your fleet!
              </p>
              <div className="flex items-center justify-center space-x-2 text-neon-yellow">
                <Coins className="w-5 h-5" />
                <span className="font-pixel text-sm">Transaction Complete</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-blue rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}
