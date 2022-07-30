const {network, ethers} = require('hardhat')
const {developmentChains, networkConfig} = require("../helper-hardhat-config");
const {verify} = require("../helper-hardhat-config")

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("30")

module.exports = async function ({getNamedAccounts, deployments}) {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts()
    // declare network config and chain Id
    const chainId = network.config.chainId
    let vrfCoordinatorV2Address, subscriptionId
    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address

        const txResponse = await vrfCoordinatorV2Mock.createSubscription();
        const txReceipt = await txResponse.wait(1);

        subscriptionId = txReceipt.events[0].args.subId

        // fund subscription         function fundSubscription(uint64 _subId, uint96 _amount)
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)


    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    const entranceFee = networkConfig[chainId]["entranceFee"]
    const gasLane = networkConfig[chainId]["gasLane"]
    const callBackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    const interval = networkConfig[chainId]["interval"]

    const args = [vrfCoordinatorV2Address, entranceFee, gasLane, subscriptionId, callBackGasLimit, interval];

    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })


    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log(" Verifying .... ")
        await verify(raffle.address, args)

    }

    console.log(" ------------------------------------  ")

}

module.exports.tags = ["all", "raffle"]