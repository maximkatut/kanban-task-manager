interface TaskProps {
  children?: React.ReactNode;
}

const Task = ({ children }: TaskProps) => {
  return (
    <li className="mb-5 px-4 py-5 w-[calc(100%-1.25rem)] bg-white rounded-lg shadow-sm cursor-pointer font-bold hover:text-purple">
      <h4 className="text-base">Build UI for unboarding flow</h4>
      <p className="text-grey-medium">2 of 3 subtasks</p>
    </li>
  );
};

export default Task;
