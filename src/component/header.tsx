import liskIcon from "../lisk.svg";

export function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      <img
        src={liskIcon}
        alt=""
        className="size-[150px] md:size-[150px]"
        style={{
          filter: "drop-shadow(0px 0px 24px #a726a9a8)",
        }}
      />
      <h3 className="text-2xl md:text-6xl font-bold tracking-tighter mb-6 text-zinc-100">
        Gaming Application
      </h3>
    </header>
  );
}
