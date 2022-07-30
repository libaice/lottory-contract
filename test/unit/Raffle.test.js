const {developmentChains, networkConfig} = require("../../helper-hardhat-config");
const {network, getNamedAccounts, deployments} = require("hardhat");
const { assert, expect } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Uint Tests ", async function () {
        let raffle, vrfCoordinatorV2Mock
        const chainId = network.config.chainId;

        beforeEach(async function () {
            const {deployer} = await getNamedAccounts();
            await deployments.fixture(["all"])
            raffle = await ethers.getContract("Raffle", deployer)
            vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
        })

        describe("constuctor", async function () {
            it('initilize the Raffle correctly ', async function () {
                const raffleState = await raffle.getRaffleState();
                console.log(`raffle State is ${raffleState} `)

                const interval = await raffle.getInterval();
                console.log(`contract interval is ${interval}`)

                assert.equal(raffleState.toString(), "0")
                assert.equal(interval.toString(), networkConfig[chainId]["interval"] )
            });
        })

    })
