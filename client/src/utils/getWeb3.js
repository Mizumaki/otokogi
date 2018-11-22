import Web3 from "web3";

const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    console.log('in getWeb3')
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    console.log('in load getWeb3')
    let web3 = window.web3;

    // Checking if Web3 has been injected by the browser (Mist/MetaMask).
    const alreadyInjected = typeof web3 !== "undefined";

    if (alreadyInjected) {
      console.log('in already getWeb3')
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider);
      console.log("Injected web3 detected.");
      resolve(web3);
    } else {
      console.log('in else getWeb3');
      // Fallback to localhost if no web3 injection. We've configured this to
      // use the development console's port by default.
      const provider = new Web3.providers.HttpProvider(
        "http://127.0.0.1:7545"
      );
      web3 = new Web3(provider);
      console.log("No web3 instance injected, using Local web3.");
      resolve(web3);
    }
  });
}

export default getWeb3;