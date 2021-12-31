import { Fragment, useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { useTimeoutFn } from "react-use";
import { toDate, formatDate } from "./utils";

const EventDetails = ({
  currentEvent,
  contract,
  currentUser,
  nearConfig,
  wallet,
  onClose,
  onLoading,
  onError,
}) => {
  const [isShowing, setIsShowing] = useState(false);
  const [closeButtonColor, setCloseButtonColor] = useState("#000");
  const [event, setEvent] = useState(currentEvent);

  let [, , resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 100);
  useEffect(() => {
    resetIsShowing();
  }, [resetIsShowing]);

  const isOwner =
    event.owner_account_id &&
    currentUser &&
    event.owner_account_id === currentUser.accountId;

  const eventDate = toDate(event.event);
  const finalizedDate =
    event.finalized && event.finalized !== "0"
      ? toDate(event.finalized)
      : undefined;
  const addParticipantsStartDate = toDate(event.add_participants_start);
  const addParticipantsEndDate = toDate(event.add_participants_end);

  const finalizeEvent = () => {};

  return (
    <Transition
      as={Fragment}
      show={isShowing}
      enter={`transform transition duration-[250ms]`}
      enterFrom="opacity-0 rotate-[-120deg] scale-50"
      enterTo="opacity-100 rotate-0 scale-100"
      leave="transform duration-200 transition ease-in-out"
      leaveFrom="opacity-100 rotate-0 scale-100 "
      leaveTo="opacity-0 scale-95 "
    >
      <div className="mw-800 bg-gradient-to-r from-indigo-300 to-indigo-500 p-6 rounded-xl flex-col shadow-md flex">
        <div className="text-2xl flex justify-between font-medium items-center mb-4">
          <div className="mt-2 text-2xl text-center font-medium text-black">
            {event.title}
          </div>
          <button
            className="font-medium "
            onClick={onClose}
            onMouseEnter={() => setCloseButtonColor("#ddd")}
            onMouseLeave={() => setCloseButtonColor("#000")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke={closeButtonColor}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="text-xl font-medium text-black flex flex-row items-center justify-between">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-1 flex-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="flex-grow">{event.description}</p>
          {isOwner && (
            <button
              className="disabled:opacity-50 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex-none"
              onClick={finalizeEvent}
            >
              Finalize Event
            </button>
          )}
        </div>
        <div className="text-md font-medium text-black text flex flex-row items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>Draw date: {formatDate(eventDate)}</p>
          {finalizedDate && <p>Finalized date: {formatDate(finalizedDate)}</p>}
        </div>
        <div className="text-md font-medium text-black text flex flex-row items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Accepting participants: {formatDate(addParticipantsStartDate)} -{" "}
          {formatDate(addParticipantsEndDate)}
        </div>
        <div className="text-xl font-medium text-black text-center">
          {event.participants.length > 0
            ? "Participants:"
            : "No participants yet, add participants before the end date."}
        </div>
        <div className="text-sm font-medium text-black text flex flex-row items-center">
          {event && event.participants && event.participants.length > 0 && (
            <div>
              Participants:
              {event.participants.map((p, index) => {
                return <Participant key={index} participant={p} />;
              })}
            </div>
          )}
        </div>
      </div>
    </Transition>
  );
};

const Participant = ({ candidate: participant }) => {
  return <div className="flex">{participant}</div>;
};

export default EventDetails;
