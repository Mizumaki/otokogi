import React from "react";
import getWeb3 from "./utils/getWeb3";
import RpsContract from "./contracts/RockPaperScissors.json";
import truffleContract from "truffle-contract";
import Explanation from "./Explanation.jsx";
import DecideEthAmount from "./DecideEthAmount.jsx";
import SelectHand from "./SelectHand.jsx";
import Data from "./Data.jsx";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null, accounts: null, contract: null,
      balance: "", donationAddress: "", stakeEth: "", ethToFiat: "", hand: '',
      phase: "data", connectingWeb3: false, error: '', totalAmountOfDonation: ''
    };
    this.updateInfo = this.updateInfo.bind(this);
    this.connectWeb3 = this.connectWeb3.bind(this);
    this.changePhase = this.changePhase.bind(this);
    this.setStakeEth = this.setStakeEth.bind(this);
    this.setEthToFiat = this.setEthToFiat.bind(this);
    this.setHand = this.setHand.bind(this);
    this.calcAllDonateAmount = this.calcAllDonateAmount.bind(this);
  }

  componentDidMount = () => {
    this.updateInfo();
  }

  componentDidUpdate = () => {
    console.log("in comp did update");
    this.updateInfo();
  }

  setEthToFiat = (value) => {
    this.setState({ ethToFiat: value });
  };

  setStakeEth = (value) => {
    this.setState({ stakeEth: value });
  };

  setHand = (value) => {
    this.setState({ hand: value });
  }

  connectWeb3 = async () => {
    try {
      this.setState({ connectingWeb3: true });
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const Contract = truffleContract(RpsContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();

      this.setState({ web3, accounts, contract: instance }, this.updateInfo);
      this.setState({ connectingWeb3: false });
    }
    catch (error) {
      this.setState({ connectingWeb3: false });
      // Catch any errors for any of the above operations.
      alert("web3と通信を試みましたが、web3、アカウント、コントラクト、いずれかのローディングに失敗しました。詳しくはconsoleをご確認ください。");
      console.log(error);
    }
  };

  updateInfo = async () => {
    if (this.state.web3) {
      const { web3, accounts, contract } = this.state;
      //await contract.setDonationAddress("0x16486F0ED7a923Bd5b70A4e666A6BfBDB822dEAF", { from: accounts[0] });
      const balanceWei = await web3.eth.getBalance(accounts[0]);
      const balanceEth = web3.utils.fromWei(balanceWei, 'ether')
      const donationAddress = await contract.checkDonationAddress();
      // if there are any change in balance or address to donation, change state
      if (balanceEth !== this.state.balance || donationAddress !== this.state.donationAddress) {
        this.setState({ balance: balanceEth.toString(), donationAddress: donationAddress.toString() });
      }
      const totalAmountOfDonation = await contract.getTotalAmountOfDonation();
      this.setState({totalAmountOfDonation});
    }
  };

  changePhase = (value, additional) => {
    this.setState({ phase: value });
    if (additional) {
      this.setState({ error: additional });
    }
  };

  toDecideEth = () => {
    this.changePhase('decideEth');
    return false;
  }

  render() {
    const main = (() => {
      switch (this.state.phase) {
        case "decideEth":
          return (
            <div>
              <Explanation decideEth {...this.state} connectWeb3={this.connectWeb3} changePhase={this.changePhase} />
              <div className="form">
                <DecideEthAmount {...this.state} changePhase={this.changePhase} setEthToFiat={this.setEthToFiat} setStakeEth={this.setStakeEth} />
              </div>
            </div>
          );
        case "notEnoughEth":
          return (
            <div>
              <Explanation notEnoughEth decideEth {...this.state} connectWeb3={this.connectWeb3} changePhase={this.changePhase} />
              <div className="form">
                <DecideEthAmount {...this.state} changePhase={this.changePhase} setEthToFiat={this.setEthToFiat} setStakeEth={this.setStakeEth} />
              </div>
            </div>
          )
        case "selectHand":
          return (
            <div>
              <Explanation chooseHand {...this.state} connectWeb3={this.connectWeb3} changePhase={this.changePhase} />
              <div className="form">
                <SelectHand {...this.state} changePhase={this.changePhase} setHand={this.setHand} />
              </div>
            </div>
          );
        case "draw":
          return (
            <div>
              <Explanation draw {...this.state} connectWeb3={this.connectWeb3} changePhase={this.changePhase} />
              <div className="form">
                <SelectHand {...this.state} changePhase={this.changePhase} setHand={this.setHand} />
              </div>
            </div>
          );
        case "win":
          return (
            <div>
              <Explanation win {...this.state} changePhase={this.changePhase} />
            </div>
          );
        case "lose":
          return (
            <div>
              <Explanation lose {...this.state} changePhase={this.changePhase} />
            </div>
          );
        case "unknownError":
          return (
            <div>
              <Explanation unknownError {...this.state} changePhase={this.changePhase} />
            </div>
          );
        case "data":
          return (
            <div>
              <Explanation decideEth {...this.state} connectWeb3={this.connectWeb3} changePhase={this.changePhase} />
              <Data {...this.state} />
            </div>
          )
        default:
          break;
      }
    })();

    return (
      <div className="App">
        <div className="header">
          <a onClick={this.toDecideEth}><h1 className="title">漢気じゃんけんDapps</h1></a>
          <p className="game-description">このゲームでは、 実際のイーサリアムを賭けてじゃんけんをしていただきます。負けてしまうと大変残念ながら、
            あなたの賭けたイーサリアムは寄付されます。しかし勝てば、なんと、賭けたイーサリアムの2倍の量を寄付することができます！！
            ぜひ勝って、喜びを噛み締めましょう。
          </p>
          <div className="info">
            <div className="condition">
              {this.state.web3 ? (<div className="flag web3">Web3 detected!</div>) : <div className="flag">Web3 not detected!</div>}
            </div>
            <div className="on-chain">
              <div className="on-chain-data">
                <span className="tag">アカウントのETH残高</span>
                <span className="value">
                  {this.state.web3 ? this.state.balance : "Web3との連携がなされていません"} ETH
                </span>
              </div>
              <div className="on-chain-data">
                <span className="tag">寄付先のアドレス</span>
                <span className="value">
                  {this.state.web3 ? <span className="address">{this.state.donationAddress}</span> : "Web3との連携がなされていません"}
                </span>
                {this.state.web3 ? <span className="address-url"><a href={`https://etherscan.io/address/${this.state.donationAddress}`} target="_blank">Etherscanで見る</a></span> : null}
              </div>
              <div className="on-chain-data">
                <span className="tag">今までの寄付金総額</span>
                <span className="value">
                  {this.state.web3 ? this.state.totalAmountOfDonation : "Web3との連携がなされていません"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="main">
          {main}
        </div>
      </div>
    );
  }
}

export default App;
