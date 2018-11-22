import React from 'react';

class RpsResult extends React.Component {
  constructor(props) {
    super(props);
    this.handleSolEvent = this.handleSolEvent.bind(this);
  }

  componentDidMount = () => {
    this.handleSolEvent();
  }
  
  handleSolEvent = async () => {
    if (this.props.contract && this.props.accounts) {
      console.log('in wait sol event😍')
      // Addressを現在のアカウントのものに絞り込む必要性あり
      await this.props.contract.RpsResult({ filter: { _address: this.props.accounts[0] }, fromBlock: 'latest', toBlock: 'latest' }, (error, result) => {
        if (!error) {
          alert('event occured');
          console.log('event is occured !!!!😍😍😍😍');
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
              this.props.changePhase('lose');
              break;
            case '2':
              this.props.changePhase('win');
              break;
            default:
              break;
          }
        } else {
          this.props.changePhase('unknownError', error);
        }
      });
    }
  }

  render() {
    return null;
  }
}

export default RpsResult;