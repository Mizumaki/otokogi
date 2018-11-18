import React from 'react';

class RpsResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = { result: 'waiting' };
  }

  componentDidMount = () => {
    // Addressを現在のアカウントのものに絞り込む必要性あり
    contract.RpsResult({ fromBlock: 'latest', toBlock: 'latest' }, (error, result) => {
      if (!error) {
        console.log(result);
        // If this component is updated, the 'result' === false
        if (!result) {
          return;
        }
        console.log(result.args._result.toString(10));
        const rpsResult = result.args._result.toString(10)
        switch (rpsResult) {
          case '0':
            this.props.changePhase('draw');
            break;
          case '1':
            this.setState({ result: 'lose' });
            break;
          case '2':
            this.setState({ result: 'win' });
            break;
          default:
            break;
        }
      } else {
        this.props.changePhase('unknownError', error);
      }
    });
  }

  render() {
    switch (this.state.result) {
      case 'waiting':
        return <Waiting />;
      case 'lose':
        return <Lose />;
      case 'win':
        return <Win />;
      default:
        return null;
    }
  }
}

const Lose = () => {
  return (
    <div className="rps-result lose">
      <i className="fas fa-tired"></i>
      <h2>😢 残念でした 😭<br />あなたの負けです</h2>
      <p>
        残念なことに、賭けたイーサリアムと同じ量、
        合計 {props.stakeEth} eth、日本円にして {props.stakeFiat} 円しか<a href={`https://etherscan.io/address/${props.donationAddress}`} target="_blank">寄付先のアドレス</a>に寄付することができませんでした。
        トランザクション生成時に支払ったEthの半分、{props.stakeEth} eth がアカウントに戻されました。
      </p>
    </div>
  )
}

const Win = () => {
  return (
    <div className="rps-result win">
      <i className="fas fa-crown"></i>
      <h2>🎊 おめでとうございます 🎊<br />あなたの勝ちです</h2>
      <p>
        嬉しいことに、賭けたイーサリアムの2倍の量、
        合計 {props.stakeEth * 2} eth、日本円にして {props.stakeFiat * 2} 円が<a href={`https://etherscan.io/address/${props.donationAddress}`} target="_blank">寄付先のアドレス</a>に寄付されました。
      </p>
    </div>
  )
}

const Waiting = () => {
  return (
    <div className="rps-result">
      <i className=""></i>
      <h2>トランザクションが承認されるのを待っています。</h2>
      <p>
        トランザクションが承認されるまで、しばらくお待ちください。
      </p>
    </div>
  )
}

export default RpsResult;