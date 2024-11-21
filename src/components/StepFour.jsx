"use client";
import { whiteLabeled } from "@/utils/sampleData";
import { usePathname } from "next/navigation";
import Translate from "./Translate";

const StepFour = ({
  free,
  architectureRef,
  customFunction,
  user,
  data,
  activeIndexTypeModern,
  setActiveIndexTypeModern,
  room_objectRef,
}) => {
  const pathname = usePathname();
  let datashow = null;
  if (pathname == "/virtual-renovation" && free) {
    let numbershow = 1;
    if (room_objectRef.current == "wall") {
      numbershow = 4;
    } else if (room_objectRef.current == "ceiling") {
      numbershow = 3;
    } else if (room_objectRef.current == "floor") {
      numbershow = 8;
    }
    datashow = data?.slice(0, numbershow);
  } else {
    datashow = data;
  }
  return (
    <>
      {" "}
      <div className="cardsBoxDiv">
        {datashow.map((architecture_style, index) => {
          const isActive = activeIndexTypeModern === index;
          const buttonClass = `innerBtnroomtype ${
            isActive ? (whiteLabeled ? "active1" : "active") : ""
          }`;
          const imagePath = `${architecture_style.image}`;

          const isDisabled = false;
          const cardColor = isDisabled ? "red" : "";
          const imageOpacity = isDisabled ? 0.5 : 1;

          return (
            <div
              key={index}
              className={`cardInner tooltip2 ${isDisabled ? "disabled" : ""}`}
              style={{ color: cardColor }}
              onClick={() => {
                if (!isDisabled) {
                  setActiveIndexTypeModern(index);
                  architectureRef.current = architecture_style.style;
                }
              }}
            >
              <div className="imgBoxInner">
                {isDisabled && (
                  <div className="tooltip">
                    <p className="avaibletoPre">
                      <Translate text="Available to Premium Users" />
                    </p>
                    <div
                      className="loginToplan"
                      onClick={() => {
                        if (pathname === "/virtual-staging")
                          customFunction("virtualstage4", "/plans");
                        else customFunction("virtualreno", "/plans");
                      }}
                    >
                      {!user ? (
                        <Translate
                          text={`Login to ${!whiteLabeled && "upgrade"}`}
                        />
                      ) : (
                        <Translate text="Upgrade plan here" />
                      )}
                    </div>
                  </div>
                )}
                <img src={imagePath} alt="" style={{ opacity: imageOpacity }} />
              </div>
              <button className={buttonClass} disabled={isDisabled}>
                {isDisabled && (
                  <svg
                    className="imgBoxInnerroomtypesvgg"
                    viewBox="0 0 13 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.36444 7.01641V5.52891C2.36444 3.0643 4.21684 1.06641 6.50002 1.06641C8.78321 1.06641 10.6356 3.0643 10.6356 5.52891V7.01641H11.0951C12.1089 7.01641 12.9332 7.90581 12.9332 8.99974V14.9497C12.9332 16.0437 12.1089 16.9331 11.0951 16.9331H1.90493C0.889703 16.9331 0.0668945 16.0437 0.0668945 14.9497V8.99974C0.0668945 7.90581 0.889703 7.01641 1.90493 7.01641H2.36444ZM4.20248 7.01641H8.79757V5.52891C8.79757 4.15979 7.76942 3.04974 6.50002 3.04974C5.23063 3.04974 4.20248 4.15979 4.20248 5.52891V7.01641Z"
                      fill="#000000"
                    />
                  </svg>
                )}{" "}
                <Translate
                  text={
                    architecture_style.style.charAt(0).toUpperCase() +
                    architecture_style.style.slice(1)
                  }
                />
              </button>
            </div>
          );
        })}
      </div>
      <button
        disabled={activeIndexTypeModern === "null"}
        onClick={() => {
          if (pathname === "/virtual-staging")
            customFunction("virtualstage", "/register");
          else customFunction("virtualreno", "/register");
        }}
        className="confirmStyleBtn !bg-mainColor"
      >
        <Translate text="Confirm style & continue" />
      </button>
    </>
  );
};

export default StepFour;
