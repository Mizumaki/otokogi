import React from "react";
import getWeb3 from "./utils/getWeb3";
import getEthPrice from "./utils/getEthPrice";
import RpsContract from "./contracts/RockPaperScissors.json";
import truffleContract from "truffle-contract";
import Explanation from "./Explanation.jsx";
import DecideEthAmount from "./DecideEthAmount.jsx";
import SelectHand from "./SelectHand.jsx";
import Data from "./Data.jsx";
import FetchEvent from "./FetchEvent";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null, accounts: null, contract: null, ethPrice: "", userTotalAmountOfDonation: '',
      balance: "", donationAddress: "", stakeEth: "", stakeFiat: "", hand: '', result: '',
      phase: "decideEth", connectingWeb3: false, error: '', totalAmountOfDonation: ''
    };
    this.calcEthToFiat = this.calcEthToFiat.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
    this.connectWeb3 = this.connectWeb3.bind(this);
    this.changePhase = this.changePhase.bind(this);
    this.setStakeEth = this.setStakeEth.bind(this);
    this.setHand = this.setHand.bind(this);
    this.toDataPage = this.toDataPage.bind(this);
    this.toTopPage = this.toTopPage.bind(this);
  }

  componentDidMount = async () => {
    const ethPrice = await getEthPrice();
    console.log(ethPrice);
    this.setState({ ethPrice });
    this.updateInfo();
  }

  componentDidUpdate = () => {
    console.log("in comp did update");
    this.updateInfo();
  }

  calcEthToFiat = (value) => {
    const ethAmount = typeof value === 'string' ? parseFloat(value) : value;
    const ethValue = parseFloat(this.state.ethPrice);
    const result = ethAmount * ethValue;
    return result;
  }

  setStakeEth = (value) => {
    const stakeFiat = this.calcEthToFiat(value);
    this.setState({ stakeEth: value, stakeFiat });
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
      this.setState({ web3, accounts, contract: instance, connectingWeb3: false }, this.updateInfo);
    }
    catch (error) {
      this.setState({ connectingWeb3: false });
      // Catch any errors for any of the above operations.
      alert("web3と通信を試みましたが、web3、アカウント、コントラクト、いずれかのローディングに失敗しました。詳しくはconsoleをご確認ください。");
      console.log(error);
    }
  };

  toDataPage = () => {
    this.setState({ phase: 'data' });
    return false;
  }

  toTopPage = () => {
    this.setState({ phase: 'decideEth' });
    return false;
  }

  updateInfo = async () => {
    if (this.state.web3 && this.state.accounts[0] !== undefined) {
      console.log('in updateInfo');
      const { web3, accounts, contract } = this.state;
      //await contract.setDonationAddress("0xA59B29d7dbC9794d1e7f45123C48b2b8d0a34636", { from: accounts[0] });
      const balanceWei = await web3.eth.getBalance(accounts[0]);
      const balanceEth = web3.utils.fromWei(balanceWei.toString(), 'ether')

      const donationAddress = await contract.checkDonationAddress();

      const totalAmountOfDonation = await contract.getTotalAmountOfDonation();
      const totalEth = web3.utils.fromWei(totalAmountOfDonation.toString(), 'ether');

      const userTotalAmountOfDonationWei = await contract.getUserTotalAmountOfDonation(accounts[0]);
      const userTotalAmountOfDonation = web3.utils.fromWei(userTotalAmountOfDonationWei.toString(), 'ether');

      // if there are any change in balance or address to donation, change state
      if (balanceEth !== this.state.balance || donationAddress !== this.state.donationAddress || totalEth !== this.state.totalAmountOfDonation || userTotalAmountOfDonation.toString() !== this.state.userTotalAmountOfDonation) {
        this.setState({ balance: balanceEth.toString(), donationAddress: donationAddress.toString(), totalAmountOfDonation: totalEth, userTotalAmountOfDonation: userTotalAmountOfDonation.toString() });
      }
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
                <DecideEthAmount {...this.state} changePhase={this.changePhase} setStakeEth={this.setStakeEth} />
              </div>
            </div>
          );
        case "notEnoughEth":
          return (
            <div>
              <Explanation notEnoughEth decideEth {...this.state} connectWeb3={this.connectWeb3} changePhase={this.changePhase} />
              <div className="form">
                <DecideEthAmount {...this.state} changePhase={this.changePhase} setStakeEth={this.setStakeEth} />
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
        case "waiting":
          return (
            <div>
              <Explanation waiting {...this.state} changePhase={this.changePhase} />
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
              <Explanation {...this.state} connectWeb3={this.connectWeb3} changePhase={this.changePhase} />
              <div>
                <Data {...this.state} calcEthToFiat={this.calcEthToFiat} refresh={this.toDataPage} />
              </div>
            </div>
          )
        default:
          break;
      }
    })();

    return (
      <div className="App">
        {this.state.contract && this.state.accounts ? <FetchEvent {...this.state} changePhase={this.changePhase} /> : null}
        <div className="header">
          <a onClick={this.toDecideEth}><h1 className="title">漢気じゃんけんDapps</h1></a>
          <p className="game-description">このゲームでは、 実際のイーサリアムを賭けてじゃんけんをしていただきます。負けてしまうと大変残念ながら、
            あなたの賭けたイーサリアムは寄付されます。しかし勝てば、なんと、賭けたイーサリアムの2倍の量を寄付することができます！！
            ぜひ勝って、喜びを噛み締めましょう。(※注意：じゃんけんをすると、そのアドレスが公開される可能性があります。ご留意のうえ、ご参加ください。)
          </p>
          <p className="game-description">MetaMaskのセキュリティに対する変更に対応が間に合っていないため、ただ今アカウント情報を適切に表示できない可能性があります。すみません。直します。
          </p>
          <div className="links">
            <a onClick={this.toTopPage}>トップページへ</a>
            <a onClick={this.toDataPage}>今までの寄付データを見る</a>
            <a href="https://github.com/Mizumaki/otokogi">GitHub</a>
            {/* 
            <a href="">技術的な解説<br />(私のブログへ飛びます)</a>
            <a href="" target="_blank">じゃんけんゲームの始め方<br />(Qitta記事へ飛びます)</a>
             */}
          </div>
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
                <span className="tag">このアカウントの寄付額</span>
                <span className="value">
                  {this.state.web3 ? this.state.userTotalAmountOfDonation : "Web3との連携がなされていません"} ETH
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
                <span className="tag">今までに集まった寄付金総額</span>
                <span className="value">
                  {this.state.web3 ? this.state.totalAmountOfDonation : "Web3との連携がなされていません"} ETH
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
