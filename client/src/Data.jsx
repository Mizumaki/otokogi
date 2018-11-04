import React from 'react';
import Top5Table from './Top5Table';
import PieChart from './PieChart';
import 'c3/c3.css';

class Data extends React.Component {
  constructor(props) {
    super(props);
    this.state = { topWinDonate: [], top5LoseDonate: [], winCount: 0, loseCount: 0, drawCount: 0, loading: false, refreshed: false }
    this.setTop5DonatesAndCount = this.setTop5DonatesAndCount.bind(this);
    this.setTop5WinDonateAndCount = this.setTop5WinDonateAndCount.bind(this);
    this.setTop5LoseDonateAndCount = this.setTop5LoseDonateAndCount.bind(this);
    this.extractTop5Blocks = this.extractTop5Blocks.bind(this);
    this.extractTop5DonationData = this.extractTop5DonationData.bind(this);
    this.setDrawCount = this.setDrawCount.bind(this);
    this.clickRefresh = this.clickRefresh.bind(this);
  }

  componentDidMount = () => {
    if (this.props.web3) {
      console.log('in compDidMount');
      this.setTop5DonatesAndCount();
    }
  }

  componentDidUpdate = () => {
    if (this.props.web3) {
      console.log('in compDidUpdate');
      this.setTop5DonatesAndCount();
    } else {
      console.log('in compDidUpdate but nothing')
    }
  }

  setTop5DonatesAndCount = () => {
    const { contract } = this.props;
    if (!contract) {
      return;
    } else {
      Promise.all([
        this.setTop5WinDonateAndCount(),
        this.setTop5LoseDonateAndCount()
      ])
        .then(() => {
          this.setDrawCount();
        })
    }
  }

  setTop5WinDonateAndCount = () => {
    return new Promise((resolve, reject) => {
      // 同率の場合は新しいtxを優先するということで、無視
      const { contract } = this.props;
      contract.getPastEvents('RpsResult', { filter: { _result: "2" }, fromBlock: 0, toBlock: 'latest' })
        .then((res) => {
          if (this.state.winCount === res.length) {
            return;
          }
          this.setState({ winCount: res.length });
          const top5WinBlocks = this.extractTop5Blocks(res);
          return this.extractTop5DonationData(top5WinBlocks);
        })
        .then((top5WinDonate) => {
          if (top5WinDonate !== undefined) {
            console.log(top5WinDonate);
            resolve(this.setState({ topWinDonate: top5WinDonate }), console.log('resolve setTop5WinDonateAmount'));
          }
        })
        .catch(e => reject(e));
    })
  }

  setTop5LoseDonateAndCount = () => {
    return new Promise((resolve, reject) => {
      // 同率の場合は新しいtxを優先するということで、無視
      const { contract } = this.props;
      contract.getPastEvents('RpsResult', { filter: { _result: "1" }, fromBlock: 0, toBlock: 'latest' })
        .then((res) => {
          if (this.state.loseCount === res.length) {
            return;
          }
          this.setState({ loseCount: res.length });

          const top5LoseBlocks = this.extractTop5Blocks(res);
          return this.extractTop5DonationData(top5LoseBlocks);
        })
        .then((top5LoseDonate) => {
          if (top5LoseDonate !== undefined) {
            resolve(this.setState({ top5LoseDonate: top5LoseDonate }), console.log('resolve setTop5WinDonateAmount'));
          }
        })
        .catch(e => reject(e));
    })
  }

  setDrawCount = () => {
    const { contract } = this.props;
    contract.getPastEvents('RpsResult', { filter: { _result: "0" }, fromBlock: 0, toBlock: 'latest' })
      .then((res) => {
        if (this.state.drawCount === res.length) {
          return;
        }
        this.setState({ drawCount: res.length });
        console.log('done setDrawCount');
      });
  }

  extractTop5Blocks = (res) => {
    const { web3 } = this.props;

    let top5Amount = [];
    let top5IndexInRes = [];

    res.forEach((currentValue, currentIndex) => {
      const sendAmount = parseFloat(web3.utils.fromWei(currentValue.returnValues._sendAmount.toString(), 'ether'));
      const min = Math.min(...top5Amount);
      if (top5Amount.length > 4) {
        // if top5 is full
        if (sendAmount >= min) {
          const minIndex = top5Amount.indexOf(min);
          top5Amount[minIndex] = sendAmount;
          top5IndexInRes[minIndex] = currentIndex;
        }
      } else {
        // if top5 is not full
        top5Amount.push(sendAmount);
        top5IndexInRes.push(currentIndex);
      }
    });

    console.log('top5Amount', top5Amount);
    console.log('top5IndexInRes', top5IndexInRes);

    let top5Blocks = [];

    const tmpAmount = top5Amount.length === 1 ? [top5Amount[0]] :new Array(...top5Amount);
    top5Amount.sort((a, b) => b - a);
    console.log('top5Amount is sorted', top5Amount);

    for (let i = 0; i < 5; i++) {
      const index = tmpAmount.indexOf(top5Amount[i]);
      console.log(index);
      // Not to match duplicate amount, assign 0 in the amount
      tmpAmount[index] = 0;
      const targetIndexInRes = top5IndexInRes[index];
      top5Blocks.push(res[targetIndexInRes]);
    }

    return top5Blocks;
  }

  extractTop5DonationData = (top5Blocks) => {
    return new Promise((resolve, reject) => {
      const { web3 } = this.props;
      let top5Donation = [];
      Promise.all(top5Blocks.map(e => {
        if (e === null || e === undefined) {
          return;
        }
        const amount = web3.utils.fromWei(e.returnValues._sendAmount.toString(), 'ether');
        web3.eth.getTransaction(e.transactionHash)
          .then((tx) => {
            const address = tx.from;
            top5Donation.push({ address, amount });
          })
      }))
        .then(() => resolve(top5Donation))
        .catch((e) => reject(e));
    })
  }

  clickRefresh = () => {
    this.props.refresh();
    this.setState({ refreshed: true });
  }

  render() {
    const top5WinDonate = this.state.topWinDonate.length !== 0 ? (
      <div className="table">
        <h2>漢気ありすぎ！<br />勝者の寄付額TOP5</h2>
        <Top5Table top5={this.state.topWinDonate} />
      </div>
    ) : null;

    const top5LoseDonate = this.state.top5LoseDonate.length !== 0 ? (
      <div className="table">
        <h2>残念これしか寄付できず！<br />敗者の寄付額TOP5</h2>
        <Top5Table top5={this.state.top5LoseDonate} />
      </div>) : null;

    const donationAmount = this.props.web3 ? (
      <div className="donation-amount">
        <h2>今までに集まった寄付金総額</h2>
        <p>{this.props.totalAmountOfDonation} ETH</p>
        <p>{Math.floor(this.props.calcEthToFiat(this.props.totalAmountOfDonation))} 円</p>
      </div>
    ) : null;

    const topDonate = (<div>{top5WinDonate}{top5LoseDonate}</div>)

    return (
      <div className="data">
        {donationAmount}
        <PieChart winCount={this.state.winCount} loseCount={this.state.loseCount} drawCount={this.state.drawCount} />
        <div className="button">
          {this.props.web3 ? (<button onClick={this.clickRefresh}>ランキングを表示する</button>) : null}
        </div>
        {this.state.refreshed ? (topDonate) : null}
      </div>
    );
  }
}

export default Data;