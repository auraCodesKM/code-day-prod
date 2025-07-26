'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Rocket, Zap, Trophy, Skull, Star, Shield, Coins } from 'lucide-react'
import AudioManager from '../components/AudioManager'

export default function Home() {
  const [score, setScore] = useState(0)
  const [health, setHealth] = useState(100)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Animate score counter
    const interval = setInterval(() => {
      setScore(prev => (prev < 999999 ? prev + Math.floor(Math.random() * 1000) : 999999))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-space-black flex items-center justify-center">
        <div className="text-center">
          <div className="font-pixel text-neon-blue text-xl mb-8 animate-glow">
            LOADING...
          </div>
          <div className="w-64 h-2 bg-cyber-gray border border-neon-blue">
            <motion.div 
              className="h-full bg-neon-blue"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2 }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-space-black relative overflow-hidden">
      {/* Audio Manager */}
      <AudioManager />
      
      {/* Starfield Background */}
      <div className="absolute inset-0 starfield opacity-40" />
      
      {/* Cosmic Dust Layer */}
      <div className="absolute inset-0 cosmic-dust opacity-20" />
      
      {/* Scan Lines Effect */}
      <div className="absolute inset-0 scan-lines opacity-20" />
      
      {/* CRT Effect */}
      <div className="absolute inset-0 crt-effect" />

      {/* Header HUD */}
      <header className="relative z-10 p-4 border-b border-neon-blue/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Rocket className="w-8 h-8 text-neon-blue animate-float" />
            <span className="font-pixel text-neon-blue text-sm md:text-lg animate-glow">
              MISSION LAUNCH
            </span>
          </motion.div>

          {/* HUD Stats */}
          <div className="flex items-center space-x-6">
            {/* Health Bar */}
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-neon-green" />
              <div className="w-24 h-3 bg-cyber-gray border border-neon-green">
                <div 
                  className="h-full health-bar-fill"
                  style={{ width: `${health}%` }}
                />
              </div>
              <span className="font-pixel text-neon-green text-xs">{health}</span>
            </div>

            {/* Score Counter */}
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-neon-yellow" />
              <span className="font-pixel text-neon-yellow text-xs score-counter">
                {score.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Title */}
            <motion.h1 
              className="font-pixel text-4xl md:text-6xl lg:text-8xl text-neon-blue mb-8 glitch-text relative"
              data-text="BURN OR GLORY"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <span className="animate-glow relative z-10">BURN OR GLORY</span>
              {/* Title background glow effect */}
              <div className="absolute inset-0 bg-neon-blue/10 blur-3xl animate-pulse" />
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="font-arcade text-lg md:text-2xl text-neon-green mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              Stake your NFT spaceship for the ultimate cosmic gamble. 
              <br />
              <span className="text-neon-pink">Success brings rewards.</span>
              <br />
              <span className="text-neon-yellow">Failure burns everything.</span>
            </motion.p>

            {/* Game Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.div 
                className="bg-cyber-gray/50 border border-neon-blue p-4 backdrop-blur-sm hover:bg-neon-blue/10 transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-neon-blue font-pixel text-2xl animate-pulse">50%</div>
                <div className="text-neon-blue font-arcade text-xs">SUCCESS RATE</div>
                <div className="absolute inset-0 bg-neon-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
              <motion.div 
                className="bg-cyber-gray/50 border border-neon-green p-4 backdrop-blur-sm hover:bg-neon-green/10 transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-neon-green font-pixel text-2xl animate-pulse">100</div>
                <div className="text-neon-green font-arcade text-xs">GALACTIC TOKENS</div>
                <div className="absolute inset-0 bg-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
              <motion.div 
                className="bg-cyber-gray/50 border border-neon-pink p-4 backdrop-blur-sm hover:bg-neon-pink/10 transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-neon-pink font-pixel text-2xl animate-pulse">0.01</div>
                <div className="text-neon-pink font-arcade text-xs">ETH TO MINT</div>
                <div className="absolute inset-0 bg-neon-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
              <motion.div 
                className="bg-cyber-gray/50 border border-neon-yellow p-4 backdrop-blur-sm hover:bg-neon-yellow/10 transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-neon-yellow font-pixel text-2xl animate-pulse">∞</div>
                <div className="text-neon-yellow font-arcade text-xs">GLORY AWAITS</div>
                <div className="absolute inset-0 bg-neon-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <button className="neon-button font-pixel px-8 py-4 text-lg md:text-xl group relative overflow-hidden">
                <span className="relative z-10 flex items-center space-x-3">
                  <Rocket className="w-6 h-6 animate-float" />
                  <span>START MISSION</span>
                </span>
              </button>
              
              <button className="neon-button font-pixel px-8 py-4 text-lg md:text-xl border-neon-yellow text-neon-yellow hover:border-neon-green hover:text-neon-green group">
                <span className="flex items-center space-x-3">
                  <Coins className="w-6 h-6 animate-pulse" />
                  <span>MINT YOUR FLEET</span>
                </span>
              </button>
              
              <button className="neon-button font-pixel px-8 py-4 text-lg md:text-xl border-neon-purple text-neon-purple hover:border-neon-pink hover:text-neon-pink group">
                <span className="flex items-center space-x-3">
                  <Star className="w-6 h-6" />
                  <span>VIEW FLEET</span>
                </span>
              </button>
            </motion.div>

            {/* Warning Message */}
            <motion.div 
              className="mt-12 p-4 border border-red-500 bg-red-500/10 backdrop-blur-sm max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              <div className="flex items-center justify-center space-x-2 text-red-400">
                <Skull className="w-5 h-5 animate-pulse" />
                <span className="font-pixel text-sm">
                  WARNING: FAILED MISSIONS RESULT IN PERMANENT NFT DESTRUCTION
                </span>
                <Skull className="w-5 h-5 animate-pulse" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Game Mechanics Section */}
        <section className="py-16 px-4 border-t border-neon-blue/30">
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              className="font-pixel text-2xl md:text-4xl text-neon-green text-center mb-12 animate-glow"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              MISSION PROTOCOLS
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <motion.div 
                className="bg-cyber-gray/30 border border-neon-blue p-6 backdrop-blur-sm hover:border-neon-green transition-colors duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 border-2 border-neon-blue rounded-full flex items-center justify-center">
                    <span className="font-pixel text-neon-blue text-xl">1</span>
                  </div>
                  <h3 className="font-pixel text-neon-blue text-lg mb-4">MINT SPACESHIP</h3>
                  <p className="font-arcade text-sm text-gray-300 leading-relaxed">
                    Acquire your NFT spaceship for 0.01 ETH. Each ship is unique and ready for cosmic adventures.
                  </p>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                className="bg-cyber-gray/30 border border-neon-green p-6 backdrop-blur-sm hover:border-neon-yellow transition-colors duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 border-2 border-neon-green rounded-full flex items-center justify-center">
                    <span className="font-pixel text-neon-green text-xl">2</span>
                  </div>
                  <h3 className="font-pixel text-neon-green text-lg mb-4">LAUNCH MISSION</h3>
                  <p className="font-arcade text-sm text-gray-300 leading-relaxed">
                    Stake your spaceship and launch into the unknown. The cosmos will decide your fate.
                  </p>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                className="bg-cyber-gray/30 border border-neon-pink p-6 backdrop-blur-sm hover:border-neon-purple transition-colors duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 border-2 border-neon-pink rounded-full flex items-center justify-center">
                    <span className="font-pixel text-neon-pink text-xl">3</span>
                  </div>
                  <h3 className="font-pixel text-neon-pink text-lg mb-4">GLORY OR BURN</h3>
                  <p className="font-arcade text-sm text-gray-300 leading-relaxed">
                    Success returns your ship + 100 GALACTIC tokens. Failure burns your NFT forever.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Leaderboard Preview */}
        <section className="py-16 px-4 border-t border-neon-blue/30">
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              className="font-pixel text-2xl md:text-4xl text-neon-yellow text-center mb-12 animate-glow"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              HALL OF GLORY
            </motion.h2>

            <div className="bg-cyber-gray/30 border border-neon-yellow backdrop-blur-sm">
              <div className="p-4 border-b border-neon-yellow/30">
                <div className="grid grid-cols-4 gap-4 font-pixel text-neon-yellow text-xs">
                  <div>RANK</div>
                  <div>PILOT</div>
                  <div>MISSIONS</div>
                  <div>REWARDS</div>
                </div>
              </div>
              
              {[
                { rank: 1, pilot: "COSMIC_ACE", missions: 47, rewards: 4700 },
                { rank: 2, pilot: "STAR_HUNTER", missions: 35, rewards: 3500 },
                { rank: 3, pilot: "VOID_RIDER", missions: 28, rewards: 2800 },
                { rank: 4, pilot: "NEBULA_GHOST", missions: 22, rewards: 2200 },
                { rank: 5, pilot: "QUANTUM_PILOT", missions: 19, rewards: 1900 },
              ].map((player, index) => (
                <motion.div 
                  key={player.rank}
                  className="p-4 border-b border-neon-yellow/10 hover:bg-neon-yellow/5 transition-colors duration-300"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="grid grid-cols-4 gap-4 font-arcade text-sm">
                    <div className="text-neon-yellow">#{player.rank}</div>
                    <div className="text-neon-green">{player.pilot}</div>
                    <div className="text-neon-blue">{player.missions}</div>
                    <div className="text-neon-pink">{player.rewards.toLocaleString()}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neon-blue/30 p-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-arcade text-sm text-gray-400">
            © 2024 Mission Launch: Burn or Glory • Built for the Cosmos • 
            <span className="text-neon-blue ml-2">Powered by Ethereum</span>
          </p>
        </div>
      </footer>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-blue rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}
