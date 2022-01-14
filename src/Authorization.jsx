import { Fragment, useState, useEffect } from "react";
import { useTimeoutFn } from "react-use";
import { Transition } from "@headlessui/react";
import { Link } from "react-router-dom";

const Authorization = ({
  contract,
  currentUser,
  nearConfig,
  wallet,
  isLoading,
}) => {
  const signIn = () => {
    wallet.requestSignIn(nearConfig.contractName, "NEAR Giveway");
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  let [isShowing, setIsShowing] = useState(true);
  let [, , resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 500);

  useEffect(() => {
    resetIsShowing();
  }, [resetIsShowing]);

  return (
    <>
      <Transition
        as={Fragment}
        show={isShowing}
        enter="transform transition duration-[500ms]"
        enterFrom="opacity-0 rotate-[-120deg] scale-50"
        enterTo="opacity-100 rotate-0 scale-100"
        leave="transform duration-200 transition ease-in-out"
        leaveFrom="opacity-100 rotate-0 scale-100 "
        leaveTo="opacity-0 scale-95 "
      >
        <div className="flex justify-between bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mt-6 p-2 mx-auto rounded-xl shadow-md items-center">
          <Link to="/">
            <img
              className="h-14 w-20"
              src="https://docs.near.org/img/near_logo.svg"
              alt="NEAR Logo"
            />
          </Link>
          <div
            className={`text-xl font-medium text-black uppercase flex ml-4 items-center`}
          >
            NEAR Giveaway
            {isLoading && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`animate-spin ml-4 h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}
          </div>
          <div className="flex justify-between">
            {currentUser ? (
              <button
                className="bg-gradient-to-r from-indigo-400 to-indigo-500 hover:from-indigo-700 hover:to-indigo-900 text-black hover:text-white py-2 px-4 rounded float-right"
                onClick={signOut}
              >
                Logout
              </button>
            ) : (
              <button
                className="bg-gradient-to-r from-indigo-400 to-indigo-500 hover:from-indigo-700 hover:to-indigo-900 text-black hover:text-white py-2 px-4 rounded float-right"
                onClick={signIn}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </Transition>
    </>
  );
};

export default Authorization;
