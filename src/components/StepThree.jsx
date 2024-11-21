import { whiteLabeled } from "@/utils/sampleData";
import { usePathname } from "next/navigation";
import Translate from "./Translate";
import { stagingData } from "@/utils/data";
const StepThree = ({
  onButtonClick,
  handleRoomTypeSelection,
  roomRef,
  activeIndex,
  setStep,
  free,
  // mask,
  doPreprocessLoading,
}) => {
  const pathname = usePathname();
  return (
    <>
      {doPreprocessLoading && pathname === "/virtual-staging" ? (
        <div>
          <div className="imageDivBox">
            <img
              className="imageBoxLoader"
              style={{
                maxHeight: "300px",
                objectFit: "contain",
                margin: "20px 0px",
                filter: "brightness(0%)",
              }}
              src={
                whiteLabeled
                  ? "/images/redfin-loading.gif"
                  : "/loading-nexare.gif"
              }
              alt="loading"
            />
          </div>
        </div>
      ) : (
        <>
          <p className="step4Para !text-mainColor">
            <Translate text="Step 2" />{" "}
            <span className="step4ParaSpan">
              - <Translate text="Select Room Type" />
            </span>
          </p>
          <p className="roomtypestyledPara" style={{ marginBottom: "10px" }}>
            <Translate text="Please select room type below" />
          </p>
          <div className="cardsBoxDivroomtype">
            {Object.keys(stagingData)?.map((typeName, index) => {
              const property = stagingData[typeName];
              const isActive = activeIndex === index;
              const buttonClass = `innerBtnroomtype ${
                isActive ? (whiteLabeled ? "active1" : "active") : ""
              }`;
              const isLivingRoom = typeName.toLowerCase() === roomRef.current;
              let isDisabled = false;
              if (pathname === "/virtual-renovation") {
                isDisabled = free && !isLivingRoom;
              }

              const imageOpacity = isDisabled ? 0.5 : 1; // Adjust this value to set the desired opacity

              return (
                <div key={index}>
                  {property.isTraining && pathname === "/virtual-staging" ? (
                    <div
                      key={index}
                      className={`cardInnerroomtype !bg-mainColor `}
                    >
                      <div className="imgBoxInnerroomtype relative w-full h-[180px]">
                        <img
                          src={property.image}
                          className="w-full h-full object-cover opacity-20"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="!text-white text-center">
                            <h3 className="text-2xl font-[400] mb-2">
                              <Translate text="Coming soon" />
                            </h3>
                          </div>
                        </div>
                      </div>

                      <button className={buttonClass} disabled={isDisabled}>
                        <Translate
                          text={
                            typeName.charAt(0).toUpperCase() + typeName.slice(1)
                          }
                        />
                      </button>
                    </div>
                  ) : (
                    <div
                      key={index}
                      className={`cardInnerroomtype ${
                        isDisabled ? "disabled" : ""
                      }`}
                      onClick={() => {
                        if (!isDisabled) {
                          onButtonClick(index);
                          handleRoomTypeSelection(typeName);
                        }
                      }}
                    >
                      <div className="imgBoxInnerroomtype">
                        <img
                          src={property.image}
                          alt={typeName}
                          style={{ opacity: imageOpacity }}
                        />
                      </div>

                      <button className={buttonClass} disabled={isDisabled}>
                        <Translate
                          text={
                            typeName.charAt(0).toUpperCase() + typeName.slice(1)
                          }
                        />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setStep((prevStep) => prevStep + 1)}
            className="confirmStyleBtn !bg-mainColor"
          >
            <Translate text="Confirm type & continue" />
          </button>
        </>
      )}
    </>
  );
};
export default StepThree;
