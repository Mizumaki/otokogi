import React from 'react';
import BN from 'bn.js';

class DecideEthAmount extends React.Component {
  constructor(props) {
    super(props);
    this.calcEthToFiat = this.calcEthToFiat.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  calcEthToFiat = async (value) => {
    // 1 ETH = 22,936.15 JPY
    // 本当なら最新のものを取得したい
    const ethValue = 22936.15;
    const result = parseFloat(value) * ethValue;
    this.props.setEthToFiat(result);
  }

  handleChange = (event) => {
    this.props.setStakeEth(event.target.value);
    this.calcEthToFiat(event.target.value);
  }

  handleSubmit = (event) => {
    if (this.props.web3) {
      const { web3, accounts, contract } = this.props;
      const stakeWei = web3.utils.toWei(this.props.stakeEth, 'ether');
      console.log(stakeWei);
      console.log(new BN(stakeWei, 10));
      const canStart = contract.canStart(stakeWei);
      const next = canStart ? "selectHand" : "notEnoughEth";
      this.props.changePhase(next);
      event.preventDefault();
    }
  }
  
  render() {
    const submit = this.props.web3 ?
      (<input type="submit" value="男気じゃんけんを始める" />) :
      this.props.connectingWeb3 ? 
      (<input type="submit" disabled value="WEB3との連携をトライ中" />) :
      (<input type="submit" disabled value="まずはWEB3と連携してください。" />);
    return (
      <form onSubmit={this.handleSubmit} >
        <label htmlFor="amountOfEth">賭けるEthの量</label>
        <input type="number" step="0.01" min="0.01" id="amountOfEth" name="amountOfEth" placeholder="0.00" value={this.props.stakeEth} onChange={this.handleChange} required />
        <label htmlFor="ethToFiatResult">日本円での支払い額概算</label>
        <output name="ethToFiatResult" id="ethToFiatResult">{this.props.ethToFiat}円</output>
        {submit}
      </form>
    );
  }
}

export default DecideEthAmount;