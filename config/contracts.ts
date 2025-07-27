// Contract configuration
export const CONTRACTS = {
  // NFT Contract addresses
  NFT_CONTRACT: {
    // Ethereum Mainnet (for production)
    '1': '0x0000000000000000000000000000000000000000', // Replace with actual address
    
    // Sepolia Testnet (for testing)
    '11155111': '0xc624865cD93c176a6016814e3560753b7Cb26C38', // New NFT contract
    
    // Local Hardhat Network
    '31337': '0x0000000000000000000000000000000000000000', // Replace with actual address
    
    // Default fallback
    'default': '0xc624865cD93c176a6016814e3560753b7Cb26C38'
  },
  
  // SpaceLaunchGame Contract addresses
  SPACE_LAUNCH_GAME: {
    // Ethereum Mainnet (for production)
    '1': '0x0000000000000000000000000000000000000000', // Replace with actual address
    
    // Sepolia Testnet (for testing)
    '11155111': '0x4d01f42Fa321C89593428564E89e9c55930C5A3D', // Game contract
    
    // Local Hardhat Network
    '31337': '0x0000000000000000000000000000000000000000', // Replace with actual address
    
    // Default fallback
    'default': '0x4d01f42Fa321C89593428564E89e9c55930C5A3D'
  },
  
  // ERC20 Token Contract addresses (GALACTIC tokens)
  ERC20_TOKEN: {
    // Ethereum Mainnet (for production)
    '1': '0x0000000000000000000000000000000000000000', // Replace with actual address
    
    // Sepolia Testnet (for testing)
    '11155111': '0xe9951582D9F0E8D37F37D0Ef259C5cAaA2E46e4e', // GALACTIC token contract
    
    // Local Hardhat Network
    '31337': '0x0000000000000000000000000000000000000000', // Replace with actual address
    
    // Default fallback
    'default': '0xe9951582D9F0E8D37F37D0Ef259C5cAaA2E46e4e'
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