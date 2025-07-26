'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Rocket, Wallet, CheckCircle, Menu, X } from 'lucide-react'
import { useWeb3 } from './Web3Provider'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Mission', href: '/mission' },
  { name: 'Marketplace', href: '/marketplace' },
  { name: 'My Fleet', href: '/fleet' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { isConnected, account, connectWallet, isConnecting } = useWeb3()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-4 px-4">
      <nav className="glass-navbar w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Rocket className="w-8 h-8 text-neon-blue animate-float" />
            <span className="font-pixel text-neon-blue text-lg hidden md:block">
              MISSION LAUNCH
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <li key={item.name} className="relative">
                <Link
                  href={item.href}
                  className={`font-arcade text-base transition-colors duration-300 ${
                    pathname === item.href
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}>
                  {item.name}
                </Link>
                {pathname === item.href && (
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-neon-blue"
                    layoutId="underline"
                  />
                )}
              </li>
            ))}
          </ul>

          {/* Desktop Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            {isConnected && account ? (
              <div className="flex items-center space-x-2 bg-neon-green/10 border border-neon-green/50 px-4 py-2 rounded-lg">
                <CheckCircle className="w-4 h-4 text-neon-green" />
                <span className="font-pixel text-xs text-neon-green">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
            ) : (
              <button 
                onClick={connectWallet}
                disabled={isConnecting}
                className="font-pixel text-xs px-4 py-2 rounded-lg bg-neon-blue/10 text-neon-blue border border-neon-blue/50 hover:bg-neon-blue/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4" />
                  <span>{isConnecting ? 'CONNECTING...' : 'CONNECT'}</span>
                </span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-neon-blue hover:text-neon-green transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden glass-navbar mt-2 rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-3">
                {navItems.map(item => (
                  <Link 
                    key={item.name}
                    href={item.href} 
                    className={`block font-arcade text-base transition-colors duration-300 ${
                      pathname === item.href
                        ? 'text-neon-green'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Wallet Connection */}
              <div className="pt-3 border-t border-neon-blue/30">
                {isConnected && account ? (
                  <div className="flex items-center space-x-2 bg-neon-green/10 border border-neon-green/50 px-4 py-3 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-neon-green" />
                    <span className="font-pixel text-xs text-neon-green">
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      connectWallet()
                      setIsMobileMenuOpen(false)
                    }}
                    disabled={isConnecting}
                    className="w-full font-pixel text-xs px-4 py-3 rounded-lg bg-neon-blue/10 text-neon-blue border border-neon-blue/50 hover:bg-neon-blue/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <Wallet className="w-4 h-4" />
                      <span>{isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}</span>
                    </span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </div>
  )
}
