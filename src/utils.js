import moment from "moment";
import Big from "big.js";
import * as nearAPI from "near-api-js";
import getConfig from "./config";

export const formatDate = (date) => {
  return date ? date.format("DD MMM yyyy HH:mm") : "";
};

export const toDate = (date) => {
  const timestamp = Math.floor(date / 1000000).toFixed();
  return moment(timestamp, "x");
};

export const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

const KeyCodes = {
  comma: 188,
  enter: 13,
  space: 32,
};

export const accountExist = async (accountId) => {
  const connection = getNearAccountConnection();
  if (accountId.length === 44) {
    let key = new nearAPI.utils.PublicKey({
      keyType: nearAPI.utils.key_pair.KeyType.ED25519,
      data: Buffer.from(accountId, "hex"),
    });
    return !!key.toString();
  }

  try {
    await new nearAPI.Account(connection, accountId).state();
    return true;
  } catch (error) {
    return false;
  }
};

function getNearAccountConnection() {
  if (!window.connection) {
    const config = getConfig(process.env.NODE_ENV || "testnet");
    console.log(config);
    const provider = new nearAPI.providers.JsonRpcProvider(config.nodeUrl);
    window.connection = new nearAPI.Connection(config.nodeUrl, provider, {});
  }
  return window.connection;
}

export const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space];
