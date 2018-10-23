import React from 'react';

const Explanation = (props) => {

  const promptToConnectWeb3 = (
    <div className="popup warning">
      <p>このゲームをプレイするには、MetaMaskなどのweb3と通信できるアプリケーションと連携を行う必要があります。</p>
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
      <i class="fas fa-crown"></i>
      <h2>🎊 おめでとうございます 🎊<br />あなたの勝ちです</h2>
      <p>
        嬉しいことに、賭けたイーサリアムの2倍の量、
        合計 {props.stakeEth * 2 /* web3からガチのトランザクション情報より確認したいところ */} eth、日本円にして *** 円がアドレス *** に寄付されました。
        トランザクション生成に、*** Gasを消費しました。
      </p>
    </div>
  );

  const lose = (
    <div className="rps-result lose">
      <i class="fas fa-tired"></i>
      <h2>😢 残念でした 😭<br />あなたの負けです</h2>
      <p>
        残念なことに、賭けたイーサリアムと同じ量、
        合計 *** eth、日本円にして *** 円しかアドレス *** に寄付することができませんでした。
        トランザクション生成に、*** Gasを消費しました。
      </p>
    </div>
  );

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