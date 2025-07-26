// Quick Alchemy API test script
// Run with: node test-alchemy.js

const { Alchemy, Network } = require('alchemy-sdk');

// Your configuration
const API_KEY = 'mKSXhkHH4QGGKApSV9bmVUoFwuetHWWw';
const WALLET_ADDRESS = 'YOUR_WALLET_ADDRESS_HERE'; // Replace with your actual wallet address
const CONTRACT_ADDRESS = '0xbdFD697ae59ECbDe6B25D632f064Ec9F0ab8A1F7';

async function testAlchemy() {
  console.log('🧪 Testing Alchemy API...\n');
  
  // Test different networks
  const networks = [
    { name: 'Ethereum Mainnet', network: Network.ETH_MAINNET },
    { name: 'Ethereum Sepolia', network: Network.ETH_SEPOLIA },
    { name: 'Polygon Mainnet', network: Network.MATIC_MAINNET },
  ];
  
  for (const net of networks) {
    console.log(`\n🌐 Testing ${net.name}...`);
    
    try {
      const alchemy = new Alchemy({
        apiKey: API_KEY,
        network: net.network
      });
      
      // Test 1: Get all NFTs for wallet
      console.log('📡 Fetching ALL NFTs...');
      const allNFTs = await alchemy.nft.getNftsForOwner(WALLET_ADDRESS);
      console.log(`✅ Found ${allNFTs.totalCount} total NFTs`);
      
      if (allNFTs.ownedNfts.length > 0) {
        console.log('🎯 Sample NFTs:');
        allNFTs.ownedNfts.slice(0, 3).forEach((nft, i) => {
          console.log(`  ${i + 1}. ${nft.title || nft.name || 'Unnamed'} (${nft.contract.address})`);
        });
      }
      
      // Test 2: Get NFTs for specific contract
      if (CONTRACT_ADDRESS) {
        console.log(`📡 Fetching NFTs from contract ${CONTRACT_ADDRESS}...`);
        const contractNFTs = await alchemy.nft.getNftsForOwner(WALLET_ADDRESS, {
          contractAddresses: [CONTRACT_ADDRESS]
        });
        console.log(`✅ Found ${contractNFTs.totalCount} NFTs from this contract`);
      }
      
    } catch (error) {
      console.log(`❌ ${net.name} failed:`, error.message);
    }
  }
}

// Replace YOUR_WALLET_ADDRESS_HERE with your actual wallet address and run:
// node test-alchemy.js
if (WALLET_ADDRESS === 'YOUR_WALLET_ADDRESS_HERE') {
  console.log('❗ Please replace YOUR_WALLET_ADDRESS_HERE with your actual wallet address in this file');
} else {
  testAlchemy().catch(console.error);
}
