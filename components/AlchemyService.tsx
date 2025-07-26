'use client'

import { Alchemy, Network } from 'alchemy-sdk'

// Alchemy configuration - support multiple networks
const getAlchemyConfig = () => {
  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'demo'
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || '11155111'
  
  // Map chain IDs to Alchemy networks
  const networkMap: { [key: string]: Network } = {
    '1': Network.ETH_MAINNET,
    '11155111': Network.ETH_SEPOLIA,
    '137': Network.MATIC_MAINNET,
    '80001': Network.MATIC_MUMBAI,
  }
  
  const network = networkMap[chainId] || Network.ETH_SEPOLIA
  
  console.log('Alchemy Config:', { apiKey: apiKey.substring(0, 10) + '...', network, chainId })
  
  return { apiKey, network }
}

const alchemy = new Alchemy(getAlchemyConfig())

// NFT Ship Types mapping
export const SHIP_TYPES = {
  'STELLAR VOYAGER': {
    id: 'stellar-voyager',
    name: 'STELLAR VOYAGER',
    rarity: 'COMMON',
    color: 'neon-blue',
    stats: { speed: 65, armor: 45, luck: 30 },
    description: 'A reliable starter ship for cosmic adventures'
  },
  'NEBULA HUNTER': {
    id: 'nebula-hunter', 
    name: 'NEBULA HUNTER',
    rarity: 'RARE',
    color: 'neon-green',
    stats: { speed: 80, armor: 60, luck: 35 },
    description: 'Enhanced propulsion for deep space missions'
  },
  'QUANTUM DESTROYER': {
    id: 'quantum-destroyer',
    name: 'QUANTUM DESTROYER', 
    rarity: 'EPIC',
    color: 'neon-purple',
    stats: { speed: 95, armor: 85, luck: 75 },
    description: 'Elite warship with quantum-enhanced capabilities'
  }
}

// Enhanced NFT interface with Alchemy data
export interface AlchemyNFT {
  tokenId: string
  contractAddress: string
  shipType: keyof typeof SHIP_TYPES
  name: string
  description: string
  image: string
  mintedAt: string
  level: number
  experience: number
  missions: number
  earnings: number
  metadata: any
}

// Map NFT metadata to ship type based on name or attributes
const mapNFTToShipType = (nft: any): keyof typeof SHIP_TYPES => {
  const name = nft.name?.toUpperCase() || ''
  const description = nft.description?.toUpperCase() || ''
  
  if (name.includes('STELLAR') || name.includes('VOYAGER')) {
    return 'STELLAR VOYAGER'
  } else if (name.includes('NEBULA') || name.includes('HUNTER')) {
    return 'NEBULA HUNTER'
  } else if (name.includes('QUANTUM') || name.includes('DESTROYER')) {
    return 'QUANTUM DESTROYER'
  }
  
  // Default to STELLAR VOYAGER if can't determine
  return 'STELLAR VOYAGER'
}

// Generate mock game data for NFTs (in real app, this would come from game backend)
const generateGameData = (tokenId: string) => {
  const seed = parseInt(tokenId) || 1
  return {
    level: Math.max(1, Math.floor(seed % 10) + 1),
    experience: (seed % 10) * 250 + Math.floor(seed / 10) * 100,
    missions: Math.floor(seed % 50) + Math.floor(seed / 100) * 5,
    earnings: parseFloat(((seed % 100) / 1000 + (seed % 10) / 100).toFixed(3))
  }
}

export class AlchemyNFTService {
  // Test different networks to find where NFTs are located
  async testNetworksForNFTs(ownerAddress: string): Promise<void> {
    const networks = [
      { name: 'Ethereum Mainnet', network: Network.ETH_MAINNET, chainId: '1' },
      { name: 'Ethereum Sepolia', network: Network.ETH_SEPOLIA, chainId: '11155111' },
      { name: 'Polygon Mainnet', network: Network.MATIC_MAINNET, chainId: '137' },
      { name: 'Polygon Mumbai', network: Network.MATIC_MUMBAI, chainId: '80001' },
    ]
    
    console.log('🔍 Testing networks for NFTs...')
    
    for (const net of networks) {
      try {
        console.log(`\n🌐 Testing ${net.name} (Chain ID: ${net.chainId})...`)
        const testAlchemy = new Alchemy({
          apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'demo',
          network: net.network
        })
        
        const response = await testAlchemy.nft.getNftsForOwner(ownerAddress, { omitMetadata: false })
        console.log(`📊 ${net.name} results:`, {
          totalCount: response.totalCount,
          ownedNftsCount: response.ownedNfts?.length || 0
        })
        
        if (response.ownedNfts && response.ownedNfts.length > 0) {
          console.log(`🎯 Found ${response.ownedNfts.length} NFTs on ${net.name}!`)
          console.log('Sample NFTs:', response.ownedNfts.slice(0, 3).map((nft: any) => ({
            tokenId: nft.tokenId,
            contract: nft.contract?.address,
            title: nft.title || nft.name,
            tokenType: nft.tokenType
          })))
        }
        
      } catch (error) {
        console.log(`❌ ${net.name} failed:`, (error as Error).message)
      }
    }
  }
  
  // Fetch NFTs for a specific owner
  async getNFTsForOwner(ownerAddress: string, contractAddress?: string): Promise<AlchemyNFT[]> {
    try {
      console.log('🚀 Fetching NFTs for owner:', ownerAddress)
      console.log('🔍 Contract filter:', contractAddress || 'All contracts')
      console.log('🌐 Current network:', getAlchemyConfig().network)
      console.log('🔑 API Key (first 10 chars):', getAlchemyConfig().apiKey.substring(0, 10) + '...')
      
      // Try multiple approaches to fetch NFTs
      const approaches = [
        // Approach 1: With contract filter (if provided)
        ...(contractAddress ? [{
          contractAddresses: [contractAddress],
          omitMetadata: false,
        }] : []),
        
        // Approach 2: Without contract filter (all NFTs)
        {
          omitMetadata: false,
        },
        
        // Approach 3: Minimal options
        {}
      ]
      
      let nftsResponse: any = null
      let usedApproach = 0
      
      for (let i = 0; i < approaches.length; i++) {
        try {
          console.log(`📡 Trying approach ${i + 1}:`, approaches[i])
          nftsResponse = await alchemy.nft.getNftsForOwner(ownerAddress, approaches[i])
          usedApproach = i + 1
          console.log(`✅ Approach ${i + 1} successful!`)
          break
        } catch (approachError) {
          console.log(`❌ Approach ${i + 1} failed:`, approachError)
          continue
        }
      }
      
      if (!nftsResponse) {
        throw new Error('All approaches failed')
      }
      
      console.log('📊 Alchemy response (approach ' + usedApproach + '):', {
        totalCount: nftsResponse.totalCount,
        ownedNftsCount: nftsResponse.ownedNfts?.length || 0,
        pageKey: nftsResponse.pageKey,
        validAt: nftsResponse.validAt
      })
      
      if (nftsResponse.ownedNfts?.length > 0) {
        console.log('🎯 First NFT sample:', {
          tokenId: nftsResponse.ownedNfts[0].tokenId,
          title: nftsResponse.ownedNfts[0].title,
          name: nftsResponse.ownedNfts[0].name,
          contract: nftsResponse.ownedNfts[0].contract?.address,
          tokenType: nftsResponse.ownedNfts[0].tokenType,
          description: nftsResponse.ownedNfts[0].description
        })
      }
      
      const allNFTs = nftsResponse.ownedNfts || []
      console.log('📝 Processing', allNFTs.length, 'NFTs...')
      
      // Process all NFTs (don't filter by title initially to see what we get)
      const processedNFTs: AlchemyNFT[] = allNFTs
        .map((nft: any, index: number) => {
          console.log(`🔄 Processing NFT ${index + 1}:`, {
            tokenId: nft.tokenId,
            title: nft.title,
            name: nft.name,
            contract: nft.contract?.address,
            hasMetadata: !!nft.metadata
          })
          
          const shipType = mapNFTToShipType(nft)
          const gameData = generateGameData(nft.tokenId)
          
          return {
            tokenId: nft.tokenId,
            contractAddress: nft.contract?.address || '',
            shipType,
            name: nft.title || nft.name || `Ship #${nft.tokenId}`,
            description: nft.description || SHIP_TYPES[shipType].description,
            image: nft.media?.[0]?.gateway || nft.media?.[0]?.raw || nft.image?.originalUrl || '',
            mintedAt: new Date().toISOString().split('T')[0],
            ...gameData,
            metadata: nft.metadata || {}
          }
        })
      
      console.log('✨ Final processed NFTs:', processedNFTs.length)
      console.log('🎮 Processed NFTs details:', processedNFTs.map(nft => ({
        tokenId: nft.tokenId,
        name: nft.name,
        shipType: nft.shipType,
        contract: nft.contractAddress
      })))
      
      return processedNFTs
      
    } catch (error) {
      console.error('💥 Error fetching NFTs from Alchemy:', error)
      console.error('Error details:', {
        message: (error as Error).message,
        stack: (error as Error).stack,
        name: (error as Error).name
      })
      // Return empty array instead of throwing to prevent app crashes
      return []
    }
  }
  
  // Fetch specific NFT details
  async getNFTDetails(contractAddress: string, tokenId: string): Promise<AlchemyNFT | null> {
    try {
      const nft = await alchemy.nft.getNftMetadata(contractAddress, tokenId)
      
      if (!nft) return null
      
      const shipType = mapNFTToShipType(nft)
      const gameData = generateGameData(tokenId)
      
      return {
        tokenId: nft.tokenId,
        contractAddress: nft.contract.address,
        shipType,
        name: nft.name || `Ship #${nft.tokenId}`,
        description: nft.description || SHIP_TYPES[shipType].description,
        image: nft.image?.originalUrl || nft.image?.cachedUrl || '',
        mintedAt: new Date().toISOString().split('T')[0],
        ...gameData,
        metadata: nft.raw?.metadata || {}
      }
      
    } catch (error) {
      console.error('Error fetching NFT details from Alchemy:', error)
      return null
    }
  }
  
  // Get NFT collection info
  async getCollectionInfo(contractAddress: string) {
    try {
      const metadata = await alchemy.nft.getContractMetadata(contractAddress)
      return metadata
    } catch (error) {
      console.error('Error fetching collection info:', error)
      return null
    }
  }
}

// Export singleton instance
export const alchemyNFTService = new AlchemyNFTService()
