import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import Translate from "./Translate";

const Pricing = () => {
  const planNames = ["BASIC", "PRO", "PREMIUM", "POWER USER"];

  const features = [
    "Sky Replacement",
    "Grass Replacement",
    "Photo Enhancement",
    "AI Virtual Staging",
    "AI Room Renovation",
    "AI Room Object Removal",
  ];
  const textFeatures = ["Property Description Creation", "Alt Text Generation"];
  const apiArray = ["API Connectivity", "API Documentation"];

  return (
    <div className="mb-10 overflow-auto">
      <div className="my-10 text-center">
        <h1 className="text-2xl text-gray-800 font-semibold leading-5">
          <Translate text="Compare plans" />
        </h1>
      </div>
      <div className="overflow-x-auto">
        <div className="w-[1100px] lg:!w-full">
          <div className="flex items-center justify-between border-b border-gray-200 h-14">
            <p className="text-xl font-semibold text-gray-900 pl-4">
              <Translate text="Features" />
            </p>

            <div className="flex space-x-10 h-full">
              {planNames.map((planName, index) => (
                <div
                  key={index}
                  className="text-white !bg-mainColor w-36 flex justify-center items-center rounded-md">
                  <p className="text-lg font-bold">
                    <Translate text={planName} />
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between border-b !bg-[#ecf2ff80] py-4">
            <h2 className="text-lg font-bold text-gray-900 pl-4">
              <Translate text="AI Photo Enhancement" />
            </h2>
          </div>

          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-gray-400 h-14">
              <p className="text-xs font-light text-gray-900 pl-4">
                <Translate text={feature} />
              </p>

              <div className="flex space-x-10 h-full">
                {planNames.map((planName, index) => (
                  <div
                    key={index}
                    className={`text-white !bg-[#EAEEFF] w-36 flex justify-center items-center`}>
                    <p className="text-sm font-medium">
                      <FaCheck className="inline-block !text-mainColor text-lg" />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between border-b !bg-[#ecf2ff80] py-4">
            <h2 className="text-lg font-bold text-gray-900 pl-4">
              <Translate text="AI Text Improvement" />
            </h2>
          </div>
          {textFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-gray-200 h-14">
              <p className="text-xs font-light text-gray-900 pl-4">
                <Translate text={feature} />
              </p>

              <div className="flex space-x-10 h-full">
                {planNames.map((planName, index) => (
                  <div
                    key={index}
                    className={`text-white ${
                      (planName === "PREMIUM" || planName === "POWER USER") &&
                      textFeatures.includes(feature)
                        ? "!bg-[#EAEEFF]"
                        : "!bg-[#FEE2E2]"
                    } w-36 flex justify-center items-center`}>
                    <p className="text-sm font-medium">
                      {(planName === "PREMIUM" || planName === "POWER USER") &&
                      textFeatures.includes(feature) ? (
                        <FaCheck className="inline-block !text-mainColor text-lg" />
                      ) : (
                        <ImCross className="inline-block text-red-500 text-lg" />
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between border-b !bg-[#ecf2ff80] py-4">
            <h2 className="text-lg font-bold text-gray-900 pl-4">
              <Translate text="API" />
            </h2>
          </div>
          {apiArray.map((feature, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-gray-200 h-14">
              <p className="text-xs font-light text-gray-900 pl-4">
                <Translate text={feature} />
              </p>

              <div className="flex space-x-10 h-full">
                {planNames.map((planName, index) => (
                  <div
                    key={index}
                    className={`text-white ${
                      planName === "POWER USER" && apiArray.includes(feature)
                        ? "!bg-[#EAEEFF]"
                        : "!bg-[#FEE2E2]"
                    } w-36 flex justify-center items-center`}>
                    <p className="text-sm font-medium">
                      {planName === "POWER USER" &&
                      apiArray.includes(feature) ? (
                        <FaCheck className="inline-block !text-mainColor text-lg" />
                      ) : (
                        <ImCross className="inline-block text-red-500 text-lg" />
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
