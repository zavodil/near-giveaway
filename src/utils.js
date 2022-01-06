import moment from "moment";
import Big from "big.js";

export const formatDate = (date) => {
  return date.format("DD MMM yyyy HH:MM");
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

export const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space];
