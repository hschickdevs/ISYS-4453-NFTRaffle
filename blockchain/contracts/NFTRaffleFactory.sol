// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./NFTRaffle.sol";

contract NFTRaffleFactory {
    struct Raffle {
        uint id;
        address raffleAddress;
        uint createdAt;
        address owner;
        string ownerEmail;
    }

    address public administrator; // Owner and controller of the factory contract
    Raffle[] public raffles;
    uint public rafflesCreated; // Required to keep the ability to remove raffles and keep ID creation

    event RaffleCreated(Raffle raffle);
    event RaffleDeleted(Raffle raffle);

    constructor(address _administrator) {
        // Msg.sender can either delegate the administrator role to another address or keep it. 
        administrator = _administrator;
    }

    // Create the NFTRaffle instance and return the NFTRaffle contract address
    function createRaffle(address nftAddress, uint nftTokenID, string memory ownerEmail, uint ticketPrice, uint duration) public returns (address) {
        bool _matched = false;
        

        NFTRaffle raffleContract;

        raffleContract = new NFTRaffle(msg.sender, nftAddress, nftTokenID, ownerEmail, ticketPrice, duration);

        Raffle memory raffle = Raffle(
            rafflesCreated + 1,
            address(raffleContract),
            block.timestamp,
            raffleContract.owner(),
            raffleContract.ownerEmail()
        );
        raffles.push(raffle);

        rafflesCreated++;

        emit RaffleCreated(raffle);

        return raffle.raffleAddress;
    }

    // Delete raffle from storage (only owner of raffle)
    // A raffle could be deleted if it was accidentally deployed (set to pending state) and will never actually be started.
    function deleteRaffle(uint raffleId) public {
        require(msg.sender == administrator, "Only factory administrator can delete raffles");

        bool _matched = false;
        Raffle memory _matchedRaffle;
        uint _idx;
        for (uint i = 0; i < raffles.length; i++) {
            if (raffles[i].id == raffleId) {
                _idx = i;
                _matched = true;
                _matchedRaffle = raffles[i];
                break;
            }
        }

        require(_matched, "Could not locate raffle with given ID.");
        // require(_matchedRaffle.owner == msg.sender, "Message sender does not own the specified raffle.");
        // Shift the array and remove the element:
        for (uint i = _idx; i < raffles.length - 1; i++) {
            raffles[i] = raffles[i + 1];
        }
        raffles.pop();

        emit RaffleDeleted(_matchedRaffle);
    }

    // Get all raffles' IDs that match a certain status
    // The _state parameter should be equal to the index of the item in the NFTRaffle.State enum
    function fetchRafflesByState(uint _state) public view returns (Raffle[] memory) {
        // Find match count first (Solidity dynamic memory array problem)
        uint size;
        for (uint i = 0; i < raffles.length; i++) {
            if (NFTRaffle(raffles[i].raffleAddress).getState() == _state) {
                size++;
            }
        }

        // Prepare output
        uint counter;
        Raffle[] memory _raffles = new Raffle[](size);
        for (uint i = 0; i < raffles.length; i++) {
            if (NFTRaffle(raffles[i].raffleAddress).getState() == _state) {
                _raffles[counter] = raffles[i];
                counter++;
            }
        }

        return _raffles;
    }

    // Get all Raffles owned by the specified wallet address
    function fetchRafflesByOwner(address owner) public view returns (Raffle[] memory) {
        // Find match count first (Solidity dynamic memory array problem)
        uint size;
        for (uint i = 0; i < raffles.length; i++) {
            if (raffles[i].owner == owner) {
                size++;
            }
        }

        // Prepare output
        uint counter;
        Raffle[] memory _raffles = new Raffle[](size);
        for (uint i = 0; i < raffles.length; i++) {
            if (raffles[i].owner == owner) {
                _raffles[counter] = raffles[i];
                counter++;
            }
        }

        return _raffles;
    }

    function rafflesLength() public view returns (uint) {
        return raffles.length;
    }
}