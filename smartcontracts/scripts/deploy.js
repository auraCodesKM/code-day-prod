const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);


  const SpaceNFT = await hre.ethers.getContractFactory("SpaceNFT");
  const spaceNFT = await SpaceNFT.deploy(deployer.address);

  await spaceNFT.waitForDeployment();
  const contractAddress = await spaceNFT.getAddress();

  console.log("SpaceNFT deployed to:", contractAddress);
  console.log("Treasury address:", deployer.address);

  const ship1Fee = await spaceNFT.ship1Fee();
  const ship2Fee = await spaceNFT.ship2Fee();
  const ship3Fee = await spaceNFT.ship3Fee();

  console.log("Ship 1 Fee:", hre.ethers.formatEther(ship1Fee), "ETH");
  console.log("Ship 2 Fee:", hre.ethers.formatEther(ship2Fee), "ETH");
  console.log("Ship 3 Fee:", hre.ethers.formatEther(ship3Fee), "ETH");

  // Verify the contract on Etherscan (if not on local network)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await spaceNFT.deployTransaction.wait(6);
    await verify(contractAddress, [deployer.address]);
  }
}

async function verify(contractAddress, args) {
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 