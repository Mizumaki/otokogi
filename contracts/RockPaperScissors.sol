pragma solidity ^0.4.24;

import '../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol';
import '../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol';

contract RockPaperScissors is Ownable {

  using SafeMath for uint;

  address donationAddress;
  uint totalAmountOfDonation;
  mapping(address => uint) public userTotalAmountOfDonation;
  event RpsResult(address indexed _address, uint indexed _result, uint _sendAmount);

  function setDonationAddress(address _account) external onlyOwner() {
    donationAddress = _account;
  }

  function checkDonationAddress() external view returns(address) {
    return donationAddress;
  }

  function getTotalAmountOfDonation() external view returns(uint) {
    return totalAmountOfDonation;
  }

  function getUserTotalAmountOfDonation(address _userAddress) external view returns(uint) {
    return userTotalAmountOfDonation[_userAddress];
  }

  function canStart(uint _price) external view returns(bool) {
    if (msg.sender.balance >= _price.mul(2)) {
      return true;
    } else {
      return false;
    }
  }

  function random(uint _num) private view returns (uint) {
    uint randomHash = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, _num)));
    return randomHash.mod(3);
  }

  function rpsCalc(uint _userHand, uint _randHand) private pure returns (uint) {
    if (_userHand > _randHand) {
      return (_userHand.sub(_randHand).add(3)).mod(3);
    } else {
      return (_randHand.sub(_userHand).add(3)).mod(3);
    }
  }

  function rockPaperScissors(uint _userHand, uint _num) external payable {
    uint randHand = random(_num);
    uint result = rpsCalc(_userHand, randHand);

    if (result == 1) {
      // LOSE
      donationAddress.transfer(msg.value.div(2));
      msg.sender.transfer(msg.value.div(2));
      totalAmountOfDonation = totalAmountOfDonation.add(msg.value.div(2));
      userTotalAmountOfDonation[msg.sender] = userTotalAmountOfDonation[msg.sender].add(msg.value.div(2));
      emit RpsResult(msg.sender, 1, msg.value.div(2));
    } else if (result == 2) {
      // WIN
      donationAddress.transfer(msg.value);
      totalAmountOfDonation = totalAmountOfDonation.add(msg.value);
      userTotalAmountOfDonation[msg.sender] = userTotalAmountOfDonation[msg.sender].add(msg.value);
      emit RpsResult(msg.sender, 2, msg.value);
    } else if (result == 0){
      // DRAW
      msg.sender.transfer(msg.value);
      emit RpsResult(msg.sender, 0, 0);
    } else {
      // if result is not 0,1,2 means Error.
      revert();
    }
  }

}
