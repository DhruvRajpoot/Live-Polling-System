import star from "../../assets/star.svg";
import { useNavigate } from "react-router-dom";

const LogoPill = () => {
  const navigate = useNavigate();
  return (
    <div
      className="flex w-fit items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold cursor-pointer"
      style={{
        background: "linear-gradient(90deg, #7565d9 0%, #4d0acd 100%)",
      }}
      onClick={() => navigate("/")}
    >
      <img src={star} alt="logo" className="w-4 h-4" />
      Intervue Poll
    </div>
  );
};

export default LogoPill;
