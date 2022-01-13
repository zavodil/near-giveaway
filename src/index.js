// src/index.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import getConfig from "./config.js";
import * as nearAPI from "near-api-js";
import { BrowserRouter } from "react-router-dom";

// Initializing contract
async function initContract() {
  const nearConfig = getConfig(process.env.NODE_ENV || "testnet");

  // Initializing connection to the NEAR TestNet
  const near = await nearAPI.connect({
    deps: {
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
    },
    ...nearConfig,
  });

  // Needed to access wallet
  const walletConnection = new nearAPI.WalletConnection(near);

  // Load in account data
  let currentUser;
  if (walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount,
    };
  }

  // Initializing our contract APIs by contract name and configuration
  const contract = await new nearAPI.Contract(
    walletConnection.account(),
    nearConfig.contractName,
    {
      viewMethods: [
        "get_event",
        "get_events",
        "get_events_to_finalize",
        "get_payouts",
      ],
      changeMethods: ["add_event", "insert_participants", "finalize_event"],
      sender: walletConnection.getAccountId(),
    }
  );

  return { contract, currentUser, nearConfig, walletConnection };
}

window.nearInitPromise = initContract().then(
  ({ contract, currentUser, nearConfig, walletConnection }) => {
    ReactDOM.render(
      <BrowserRouter>
        <App
          contract={contract}
          currentUser={currentUser}
          nearConfig={nearConfig}
          wallet={walletConnection}
        />
      </BrowserRouter>,
      document.getElementById("root")
    );
  }
);
