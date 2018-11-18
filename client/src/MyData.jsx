import React from 'react';
import PieChart from './PieChart';
import 'c3/c3.css';

class MyData extends React.Component {
  constructor(props) {
    super(props);
    this.state = { winCount: 0, loseCount: 0, drawCount: 0 }
    this.setCount = this.setCount.bind(this);
    this.setWinCount = this.setWinCount.bind(this);
    this.setLoseCount = this.setLoseCount.bind(this);
    this.setDrawCount = this.setDrawCount.bind(this);
  }

  componentDidMount = () => {
    if (this.props.web3) {
      this.setCount();
    }
  }

  componentDidUpdate = () => {
    if (this.props.web3) {
      this.setCount();
    }
  }

  setCount = () => {
    this.setWinCount();
    this.setLoseCount();
    this.setDrawCount();
  }

  setWinCount = () => {
    this.props.contract.getPastEvents('RpsResult', { filter: { _address: this.props.accounts[0], _result: "2" }, fromBlock: 0, toBlock: 'latest' })
      .then((res) => {
        if (this.state.winCount === res.length) {
          return;
        }
        this.setState({ winCount: res.length });
      })
      .catch(e => console.log(e));
  }

  setLoseCount = () => {
    this.props.contract.getPastEvents('RpsResult', { filter: { _address: this.props.accounts[0], _result: "1" }, fromBlock: 0, toBlock: 'latest' })
      .then((res) => {
        if (this.state.loseCount === res.length) {
          return;
        }
        this.setState({ loseCount: res.length });
      })
      .catch(e => console.log(e));
  }

  setDrawCount = () => {
    this.props.contract.getPastEvents('RpsResult', { filter: { _address: this.props.accounts[0], _result: "0" }, fromBlock: 0, toBlock: 'latest' })
      .then((res) => {
        if (this.state.drawCount === res.length) {
          return;
        }
        this.setState({ drawCount: res.length });
      })
      .catch(e => console.log(e));
  }

  render() {
    const donationAmount = this.props.web3 ? (
      <div className="donation-amount">
        <h2>今までに集まった寄付金総額</h2>
        <p>{this.props.userTotalAmountOfDonation} ETH</p>
        <p>{Math.floor(this.props.calcEthToFiat(this.props.userTotalAmountOfDonation))} 円</p>
      </div>
    ) : null;
    return (
      <div className="data">
        {donationAmount}
        <PieChart winCount={this.state.winCount} loseCount={this.state.loseCount} drawCount={this.state.drawCount} />
      </div>
    );
  }
}

export default MyData;