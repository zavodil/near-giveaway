import { Fragment, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { useTimeoutFn } from "react-use";
import { toDate, formatDate } from "./utils";
import * as nearAPI from 'near-api-js'

const EventCard = ({
  currentEvent,
  index,
  delay,
  contract,
  currentUser,
  nearConfig,
  wallet,
  onLoading,
  onEventSelected,
}) => {
  let [isShowing, setIsShowing] = useState(false);
  let [isHovered, setIsHovered] = useState(false);
  const [event, setEvent] = useState(currentEvent);

  const eventDate = toDate(event.event_timestamp);
  const finalizedDate =
    event.finalized_timestamp && event.finalized_timestamp !== "0"
      ? toDate(event.finalized_timestamp)
      : undefined;
  const addParticipantsStartDate = toDate(
    event.add_participants_start_timestamp
  );
  const addParticipantsEndDate = toDate(event.add_participants_end_timestamp);

  useEffect(() => {
    if (onLoading) {
      onLoading(true);
      contract.get_event({ event_id: event.event_id }).then(
        (event) => {
          onLoading(false);
          setEvent(event);
        },
        (err) => {
          onLoading(false);
        }
      );
    }
  }, [contract, event.event_id, onLoading]);

  let [, , resetIsShowing] = useTimeoutFn(
    () => setIsShowing(true),
    index * 200
  );

  useEffect(() => {
    resetIsShowing();
  }, [resetIsShowing]);

  return (
    <Transition
      as={Fragment}
      show={isShowing}
      enter={`transform transition duration-[${delay}ms]`}
      enterFrom="opacity-0 rotate-[-120deg] scale-50"
      enterTo="opacity-100 rotate-0 scale-100"
      leave="transform duration-200 transition ease-in-out"
      leaveFrom="opacity-100 rotate-0 scale-100 "
      leaveTo="opacity-0 scale-95 "
    >
      <div
        onClick={() => onEventSelected(event)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-full bg-gradient-to-r ${
          isHovered
            ? "from-yellow-500 to-red-600"
            : "from-yellow-400 to-red-500"
        }  p-6 max-w-sm mx-auto rounded-xl flex-col shadow-md flex space-y-2 cursor-pointer`}
      >
        <div className="text-xl font-medium text-black text-center">
          {event.title}
        </div>
        <div className="text-xl font-medium text-black break-all flex flex-row justify-start">
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
          {event.description}
        </div>
        <div className="text-md font-medium text-black text flex flex-row justify-start">
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="mr-2">
            Created: <br /> {formatDate(eventDate)}
          </div>
          {finalizedDate && (
            <div>
              Finalized: <br /> {formatDate(finalizedDate)}
            </div>
          )}
        </div>
        <div className="text-md font-medium text-black text flex flex-row justify-start">
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="flex-wrap">
            Accept participants: <br /> {formatDate(addParticipantsStartDate)} -{" "}
            {formatDate(addParticipantsEndDate)}
          </p>
        </div>
        <div className="text-md font-medium text-black text flex flex-row justify-start">
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>Rewards:</p>
          {event.rewards &&
            event.rewards.map((r, i) => (
              <div
                className="pr-2 pl-2 ml-2 bg-gradient-to-r from-green-300 to-green-500 rounded-lg"
                key={i}
              >{`${nearAPI.utils.format.formatNearAmount(r, 2)}`}</div>
            ))}
        </div>
        <div className="text-md font-medium text-black text flex flex-row justify-start">
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          {!event.participants ||
            (event.participants &&
              event.participants.length === 0 &&
              "No participants yet, only owner can add new participants.")}
          {event.participants &&
            event.participants.length > 0 &&
            `${event.participants.length} total participants.`}
        </div>
      </div>
    </Transition>
  );
};

export default EventCard;
