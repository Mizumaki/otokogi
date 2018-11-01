import React from 'react';

const Row = (props) => (
  <tr>
    <td>{props.i + 1}</td>
    <td>{props.amount}</td>
    <td className="address"><a href={`https://etherscan.io/address/${props.address}`} target="_blank">{props.address}</a></td>
  </tr>
);

const Top5Table = (props) => {
  const rows = props.top5 ? props.top5.map((e, i) =>
    <Row key={i} i={i} amount={e.amount} address={e.address} />
  ) : null;

  return (
    <table>
      <tbody>
        <tr>
          <th>順位</th>
          <th>寄付金額</th>
          <th>寄付した人のアドレス</th>
        </tr>
        {rows}
      </tbody>
    </table>
  );
}

export default Top5Table;