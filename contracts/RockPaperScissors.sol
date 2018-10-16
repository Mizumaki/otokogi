pragma solidity ^0.4.24;

contract RockPaperScissors {

  modifier affordPay() {
    require(msg.sender.balance >= msg.value, "You don't have enough eth!!");
    _;
  }

  function ethHoldings() external view returns(uint) {
    return msg.sender.balance;
  }

  function canStart(uint _price) external view returns(bool) {
    if (msg.sender.balance >= _price * 2 ether) {
      return true;
    } else {
      return false;
    }
  }

  function random() private view returns (uint) {
    uint randomHash = uint(keccak256(abi.encodePacked(block.difficulty, now)));
    return randomHash % 3;
  }

  function rpsResult(uint _userHand, uint _randHand) private pure returns (uint) {
    // マイナスが入るが大丈夫か？？
    uint result = (_userHand - _randHand + 3) % 3;
    return result;
  }

  function rockPaperScissors(uint _userHand) external affordPay() payable {
    uint randHand = random();
    uint result = rpsResult(_userHand, randHand);
    address donationAccount = 0x16F641d63FD077f548A57fDa4835DFBb1BB999A9;
    if (result == 1) {
      // LOSE
      donationAccount.transfer(msg.value / 2);
      msg.sender.transfer(msg.value / 2);
    } else if (result == 2) {
      // WIN
      donationAccount.transfer(msg.value);
    } else {
      // DRAW
      msg.sender.transfer(msg.value);
    }
  }

}
