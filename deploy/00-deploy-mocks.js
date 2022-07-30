const {network} = require("hardhat");
const {developmentChains} = require("../helper-hardhat-config")

const BASE_FEE = ethers.utils.parseEther("0.25")
const GAS_PRICE_LINK = 1E9

module.exports = async function ({getNamedAccounts, deployments}) {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts()

    const args = [BASE_FEE, GAS_PRICE_LINK];

    const chainId = network.config.chainId;

    if (developmentChains.includes(network.name)) {
        console.log("Locla network detecked ... Deploying Mocks  ")
        // deploy a mock
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        })

        console.log("Mocks Deployed !  ")
        console.log(" ----------------------------------  ")

    }

}
module.exports.tags = ["all", "mocks"]