interface CheckboxProps {
  isChecked: boolean;
}

const Checkbox = ({ isChecked }: CheckboxProps) => {
  return (
    <span
      className={`w-4 h-4 bg-purple p-[3px] pt-[5px] rounded-sm border-[1px] ${
        isChecked
          ? "bg-purple hover:bg-purple-hover border-none"
          : "bg-white dark:bg-grey-very-dark border-lines-light dark:border-lines-dark"
      }`}
    >
      <svg className={`${!isChecked && "hidden"}`} width="10" height="8" xmlns="http://www.w3.org/2000/svg">
        <path className="stroke-white" strokeWidth="2" fill="none" d="m1.276 3.066 2.756 2.756 5-5" />
      </svg>
    </span>
  );
};

export default Checkbox;
