import { ethers } from 'ethers'
import { getContractAddress } from '../config/contracts'

// NFT Contract ABI - This should match your deployed contract
const NFT_ABI = [
  "function mintShip1() external payable returns (uint256)",
  "function mintShip2() external payable returns (uint256)",
  "function mintShip3() external payable returns (uint256)",
  "function mintShip(string memory tokenURI) external payable returns (uint256)",
  "function tokenCounter() external view returns (uint256)",
  "function mintFee() external view returns (uint256)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function burn(uint256 tokenId) external",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
]

export interface Rocket {
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

export class NFTService {
  private contract: ethers.Contract | null = null
  private signer: ethers.JsonRpcSigner | null = null
  private chainId: number | null = null

  constructor(signer: ethers.JsonRpcSigner | null, chainId?: number) {
    this.signer = signer
    this.chainId = chainId || null
    if (signer) {
      const contractAddress = getContractAddress(chainId || 1)
      this.contract = new ethers.Contract(contractAddress, NFT_ABI, signer)
    }
  }

  async mintNFT(rocket: Rocket): Promise<{ success: boolean; tokenId?: number; error?: string }> {
    if (!this.contract || !this.signer) {
      return { success: false, error: 'Wallet not connected' }
    }

    try {
      // Determine which mint function to use based on rocket ID with static fees
      let mintFunction: string
      let mintFee: bigint
      
      switch (rocket.id) {
        case 1:
          mintFunction = 'mintShip1'
          mintFee = ethers.parseEther('0.01') // 0.01 ETH
          break
        case 2:
          mintFunction = 'mintShip2'
          mintFee = ethers.parseEther('0.025') // 0.025 ETH
          break
        case 3:
          mintFunction = 'mintShip3'
          mintFee = ethers.parseEther('0.05') // 0.05 ETH
          break
        default:
          return { success: false, error: 'Invalid rocket ID' }
      }
      
      // Mint the NFT using the appropriate function (no tokenURI needed as it's hardcoded)
      const tx = await this.contract[mintFunction]({ value: mintFee })
      
      // Wait for transaction confirmation
      const receipt = await tx.wait()
      
      // Find the Transfer event to get the token ID
      const transferEvent = receipt.logs.find((log: any) => {
        try {
          const parsed = this.contract!.interface.parseLog(log)
          return parsed?.name === 'Transfer'
        } catch {
          return false
        }
      })
      
      if (transferEvent) {
        const parsed = this.contract!.interface.parseLog(transferEvent)
        if (parsed) {
          const tokenId = parsed.args[2] // tokenId is the third argument
          return { success: true, tokenId: Number(tokenId) }
        }
      }
      
      return { success: true }
      
    } catch (error: any) {
      console.error('Mint error:', error)
      return { 
        success: false, 
        error: error.reason || error.message || 'Failed to mint NFT' 
      }
    }
  }

  async getMintFee(shipId?: number): Promise<string> {
    // Return static fees based on ship ID
    switch (shipId) {
      case 1: return '0.01'
      case 2: return '0.025'
      case 3: return '0.05'
      default: return '0.01'
    }
  }

  async getTokenCounter(): Promise<number> {
    if (!this.contract) {
      return 0
    }
    
    try {
      const counter = await this.contract.tokenCounter()
      return Number(counter)
    } catch (error) {
      console.error('Error getting token counter:', error)
      return 0
    }
  }

  async getUserNFTs(address: string): Promise<number[]> {
    if (!this.contract) {
      return []
    }
    
    try {
      const balance = await this.contract.balanceOf(address)
      const tokenIds: number[] = []
      
      // Get all tokens owned by the user
      for (let i = 0; i < Number(balance); i++) {
        // This is a simplified approach - in production you might want to use events
        // or maintain a mapping of user tokens
        const tokenId = await this.contract.tokenOfOwnerByIndex(address, i)
        tokenIds.push(Number(tokenId))
      }
      
      return tokenIds
    } catch (error) {
      console.error('Error getting user NFTs:', error)
      return []
    }
  }

  private createTokenURI(rocket: Rocket): string {
    // Create metadata for the NFT
    const metadata = {
      name: rocket.name,
      description: rocket.description,
      image: rocket.image,
      attributes: [
        {
          trait_type: "Rarity",
          value: rocket.rarity
        },
        {
          trait_type: "Speed",
          value: rocket.stats.speed,
          max_value: 100
        },
        {
          trait_type: "Armor",
          value: rocket.stats.armor,
          max_value: 100
        },
        {
          trait_type: "Luck",
          value: rocket.stats.luck,
          max_value: 100
        }
      ],
      external_url: "https://burnorglory.com",
      background_color: "000000"
    }
    
    // In a real implementation, you would upload this to IPFS or similar
    // For now, we'll return a data URI
    const jsonString = JSON.stringify(metadata)
    return `data:application/json;base64,${btoa(jsonString)}`
  }

  // Helper method to format address for display
  static formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Helper method to check if address is valid
  static isValidAddress(address: string): boolean {
    return ethers.isAddress(address)
  }
} 