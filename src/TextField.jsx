import DateTimePicker from "react-datetime-picker";

const TextField = ({
  label,
  value,
  lines,
  onValueChange,
  isDate,
  placeholder,
}) => {
  return (
    <div className="mt-2 flex justify-between rounded-md">
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-700 w-1/3 mr-2"
      >
        {label}
      </label>
      {isDate ? (
        <DateTimePicker
          className="border-2 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-2/3 sm:text-sm border-gray-200 rounded-md"
          value={value}
          onChange={(date) => onValueChange(date)}
        />
      ) : lines ? (
        <textarea
          className="border-2 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-2/3 sm:text-sm border-gray-200 rounded-md"
          name={label}
          id={label}
          rows={lines}
          placeholder={placeholder || ""}
          onChange={onValueChange}
        ></textarea>
      ) : (
        <input
          type="text"
          name={label}
          id={label}
          placeholder={placeholder || ""}
          className="border-2 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-2/3 sm:text-sm border-gray-200 rounded-md"
          value={value}
          onChange={onValueChange}
        />
      )}
    </div>
  );
};

export default TextField;
