pragma solidity ^0.4.24;

import '../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol';
//import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract RockPaperScissors is Ownable {
  address donationAddress;
  event RpsResult(uint _result, uint _sendedAmount);

  function setDonationAddress(address _account) external onlyOwner() {
    donationAddress = _account;
  }

  // checkよりgetだな
  function checkDonationAddress() external view returns(address) {
    return donationAddress;
  }

  modifier affordPay() {
    require(msg.sender.balance >= msg.value, "You don't have enough eth!!");
    _;
  }

  function canStart(uint _price) external view returns(bool) {
    if (msg.sender.balance >= _price * 2 wei) {
      return true;
    } else {
      return false;
    }
  }

  function random() private view returns (uint) {
    uint randomHash = uint(keccak256(abi.encodePacked(block.difficulty, now)));
    return randomHash % 3;
  }

  function rpsCalc(uint _userHand, uint _randHand) private pure returns (uint) {
    // マイナスが入るが大丈夫か？？
    uint result = (_userHand - _randHand + 3) % 3;
    return result;
  }

  function rockPaperScissors(uint _userHand) external affordPay() payable {
    uint randHand = random();
    uint result = rpsCalc(_userHand, randHand);

    if (result == 1) {
      // LOSE
      donationAddress.transfer(msg.value / 2);
      msg.sender.transfer(msg.value / 2);
      emit RpsResult(1, msg.value / 2);
    } else if (result == 2) {
      // WIN
      donationAddress.transfer(msg.value);
      emit RpsResult(2, msg.value);
    } else if (result == 0){
      // DRAW
      msg.sender.transfer(msg.value);
      emit RpsResult(0, 0);
    } else {
      // if result is not 0,1,2 means Error.
      revert();
    }
  }

}
