import React from 'react';

const Top5Table = (props) => {
  const Row = (rowProps) => (
    <tr>
      <td>{rowProps.i + 1}</td>
      <td>{rowProps.amount}</td>
      <td><a href={`https://etherscan.io/address/${rowProps.address}`} target="_blank">{rowProps.address}</a></td>
    </tr>
  );

  const rows = props.top5.map((e, i) =>
    <Row key={i} i={i} amount={e.amount} address={e.address} />
  );

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