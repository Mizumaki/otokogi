import React from 'react';
import BN from 'bn.js';

class SelectHand extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: '' };
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.rps = this.rps.bind(this);
  }

  handleRadioChange = (changeEvent) => {
    this.setState({
      selected: changeEvent.target.value
    });
  }

  rps = async () => {
    const { web3, contract, accounts } = this.props;
    const doubleStakeEth = parseFloat(this.props.stakeEth) * 2;
    console.log(doubleStakeEth);
    const doubleStakeWei = web3.utils.toWei(doubleStakeEth.toString(), 'ether');
    console.log(doubleStakeWei.toString());
    console.log(contract);
    // Executing contract
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 75000;
    console.log('gaslimit', gasLimit);
    const random = Math.floor(Math.random() * 10000);
    contract.rockPaperScissors(this.props.hand, random, { from: accounts[0], value: doubleStakeWei, gas: gasLimit, gasPrice })
      .then(() => {
        this.props.changePhase('waiting');
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.selected && this.props.stakeEth) {
      this.props.setHand(this.state.selected);
      // rpsを実行
      this.rps();
    } else if (!this.props.stakeEth) {
      alert('まず、賭けるイーサリアムの量を指定してください。')
      this.props.changePhase('decideEth');
    }
  }

  render() {
    const rock = (<i className="far fa-hand-rock"><span className="hand-name">グー</span></i>);
    const scissors = (<i className="far fa-hand-peace"><span className="hand-name">チョキ</span></i>);
    const papaer = (<i className="far fa-hand-spock"><span className="hand-name">パー</span></i>)

    const Hand = (hand, num) => (
      <div className="hand-wrapper">
        <input type="radio" id={hand} name="rps" value={num} onChange={this.handleRadioChange} checked={this.state.selected === num.toString()} />
        <label className={hand} htmlFor={hand}>
          {eval(hand)}
        </label>
      </div>
    );

    const submit = this.props.web3 ?
      this.state.selected ? (<input type="submit" value="この手でじゃんけんをする" />) :
        (<input type="submit" disabled value="手を選んでください" />) :
      (<input type="submit" disabled value="まずはWEB3と連携してください" />);

    return (
      <form onSubmit={this.handleSubmit} className="rps">
        <div className="hands">
          {Hand("rock", 0)}
          {Hand("scissors", 1)}
          {Hand("papaer", 2)}
        </div>

        {submit}
      </form>

    );
  }
}

export default SelectHand;