//SPDX-License-Identifier:MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

error Raffle__NotEnoughETHEntered();

contract Raffle is VRFConsumerBaseV2 {
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;


    event RaffleEnter(address indexed player);

    constructor (address vrfCoordinatorV2, uint256 entranceFee) VRFConsumerBaseV2(vrfCoordinatorV2)  {
        i_entranceFee = entranceFee;
    }

    // use chainlink VRF to get random number

    function requestRandomWinner() external {
        // request random number
        // get the random number and do something with it

        // 2 tx process

    }


    // function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal virtual;

    function fulfillRandomWords( uint256 requestId, uint256[] memory randomWords ) internal override {

    }

    function getEntranceFee() public view returns  (uint256){
        return i_entranceFee;
    }

    function enterRaffle() payable public{
        if(msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        s_players.push(payable(msg.sender));
        // event 
        emit RaffleEnter(msg.sender);
    }

    function getPlayer(uint256 index) public view returns(address){
        return s_players[index];
    }

}