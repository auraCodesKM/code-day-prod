// Contract configuration
export const CONTRACTS = {
  // Replace with your actual deployed contract addresses
  NFT_CONTRACT: {
    // Ethereum Mainnet (for production)
    '1': '0x0000000000000000000000000000000000000000', // Replace with actual address
    
    // Sepolia Testnet (for testing)
    '11155111': '0xbdFD697ae59ECbDe6B25D632f064Ec9F0ab8A1F7', // Replace with actual address
    
    // Local Hardhat Network
    '31337': '0x0000000000000000000000000000000000000000', // Replace with actual address
    
    // Default fallback
    'default': '0x0000000000000000000000000000000000000000'
  }
}

export const NETWORKS = {
  '1': 'Ethereum Mainnet',
  '11155111': 'Sepolia Testnet',
  '31337': 'Local Hardhat',
  'default': 'Unknown Network'
}

export function getContractAddress(chainId: number | string): string {
  const chainIdStr = chainId.toString()
  return CONTRACTS.NFT_CONTRACT[chainIdStr as keyof typeof CONTRACTS.NFT_CONTRACT] || 
         CONTRACTS.NFT_CONTRACT.default
}

export function getNetworkName(chainId: number | string): string {
  const chainIdStr = chainId.toString()
  return NETWORKS[chainIdStr as keyof typeof NETWORKS] || NETWORKS.default
} 