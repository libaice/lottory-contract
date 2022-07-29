//SPDX-License-Identifier:MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

    error Raffle__NotEnoughETHEntered();
    error Raffle_TransferFailed();

contract Raffle is VRFConsumerBaseV2 {
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    address private  s_recentWinner;

    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor (address vrfCoordinatorV2, uint256 entranceFee, bytes32 gasLane, uint64 subscriptionId, uint32 callBackGasLimit) VRFConsumerBaseV2(vrfCoordinatorV2)  {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callBackGasLimit;
    }

    // use chainlink VRF to get random number

    function requestRandomWinner() external {
        // request random number
        // get the random number and do something with it
        // 2 tx process
        uint256 requestId = i_vrfCoordinator.requestRandomWords(i_gasLane, i_subscriptionId, REQUEST_CONFIRMATIONS, i_callbackGasLimit, NUM_WORDS);
        emit RequestedRaffleWinner(requestId);
    }

    //  function requestRandomWords(
    //     bytes32 keyHash,
    //     uint64 subId,
    //     uint16 minimumRequestConfirmations,
    //     uint32 callbackGasLimit,
    //     uint32 numWords
    //   ) external returns (uint256 requestId);



    // function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal virtual;

    function fulfillRandomWords(uint256 /*requestId */, uint256[] memory randomWords) internal override {
        // module % get the last value
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];

        (bool success, ) = recentWinner.call{value: address(this).balance}("");

        if(!success){
            revert Raffle_TransferFailed();
        }
        emit WinnerPicked(recentWinner);
    }

    function getEntranceFee() public view returns (uint256){
        return i_entranceFee;
    }

    function enterRaffle() payable public {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        s_players.push(payable(msg.sender));
        // event 
        emit RaffleEnter(msg.sender);
    }

    function getPlayer(uint256 index) public view returns (address){
        return s_players[index];
    }

    function getRecentWinner() public view returns (address){
        return s_recentWinner;
    }

}


// 14 23 39