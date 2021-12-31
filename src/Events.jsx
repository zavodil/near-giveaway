import React, { useState, useEffect } from "react";
import AddEventCard from "./AddEventCard";
import AddEventDialog from "./AddEventDialog";
import EventCard from "./EventCard";
import EventDetails from "./EventDetails";
import moment from "moment";
import Big from "big.js";

const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

const Events = ({
  contract,
  currentUser,
  nearConfig,
  wallet,
  onLoading,
  onError,
}) => {
  const [events, setEvents] = useState();
  const [fromIndex, setFromIndex] = useState(0);
  const [limit, setLimit] = useState(10);
  const [shouldReloadEvents, setShouldReloadEvents] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState();
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);

  const activateEvent = (election) => {
    localStorage.setItem("activeEvent", election.id);
    setSelectedEvent(election);
  };

  const deactivateEvent = () => {
    localStorage.removeItem("activeEvent");
    setSelectedEvent(null);
  };

  const toNano = (date) => {
    return `${moment(date).format("x")}000000`;
  };

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
    contract
      .add_event(
        {
          event_input: {
            title,
            description,
            rewards,
            participants,
            allow_duplicate_participants: allowDuplicates,
            event_timestamp: toNano(eventDate),
            add_participants_start_timestamp: toNano(addParticipantsStartDate),
            add_participants_end_timestamp: toNano(addParticipantsEndDate),
          },
        },
        BOATLOAD_OF_GAS,
        Big(1)
          .times(10 ** 24)
          .toFixed()
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
      contract.get_events({ from_index: fromIndex, limit: limit }).then(
        (events) => {
          onLoading(false);
          setEvents(events);
          setShouldReloadEvents(false);
        },
        (err) => {
          setShouldReloadEvents(false);
          onLoading(false);
          onError(`${err && err.kind ? err.kind["ExecutionError"] : err}`);
        }
      );
    }
  }, [contract, onLoading, limit, fromIndex, onError, shouldReloadEvents]);

  return (
    <>
      <div className="container mx-auto flex-row">
        {!selectedEvent && (
          <div className="grid lg:grid-cols-4 md:grid-cols-2 xs:grid-cols-1 gap-4">
            <AddEventCard onAddEvent={() => setIsNewEventDialogOpen(true)} />
            {events &&
              Object.keys(events).map((key, index) => {
                return (
                  <EventCard
                    key={index}
                    currentEvent={events[key]}
                    index={index}
                    contract={contract}
                    currentUser={currentUser}
                    nearConfig={nearConfig}
                    wallet={wallet}
                    onLoading={onLoading}
                    onEventSelected={activateEvent}
                  />
                );
              })}
          </div>
        )}
        {isNewEventDialogOpen && (
          <AddEventDialog
            isOpen={isNewEventDialogOpen}
            onClose={() => setIsNewEventDialogOpen(false)}
            onRegister={registerEvent}
          />
        )}
        {selectedEvent && (
          <div className="grid grid-cols-1">
            <EventDetails
              currentEvent={selectedEvent}
              contract={contract}
              currentUser={currentUser}
              nearConfig={nearConfig}
              wallet={wallet}
              onLoading={onLoading}
              onError={onError}
              onClose={deactivateEvent}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Events;
