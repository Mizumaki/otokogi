import "whatwg-fetch";

// if some Error, this returns 22000 yen
const getEthPrice = () => {
  return new Promise((resolve) => {
    fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=JPY&extraParams=crypto-otokogi")
      .then(res => {
        return res.json()
      })
      .then((data) => resolve(data.JPY))
      .catch(() => resolve(22000.00));
  })
}

export default getEthPrice;