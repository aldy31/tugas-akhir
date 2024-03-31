import { setGlobalState, useGlobalState } from "../store";
const Hero = () => {
  const [stats] = useGlobalState("stats");
  console.log(stats);

  return (
    <div className="text-center bg-white text-gray-800 py-24 px-6">
      <div className="flex justify-center items-center mt-10">
        <div
          className="flex flex-col justify-center items-center
          h-20 border shadow-md w-full"
        >
          <span
            className="text-lg font-bold text-black-900
            leading-5"
          >
            {stats?.totalProjects || 0}
          </span>
          <span>Projects</span>
        </div>
        <div
          className="flex flex-col justify-center items-center
          h-20 border shadow-md w-full"
        >
          <span
            className="text-lg font-bold text-black-900
            leading-5"
          >
            {stats?.validedProjects || 0}
          </span>
          <span>Validated Projects</span>
        </div>
        <div
          className="flex flex-col justify-center items-center
          h-20 border shadow-md w-full"
        >
          <span
            className="text-lg font-bold text-black-900
            leading-5"
          >
            {stats?.nonValidateProjects || 0}
          </span>
          <span>NonValidated Projects</span>
        </div>
        <div
          className="flex flex-col justify-center items-center
          h-20 border shadow-md w-full"
        >
          <span
            className="text-lg font-bold text-black-900
            leading-5"
          >
            {stats?.totalBacking || 0}
          </span>
          <span>Dukungan/Donasi</span>
        </div>
        <div
          className="flex flex-col justify-center items-center
          h-20 border shadow-md w-full"
        >
          <span
            className="text-lg font-bold text-black-900
            leading-5"
          >
            {stats?.totalDonations || 0} ETH
          </span>
          <span>Disumbangkan</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
