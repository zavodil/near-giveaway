import "regenerator-runtime/runtime";
import React, { useState } from "react";
import PropTypes from "prop-types";
import Authorization from "./Authorization";
import LoadingIndicator from "./LoadingIndicator";
import ErrorPopup from "./ErrorPopup";
import Events from "./Events";
import { Routes, Route } from "react-router-dom";
import EventDetails from "./EventDetails";

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="container mx-auto">
      <Authorization
        contract={contract}
        currentUser={currentUser}
        nearConfig={nearConfig}
        wallet={wallet}
        onLoading={setIsLoading}
      />
      <ErrorPopup error={error} callback={() => setError("")} />
      <LoadingIndicator isLoading={isLoading} />
      {currentUser && currentUser.accountId && (
        <Routes>
          <Route
            path="/"
            element={
              <Events
                contract={contract}
                currentUser={currentUser}
                nearConfig={nearConfig}
                wallet={wallet}
                onLoading={setIsLoading}
                onError={setError}
              />
            }
          />
          <Route
            path="events/:eventId"
            element={
              <EventDetails
                contract={contract}
                currentUser={currentUser}
                nearConfig={nearConfig}
                wallet={wallet}
                onLoading={setIsLoading}
                onError={setError}
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

App.propTypes = {
  contract: PropTypes.shape({
    get_events_to_finalize: PropTypes.func.isRequired,
    get_events: PropTypes.func.isRequired,
    get_event: PropTypes.func.isRequired,
    get_payouts: PropTypes.func.isRequired,
    add_event: PropTypes.func.isRequired,
    insert_participants: PropTypes.func.isRequired,
    finalize_event: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
  }),
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired,
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
  }).isRequired,
};

export default App;
