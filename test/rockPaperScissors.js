const RockPaperScissors = artifacts.require("./RockPaperScissors.sol");

contract("RockPaperScissors", accounts => {
  it("should set and get donationAddress correctly", async () => {
    const rps = await RockPaperScissors.deployed();

    await rps.setDonationAddress('0x16486f0ed7a923bd5b70a4e666a6bfbdb822deaf', {
      from: accounts[0]
    });

    // Get stored value
    const storedData = await rps.checkDonationAddress();

    assert.equal(storedData, '0x16486f0ed7a923bd5b70a4e666a6bfbdb822deaf', `The address is ${storedData} and this is incorrect.`);
  });
  
  it("should set and get donationAddress correctly", async () => {
    const rps = await RockPaperScissors.deployed();

    await rps.setDonationAddress('0x16486f0ed7a923bd5b70a4e666a6bfbdb822deaf', {
      from: accounts[0]
    });

    // Get stored value
    const storedData = await rps.checkDonationAddress();

    assert.equal(storedData, '0x16486f0ed7a923bd5b70a4e666a6bfbdb822deaf', `The address is ${storedData} and this is incorrect.`);
  });
});