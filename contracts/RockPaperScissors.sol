pragma solidity ^0.4.24;

contract RockPaperScissors {

  modifier affordPay(uint _price) {
    require(address(this).balance >= _price * 2, "Error message");
    _;
  }

  function canStart(uint _price) external view returns(bool) {
    if (address(this).balance >= _price * 2 ether) {
      return true;
    } else {
      return false;
    }
  }

  function random() private view returns (uint) {
    uint randomHash = uint(keccak256(abi.encodePacked(block.difficulty, now)));
    return randomHash % 99;
  }

  function rockPaperScissors(uint _hand) external affordPay(msg.value) payable {
    uint rand = random();
    if (rand < 33) {

    } else if (rand < 66) {

    } else {
      
    }
    _hand;
  }

}
