import { Fragment, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { useTimeoutFn } from "react-use";

const AddEventCard = ({ onAddEvent }) => {
  let [isShowing, setIsShowing] = useState(false);
  let [isHovered, setIsHovered] = useState(false);

  let [, , resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 100);

  useEffect(() => {
    resetIsShowing();
  }, [resetIsShowing]);
  return (
    <Transition
      as={Fragment}
      show={isShowing}
      enter={`transform transition duration-[200ms]`}
      enterFrom="opacity-0 rotate-[-120deg] scale-50"
      enterTo="opacity-100 rotate-0 scale-100"
      leave="transform duration-200 transition ease-in-out"
      leaveFrom="opacity-100 rotate-0 scale-100 "
      leaveTo="opacity-0 scale-95 "
    >
      <button
        onClick={onAddEvent}
        className={`w-full bg-gradient-to-r ${
          isHovered
            ? "from-green-300 to-blue-500"
            : "from-green-100 to-blue-300"
        } p-6 mx-auto max-w-sm rounded-xl shadow-md cursor-pointer`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </Transition>
  );
};

export default AddEventCard;
