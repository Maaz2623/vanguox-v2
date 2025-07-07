import Image from "next/image";

export const DummyMessagesList = () => {
  return (
    <div className="flex flex-col h-full gap-y-4 p-5 justify-center items-center">
      <div>
        <Image src={`/logo.svg`} alt="logo" width={100} height={100} />
      </div>
      <div className="text-center flex flex-col gap-y-2">
        <span className="text-4xl font-bold tracking-wide">
          Start using Vanguox
        </span>
        <p className="text-muted-foreground">
          Get smart AI answers with vanguox AI
        </p>
      </div>
    </div>
  );
};
