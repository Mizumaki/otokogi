const RockPaperScissors = artifacts.require("./RockPaperScissors.sol");

contract("RockPaperScissors", accounts => {
  it("random should random", async () => {
    const rps = await RockPaperScissors.deployed();

    let [count0, count1, count2] = [0, 0, 0];

    const sleep = (duration) => {
      const dt1 = new Date().getTime();
      let dt2 = new Date().getTime();
      while (dt2 < dt1 + duration) {
        dt2 = new Date().getTime();
      }
      return;
    }
    const arr = [...Array(1000).keys()];

    await Promise.all(arr.map(async (x) => {
      const num = await rps.random(Math.floor(Math.random() * 10000));
      switch (num.toString()) {
        case '0':
          count0++;
          break;
        case '1':
          count1++;
          break;
        case '2':
          count2++;
          break;
        default:
          break;
      }
    })).then(() => {
      assert.equal(false, true, `count0: ${count0}, count1: ${count1}, count2: ${count2}`);
    })
  });

  /*
  it("should set and get donationAddress correctly", async () => {
    const rps = await RockPaperScissors.deployed();

    await rps.setDonationAddress('0x16486f0ed7a923bd5b70a4e666a6bfbdb822deaf', {
      from: accounts[0]
    });

    // Get stored value
    const storedData = await rps.checkDonationAddress();

    assert.equal(storedData, '0x16486f0ed7a923bd5b70a4e666a6bfbdb822deaf', `The address is ${storedData} and this is incorrect.`);
  });

  it("should rps algorithm is correct", async () => {
    let win = 0;
    let lose = 0;
    let draw = 0;
    let error = 0;

    function checkJanken(a, b) {
      var c = (a - b + 3) % 3;
      if (c === 0) {
        draw++;
      } else if (c === 2) {
        win++;
      } else if (c === 1) {
        lose++;
      } else {
        error++;
      }
    }

    let wins = [];
    let loses = [];
    let draws = [];

    for (let x = 0; x < 100; x++) {
      for (let i = 1; i < 100; i++) {
        const hand = Math.floor(Math.random() * 10 % 3);
        const hand2 = Math.floor(Math.random() * 10 % 3);
        checkJanken(hand, hand2);
      }
      wins.push(win);
      loses.push(lose);
      draws.push(draw);
      [win, lose, draw] = [0, 0, 0];
    }

    win = wins.reduce((prev, curr) => prev + curr) / 100;
    lose = loses.reduce((prev, curr) => prev + curr) / 100;
    draw = draws.reduce((prev, curr) => prev + curr) / 100;

    let res = false;

    if (win, lose, draw < 34 && win, lose, draw > 32) {
      res = true;
    }

    if (error !== 0) {
      res = false;
    }

    assert.equal(res, true, `win: ${win}, lose: ${lose}, draw: ${draw}, error: ${error}`);
  });

  it("should probability of rps is all equal", async () => {
    const rps = await RockPaperScissors.deployed();
    
    let win = 0;
    let lose = 0;
    let draw = 0;
    let error = 0;
    
    let wins = [];
    let loses = [];
    let draws = [];
    
    rps.RpsResult({
      fromBlock: 'latest',
      toBlock: 'latest'
    }, (error, result) => {
      if (!error) {
        const rpsResult = result.args._result.toString(10);
        switch (rpsResult) {
          case '0':
            draw++;
            break;
          case '1':
            lose++;
            break;
            case '2':
            win++;
            break;
            default:
            error++;
            break;
        }
      }
    });
    
    const arr = [...Array(100).keys()];
    const time = 5;
    const arr2 = [...Array(time).keys()];
    
    const rps100time = () => {
      return new Promise(resolve => {
        Promise.all(arr.map(x => {
          const hand = Math.floor(Math.random() * 10 % 3);
          return rps.rockPaperScissors(hand, {
            from: accounts[0]
          });
        })).then(() => {
          wins.push(win);
          loses.push(lose);
          draws.push(draw);
          [win, lose, draw] = [0, 0, 0];
          resolve();
        })
      });
    }

    await Promise.all(arr2.map(x => {
      return rps100time();
    }))
    .then(() => {
      winAv = wins.reduce((prev, curr) => prev + curr) / time;
      loseAv = loses.reduce((prev, curr) => prev + curr) / time;
      drawAv = draws.reduce((prev, curr) => prev + curr) / time;
      
      let res = false;
      
      if (winAv, loseAv, drawAv < 34 && winAv, loseAv, drawAv > 32) {
          //res = true;
        }
        
        if (error !== 0) {
          res = false;
        }
        
        assert.equal(res, true, `win: ${winAv}, lose: ${loseAv}, draw: ${drawAv}, error: ${error}`);
      });
    });
    
    */
});