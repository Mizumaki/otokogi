import React from 'react';
import AllData from './AllData';
import MyData from './MyData';

class Data extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tab: 'myData' };
  }

  render() {
    const checkedTabStyle = { background: 'hsl(212, 70%, 18%)', cursor: 'default' }
    let elements;
    let tags;
    const onClick = () => {
      if (this.state.tab === 'allData') {
        this.setState({ tab: 'myData' });
      } else {
        this.setState({ tab: 'allData' });
      }
    }
    switch (this.state.tab) {
      case 'allData':
        elements = <AllData {...this.props} />;
        tags = (
          <div className="data-tabs">
            <div className="data-tab" style={checkedTabStyle}>全寄付データ</div>
            <div className="data-tab" onClick={onClick}>自分の寄付データ</div>
          </div>
        );
        break;
      case 'myData':
        elements = <MyData {...this.props} />;
        tags = (
          <div className="data-tabs">
            <div className="data-tab" onClick={onClick}>全寄付データ</div>
            <div className="data-tab" style={checkedTabStyle}>自分の寄付データ</div>
          </div>
        );
        break;
      default:
        return null;
    }

    return (
      <div className="data-wrap">
        {tags}
        {elements}
      </div>
    )
  }
}

export default Data;