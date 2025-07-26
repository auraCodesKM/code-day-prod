# Web3 Integration Setup Guide

This guide explains how to set up the Web3 integration for the Burn or Glory NFT game.

## Prerequisites

1. **MetaMask Extension**: Install MetaMask browser extension
2. **Test ETH**: Get some test ETH from a faucet (for Sepolia testnet)
3. **Smart Contract**: Deploy the NFT contract to your preferred network

## Smart Contract Deployment

### 1. Deploy the NFT Contract

Navigate to the `smartcontracts` directory and deploy the contract:

```bash
cd smartcontracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia  # or your preferred network
```

### 2. Contract Functions

The contract now includes specific mint functions for each ship type:

- **mintShip1**: 0.01 ETH - For STELLAR VOYAGER (Common)
- **mintShip2**: 0.025 ETH - For NEBULA HUNTER (Rare)  
- **mintShip3**: 0.05 ETH - For QUANTUM DESTROYER (Epic)

### 3. Update Contract Address

After deployment, update the contract address in `config/contracts.ts`:

```typescript
export const CONTRACTS = {
  NFT_CONTRACT: {
    // Replace with your actual deployed contract address
    '11155111': '0xYOUR_DEPLOYED_CONTRACT_ADDRESS', // Sepolia
    '1': '0xYOUR_MAINNET_CONTRACT_ADDRESS', // Mainnet
    // ... other networks
  }
}
```

## Features Integrated

### 1. Web3 Provider (`components/Web3Provider.tsx`)
- **Wallet Connection**: Connect to MetaMask or other Web3 wallets
- **Account Management**: Display connected wallet address
- **Network Detection**: Automatically detect and display current network
- **Error Handling**: Comprehensive error handling for connection issues

### 2. NFT Service (`components/NFTService.ts`)
- **Minting**: Mint NFT spaceships with metadata
- **Contract Interaction**: Direct interaction with the smart contract
- **Transaction Handling**: Wait for transaction confirmations
- **Metadata Generation**: Create token URIs with rocket attributes

### 3. UI Integration
- **Main Page**: Wallet connection button and status display
- **Marketplace**: Real NFT minting with transaction feedback
- **Error Modals**: User-friendly error messages
- **Success Feedback**: Transaction success confirmations

## Usage

### Connecting Wallet
1. Click "CONNECT WALLET" on the main page
2. Approve the connection in MetaMask
3. Your wallet address will be displayed

### Minting NFTs
1. Navigate to the Marketplace
2. Ensure wallet is connected
3. Click "MINT NFT" on any spaceship
4. Approve the transaction in MetaMask
5. Wait for confirmation

### Supported Networks
- **Sepolia Testnet**: For testing (recommended)
- **Ethereum Mainnet**: For production
- **Local Hardhat**: For development

## Configuration

### Contract Addresses
Update `config/contracts.ts` with your deployed contract addresses:

```typescript
NFT_CONTRACT: {
  '11155111': '0x...', // Sepolia
  '1': '0x...',        // Mainnet
  '31337': '0x...',    // Local
}
```

### Network Configuration
Add new networks in `config/contracts.ts`:

```typescript
export const NETWORKS = {
  '11155111': 'Sepolia Testnet',
  '1': 'Ethereum Mainnet',
  '137': 'Polygon Mainnet', // Add new networks here
}
```

## Error Handling

The integration includes comprehensive error handling:

- **Connection Errors**: MetaMask not installed, connection refused
- **Transaction Errors**: Insufficient funds, contract errors
- **Network Errors**: Wrong network, contract not deployed
- **User Feedback**: Clear error messages and recovery options

## Security Considerations

1. **Contract Verification**: Always verify your deployed contracts
2. **Test Thoroughly**: Test on testnets before mainnet
3. **Error Boundaries**: Implement proper error boundaries
4. **User Education**: Guide users through the Web3 process

## Troubleshooting

### Common Issues

1. **"No Ethereum provider found"**
   - Install MetaMask extension
   - Ensure MetaMask is unlocked

2. **"Failed to connect wallet"**
   - Check if MetaMask is installed
   - Ensure user approved the connection

3. **"Transaction failed"**
   - Check if user has sufficient ETH
   - Verify contract is deployed on current network
   - Check contract address configuration

4. **"Wrong network"**
   - Switch to the correct network in MetaMask
   - Update contract address for current network

### Debug Mode

Enable debug logging by adding to your browser console:

```javascript
localStorage.setItem('debug', 'web3:*')
```

## Next Steps

1. **Deploy Contract**: Deploy the NFT contract to your preferred network
2. **Update Addresses**: Update contract addresses in `config/contracts.ts`
3. **Test Integration**: Test wallet connection and NFT minting
4. **Add Features**: Implement additional Web3 features as needed

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify contract deployment and addresses
3. Ensure MetaMask is properly configured
4. Test on supported networks only 