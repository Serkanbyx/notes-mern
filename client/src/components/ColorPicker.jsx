const COLORS = [
  { name: "yellow", value: "#fff9c4" },
  { name: "green", value: "#c8e6c9" },
  { name: "blue", value: "#bbdefb" },
  { name: "purple", value: "#e1bee7" },
  { name: "pink", value: "#f8bbd0" },
  { name: "orange", value: "#ffe0b2" },
];

const ColorPicker = ({ selectedColor, onSelect }) => (
  <div className="flex items-center gap-2">
    {COLORS.map(({ name, value }) => {
      const isSelected = selectedColor === name;
      return (
        <button
          key={name}
          type="button"
          onClick={() => onSelect(name)}
          style={{ backgroundColor: value }}
          className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-150 ${
            isSelected
              ? "scale-110 border-gray-700"
              : "border-transparent hover:scale-110 hover:border-gray-300"
          }`}
          aria-label={`Select ${name} color`}
          title={name.charAt(0).toUpperCase() + name.slice(1)}
        >
          {isSelected && <CheckIcon />}
        </button>
      );
    })}
  </div>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-3.5 w-3.5 text-gray-700"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default ColorPicker;
