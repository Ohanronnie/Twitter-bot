import { TwitterApi } from "twitter-api-v2";
import axios from "axios";
import cron from "node-cron";
import express from "express";

const app = express();
class Credentials {
  static API_KEY = "kxDM1E5ctQoVK2FaS9u6m8i2h";
  static API_SECRET = "Oa0P0T1fOOJxJDJNy0lrcQS6OR10voO12pPAko9fRPN2EHO9An";
  static ACCESS_TOKEN = "1748365187617296384-9hwL73aRUG32y0oLWik1VMF0lVzpxV";
  static ACCESS_TOKEN_SECRET = "8Dtgf10JGsxMZiETZeBTNZ2KDnVxD2MFUMiFZ0MFWMnfu";
  static BEARER_TOKEN =
    "AAAAAAAAAAAAAAAAAAAAALhttAEAAAAA%2F2Utq64u4PPA8iSX%2B4%2FxnjB%2BPzg%3DAVb4GHPp6DVEHCBMAaAeFMLnKJrks1DJPUSZCIn3iYC1lP1KFE";
  static RATES = {
    URL: "https://rest.coinapi.io/v1/exchangerate",
    API_KEY: "1942736E-D354-42A6-9D95-0E49D3283F54",
    COINS: ["BTC", "ETH", "BNB"],
    CURRENCY: ["USD", "GBP", "EUR", "CAD"],
  };
}
const client = new TwitterApi({
  appKey: Credentials.API_KEY,
  appSecret: Credentials.API_SECRET,
  accessToken: Credentials.ACCESS_TOKEN,
  accessSecret: Credentials.ACCESS_TOKEN_SECRET,
});

/*const test = await client.v2.tweet(
  "Testing"
)
*/
async function TweetRate() {
  const currency_rates = {};
  const crypto_rates = {};
  for (let i = 0; i < Credentials.RATES.CURRENCY.length; i++) {
    const value = Credentials.RATES.CURRENCY[i];
    const response = await axios.get(`${Credentials.RATES.URL}/${value}/NGN`, {
      params: {
        apiKey: Credentials.RATES.API_KEY,
      },
    });
    currency_rates[value] = response.data.rate.toFixed(2);
  }
  for (let i = 0; i < Credentials.RATES.COINS.length; i++) {
    const value = Credentials.RATES.COINS[i];
    const response = await axios.get(`${Credentials.RATES.URL}/${value}/USD`, {
      params: {
        apiKey: Credentials.RATES.API_KEY,
      },
    });
    crypto_rates[value] = response.data.rate.toFixed(2);
  }
  const postString = `${new Date()
    .toLocaleTimeString("en-NG", {
      year: "numeric",
      weekday: "long",
      day: "numeric",
      month: "long",
      time: "numeric",
    })
    .replace("at", "•")}\n\n$1 USD → ₦${currency_rates["USD"]} \n£1 GBP → ₦${
    currency_rates["GBP"]
  }\n€1 EUR → ₦${currency_rates["EUR"]}\n£1 CAD → ₦${currency_rates["CAD"]}
  `;
  const coinString = `${new Date()
    .toLocaleTimeString("en-NG", {
      year: "numeric",
      weekday: "long",
      day: "numeric",
      month: "long",
      time: "numeric",
    })
    .replace("at", "•")}\n\n1 BTC → $${crypto_rates["BTC"]} \n1 ETH → $${
    crypto_rates["ETH"]
  }\n1 BNB → $${crypto_rates["BNB"]}
  `;
  const currencyPosted = await client.v2.tweet(postString);
  const coinPosted = await client.v2.tweet(coinString);

  console.log(currencyPosted, coinPosted);
}
app.get("/cron", TweetRate);
app.get("/", () => console.log(Date.now()));
app.listen(process.env.PORT || 3000, () => "app is running already");
export default app;
