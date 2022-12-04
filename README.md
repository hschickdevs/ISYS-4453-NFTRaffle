# ISYS-4453-NFTRaffle

 Project files for NFTRaffle, the final project in our ISYS-4453 Blockchain Development class.

 Escrow contract stores ERC721 NFT to be raffled, and sells tickets to the raffle for the specified price in the constructor.

## NFT Collection Used for Testing (Mumbai):

https://testnets.opensea.io/collection/digital-liminal-spaces

## Randomisation Method:

[Linear Congruential Psuedorandom Number Generator](https://en.wikipedia.org/wiki/Linear_congruential_generator)

## NFTRaffle Contract Design Flow:
[**NFTRaffle.sol**](blockchain/NFTRaffle.sol)

1. `Constructor()` instantiates the NFTRaffle contract with all required data, but DOES NOT yet receive the NFT.
    - This is because the NFTRaffle contract must be approved to spend the NFT by the owner.
2. The owner approves the contract to spend the ERC721 NFT with the recently deployed NFTRaffle contract's address.
    * This is so that the NFTRaffle contract can call the ERC721.safeTransferFrom() method to receive the NFT, and send it to the winner once the raffle is over.
    * This should be implemented in the interface once the contract is deployed.
3. The owner calls the `startRaffle()` method
    - Transfers the NFT from the owner to the NFTRaffle escrow contract.
    - Starts the timer on the raffle.
    - Users can now purchase tickets to the raffle.
4. Until a ticket is purchased, the `cancelRaffle()` can be called, which will cancel the raffle and turn the NFT back over to the owner. However, as soon as a ticket is purchased this method is voided.
5. Once the specified amount of time has passed (set as `duration` in the constructor), users will not be able to buy more tickets. 
    - At this point, the `settleRaffle()` method should be called, which does the following: 
        1. Checks that at least 1 ticket was purchased, if not, the `cancelRaffle()` function should be called to return the NFT to the owner. 
        2. Draws a winning ticket using the randomisation method.
        3. Transfers the NFT to the winner.
        4. Transfers the raised funds to the Raffle owner.

## Web Design Ideas:

* Use template: [*ethereum-boilerplate*](https://github.com/hschickdevs/ethereum-boilerplate)
* Home page should display Raffles, with a dropdown to filter Raffles: All, Pending, Active, Settled, Cancelled.

## Tasks for Blake:
- [ ] Will need brief description in our presentation on how the randomisation algorithm works, as this is a key component of a raffle in the sense that it needs to be provably random and fair. Also how it was implemented in the contract. https://en.wikipedia.org/wiki/Linear_congruential_generator
- [ ] Create a few different wallet addresses, and get Mumbai testnet MATIC for them to test the raffles using the faucet: https://faucet.polygon.technology/