import React from 'react';
import Top5Table from './Top5Table';

class Data extends React.Component {
  constructor(props) {
    super(props);
    this.state = { top5WinDonate: [], top5LoseDonate: [], winCount: 0, loseCount: 0, drawCount: 0 }
    this.getTop5WinDonate = this.getTop5WinDonate.bind(this);
  }

  componentDidMount = () => {
    this.getTop5WinDonate();
  }

  componentDidUpdate = () => {
    this.getTop5WinDonate();
  }

  getTop5WinDonate = () => {
    // 同率の場合は新しいtxを優先するということで、無視
    const { contract } = this.props;
    if (!contract) {
      return;
    }
    contract.getPastEvents('RpsResult', { filter: { _result: "1" }, fromBlock: 0, toBlock: 'latest' })
      .then((res) => {
        if (this.state.winCount === res.length) {
          return;
        }

        console.log(res);
        this.setState({ winCount: res.length });

        res.forEach((block) => {
          console.log(block.returnValues._sendAmount);
        });

        let top5Amount = [];
        let top5IndexInRes = [];

        res.forEach((currentValue, currentIndex) => {
          const sendAmount = currentValue.returnValues._sendAmount;
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
        const tmpAmount = top5Amount;
        top5Amount.sort((a, b) => a - b);
        console.log('top5Amount is sorted', top5Amount);

        for (let i = 0; i < 5; i++) {
          const index = tmpAmount.indexOf(top5Amount[i]);
          console.log(index);
          // Not to match duplicate amount, assign 0 in the amount
          tmpAmount[index] = 0;
          const targetIndexInRes = top5IndexInRes[index];
          top5Blocks.push(res[targetIndexInRes]);
        }

        let top5WinDonate = [];
        Promise.all(top5Blocks.map(e => {
          if (e === null || e === undefined) {
            return;
          }
          console.log(e)
          const amount = e.returnValues._sendAmount;
          this.props.web3.eth.getTransaction(e.transactionHash)
            .then((tx) => {
              const address = tx.from;
              top5WinDonate.push({ address, amount });
            })
        }))
          .then(() => this.setState({ top5WinDonate }));

      })
  }

  extractTop5Blocks = () => {

  }

  render() {
    return (
      <div>
        <div>
          <h2>漢気ありすぎ！勝者の寄付額TOP5</h2>
          <Top5Table top5={this.state.top5WinDonate} />
        </div>
        <div>
          <h2>残念これしか寄付できず！敗者の寄付額TOP5</h2>
          <Top5Table top5={this.state.top5WinDonate} />
        </div>
      </div>
    );
  }
}

export default Data;