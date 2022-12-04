// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract NFTRaffle is IERC721Receiver {
    struct Ticket {
        address payable owner;
        string email;
    }

    enum State {
        PENDING,
        ACTIVE,
        SETTLED,
        CANCELLED
    }

    // Owner & NFT
    State private _state;
    address public owner;
    string public ownerEmail;
    address public nftAddress;
    uint public nftTokenID;
    string public nftTokenURI;


    // State & Configurables
    uint public ticketPrice;
    uint public duration;
    uint public startTime;
    uint public endTime;

    Ticket[] private tickets;
    mapping(address => uint) public ticketCounts;

    event Started(uint timestamp, address _nftAddress, uint _tokenID);
    event TicketsBought(address owner, uint amount);
    event Cancelled(uint timestamp);
    event Ended(uint timestamp, Ticket winningTicket);


    // ---------- CONSTRUCTOR ---------- \\
    constructor (address _nftAddress, uint _nftTokenID, string memory _ownerEmail, uint _ticketPrice, uint _duration) {
        // Verify NFT Credentials
        require(
            ERC721(_nftAddress).ownerOf(_nftTokenID) == msg.sender,
            "Message sender does not own the specified NFT."
        );
        
        owner = msg.sender;
        ownerEmail = _ownerEmail;
        ticketPrice = _ticketPrice;
        duration = _duration;
        _state = State.PENDING;

        nftAddress = _nftAddress;
        nftTokenID = _nftTokenID;
        nftTokenURI = ERC721(_nftAddress).tokenURI(_nftTokenID);
    }


    // ---------- MODIFIERS ---------- \\
    modifier isOwner() {
        require(msg.sender == owner, "Only the owner of the Raffle can call this function.");
        _;
    }
    modifier isActive() {
        require(_state == State.ACTIVE, "Raffle is not active.");
        _;
    }
    modifier notEnded() {
        require(block.timestamp >= endTime, "Raffle cannot be ended yet.");
        _;
    }


    // ---------- STATE FUNCTIONS ---------- \\
    function startRaffle() public {
        require(_state == State.PENDING, "Raffle is not in 'Pending' state.");
        require(ERC721(nftAddress).getApproved(nftTokenID) == address(this), "Raffle contract is not approved to access NFT");

        // Handle NFT Escrow (Contract should be approved to spend NFT)
        ERC721(nftAddress).safeTransferFrom(msg.sender, address(this), nftTokenID);
        
        startTime = block.timestamp; // Should be started when deposited
        endTime = startTime + duration;
        _state = State.ACTIVE;
        
        emit Started(startTime, nftAddress, nftTokenID);
    }

    function settleRaffle() public isActive() notEnded() {
        require(size() > 0, "Raffle is over, but no tickets were purchased. Call cancelRaffle() instead.");

        // Pick random ticket
        Ticket memory winningTicket = _drawTicket();

        // transfer NFT to ticket holder
        ERC721(nftAddress).safeTransferFrom(address(this), winningTicket.owner, nftTokenID);
        
        // Disperse funds to owner
        payable(owner).transfer(address(this).balance);

        emit Ended(block.timestamp, winningTicket);
    }

    function cancelRaffle() public isOwner() isActive() {
        // Cancel the raffle if no one has entered
        require(size() == 0, "Raffle cannot be ended after tickets are purchased.");
        
        // Return NFT to owner
        ERC721(nftAddress).safeTransferFrom(address(this), owner, nftTokenID);

        _state = State.CANCELLED;
        emit Cancelled(block.timestamp);
    }

    function purchaseTickets(uint amount, string calldata email) public payable isActive() notEnded() {
        require(msg.sender != owner, "The owner cannot buy raffle tickets.");
        require(msg.value == (ticketPrice * amount), "Inaccurate message value.");

        // Add tickets to storage
        for (uint i=0; i < amount; i++) {
            Ticket memory newTicket = Ticket(payable(msg.sender), email);
            tickets.push(newTicket);
        }

        ticketCounts[msg.sender] += amount;

        emit TicketsBought(msg.sender, amount);
    }


    // ---------- VIEW FUNCTIONS ---------- \\
    function onERC721Received( address , address , uint256 , bytes calldata  ) public pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function getState() public view returns (string memory) {
        if (_state == State.PENDING) {
            return "Pending";
        } else if (_state == State.ACTIVE) {
            return "Active";
        } else if (_state == State.SETTLED) {
            return "Settled";
        } else if (_state == State.CANCELLED) {
            return "Cancelled";
        } else {
            return "Error";
        }
    }

    function treasury() public view returns (uint) {
        // Returns the value in Ether of the contract
        return address(this).balance;
    }

    function size() public view returns (uint) {
        return tickets.length;
    }

    function _drawTicket() private view returns (Ticket memory) {
        require(tickets.length > 0, "No tickets have been purchased.");

        uint idx = _random() % tickets.length;
        return tickets[idx];
    }
    
    // Generate a random number using the Linear Congruential Generator algorithm,
    // using the block number as the seed of randomness.
    // The magic numbers `a`, `c` and `m` where taken from the Wikipedia article.
    function _random() private view returns (uint) {
        uint seed = block.number;

        uint a = 1103515245;
        uint c = 12345;
        uint m = 2 ** 32;

        return (a * seed + c) % m;
    }
}