const {developmentChains, networkConfig} = require("../../helper-hardhat-config");
const {network, getNamedAccounts, deployments, ethers} = require("hardhat");
const {assert, expect} = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Uint Tests ", async function () {
        let raffle, vrfCoordinatorV2Mock, deployer
        const chainId = network.config.chainId;

        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer;
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
                assert.equal(interval.toString(), networkConfig[chainId]["interval"])
            });
        })


        describe(" enterRaffle ", async function () {
            it("revert when you don't pay enough ", async function () {
                await expect(raffle.enterRaffle()).to.be.revertedWith("Raffle__NotEnoughETHEntered")
            });

            it('record players when they enter', async function () {
                await raffle.enterRaffle({value: ethers.utils.parseEther("0.5")})
                const playerFromContract = await raffle.getPlayer(0);
                console.log("the first in contract is ", playerFromContract);

                assert.equal(playerFromContract, deployer)
            });


            it('emit events on enter', async function () {
                await expect(raffle.enterRaffle({value: ethers.utils.parseEther("0.1")})).to.emit(raffle, "RaffleEnter");
            });

            it('does not allow entrance when raffle is calculating ', async function () {
                // make a situation when raffle is calculating
            });


        })


    })
