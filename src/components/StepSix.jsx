import { usePathname } from "next/navigation";
import Translate from "./Translate";

function StepSix({
  free,
  setStep,
  finalImage,
  customFunction,
  SetFinalImage,
  overridePrompt,
  setOverridePrompt,
  setUpload,
}) {
  const pathname = usePathname();
  return (
    <>
      <p className="font-roboto font-normal text-[#404256] text-[0.86rem] mt-2.5">
        <Translate text="We want to be better, before we regenerate another output for you," />
        {pathname == "/virtual-staging" ? (
          <Translate text=" write a prompt to place objects of your own desire." />
        ) : (
          <Translate text=" please let us know what went wrong with the last one?" />
        )}
      </p>
      <div className="cardsBoxDivreviewResultRegenerate">
        <div className="regenerateLeftSide">
          <img
            src={Array.isArray(finalImage) ? finalImage[0] : finalImage}
            alt=""
          />
        </div>
        <div className="regenerateRightSide">
          {pathname == "/virtual-staging" ? (
            <>
              <p className="shareYourTought">
                <Translate text="Try out your own prompt" />
              </p>
              <textarea
                className="inputFeedback"
                value={overridePrompt}
                onChange={(e) => setOverridePrompt(e.target.value)}
                placeholder="Comments"></textarea>
            </>
          ) : (
            <>
              <img className="faceicon" src="faceicon.svg" alt="loading" />
              <p className="shareYourTought">
                <Translate text="Share your thoughts with us" />
              </p>
              <textarea
                className="inputFeedback"
                placeholder="Comments"></textarea>
            </>
          )}
          <button
            onClick={() => {
              if (
                pathname == "/virtual-refurnishing" ||
                pathname == "/object-removal"
              ) {
                setUpload(true);
                setStep(2);
              } else if (pathname == "/virtual-staging") {
                SetFinalImage(null);
                setStep(4);
                customFunction();
              } else {
                setStep(3);
                setUpload(true);
              }
            }}
            className="regenerateNowAgain !bg-mainColor">
            <Translate text="Regenerate now" />
          </button>
        </div>
      </div>
    </>
  );
}

export default StepSix;
