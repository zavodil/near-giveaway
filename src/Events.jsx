import React, { useState, useEffect } from "react";
import AddEventCard from "./AddEventCard";
import AddEventDialog from "./AddEventDialog";
import EventCard from "./EventCard";
import moment from "moment";
import { BOATLOAD_OF_GAS } from "./utils";
import * as nearAPI from "near-api-js";

const Events = ({
  contract,
  currentUser,
  nearConfig,
  wallet,
  onLoading,
  onError,
}) => {
  const [events, setEvents] = useState();
  const [shouldReloadEvents, setShouldReloadEvents] = useState(true);
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);
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
    async function reloadEvents() {
      if (onLoading && shouldReloadEvents) {
        onLoading(true);
        let fromIndex = 0;
        const limit = 30;
        let newEvents = [];
        while (true) {
          try {
            let events = await contract.get_events({
              from_index: fromIndex,
              limit: limit,
            });
            newEvents = newEvents.concat(events);
            if (events.length !== limit) break;

            fromIndex += limit;
          } catch (err) {
            onError(`${err}`);
            break;
          }
        }
        newEvents = newEvents.sort(
          (a, b) => parseInt(b.event_timestamp) - parseInt(a.event_timestamp)
        );

        if (newEvents.length) {
          setEvents(newEvents);
        }
        setShouldReloadEvents(false);
        onLoading(false);
      }
    }
    reloadEvents();
  }, [contract, onLoading, onError, shouldReloadEvents]);

  return (
    <>
      <div className="container mx-auto flex-row">
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

export default Events;
