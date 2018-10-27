import React from 'react';

class Data extends React.Component {
  constructor(props) {
    super(props);
    this.getTotalAmountOfDonation = this.getTotalAmountOfDonation.bind(this);
  }

  componentDidMount = () => {
    //this.getTotalAmountOfDonation();
  }

  componentDidUpdate = () => {
    //this.getTotalAmountOfDonation();
  }

  getTotalAmountOfDonation = async () => {
    console.log('in');
    const { web3 } = this.props;
    const contract = this.props.contract;
    console.log(web3);
    console.log(contract);
    if (contract) {
      console.log('in contract');

      contract.getPastEvents('RpsResult', { filter: { _result: "1" }, fromBlock: 0, toBlock: 'latest' })
        .then((res) => {
          console.log('getPastEvents promise', res);
          //const aaa = res[28];
          //web3.eth.getTransaction(aaa.transactionHash)
          //  .then(console.log)
        })
        .catch(err => console.log(err));
    }
    return false;
  }

  render() {
    return (
      <button onClick={this.getTotalAmountOfDonation}>didMount</button>
    );
  }
}

export default Data;