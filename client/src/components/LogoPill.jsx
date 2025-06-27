import star from "../assets/star.svg";

const LogoPill = () => {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold"
      style={{
        background: "linear-gradient(90deg, #7565d9 0%, #4d0acd 100%)",
      }}
    >
      <img src={star} alt="logo" className="w-4 h-4" />
      Intervue Poll
    </div>
  );
};

export default LogoPill;
