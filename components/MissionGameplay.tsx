'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Zap, Target, Shield, AlertTriangle, Trophy, Skull } from 'lucide-react'

interface MissionGameplayProps {
  selectedShip: any
  missionType: string
  onMissionComplete: (success: boolean, damage?: number) => void
  onExit: () => void
}

// Mission backgrounds in sequence
const STAGE_BACKGROUNDS = [
  '/images/Free Magical Cloud Sea Image | Download at StockCake.jpg', // Magical Cloud Sea
  '/images/ -3.jpg', // Asteroid Field
  '/images/ -4.jpg', // Cosmic Storm
  '/images/ -5.jpg', // Enemy Territory
  '/images/ -6.jpg', // Nebula Passage
  '/images/ -7.jpg', // Hostile Sector
  '/images/ -8.jpg', // Deep Space Anomaly
  '/images/ -9.jpg', // Final Approach
  '/images/Céu de estrelas em fundo à noite | imagem Premium gerada com IA.jpg'  // Stellar Graveyard
]

// Obstacle types
const OBSTACLE_TYPES = [
  { type: 'asteroid', color: '#8B4513', size: 60, damage: 15 },
  { type: 'enemy', color: '#ff0040', size: 40, damage: 25 },
  { type: 'laser', color: '#00ff88', size: 20, damage: 10 },
  { type: 'mine', color: '#a855f7', size: 35, damage: 30 }
]

export default function MissionGameplay({ selectedShip, missionType, onMissionComplete, onExit }: MissionGameplayProps) {
  const [currentStage, setCurrentStage] = useState(0)
  const [shipPosition, setShipPosition] = useState({ x: 100, y: 300 })
  const [health, setHealth] = useState(100)
  const [score, setScore] = useState(0)
  const [obstacles, setObstacles] = useState<any[]>([])
  const [projectiles, setProjectiles] = useState<any[]>([])
  const [gamePhase, setGamePhase] = useState<'flying' | 'combat' | 'complete'>('flying')
  const [missionText, setMissionText] = useState('MISSION INITIATED - NAVIGATING COSMIC VOID')
  const [isGameActive, setIsGameActive] = useState(true)

  // Ship movement with mouse/touch
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isGameActive) return
    const rect = document.getElementById('mission-container')?.getBoundingClientRect()
    if (rect) {
      setShipPosition({
        x: Math.max(50, Math.min(rect.width - 100, e.clientX - rect.left)),
        y: Math.max(50, Math.min(rect.height - 100, e.clientY - rect.top))
      })
    }
  }, [isGameActive])

  // Auto-shooting
  const shoot = useCallback(() => {
    if (!isGameActive) return
    const newProjectile = {
      id: Date.now(),
      x: shipPosition.x + 40,
      y: shipPosition.y,
      speed: 8
    }
    setProjectiles(prev => [...prev, newProjectile])
  }, [shipPosition, isGameActive])

  // Generate obstacles
  const generateObstacle = useCallback(() => {
    if (!isGameActive) return
    const obstacle = {
      id: Date.now(),
      ...OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)],
      x: window.innerWidth + 100,
      y: Math.random() * (window.innerHeight - 200) + 100,
      speed: 2 + Math.random() * 3
    }
    setObstacles(prev => [...prev, obstacle])
  }, [isGameActive])

  // Game loop
  useEffect(() => {
    if (!isGameActive) return

    const gameLoop = setInterval(() => {
      // Move obstacles
      setObstacles(prev => prev
        .map(obs => ({ ...obs, x: obs.x - obs.speed }))
        .filter(obs => obs.x > -100)
      )

      // Move projectiles
      setProjectiles(prev => prev
        .map(proj => ({ ...proj, x: proj.x + proj.speed }))
        .filter(proj => proj.x < window.innerWidth + 100)
      )

      // Check collisions
      setObstacles(prev => {
        const remaining = []
        let damageDealt = 0

        for (const obs of prev) {
          let hit = false

          // Check ship collision
          const shipDistance = Math.sqrt(
            Math.pow(obs.x - shipPosition.x, 2) + Math.pow(obs.y - shipPosition.y, 2)
          )
          if (shipDistance < 50) {
            damageDealt += obs.damage
            hit = true
          }

          // Check projectile collisions
          for (const proj of projectiles) {
            const projDistance = Math.sqrt(
              Math.pow(obs.x - proj.x, 2) + Math.pow(obs.y - proj.y, 2)
            )
            if (projDistance < 30) {
              setScore(prev => prev + 10)
              setProjectiles(prevProj => prevProj.filter(p => p.id !== proj.id))
              hit = true
              break
            }
          }

          if (!hit) remaining.push(obs)
        }

        if (damageDealt > 0) {
          setHealth(prev => Math.max(0, prev - damageDealt))
        }

        return remaining
      })
    }, 50)

    return () => clearInterval(gameLoop)
  }, [shipPosition, projectiles, isGameActive])

  // Stage progression
  useEffect(() => {
    if (!isGameActive) return

    const stageTimer = setTimeout(() => {
      if (currentStage < STAGE_BACKGROUNDS.length - 1) {
        setCurrentStage(prev => prev + 1)
        setMissionText(`STAGE ${currentStage + 2} - ${getStageText(currentStage + 1)}`)
      } else {
        setGamePhase('complete')
        setIsGameActive(false)
        // Determine success based on health remaining
        const success = health > 20
        setTimeout(() => onMissionComplete(success, 100 - health), 2000)
      }
    }, 8000) // 8 seconds per stage

    return () => clearTimeout(stageTimer)
  }, [currentStage, health, onMissionComplete, isGameActive])

  // Health check
  useEffect(() => {
    if (health <= 0) {
      setGamePhase('complete')
      setIsGameActive(false)
      setMissionText('MISSION FAILED - SHIP DESTROYED')
      setTimeout(() => onMissionComplete(false, 100), 2000)
    }
  }, [health, onMissionComplete])

  // Auto-shoot and obstacle generation
  useEffect(() => {
    if (!isGameActive) return

    const shootInterval = setInterval(shoot, 300)
    const obstacleInterval = setInterval(generateObstacle, 1500)

    return () => {
      clearInterval(shootInterval)
      clearInterval(obstacleInterval)
    }
  }, [shoot, generateObstacle, isGameActive])

  // Mouse movement listener
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  const getStageText = (stage: number) => {
    const texts = [
      'ENTERING MAGICAL CLOUD SEA',
      'NAVIGATING ASTEROID FIELD',
      'COSMIC STORM DETECTED',
      'ENEMY TERRITORY AHEAD',
      'NEBULA PASSAGE',
      'HOSTILE SECTOR',
      'DEEP SPACE ANOMALY',
      'FINAL APPROACH',
      'STELLAR GRAVEYARD'
    ]
    return texts[stage] || 'UNKNOWN SECTOR'
  }

  return (
    <div 
      id="mission-container"
      className="fixed inset-0 z-50 overflow-hidden cursor-none"
      style={{ 
        backgroundImage: `url(${STAGE_BACKGROUNDS[currentStage]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Animation Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />

      {/* Starfield Effect */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
              x: [-2, 2, -2]
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* HUD - Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex justify-between items-center">
          {/* Health Bar */}
          <div className="flex items-center space-x-4">
            <Heart className="w-6 h-6 text-neon-red" />
            <div className="w-64 h-4 bg-black/50 border border-neon-red rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-neon-red to-neon-green"
                style={{ width: `${health}%` }}
                animate={{ 
                  boxShadow: health < 30 ? '0 0 20px #ff0040' : '0 0 10px #00ff88'
                }}
              />
            </div>
            <span className="font-pixel text-white">{health}%</span>
          </div>

          {/* Score */}
          <div className="flex items-center space-x-2">
            <Target className="w-6 h-6 text-neon-blue" />
            <span className="font-pixel text-2xl text-neon-blue">{score}</span>
          </div>

          {/* Exit Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onExit}
            className="font-pixel px-4 py-2 bg-neon-red/20 border border-neon-red text-neon-red hover:bg-neon-red/30 transition-all"
          >
            ABORT MISSION
          </motion.button>
        </div>
      </div>

      {/* Mission Text */}
      <motion.div
        className="absolute top-20 left-1/2 transform -translate-x-1/2"
        key={missionText}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div className="bg-black/70 border border-neon-blue px-6 py-3 rounded">
          <p className="font-pixel text-neon-blue text-center">{missionText}</p>
        </div>
      </motion.div>

      {/* Stage Progress */}
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {STAGE_BACKGROUNDS.map((_: string, index: number) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full border ${
                index <= currentStage 
                  ? 'bg-neon-green border-neon-green' 
                  : 'bg-transparent border-gray-500'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Ship */}
      <motion.div
        className="absolute z-30"
        style={{ 
          left: shipPosition.x - 40, 
          top: shipPosition.y - 40,
        }}
        animate={{ 
          rotate: [0, 2, -2, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.img
          src="/rockets/1.svg"
          alt="Ship"
          className="w-20 h-20 filter brightness-125"
          animate={{
            filter: [
              'brightness(1.25) drop-shadow(0 0 10px #00f5ff)',
              'brightness(1.5) drop-shadow(0 0 20px #00f5ff)',
              'brightness(1.25) drop-shadow(0 0 10px #00f5ff)'
            ]
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        
        {/* Engine Trail */}
        <motion.div
          className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-16 h-2 bg-gradient-to-l from-neon-blue to-transparent rounded-full"
          animate={{
            scaleX: [0.8, 1.2, 0.8],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
      </motion.div>

      {/* Projectiles */}
      <AnimatePresence>
        {projectiles.map(proj => (
          <motion.div
            key={proj.id}
            className="absolute w-3 h-1 bg-neon-green rounded-full z-20"
            style={{ left: proj.x, top: proj.y + 10 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <div className="w-full h-full bg-neon-green rounded-full animate-pulse" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Obstacles */}
      <AnimatePresence>
        {obstacles.map(obs => (
          <motion.div
            key={obs.id}
            className="absolute z-20 flex items-center justify-center rounded-full"
            style={{ 
              left: obs.x - obs.size/2, 
              top: obs.y - obs.size/2,
              width: obs.size,
              height: obs.size,
              backgroundColor: obs.color,
              boxShadow: `0 0 20px ${obs.color}`
            }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: 1, 
              rotate: 360,
              boxShadow: [`0 0 10px ${obs.color}`, `0 0 30px ${obs.color}`, `0 0 10px ${obs.color}`]
            }}
            exit={{ scale: 0 }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              boxShadow: { duration: 1, repeat: Infinity }
            }}
          >
            {obs.type === 'enemy' && <Skull className="w-6 h-6 text-white" />}
            {obs.type === 'asteroid' && <div className="w-4 h-4 bg-gray-600 rounded-full" />}
            {obs.type === 'laser' && <Zap className="w-4 h-4 text-white" />}
            {obs.type === 'mine' && <AlertTriangle className="w-5 h-5 text-white" />}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Mission Complete Overlay */}
      <AnimatePresence>
        {gamePhase === 'complete' && (
          <motion.div
            className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {health > 0 ? (
                <>
                  <Trophy className="w-20 h-20 text-neon-green mx-auto mb-4" />
                  <h2 className="font-pixel text-4xl text-neon-green mb-4">MISSION COMPLETE!</h2>
                  <p className="font-arcade text-xl text-gray-300 mb-2">Ship Survived: {health}% Hull Integrity</p>
                  <p className="font-arcade text-lg text-neon-blue">Score: {score} Points</p>
                </>
              ) : (
                <>
                  <Skull className="w-20 h-20 text-neon-red mx-auto mb-4" />
                  <h2 className="font-pixel text-4xl text-neon-red mb-4">SHIP DESTROYED!</h2>
                  <p className="font-arcade text-xl text-gray-300">Your vessel was lost in the cosmic void...</p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="absolute bottom-6 left-6 bg-black/70 border border-neon-blue p-4 rounded">
        <p className="font-arcade text-sm text-neon-blue mb-2">CONTROLS:</p>
        <p className="font-arcade text-xs text-gray-300">• Move mouse to pilot ship</p>
        <p className="font-arcade text-xs text-gray-300">• Auto-firing enabled</p>
        <p className="font-arcade text-xs text-gray-300">• Avoid obstacles to survive</p>
      </div>
    </div>
  )
}
