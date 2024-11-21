import { usePathname } from "next/navigation";
import React from "react";
import Translate from "./Translate";
import "../styles/decluttering.css";
const Stepper = ({ stepperClass, progressSteps, step }) => {
  const pathname = usePathname();
  const getConditionalClassName = (pathname) => {
    switch (true) {
      case pathname === "/decluttering-and-staging":
        return "stepsBoxDivStaging";
      case pathname === "/virtual-renovation":
        return "stepsBoxDivReno";
      case pathname === "/virtual-refurnishing":
        return "stepsBoxDivref";
      case pathname.includes("/enhance"):
        return "stepsBoxDivEnhance";
      case pathname === "/object-removal":
        return "stepsBoxDivref";
      case pathname === "/smart-detection" || pathname === "/image-compliance":
        return "stepsBoxDivSmart";
      default:
        return "stepsBoxDivStaging";
    }
  };
  return (
    <>
      <div className={`stepsBoxDiv ${getConditionalClassName(pathname)}`}>
        {progressSteps.map((progressStep, index) => (
          <React.Fragment key={index}>
            {index + 1 < step && (
              <>
                <svg
                  className="stepsBoxDivsvg"
                  viewBox="0 0 38 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 19C0 8.50547 8.50547 0 19 0C29.4945 0 38 8.50547 38 19C38 29.4945 29.4945 38 19 38C8.50547 38 0 29.4945 0 19ZM27.5945 15.7195C28.4035 14.9105 28.4035 13.5895 27.5945 12.7805C26.7855 11.9715 25.4645 11.9715 24.6555 12.7805L16.625 20.8109L13.3445 17.5305C12.5355 16.7215 11.2145 16.7215 10.4055 17.5305C9.59648 18.3395 9.59648 19.6605 10.4055 20.4695L15.1555 25.2195C15.9645 26.0285 17.2855 26.0285 18.0945 25.2195L27.5945 15.7195Z"
                    fill="#39C257"
                  />
                </svg>

                <div className="line"></div>
              </>
            )}
            {index + 1 == step && (
              <>
                <div className="circleBox circleBoxRemoveBg">
                  {index !== progressSteps.length - 1 ? (
                    <svg
                      width="38"
                      height="38"
                      viewBox="0 0 38 38"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="19"
                        cy="19"
                        r="18"
                        stroke={"#000000"}
                        strokeWidth="2"
                      />
                      <circle cx="19" cy="19" r="12" fill={"#000000"} />
                    </svg>
                  ) : (
                    <svg
                      className="stepsBoxDivsvg"
                      viewBox="0 0 38 38"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 19C0 8.50547 8.50547 0 19 0C29.4945 0 38 8.50547 38 19C38 29.4945 29.4945 38 19 38C8.50547 38 0 29.4945 0 19ZM27.5945 15.7195C28.4035 14.9105 28.4035 13.5895 27.5945 12.7805C26.7855 11.9715 25.4645 11.9715 24.6555 12.7805L16.625 20.8109L13.3445 17.5305C12.5355 16.7215 11.2145 16.7215 10.4055 17.5305C9.59648 18.3395 9.59648 19.6605 10.4055 20.4695L15.1555 25.2195C15.9645 26.0285 17.2855 26.0285 18.0945 25.2195L27.5945 15.7195Z"
                        fill="#39C257"
                      />
                    </svg>
                  )}
                </div>
                {index !== progressSteps.length - 1 && (
                  <div className="grayLine"></div>
                )}
              </>
            )}
            {index + 1 > step && (
              <>
                <div className="circleBox"></div>
                {index !== progressSteps.length - 1 && (
                  <div className="grayLine"></div>
                )}
              </>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className={`mt-3 ${stepperClass}`}>
        {progressSteps.map((progressStep, index) => (
          <p
            key={`step-label-${index}`} // Adding key here
            className="w-full font-roboto font-semibold text-[0.8rem] uppercase text-[#777e91]"
          >
            <Translate text={`Step ${index + 1}`} />
          </p>
        ))}
      </div>
      <div className={`mt-[5px] ${stepperClass}`}>
        {progressSteps.map((progressStep, index) => (
          <p
            key={`step-name-${index}`} // Adding key here
            className="w-full font-roboto font-semibold text-[0.9rem] text-[#404256]"
          >
            <Translate text={progressStep.name} />
          </p>
        ))}
      </div>
      <div className="w-full h-[1px] !bg-[#d4ddff] mt-2.5"></div>
    </>
  );
};

export default Stepper;
