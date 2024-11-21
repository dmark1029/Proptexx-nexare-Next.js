"use client";
import { React, useCallback, useState } from "react";
import { Modal } from "@mui/material";
import { useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
  ReactCompareSliderImage,
} from "react-compare-slider";
import Translate from "./Translate";

const BeforeAfterModal = ({ open, setOpen, stepsData }) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handlePositionChange = useCallback((position) => {
    setSliderPosition(position);
  }, []);

  const close = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-100 rounded w-11/12 md:!w-5/12 xl:!w-5/12 shadow-lg outline-none">
        <div className="p-[10px] flex justify-between items-center border-b border-[#d9d9d9]">
          <strong className="text-[#242425] text-[0.8rem]">
            {stepsData.imgId}
          </strong>{" "}
          <span
            onClick={close}
            className="text-[#222228] cursor-pointer select-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 384 512"
              fill="#333">
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </span>
        </div>
        <div className="beforeAfterBoxadvancefirstPage">
          <ReactCompareSlider
            handle={
              <ReactCompareSliderHandle
                buttonStyle={{
                  backdropFilter: " brightness()",
                  border: 0,
                  color: "white",
                  background: "black",
                  border:
                    "0.1041666667vw                                                        solid var(--neutrals-white, #FFF)",
                }}
              />
            }
            itemOne={
              <ReactCompareSliderImage
                src={stepsData.originalImage}
                className="object-cover object-center"
              />
            }
            itemTwo={
              <ReactCompareSliderImage
                src={stepsData.finalImage}
                className="object-cover object-center"
              />
            }
            onPositionChange={handlePositionChange}
            className="flex w-full h-full"
          />
          <p
            className={`rounded absolute text-[0.65rem] font-medium bottom-2.5 left-2.5 bg-white w-[50px] h-5 text-black flex justify-center items-center font-[Inter] leading-[150%] ${
              sliderPosition < 9.57 ? "opacity-0" : "opacity-100"
            }`}>
            <Translate text="Before" />
          </p>
          <p
            className={`rounded absolute text-[0.65rem] font-medium bottom-2.5 right-2.5 bg-white w-[50px] h-5 text-black flex justify-center items-center font-[Inter] leading-[150%] ${
              sliderPosition > 90.43 ? "opacity-0" : "opacity-100"
            }`}>
            <Translate text="After" />
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default BeforeAfterModal;
