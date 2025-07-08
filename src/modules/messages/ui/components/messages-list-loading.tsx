import { GridLoader } from "react-spinners";

export const MessagesListLoading = () => {
  return (
    <div className="h-full flex justify-center items-center w-full">
      <div className="flex flex-col text-center gap-y-2 justify-center items-center">
        <GridLoader className="" color="#fffff" />
      </div>
    </div>
  );
};
