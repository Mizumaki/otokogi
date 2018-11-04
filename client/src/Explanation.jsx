import React from 'react';

const Explanation = (props) => {

  const promptToConnectWeb3 = (
    <div className="popup warning">
      <p>このゲームをプレイするには、MetaMaskなどのweb3と通信できるアプリケーションと連携を行う必要があります。（MetaMask上でのログインが必要になる場合があります。）</p>
      {props.connectingWeb3 ? (<button onClick={props.connectWeb3} disabled>MetaMask(またはその他のweb3)と連携を試みています</button>) : (<button onClick={props.connectWeb3}>MetaMask(またはその他のweb3)と連携する</button>)}
    </div>);

  const decideEth = (
    <div className="exp step1">
      <p>まず賭けるイーサリアムの量を指定してください。0.01 ethより賭けることが可能です。</p>
      <p>賭ける際の注意点として、最大2倍の支払いが予想されることがあります。お気をつけください。</p>
      <p>また、この段階ではトランザクションは発生しません。</p>
    </div>
  );

  const notEnoughEth = (
    <div className="popup alert">
      <p>どうやらゲームに参加するのに必要なイーサリアムの量が足りていないようです。必要なイーサリアムの量は、「賭けイーサの2倍 + Gasコスト」です。</p>
      <p>今一度、残高を確認して賭けEthを入力してください。</p>
    </div>
  );

  const chooseHand = (
    <div className="exp step2">
      <p>
        じゃんけんの手を選んでください。<br />
        現在の賭けイーサ： {props.stakeEth} eth
      </p>
      <p>手を決定したタイミングでトランザクションが発生します。</p>
    </div>
  );

  const draw = (
    <div className="exp step2">
      <p>
        あいこです。もう一度手を選んでください。<br />
        現在の賭けイーサ： {props.stakeEth} eth
      </p>
      <p>手を決定したタイミングでトランザクションが発生します。</p>
    </div>
  );

  const win = (
    <div className="rps-result win">
      <i className="fas fa-crown"></i>
      <h2>🎊 おめでとうございます 🎊<br />あなたの勝ちです</h2>
      <p>
        嬉しいことに、賭けたイーサリアムの2倍の量、
        合計 {props.stakeEth * 2} eth、日本円にして {props.stakeFiat * 2} 円が<a href={`https://etherscan.io/address/${props.donationAddress}`} target="_blank">寄付先のアドレス</a>に寄付されました。
      </p>
    </div>
  );

  const lose = (
    <div className="rps-result lose">
      <i className="fas fa-tired"></i>
      <h2>😢 残念でした 😭<br />あなたの負けです</h2>
      <p>
        残念なことに、賭けたイーサリアムと同じ量、
        合計 {props.stakeEth} eth、日本円にして {props.stakeFiat} 円しか<a href={`https://etherscan.io/address/${props.donationAddress}`} target="_blank">寄付先のアドレス</a>に寄付することができませんでした。
        トランザクション生成時に支払ったEthの半分、{props.stakeEth} eth がアカウントに戻されました。
      </p>
    </div>
  );

  const unknownError = (
    <div className="popup warning">
      <p>エラーが起きました。以下がトランザクションの情報です。</p>
      <div className="json">
        <pre>
          {props.error ? JSON.stringify(props.error, null, 2) : null}
        </pre>
      </div>
    </div>
  );

  if (props.unknownError) {
    return unknownError;
  }

  if (props.win || props.lose) {
    const result = props.win ? win : lose;
    const onClick = () => {
      props.changePhase("decideEth");
      return false;
    }
    return (
      <div>
        {result}
        <a className="link" onClick={onClick}>トップへ戻る</a>
      </div>
    );
  }

  return (
    <div>
      {props.web3 ? null : promptToConnectWeb3}
      {props.notEnoughEth ? notEnoughEth : null}
      {props.decideEth ? decideEth : null}
      {props.chooseHand || props.draw ? (props.chooseHand ? chooseHand : draw) : null}
    </div>
  );
}


export default Explanation;