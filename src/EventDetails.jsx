import { Fragment, useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { useTimeoutFn } from "react-use";
import { toDate, formatDate } from "./utils";
import { WithContext as ReactTags } from "react-tag-input";
import { delimiters } from "./utils";
import { BOATLOAD_OF_GAS } from "./utils";
import moment from "moment";

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
  const [shouldReloadEvent, setShouldReloadEvent] = useState(false);
  const [newParticipants, setNewParticipants] = useState([]);

  let [, , resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 100);
  useEffect(() => {
    resetIsShowing();
  }, [resetIsShowing]);

  const isOwner =
    event.owner_account_id &&
    currentUser &&
    event.owner_account_id === currentUser.accountId;

  const eventDate = toDate(event.event_timestamp);
  const finalizedDate =
    event.finalized_timestamp && event.finalized_timestamp !== "0"
      ? toDate(event.finalized_timestamp)
      : undefined;
  const addParticipantsStartDate = toDate(
    event.add_participants_start_timestamp
  );
  const addParticipantsEndDate = toDate(event.add_participants_end_timestamp);

  const finalizeEvent = () => {
    if (!finalizedDate && eventDate.isBefore(moment())) {
      onLoading(true);
      contract
        .finalize_event(
          {
            event_id: event.id,
          },
          BOATLOAD_OF_GAS
        )
        .then(
          () => {
            setShouldReloadEvent(true);
            onLoading(false);
          },
          (err) => {
            onLoading(false);
            onError(`${err && err.kind ? err.kind["ExecutionError"] : err}`);
          }
        );
    }
  };

  const saveNewParticipants = () => {
    if (newParticipants.length > 0) {
      onLoading(true);
      contract
        .insert_participants(
          {
            event_id: event.event_id,
            participants: newParticipants.map((p) => p.id),
          },
          BOATLOAD_OF_GAS
        )
        .then(
          () => {
            setShouldReloadEvent(true);
            onLoading(false);
          },
          (err) => {
            onLoading(false);
            onError(`${err && err.kind ? err.kind["ExecutionError"] : err}`);
          }
        );
    }
  };

  const handleDeleteParticipant = (i) => {
    setNewParticipants(newParticipants.filter((p, index) => index !== i));
  };

  const handleAddParticipant = (p) => {
    //TODO Add address validation
    setNewParticipants([...newParticipants, p]);
  };

  const handleDragParticipant = (tag, currPos, newPos) => {
    const newTags = newParticipants.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setNewParticipants(newTags);
  };

  useEffect(() => {
    if (shouldReloadEvent && onLoading && onError) {
      const eventId = event.id;
      contract
        .get_event(
          {
            event_id: eventId,
          },
          BOATLOAD_OF_GAS
        )
        .then(
          (event) => {
            setEvent({ ...event, id: eventId });
            setShouldReloadEvent(false);
            onLoading(false);
          },
          (err) => {
            setShouldReloadEvent(false);
            onLoading(false);
            onError(`${err && err.kind ? err.kind["ExecutionError"] : err}`);
          }
        );
    }
  }, [contract, event.id, shouldReloadEvent, onLoading, onError]);

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
          <button
            className="disabled:opacity-50 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex-none"
            onClick={finalizeEvent}
          >
            Finalize Event
          </button>
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
          <p className="flex-grow">Draw date: {formatDate(eventDate)}</p>
          {finalizedDate && <p>Finalized date: {formatDate(finalizedDate)}</p>}
        </div>
        <div className="text-md font-medium text-black text flex flex-row items-center mt-2">
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
        <div className="text-md font-medium text-black text flex flex-row items-center mt-2">
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Rewards:
          {event.rewards &&
            event.rewards.map((r, i) => (
              <div
                className="pr-2 pl-2 ml-2 bg-gradient-to-r from-green-300 to-green-500 rounded-lg"
                key={i}
              >
                {r}
              </div>
            ))}
        </div>
        <div className="text-xl font-medium text-black text-center">
          {event.participants.length > 0
            ? "Participants:"
            : "No participants yet, add participants before the end date."}
        </div>
        <div className="text-md font-medium text-black text flex flex-row items-center">
          {event && event.participants && event.participants.length > 0 && (
            <div>
              {event.participants.map((p, index) => {
                return <Participant key={index} participant={p} />;
              })}
            </div>
          )}
        </div>
        {isOwner && (
          <>
            <div className="text-xl font-medium text-black text-center">
              Add participants:
            </div>
            <div className={`mt-4 flex mr-4`}>
              <div className="flex-auto">
                <ReactTags
                  tags={newParticipants}
                  delimiters={delimiters}
                  handleDelete={handleDeleteParticipant}
                  handleAddition={handleAddParticipant}
                  handleDrag={handleDragParticipant}
                  inputFieldPosition="top"
                  allowUnique={!event.allowDuplicates}
                  placeholder="Insert participants"
                  allowDragDrop={true}
                  inline={true}
                />
              </div>
              <button
                className="disabled:opacity-50 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex-none h-12"
                disabled={newParticipants.length === 0}
                onClick={saveNewParticipants}
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </Transition>
  );
};

const Participant = ({ participant }) => {
  return <div className="flex text-md">{participant}</div>;
};

export default EventDetails;
