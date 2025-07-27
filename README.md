# 🚀 Mission Launch: Burn or Glory    

<div align="center">

![Space Launch Game](https://img.shields.io/badge/Game-Space%20Launch-blue?style=for-the-badge&logo=rocket)
![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Ethereum](https://img.shields.io/badge/Ethereum-Web3-purple?style=for-the-badge&logo=ethereum)

**A thrilling Web3 space exploration game where NFT spaceships embark on dangerous missions for glory and rewards!**

[🎮 Play Now](#getting-started) • [📖 Documentation](#documentation) • [🛠️ Setup](#installation) • [🚀 Deploy](#deployment)

</div>

---

## 🌟 Overview

**Mission Launch: Burn or Glory** is an innovative blockchain-based space exploration game where players use NFT spaceships to embark on high-risk, high-reward missions. Each launch is a gamble - your ship might return victorious with GALACTIC tokens, or it might burn up in the void of space!

### ✨ Key Features

- 🛸 **NFT Spaceships**: Three unique ship classes with different rarity levels
- 🎯 **Mission System**: Launch dangerous space missions with real consequences
- 💰 **GALACTIC Rewards**: Earn cryptocurrency tokens for successful missions
- 📊 **Dynamic Success Rates**: Risk vs reward mechanics
- 🏪 **Marketplace**: Trade and discover new spaceships
- 📈 **Fleet Management**: Track your ships and mission history
- 🔗 **Web3 Integration**: Full MetaMask and Ethereum blockchain support

---

## 🎮 Game Mechanics

### 🛸 Spaceship Classes

| Ship Type | Rarity | Mint Cost | Success Rate | Reward Multiplier |
|-----------|--------|-----------|--------------|-------------------|
| **STELLAR VOYAGER** | Common | 0.01 ETH | 65% | 1x |
| **NEBULA HUNTER** | Rare | 0.025 ETH | 55% | 1.5x |
| **QUANTUM DESTROYER** | Epic | 0.05 ETH | 45% | 2x |

### 🎯 Mission System

1. **Select Your Ship**: Choose from your NFT fleet
2. **Launch Mission**: Approve your ship for the mission contract
3. **Risk Assessment**: Each mission has a success/failure probability
4. **Results**: Ships either return with rewards or are lost forever
5. **Rewards**: Successful missions earn GALACTIC tokens

---

## 🛠️ Tech Stack

<div align="center">

| Frontend | Blockchain | Development |
|----------|------------|-------------|
| ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) | ![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=flat&logo=ethereum&logoColor=white) | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) |
| ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) | ![Ethers.js](https://img.shields.io/badge/Ethers.js-2535A0?style=flat&logo=ethereum&logoColor=white) | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) |
| ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white) | ![MetaMask](https://img.shields.io/badge/MetaMask-F6851B?style=flat&logo=metamask&logoColor=white) | ![Hardhat](https://img.shields.io/badge/Hardhat-FFF100?style=flat&logo=hardhat&logoColor=black) |

</div>

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js** (v18 or higher)
- ✅ **MetaMask** browser extension
- ✅ **Test ETH** (for Sepolia testnet)
- ✅ **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/auraCodesKM/code-day-prod.git
   cd code-day-prod
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔧 Smart Contract Setup

### Deploy Contracts

1. **Navigate to smart contracts directory**
   ```bash
   cd smartcontracts
   npm install
   ```

2. **Compile contracts**
   ```bash
   npx hardhat compile
   ```

3. **Deploy to testnet**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```



---

## 📁 Project Structure

```
codeday-game/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 fleet/             # Fleet management page
│   ├── 📁 marketplace/       # NFT marketplace
│   ├── 📁 mission/           # Mission launch interface
│   └── 📄 page.tsx           # Home page
├── 📁 components/            # Reusable React components
│   ├── 📄 Web3Provider.tsx   # Web3 context provider
│   ├── 📄 NFTService.ts      # NFT interaction service
│   └── 📄 ...               # Other components
├── 📁 services/              # Business logic services
│   └── 📄 SpaceLaunchGameService.ts # Main game service
├── 📁 config/                # Configuration files
│   └── 📄 contracts.ts       # Smart contract addresses
├── 📁 smartcontracts/        # Solidity smart contracts
├── 📁 public/                # Static assets
└── 📁 rockets/               # Spaceship assets
```

---

## 🎯 Core Features

### 🛸 Fleet Management
- View your NFT spaceship collection
- Track ship statistics and mission history
- Manage ship approvals for missions

### 🚀 Mission Launch
- Select ships from your fleet
- Real-time mission probability calculations
- Blockchain transaction handling
- Mission result animations

### 🏪 Marketplace
- Browse available spaceships
- Mint new ships directly
- Trade with other players
- Rarity-based pricing

### 📊 Statistics Dashboard
- Track successful launches
- Monitor GALACTIC token earnings
- View fleet performance metrics
- Mission success rates

---

## 🔗 Smart Contracts

### NFT Contract Features
- **ERC-721 Standard**: Full NFT compatibility
- **Tiered Minting**: Different costs for ship rarities
- **Metadata Support**: Rich ship attributes and imagery
- **Approval System**: Secure mission participation

### Game Contract Features
- **Mission Logic**: Randomized success/failure mechanics
- **Reward Distribution**: Automatic GALACTIC token rewards
- **Event Logging**: Complete mission history on-chain
- **Security**: Ownership verification and approval checks

### Token Contract Features
- **ERC-20 Standard**: GALACTIC reward tokens
- **Mintable**: New tokens created for successful missions
- **Burnable**: Tokens can be burned for special features
- **Transferable**: Full trading support

---

## 🎨 UI/UX Features

### 🌌 Immersive Design
- **Space Theme**: Dark, cosmic visual design
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Layout**: Mobile and desktop optimized
- **Interactive Elements**: Hover effects and micro-interactions

### 🔊 Audio Experience
- **Sound Effects**: Mission launch and result sounds
- **Background Music**: Atmospheric space soundtrack
- **Audio Controls**: Mute/unmute functionality

### 📱 Mobile Support
- **Touch Optimized**: Mobile-first design approach
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Performance**: Optimized for mobile Web3 browsers

---

## 🧪 Testing

### Run Tests
```bash
# Smart contract tests
cd smartcontracts
npx hardhat test

# Frontend tests
npm run test
```

### Test Networks
- **Sepolia Testnet**: Primary testing environment
- **Local Hardhat**: Development and unit testing
- **Goerli Testnet**: Alternative testing network

---

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Vercel Deployment
```bash
# Deploy to Vercel
vercel --prod
```

### Smart Contract Deployment
```bash
# Deploy to mainnet (use with caution)
npx hardhat run scripts/deploy.js --network mainnet
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the existing code style

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support & Community

<div align="center">

[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289DA?style=for-the-badge&logo=discord)](https://discord.gg/your-discord)
[![Twitter](https://img.shields.io/badge/Twitter-Follow%20Us-1DA1F2?style=for-the-badge&logo=twitter)](https://twitter.com/your-twitter)
[![GitHub](https://img.shields.io/badge/GitHub-Star%20Repo-181717?style=for-the-badge&logo=github)](https://github.com/auraCodesKM/code-day-prod)

</div>

### 🐛 Bug Reports
Found a bug? Please create an issue with:
- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

### 💡 Feature Requests
Have an idea? We'd love to hear it! Open an issue with:
- Feature description
- Use case explanation
- Implementation suggestions

---

## 🙏 Acknowledgments

- **Ethereum Foundation** for blockchain infrastructure
- **Next.js Team** for the amazing framework
- **OpenZeppelin** for secure smart contract libraries
- **Alchemy** for reliable Web3 infrastructure
- **Framer** for beautiful animations

---

<div align="center">

**Made with ❤️ by the Burn or Glory Team**

*May your missions be successful and your ships return home safely!* 🚀

</div>
