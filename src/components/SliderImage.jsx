"use client";
import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
  ReactCompareSliderImage,
} from "react-compare-slider";

const SliderImage = ({
  selectedImage,
  finalImage,
  handlePositionChange,
  setFinalImageIndex,
}) => {
  const mainSliderRef = useRef();
  const compareSliderRef = useRef();
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: false,
    prevArrow: (
      <button aria-label="Previous" type="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 320 512"
        >
          <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
        </svg>
      </button>
    ),
    nextArrow: (
      <button className="slick-next" aria-label="Next" type="button">
        Next
      </button>
    ),
    beforeChange: (current, next) => {
      // Set the index of the React Compare Slider when the main slider changes
      setFinalImageIndex(next);
    },
  };

  return (
    <div className="w-full h-full relative mb-[20px]">
      <div className="mb-2.5">
        <Slider draggable={false} ref={mainSliderRef} {...settings}>
          {finalImage &&
            finalImage.map((image, idx) => (
              <div
                key={idx}
                className="flex justify-center items-center relative h-full"
              >
                {image !== "" ? (
                  <ReactCompareSlider
                    ref={compareSliderRef}
                    handle={
                      <ReactCompareSliderHandle
                        buttonStyle={{
                          backdropFilter: " brightness()",
                          border: 0,
                          height: "100%",
                          width: "100%",
                          color: "white",
                          background: "black",
                          border:
                            "0.1041666667vw solid var(--neutrals-white, #FFF)",
                        }}
                        style={{ color: "black" }}
                      />
                    }
                    itemOne={
                      <ReactCompareSliderImage
                        src={selectedImage}
                        className="h-full w-screen flex"
                      />
                    }
                    itemTwo={
                      <ReactCompareSliderImage
                        src={image}
                        className="h-full w-screen flex"
                      />
                    }
                    onPositionChange={() => {
                      handlePositionChange();
                    }}
                    className="flex h-auto"
                  />
                ) : (
                  <>
                    <div className="flex justify-center flex-col w-full h-full top-[1vw]">
                      <img
                        style={{
                          height: "190px",
                          margin: "160px auto 50px",
                          objectFit: "contain",
                          filter: "brightness(0%)",
                        }}
                        src={"/loading-nexare.gif"}
                        alt=""
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
        </Slider>
      </div>
    </div>
  );
};

export default SliderImage;
