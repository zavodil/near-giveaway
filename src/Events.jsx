import React, { Fragment, useState, useEffect } from "react";
import AddEventCard from "./AddEventCard";
import AddEventDialog from "./AddEventDialog";
import EventCard from "./EventCard";
import moment from "moment";
import { BOATLOAD_OF_GAS } from "./utils";
import * as nearAPI from "near-api-js";
import { Switch } from "@headlessui/react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

const Events = ({
  contract,
  currentUser,
  nearConfig,
  wallet,
  onLoading,
  onError,
}) => {
  const [events, setEvents] = useState();
  const [limit, setLimit] = useState(30);
  const [showActiveEvents, setShowActiveEvents] = useState(true);
  const [shouldReloadEvents, setShouldReloadEvents] = useState(true);
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);
  const toNano = (date) => {
    return `${moment(date).format("x")}000000`;
  };

  const limits = [5, 10, 20, 30];

  const registerEvent = (
    title,
    description,
    eventDate,
    addParticipantsEndDate,
    addParticipantsStartDate,
    allowDuplicates,
    rewards,
    participants
  ) => {
    onLoading(true);

    const totalRewards = rewards
      .map((r) => r.id)
      .reduce((a, b) => parseFloat(a) + parseFloat(b));

    const serviceFee = Math.min(10, totalRewards * 0.01);

    contract
      .add_event(
        {
          event_input: {
            title,
            description,
            rewards: rewards.map((r) =>
              nearAPI.utils.format.parseNearAmount(r.id.toString())
            ),
            participants: participants.map((p) => p.id),
            allow_duplicate_participants: allowDuplicates,
            event_timestamp: toNano(eventDate),
            add_participants_start_timestamp: toNano(addParticipantsStartDate),
            add_participants_end_timestamp: toNano(addParticipantsEndDate),
          },
        },
        BOATLOAD_OF_GAS,
        nearAPI.utils.format.parseNearAmount(
          (serviceFee + totalRewards).toString()
        )
      )
      .then(
        () => {
          onLoading(false);
          setIsNewEventDialogOpen(false);
        },
        (err) => {
          onLoading(false);
          onError(`${err && err.kind ? err.kind["ExecutionError"] : err}`);
        }
      );
  };

  useEffect(() => {
    if (onLoading && shouldReloadEvents) {
      onLoading(true);
      let fromIndex = 0;
      if (showActiveEvents) {
        contract
          .get_events_to_finalize({
            from_index: fromIndex,
            limit: limit,
          })
          .then(
            (events) => {
              setEvents(
                events.sort(
                  (a, b) =>
                    parseInt(b.event_timestamp) - parseInt(a.event_timestamp)
                )
              );
            },
            (err) => {
              onError(`${err}`);
            }
          );
      } else {
        contract
          .get_events({
            from_index: fromIndex,
            limit: limit,
          })
          .then(
            (events) => {
              setEvents(
                events.sort(
                  (a, b) =>
                    parseInt(b.event_timestamp) - parseInt(a.event_timestamp)
                )
              );
            },
            (err) => {
              onError(`${err}`);
            }
          );
      }
      setShouldReloadEvents(false);
      onLoading(false);
    }
  }, [
    contract,
    onLoading,
    onError,
    shouldReloadEvents,
    showActiveEvents,
    limit,
  ]);

  return (
    <>
      <div className="container mx-auto flex-row mt-4">
        <div className="flex justify-between items-center mb-4">
          <Limit
            limit={limit}
            limits={limits}
            onLimitChange={(val) => {
              setLimit(val);
              setShouldReloadEvents(true);
            }}
          />
          <Switch.Group className="flex justify-end items-center mr-2 ml-4 rounded-lg p-4 bg-gradient-to-r from-purple-400 to-pink-400">
            <div className="flex items-center">
              <Switch.Label className="mr-4">
                {showActiveEvents ? "Active events" : "All Events"}
              </Switch.Label>
              <Switch
                checked={showActiveEvents}
                onChange={(value) => {
                  setShouldReloadEvents(true);
                  setShowActiveEvents(value);
                }}
                className={`${
                  showActiveEvents ? "bg-blue-600" : "bg-gray-200"
                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                <span
                  className={`${
                    showActiveEvents ? "translate-x-6" : "translate-x-1"
                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                />
              </Switch>
            </div>
          </Switch.Group>
        </div>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 xs:grid-cols-1 gap-4">
          <AddEventCard onAddEvent={() => setIsNewEventDialogOpen(true)} />
          {events &&
            events.map((event, index) => {
              return (
                <EventCard
                  key={index}
                  currentEvent={event}
                  delay={20}
                  index={index}
                  contract={contract}
                  onLoading={onLoading}
                />
              );
            })}
        </div>
        {/* )} */}
        {isNewEventDialogOpen && (
          <AddEventDialog
            isOpen={isNewEventDialogOpen}
            onClose={() => setIsNewEventDialogOpen(false)}
            onRegister={registerEvent}
          />
        )}
      </div>
    </>
  );
};

const Limit = ({ limit, limits, onLimitChange }) => {
  return (
    <div className="w-45 rounded-lg pt-1 pb-2 px-2 bg-gradient-to-r from-indigo-400 to-purple-400">
      <Listbox value={limit} onChange={onLimitChange}>
        <div className="relative mt-1 flex items-center">
          <Listbox.Label className={"mr-4"}>Limit</Listbox.Label>
          <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
            <span className="block truncate">{limit}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {limits.map((l) => (
                <Listbox.Option
                  key={l}
                  className={({ active }) =>
                    `${active ? "text-amber-900 bg-amber-100" : "text-gray-900"}
                          cursor-default select-none relative py-2 pl-10 pr-4`
                  }
                  value={l}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`${
                          selected ? "font-medium" : "font-normal"
                        } block truncate`}
                      >
                        {l}
                      </span>
                      {selected ? (
                        <span
                          className={`${
                            active ? "text-amber-600" : "text-amber-600"
                          }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                        >
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Events;
