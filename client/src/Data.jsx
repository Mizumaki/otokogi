import React from 'react';

class Data extends React.Component {
  constructor(props) {
    super(props);
    this.state = { top5WinDonate: [], top5LoseDonate: [], winCount: 0, loseCount: 0, drawCount: 0 }
    //this.getTotalAmountOfDonation = this.getTotalAmountOfDonation.bind(this);
    this.getTop5WinDonate = this.getTop5WinDonate.bind(this);
  }

  componentDidMount = () => {
    this.getTop5WinDonate();
  }

  componentDidUpdate = () => {
  }

  getTop5WinDonate = () => {
    // 同率の場合は新しいtxを優先するということで、無視
    const { contract } = this.props;
    if (!contract) {
      return;
    }
    contract.getPastEvents('RpsResult', { filter: { _result: "2" }, fromBlock: 0, toBlock: 'latest' })
      .then((res) => {
        this.setState({ winCount: res.length });

        res.forEach((block) => {
          console.log(block.returnValues._sendAmount);
        });

        let top5Amount = [];
        let top5IndexInRes = [];
        const reducer = (min, currentValue, currentIndex) => {
          if (top5Amount.length > 4) {
            const sendAmount = currentValue.returnValues._sendAmount;
            if (sendAmount > min) {
              const minIndex = top5Amount.indexOf(min);
              top5Amount[minIndex] = sendAmount;
              top5IndexInRes[minIndex] = currentIndex;

              const newMinAmount = Math.min(...top5Amount);

              return newMinAmount;
            }
          }
          return min;
        };
        res.reduce(reducer);

        let top5Blocks = [];
        const tmpAmount = top5Amount;
        top5Amount.sort((a, b) => a - b);

        for (let i; i++; i < 5) {
          const index = tmpAmount.indexOf(top5Amount[i]);
          const targetIndexInRes = top5IndexInRes[index];
          top5Blocks.push(res[targetIndexInRes]);
        }
        this.setState({ top5WinDonate: top5Blocks });
      })
  }

  //getTotalAmountOfDonation = async () => {
  //  console.log('in');
  //  const { web3 } = this.props;
  //  const contract = this.props.contract;
  //  console.log(web3);
  //  console.log(contract);
  //  if (contract) {
  //    console.log('in contract');
//
  //    contract.getPastEvents('RpsResult', { filter: { _result: "1" }, fromBlock: 0, toBlock: 'latest' })
  //      .then((res) => {
  //        console.log('getPastEvents promise', res);
  //        const aaa = res[0];
  //        web3.eth.getTransaction(aaa.transactionHash)
  //          .then(console.log)
  //      })
  //      .catch(err => console.log(err));
  //  }
  //  return false;
  //}

  render() {
    const row = (i, amount, address) => (
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{amount}</td>
        <td><a href={`https://etherscan.io/address/${address}`} target="_blank">{address}</a></td>
      </tr>
    );

    const rows = () => {
      this.state.top5WinDonate.map((e, i) => {
        const { web3 } = this.props;
        const amount = e.returnValues._sendAmount;
        web3.eth.getTransaction(e.transactionHash)
          .then((tx) => {
            const address = tx.from;
            return row(i, amount, address);
          });
      });
    }

    return (
      <div>
        <div>
          <button onClick={this.getTotalAmountOfDonation}>didMount</button>
          <h2>漢気ありすぎ！勝者の寄付額TOP5</h2>
          <table>
            <tr>
              <th>順位</th>
              <th>寄付金額</th>
              <th>寄付した人のアドレス</th>
            </tr>
            {rows}
          </table>
        </div>
      </div>
    );
  }
}

export default Data;