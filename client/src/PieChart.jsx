import React from 'react';
import C3Chart from 'react-c3js';

const PieChart = (props) => {
  const { winCount, loseCount, drawCount } = props;
  const data = {
    columns: [
      ['あいこ', drawCount],
      ['勝ち', winCount],
      ['負け', loseCount],
    ],
    type: 'pie'
  }
  if (winCount === 0 && loseCount === 0 && drawCount === 0) {
    return null;
  } else {
    return (
      <div className="chart">
        <h2>じゃんけんの結果の比率</h2>
        <p className="all-count">全じゃんけん回数：{winCount + loseCount + drawCount}回</p>
        <div className="counts">
          <p>勝ち：{winCount}件</p>
          <p>負け：{loseCount}件</p>
          <p>あいこ：{drawCount}件</p>
        </div>
        <C3Chart data={data} />
      </div>
    );
  }
}

export default PieChart;