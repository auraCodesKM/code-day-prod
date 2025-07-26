'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { ethers } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'

// Type assertion for MetaMask provider
declare global {
  interface Window {
    ethereum?: any
  }
}

interface Web3ContextType {
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  account: string | null
  isConnected: boolean
  isConnecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  chainId: number | null
  error: string | null
  getSigner: () => ethers.JsonRpcSigner | null
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

interface Web3ProviderProps {
  children: ReactNode
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [chainId, setChainId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize provider on mount
  useEffect(() => {
    const initProvider = async () => {
      try {
        const ethereumProvider = await detectEthereumProvider()
        
        if (ethereumProvider) {
          const browserProvider = new ethers.BrowserProvider(ethereumProvider as any)
          setProvider(browserProvider)
          
          // Check if already connected
          const accounts = await (ethereumProvider as any).request({ method: 'eth_accounts' })
          if (accounts && accounts.length > 0) {
            const signer = await browserProvider.getSigner()
            setSigner(signer)
            setAccount(accounts[0])
            setIsConnected(true)
            
            const network = await browserProvider.getNetwork()
            setChainId(Number(network.chainId))
          }
          
          // Listen for account changes
          (ethereumProvider as any).on('accountsChanged', (accounts: string[]) => {
            if (accounts.length === 0) {
              setAccount(null)
              setSigner(null)
              setIsConnected(false)
            } else {
              setAccount(accounts[0])
              browserProvider.getSigner().then(setSigner)
              setIsConnected(true)
            }
          })
          
          // Listen for chain changes
          (ethereumProvider as any).on('chainChanged', (chainId: string) => {
            setChainId(Number(chainId))
            window.location.reload()
          })
          
        } else {
          setError('No Ethereum provider found. Please install MetaMask.')
        }
      } catch (err) {
        console.error('Error initializing provider:', err)
        // setError('Failed to initialize Web3 provider')
      }
    }
    
    initProvider()
  }, [])

  const connectWallet = async () => {
    if (!provider) {
      setError('No Web3 provider available')
      return
    }
    
    setIsConnecting(true)
    setError(null)
    
    try {
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      
      setSigner(signer)
      setAccount(address)
      setIsConnected(true)
      
      const network = await provider.getNetwork()
      setChainId(Number(network.chainId))
      
    } catch (err) {
      console.error('Error connecting wallet:', err)
      setError('Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setSigner(null)
    setIsConnected(false)
    setChainId(null)
  }

  const value: Web3ContextType = {
    provider,
    signer,
    account,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    chainId,
    error,
    getSigner: () => signer
  }

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  )
} 