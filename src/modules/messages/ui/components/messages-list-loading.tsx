import { LoaderIcon } from "lucide-react";

export const MessagesListLoading = () => {
  return (
    <div className="h-full flex justify-center items-center w-full">
      <LoaderIcon className="animate-spin text-violet-400" />
    </div>
  );
};
