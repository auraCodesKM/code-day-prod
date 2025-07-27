import { ethers } from 'ethers'
import { CONTRACTS } from '../config/contracts'

// SpaceLaunchGame contract ABI
const SPACE_LAUNCH_GAME_ABI = [
  "function launchMission(uint256 tokenId) external",
  "function successfulLaunches(address user) external view returns (uint256)",
  "function launchAttempts(address user) external view returns (uint256)",
  "function galacticWon(address user) external view returns (uint256)",
  "function rewardAmount() external view returns (uint256)",
  "function successRate() external view returns (uint256)",
  "event LaunchResult(address indexed user, uint256 tokenId, bool success)"
]

// ERC721 ABI for NFT operations
const ERC721_ABI = [
  "function approve(address to, uint256 tokenId) external",
  "function isApprovedForAll(address owner, address operator) external view returns (bool)",
  "function setApprovalForAll(address operator, bool approved) external",
  "function ownerOf(uint256 tokenId) external view returns (address)"
]

export class SpaceLaunchGameService {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.Signer | null = null
  private contract: ethers.Contract | null = null
  private nftContract: ethers.Contract | null = null
  private isInitialized: boolean = false

  async initialize() {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask not found')
      }

      console.log('🔄 Initializing SpaceLaunchGameService...')
      
      this.provider = new ethers.BrowserProvider(window.ethereum)
      console.log('✅ Provider created')
      
      this.signer = await this.provider.getSigner()
      console.log('✅ Signer obtained:', await this.signer.getAddress())
      
      const network = await this.provider.getNetwork()
      const chainId = network.chainId.toString()
      
      console.log('🌐 Network:', network.name, 'Chain ID:', chainId)
      
      const gameContractAddress = CONTRACTS.SPACE_LAUNCH_GAME[chainId as keyof typeof CONTRACTS.SPACE_LAUNCH_GAME] || 
                                 CONTRACTS.SPACE_LAUNCH_GAME.default
      
      const nftContractAddress = CONTRACTS.NFT_CONTRACT[chainId as keyof typeof CONTRACTS.NFT_CONTRACT] || 
                                CONTRACTS.NFT_CONTRACT.default

      console.log('📋 Game Contract Address:', gameContractAddress)
      console.log('📋 NFT Contract Address:', nftContractAddress)
      
      if (gameContractAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error(`❌ No SpaceLaunchGame contract address configured for chain ${chainId} (${network.name})`)
      }
      
      if (nftContractAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error(`❌ No NFT contract address configured for chain ${chainId} (${network.name})`)
      }

      console.log('🔗 Creating contract instances...')
      this.contract = new ethers.Contract(gameContractAddress, SPACE_LAUNCH_GAME_ABI, this.signer)
      this.nftContract = new ethers.Contract(nftContractAddress, ERC721_ABI, this.signer)
      
      console.log('✅ Contract instances created')
      
      // Test contract connection with timeout
      console.log('🧪 Testing contract connection...')
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Contract connection timeout')), 10000)
      )
      
      const contractTest = this.contract.rewardAmount()
      
      const rewardAmount = await Promise.race([contractTest, timeoutPromise])
      console.log('✅ Contract connection test successful. Reward amount:', ethers.formatEther(rewardAmount as bigint))
      
      this.isInitialized = true
      console.log('🎉 SpaceLaunchGameService fully initialized and ready!')
      
    } catch (error) {
      console.error('❌ SpaceLaunchGameService initialization failed:', error)
      this.isInitialized = false
      
      // Reset all properties on failure
      this.provider = null
      this.signer = null
      this.contract = null
      this.nftContract = null
      
      throw error
    }
  }

  private ensureInitialized() {
    if (!this.isInitialized || !this.contract || !this.nftContract) {
      console.error('❌ Service not initialized:')
      console.error('  - isInitialized:', this.isInitialized)
      console.error('  - contract exists:', !!this.contract)
      console.error('  - nftContract exists:', !!this.nftContract)
      throw new Error('SpaceLaunchGameService not initialized. Call initialize() first.')
    }
  }

  // Public method to check if service is ready
  public isReady(): boolean {
    return this.isInitialized && !!this.contract && !!this.nftContract
  }

  async getPlayerStats(address: string) {
    this.ensureInitialized()
    
    try {
      console.log('Fetching player stats for address:', address)
      
      const [successfulLaunches, launchAttempts, galacticWon] = await Promise.all([
        this.contract!.successfulLaunches(address),
        this.contract!.launchAttempts(address),
        this.contract!.galacticWon(address)
      ])

      const stats = {
        successfulLaunches: Number(successfulLaunches),
        launchAttempts: Number(launchAttempts),
        galacticWon: ethers.formatEther(galacticWon),
        successRate: launchAttempts > 0 ? (Number(successfulLaunches) / Number(launchAttempts)) * 100 : 0
      }
      
      console.log('Player stats:', stats)
      return stats
    } catch (error) {
      console.error('Error fetching player stats:', error)
      throw error
    }
  }

  async getGameSettings() {
    this.ensureInitialized()
    
    try {
      const [rewardAmount, successRate] = await Promise.all([
        this.contract!.rewardAmount(),
        this.contract!.successRate()
      ])

      return {
        rewardAmount: ethers.formatEther(rewardAmount),
        successRate: Number(successRate)
      }
    } catch (error) {
      console.error('Error fetching game settings:', error)
      throw error
    }
  }

  async checkNFTApproval(tokenId: string, userAddress: string): Promise<boolean> {
    this.ensureInitialized()
    
    try {
      console.log('🔍 Checking NFT approval for token:', tokenId, 'user:', userAddress)
      
      const gameContractAddress = await this.contract!.getAddress()
      console.log('🎯 Game contract address:', gameContractAddress)
      
      // Check if the user has approved all tokens for the game contract
      const isApprovedForAll = await this.nftContract!.isApprovedForAll(userAddress, gameContractAddress)
      console.log('✅ Is approved for all:', isApprovedForAll)
      
      return isApprovedForAll
    } catch (error) {
      console.error('❌ Error checking NFT approval:', error)
      return false
    }
  }

  async approveNFT(tokenId: string) {
    this.ensureInitialized()
    
    try {
      console.log('🔐 Approving NFT for token:', tokenId)
      const gameContractAddress = await this.contract!.getAddress()
      console.log('🎯 Approving for game contract:', gameContractAddress)
      
      const tx = await this.nftContract!.setApprovalForAll(gameContractAddress, true)
      console.log('📝 Approval transaction sent:', tx.hash)
      
      const receipt = await tx.wait()
      console.log('✅ Approval confirmed in block:', receipt.blockNumber)
      
      return tx
    } catch (error) {
      console.error('❌ Error approving NFT:', error)
      throw error
    }
  }

  async launchMission(tokenId: string): Promise<{ success: boolean; txHash: string }> {
    this.ensureInitialized()
    
    try {
      console.log('🚀 Launching mission for token ID:', tokenId)
      const gameContractAddress = await this.contract!.getAddress()
      console.log('Contract address:', gameContractAddress)
      
      // Pre-flight validation
      const signerAddress = await this.signer!.getAddress()
      console.log('Signer address:', signerAddress)
      
      // 1. Check if user owns the token
      try {
        const owner = await this.nftContract!.ownerOf(tokenId)
        console.log('Token owner:', owner)
        console.log('User is owner:', owner.toLowerCase() === signerAddress.toLowerCase())
        
        if (owner.toLowerCase() !== signerAddress.toLowerCase()) {
          throw new Error(`You don't own token ID ${tokenId}. Owner: ${owner}`)
        }
      } catch (error) {
        console.error('❌ Token ownership check failed:', error)
        throw new Error(`Token ${tokenId} ownership validation failed: ${error}`)
      }
      
      // 2. Check if token is approved
      try {
        const isApproved = await this.nftContract!.isApprovedForAll(signerAddress, gameContractAddress)
        console.log('Is approved for all:', isApproved)
        
        if (!isApproved) {
          throw new Error(`Token ${tokenId} is not approved for the game contract. Please approve first.`)
        }
      } catch (error) {
        console.error('❌ Token approval check failed:', error)
        throw new Error(`Token ${tokenId} approval validation failed: ${error}`)
      }
      
      console.log('✅ Pre-flight validation passed, proceeding with mission...')
      
      const tx = await this.contract!.launchMission(tokenId)
      console.log('Transaction sent:', tx.hash)
      console.log('Waiting for transaction confirmation...')
      
      const receipt = await tx.wait()
      console.log('Transaction confirmed in block:', receipt.blockNumber)
      console.log('Gas used:', receipt.gasUsed.toString())
      
      // Parse the LaunchResult event to determine success/failure
      console.log('Parsing transaction logs...')
      console.log('Total logs:', receipt.logs.length)
      
      const launchResultEvent = receipt.logs.find((log: any) => {
        try {
          const parsed = this.contract!.interface.parseLog(log)
          console.log('Parsed log:', parsed?.name, parsed?.args)
          return parsed?.name === 'LaunchResult'
        } catch (e) {
          console.log('Failed to parse log:', e)
          return false
        }
      })

      let success = false
      if (launchResultEvent) {
        const parsed = this.contract!.interface.parseLog(launchResultEvent)
        success = parsed?.args?.success || false
        console.log('🎯 Mission result:', success ? 'SUCCESS' : 'FAILURE')
        console.log('Event args:', parsed?.args)
      } else {
        console.warn('⚠️ No LaunchResult event found in transaction logs')
      }

      const result = {
        success,
        txHash: tx.hash
      }
      
      console.log('Final result:', result)
      return result
    } catch (error: any) {
      console.error('❌ Error launching mission:', error)
      
      // Try to decode custom error if it's a contract revert
      if (error.code === 'CALL_EXCEPTION' && error.data) {
        console.error('📝 Contract revert details:')
        console.error('  - Error code:', error.code)
        console.error('  - Error data:', error.data)
        console.error('  - Transaction:', error.transaction)
        
        // Common custom errors that might occur
        const errorSignatures = {
          '0x7e273289': 'TokenNotOwned(uint256)', // Example custom error
          '0x8f4eb604': 'TokenNotApproved(uint256)',
          '0x3ee5aeb5': 'GamePaused()',
          '0x4ca88867': 'InvalidToken(uint256)'
        }
        
        const errorSig = error.data?.slice(0, 10)
        const knownError = errorSignatures[errorSig as keyof typeof errorSignatures]
        
        if (knownError) {
          console.error('🔍 Decoded error:', knownError)
          throw new Error(`Mission failed: ${knownError}. Please check token ownership and approval.`)
        } else {
          console.error('⚠️ Unknown custom error signature:', errorSig)
          throw new Error(`Mission failed with contract error. Token ID: ${tokenId}. Please ensure you own the token and it's approved.`)
        }
      }
      
      throw error
    }
  }

  // Listen for LaunchResult events
  onLaunchResult(callback: (user: string, tokenId: string, success: boolean) => void) {
    if (!this.contract) throw new Error('Contract not initialized')
    
    this.contract.on('LaunchResult', (user, tokenId, success) => {
      callback(user, tokenId.toString(), success)
    })
  }

  // Remove event listeners
  removeAllListeners() {
    if (this.contract) {
      this.contract.removeAllListeners()
    }
  }
}

export const spaceLaunchGameService = new SpaceLaunchGameService()
