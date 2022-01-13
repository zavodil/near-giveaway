import { Dialog, Transition } from "@headlessui/react";
import { Switch } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import TextField from "./TextField";
import moment from "moment";
import { WithContext as ReactTags } from "react-tag-input";
import { delimiters, accountExist} from "./utils";

const AddEventDialog = ({ isOpen, onClose, onRegister }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rewards, setRewards] = useState([{ id: "1", text: "1" }]);
  const [participants, setParticipants] = useState([
    { id: "lkskrnk.testnet", text: "lkskrnk.testnet" },
  ]);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [eventDate, setEventDate] = useState(new Date());
  const [addParticipantsStartDate, setAddParticipantsStartDate] = useState(new Date());
  const [addParticipantsEndDate, setAddParticipantsEndDate] = useState(new Date());

  const handleDeleteReward = (i) => {
    setRewards(rewards.filter((r, index) => index !== i));
  };

  const handleAddReward = (r) => {
    if(parseFloat(r.id) > 0) {
      setRewards([...rewards, r]);
    }
    else {
      alert("Illegal reward " + r.id)
    }
  };

  const handleDeleteParticipant = (i) => {
    setParticipants(participants.filter((p, index) => index !== i));
  };

  const handleAddParticipant = (p) => {
    accountExist(p.id).then(result=>{
      if(result) {
        setParticipants([...participants, p]);
      }
      else{
        alert("Illegal account " + p.id)
      }
    });
  };

  const handleDragParticipant = (tag, currPos, newPos) => {
    const newTags = participants.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setParticipants(newTags);
  };

  const canAddEvent = () => {
    return (
      title &&
      title.length > 0 &&
      description &&
      description.length > 0 &&
      rewards.length > 0 &&
      eventDate &&
      addParticipantsStartDate
    );
  };

  useEffect(() => {
    if(isOpen) {
      setEventDate(moment().add(8, "days").startOf("day").toDate())
      setAddParticipantsStartDate(moment().add(1, "day").startOf("day").toDate())
      setAddParticipantsEndDate(moment().add(7, "days").endOf("day").toDate())
    }
  }, [isOpen]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={onClose}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-4 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  New event
                </Dialog.Title>
                <div className="mt-2 mb-2">
                  <p className="text-sm text-gray-500">
                    Fill in the event details and press register.
                  </p>
                </div>
                <hr />
                <TextField
                  label="Title"
                  placeholder="Enter title"
                  value={title}
                  onValueChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                  label="Description"
                  value={description}
                  placeholder="Enter description"
                  onValueChange={(e) => setDescription(e.target.value)}
                />

                <TextField
                  label="Accept participants from"
                  value={addParticipantsStartDate}
                  isDate={true}
                  onValueChange={(date) => setAddParticipantsStartDate(date)}
                />

                <TextField
                  label="Accept participants until"
                  value={addParticipantsEndDate}
                  isDate={true}
                  onValueChange={(date) => setAddParticipantsEndDate(date)}
                />

                <TextField
                  label="Draw date"
                  value={eventDate}
                  isDate={true}
                  onValueChange={(date) => setEventDate(date)}
                />

                <div className="mt-4">
                  <Switch.Group>
                    <div className="flex justify-between">
                      <Switch.Label>Allow duplicates</Switch.Label>
                      <Switch
                        checked={allowDuplicates}
                        onChange={setAllowDuplicates}
                        className={`${
                          allowDuplicates ? "bg-blue-600" : "bg-gray-200"
                        } relative inline-flex items-center h-6 rounded-full w-11`}
                      >
                        <span
                          className={`${
                            allowDuplicates ? "translate-x-6" : "translate-x-1"
                          } inline-block w-4 h-4 transform bg-white rounded-full`}
                        />
                      </Switch>
                    </div>
                  </Switch.Group>
                </div>

                <div className={`mt-4`}>
                  <label className="mb-2" htmlFor="rewards">
                    Rewards (NEAR):
                  </label>
                  <ReactTags
                    tags={rewards}
                    delimiters={delimiters}
                    handleDelete={handleDeleteReward}
                    handleAddition={handleAddReward}
                    inputFieldPosition="top"
                    allowUnique={false}
                    placeholder="Insert rewards"
                    allowDragDrop={false}
                  />
                </div>

                <div className={`mt-4`}>
                  <label className="mb-2" htmlFor="participants">
                    Participants:
                  </label>
                  <ReactTags
                    tags={participants}
                    delimiters={delimiters}
                    handleDelete={handleDeleteParticipant}
                    handleAddition={handleAddParticipant}
                    handleDrag={handleDragParticipant}
                    inputFieldPosition="top"
                    allowUnique={!allowDuplicates}
                    placeholder="Insert participants"
                    allowDragDrop={true}
                  />
                </div>

                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-30"
                    onClick={() => {
                      if (canAddEvent) {
                        onRegister(
                          title,
                          description,
                          eventDate,
                          addParticipantsEndDate,
                          addParticipantsStartDate,
                          allowDuplicates,
                          rewards,
                          participants
                        );
                      }
                    }}
                    disabled={!canAddEvent()}
                  >
                    Register
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AddEventDialog;
