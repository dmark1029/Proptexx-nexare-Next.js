"use client";
import React, { useRef, useState } from "react";

const WidgetFeedback = ({ id, item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Function to generate SVG with a unique gradient ID
  const generateSVG = (uniqueId) => {
    const gradientId = `paint0_linear_${uniqueId}`;
    return (
      <svg
        width="15"
        height="16"
        viewBox="0 0 15 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.45985 5.72763V15.241C5.93939 15.6621 6.24981 16 6.93861 16H12.5834C13.7049 16 14.4601 14.9398 14.1661 13.8525C14.7187 13.1686 14.8584 12.3721 14.5196 11.5507C15.031 10.6918 15.1003 9.77117 14.5467 8.91229C15.3756 7.32188 14.6182 5.48059 12.774 5.48059H10.5189C10.5211 4.35803 10.4623 2.5241 10.0795 1.48889C9.29616 -0.628557 6.8441 -0.378636 6.92059 1.55065C6.85073 3.0697 6.49416 4.57851 5.45985 5.72763ZM0 5.51707V15.5453V16H4.56147V5.51707H0Z"
          fill={`url(#${gradientId})`} // Use dynamic ID here
        />
        <defs>
          <linearGradient
            id={gradientId} // Dynamic ID
            x1="-1.86667"
            y1="1.41176"
            x2="18.5572"
            y2="16.7766"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#47C462" />
            <stop offset="1" stopColor="#0233E4" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  const tooltipContent = (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-1">
          <p className="font-medium">Feedback</p>
          {generateSVG(id)}
        </div>
        <p className="text-[#787878] opacity-70 font-normal">
          {item?.feedback?.comment || "No feedback found"}
        </p>
      </div>
    </>
  );

  const tooltipStyle = {
    width: "252px",
    height: "auto",
    display: "none",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    position: "absolute",
    backgroundColor: "white",
    color: "black",
    padding: "16px",
    borderRadius: "8px",
    top: "100%",
    left: "-50%",
    transform: "translateX(-50%)",
    whiteSpace: "normal",
    zIndex: 1000,
    fontSize: "12px",
    lineHeight: "14.4px",
    display: isHovered ? "block" : "none", // changed here
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className="text-blue-600 text-xs font-normal underline">
        Feedback
      </button>
      <div style={{ ...tooltipStyle, display: isHovered ? "block" : "none" }}>
        {tooltipContent}
      </div>
    </div>
  );
};

export default WidgetFeedback;
