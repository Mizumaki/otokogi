pragma solidity ^0.4.24;

contract TestContract {
    address toAccount = 0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB;

    function sendMeNormalWithPure() public payable {
      pureAddress();
      msg.sender.transfer(msg.value);
    }

    function sendMeNormalWithView() public payable {
      viewAddress();
      msg.sender.transfer(msg.value);
    }

    function sendMeNormalNoPure() public payable {
      pureAddressNoPure();
      msg.sender.transfer(msg.value);
    }

    function sendMeNormalNoView() public payable {
      viewAddressNoView();
      msg.sender.transfer(msg.value);
    }


    function pureAddress() public pure returns (address) {
      return 0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB;
    }

    function viewAddress() public view returns (address) {
      return msg.sender;
    }

    function pureAddressNoPure() public returns (address) {
      return 0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB;
    }

    function viewAddressNoView() public returns (address) {
      return msg.sender;
    }

}
