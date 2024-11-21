"use client";
import React from "react";
import { Modal } from "@mui/material";
import TableNoDataAvailable from "@/components/NodataWithLoading";
import { LIMIT } from "@/constant";
import { formatApiFields } from "@/utils/fieldGenerator";
import { getPagesToShow } from "@/utils/getPagesToShow";
import moment from "moment";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import WidgetFeedback from "../utils/widgetFeedback";

const WidgetCTAModal = ({
  open,
  setOpen,
  userId,
  setUserId,
  usersList,
  setUserActionList,
  userActionList,
}) => {
  const { token, user } = useSelector((state) => state.auth.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getAllWidgetUserActions = async () => {
    setLoading(true);
    let results;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/api/widget/widgetUserActions/${userId}`
      );
      results = response?.data?.data ?? [];
      console.log(results);
      setUserActionList(results);
      setUserId(null);
    } catch (error) {
      results = [];
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userId) {
      getAllWidgetUserActions();
    }
  }, [currentPage, userId]);

  useEffect(() => {}, [open]);
  // Format Date

  const formatDate = (date) => {
    if (!date) return "-";
    const formattedDate = moment(date).format("DD/MM/YY");
    return formattedDate;
  };

  if (token && user?.role === "admin") {
    return (
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <div className="absolute outline-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  rounded max-w-[1147px] w-[90%] max-h-[90vh] overflow-auto   shadow-lg bg-[#F1F5F9] ">
          <div className="flex justify-between items-center text-center p-3 bg-[#FFFFFF] ">
            <p className="font-bold text-[20px] leading-[24px] text-[#4F4E69]">
              User Actions Overview
            </p>
            <div>
              <button onClick={() => setOpen(false)}>
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
                    r="19"
                    transform="matrix(-1 0 0 1 38 0)"
                    fill="#F0F0F0"
                  />
                  <g clip-path="url(#clip0_1460_2823)">
                    <path
                      d="M12 13.41L13.41 12L19 17.59L24.59 12L26 13.41L20.41 19L26 24.59L24.59 26L19 20.41L13.41 26L12 24.59L17.59 19L12 13.41Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1460_2823">
                      <rect
                        width="24"
                        height="24"
                        fill="white"
                        transform="matrix(-1 0 0 1 31 7)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          </div>

          {/* Box Section */}

          <div className="gap-4 md:gap-8 w-full p-8 grid grid-cols-3 ">
            <div className="bg-[#FFFFFF] border-[1px] rounded-[15px]  h-[116px] flex gap-[23px] pl-[28px] justify-start items-center text-center ">
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  opacity="0.1"
                  width="60"
                  height="60"
                  rx="30"
                  fill="#5B93FF"
                />
                <path
                  d="M27.1524 27.9851V26.5785C25.5506 25.7804 24.7087 23.9847 25.1198 22.2429C25.5309 20.501 27.0867 19.2712 28.8764 19.2734C30.6661 19.2757 32.2188 20.5094 32.6256 22.2522C33.0323 23.9951 32.1859 25.7887 30.5821 26.5828V26.8053C30.8593 26.6397 31.1783 26.5573 31.5011 26.5678C31.8238 26.5783 32.1368 26.6813 32.4027 26.8644C34.0705 25.2792 34.4812 22.7786 33.4083 20.7431C32.3353 18.7077 30.0401 17.6334 27.7898 18.1135C25.5395 18.5935 23.8825 20.5108 23.7335 22.8069C23.5846 25.1031 24.98 27.2184 27.1494 27.9851H27.1524ZM29.299 41.1426C29.1853 41.1426 29.0762 41.1878 28.9958 41.2682C28.9154 41.3486 28.8703 41.4576 28.8703 41.5713C28.8703 41.685 28.9154 41.7941 28.9958 41.8745C29.0762 41.9548 29.1853 42 29.299 42H36.1581C36.2718 42 36.3808 41.9548 36.4612 41.8745C36.5416 41.7941 36.5868 41.685 36.5868 41.5713C36.5868 41.4576 36.5416 41.3486 36.4612 41.2682C36.3808 41.1878 36.2718 41.1426 36.1581 41.1426H29.299Z"
                  fill="#5B93FF"
                />
                <path
                  d="M22.7713 33.8486C23.7412 33.9223 24.6482 34.3569 25.3134 35.0666C25.5243 35.3217 25.6002 35.4293 25.6658 35.5231C26.0175 35.9825 26.3996 36.4177 26.8095 36.8259C27.1813 37.2339 27.5969 37.5997 28.0489 37.9165C28.7929 38.52 29.3161 39.3529 29.5369 40.285H36.1577C36.1859 40.285 36.2125 40.2915 36.2404 40.2932C36.3647 40.0789 36.4976 39.8577 36.6584 39.6184C37.4438 38.4417 37.4438 37.6751 37.4438 35.9981V29.5677C37.4438 29.0942 37.0599 28.7103 36.5864 28.7103C36.1128 28.7103 35.729 29.0942 35.729 29.5677V30.8538C35.729 30.9675 35.6838 31.0766 35.6034 31.157C35.523 31.2374 35.4139 31.2825 35.3002 31.2825C35.1865 31.2825 35.0775 31.2374 34.9971 31.157C34.9167 31.0766 34.8715 30.9675 34.8715 30.8538V28.7104C34.8715 28.2368 34.4877 27.853 34.0141 27.853C33.5406 27.853 33.1567 28.2368 33.1567 28.7104V30.4251C33.1567 30.5388 33.1116 30.6479 33.0312 30.7283C32.9508 30.8087 32.8417 30.8538 32.728 30.8538C32.6143 30.8538 32.5053 30.8087 32.4249 30.7283C32.3445 30.6479 32.2993 30.5388 32.2993 30.4251V28.2816C32.2993 27.8081 31.9155 27.4242 31.4419 27.4242C30.9684 27.4242 30.5845 27.8081 30.5845 28.2816V29.9964C30.5845 30.1101 30.5394 30.2191 30.459 30.2995C30.3786 30.3799 30.2695 30.4251 30.1558 30.4251C30.0421 30.4251 29.9331 30.3799 29.8527 30.2995C29.7723 30.2191 29.7271 30.1101 29.7271 29.9964V23.2101C29.7392 22.7353 29.3849 22.3306 28.9126 22.2799C28.7965 22.2741 28.6804 22.2919 28.5713 22.3324C28.4623 22.3729 28.3627 22.4351 28.2785 22.5153C28.1942 22.5955 28.1272 22.692 28.0815 22.7989C28.0357 22.9058 28.0122 23.0209 28.0124 23.1372L28.0081 32.5685C28.0082 32.7212 27.9675 32.8711 27.89 33.0027C27.8126 33.1342 27.7013 33.2426 27.5678 33.3166C27.4328 33.3911 27.2804 33.428 27.1263 33.4237C26.9722 33.4193 26.8221 33.3737 26.6916 33.2918C25.3879 32.4609 24.38 32.0331 22.8204 32.139C22.3712 32.1584 22.0133 32.5215 22.0004 32.9709C21.9875 33.4203 22.3239 33.8034 22.7713 33.8486Z"
                  fill="#5B93FF"
                />
                <path
                  d="M31.8709 23.1376C31.8709 21.4803 30.5273 20.1367 28.87 20.1367C27.2127 20.1367 25.8691 21.4803 25.8691 23.1376C25.8687 23.6198 25.9856 24.0949 26.2096 24.522C26.4337 24.949 26.7582 25.3152 27.1552 25.5889V23.1376C27.156 22.905 27.2038 22.675 27.2957 22.4613C27.3877 22.2477 27.5219 22.0548 27.6902 21.8944C27.8581 21.7325 28.0577 21.607 28.2763 21.5259C28.495 21.4447 28.728 21.4097 28.9609 21.4228C29.8907 21.4936 30.6034 22.2782 30.5848 23.2105V25.5923C30.9816 25.3177 31.306 24.9508 31.53 24.5233C31.754 24.0957 31.871 23.6203 31.8709 23.1376Z"
                  fill="#5B93FF"
                />
              </svg>

              <div className="flex flex-col items-start">
                <p className="leading-[36px] font-semibold	text-[30px] text-[#000000]">
                  {userActionList.totalActions}
                </p>
                <p className="leading-[21.82px] font-normal		text-[16px] text-[#787878] !mt-[6px]">
                  Total Actions
                </p>
              </div>
            </div>

            <div className="bg-[#FFFFFF] border-[1px] rounded-[15px]  h-[116px] flex gap-[23px] pl-[28px] justify-start items-center text-center ">
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  opacity="0.2"
                  width="60"
                  height="60"
                  rx="30"
                  fill="#FFD66B"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M39.1792 34.0298C39.182 34.0111 39.1834 33.9928 39.1834 33.9741V26.0241C39.1834 26.0053 39.182 25.987 39.1792 25.9697C39.7384 25.8038 40.1467 25.2867 40.1467 24.6741C40.1467 23.9288 39.542 23.3241 38.7967 23.3241C38.4353 23.3241 38.1086 23.4661 37.8653 23.6962C37.8508 23.6855 37.8363 23.6752 37.8189 23.6658L34.3989 21.69L34.3787 21.6783L30.9358 19.6903C30.9198 19.6809 30.9025 19.673 30.8866 19.6664C30.9105 19.5642 30.9236 19.4592 30.9236 19.35C30.9236 18.6033 30.3189 18 29.5736 18C28.8269 18 28.2236 18.6033 28.2236 19.35C28.2236 19.4588 28.2358 19.5637 28.2606 19.6664C28.2433 19.673 28.2259 19.6809 28.21 19.6903L24.767 21.6783H24.7684L21.3278 23.6658C21.3105 23.6752 21.2959 23.6859 21.2814 23.6962C21.0395 23.4666 20.7114 23.3241 20.35 23.3241C19.6047 23.3241 19 23.9288 19 24.6741C19 25.2867 19.4078 25.8033 19.9675 25.9697C19.9647 25.987 19.9633 26.0058 19.9633 26.0241V33.9741C19.9633 33.9928 19.9647 34.0111 19.9675 34.0298C19.4083 34.1948 19 34.7114 19 35.3241C19 36.0694 19.6047 36.6741 20.35 36.6741C20.7114 36.6741 21.0395 36.5334 21.2814 36.3019C21.2959 36.3136 21.3105 36.3244 21.3278 36.3337L24.7478 38.3081C24.7544 38.3119 24.7609 38.3161 24.768 38.3198L28.2109 40.3078C28.2269 40.3172 28.2442 40.3252 28.2616 40.3331C28.2362 40.4339 28.2245 40.5403 28.2245 40.6495C28.2245 41.3948 28.8278 41.9995 29.5745 41.9995C30.3198 41.9995 30.9245 41.3948 30.9245 40.6495C30.9245 40.5408 30.9114 40.4344 30.8875 40.3331C30.9034 40.3252 30.9208 40.3172 30.9367 40.3078L34.3797 38.3198L37.8198 36.3333C37.8372 36.3239 37.8517 36.3131 37.8663 36.3014C38.1095 36.5325 38.4363 36.6736 38.7977 36.6736C39.543 36.6736 40.1477 36.0689 40.1477 35.3236C40.1467 34.7119 39.7384 34.1948 39.1792 34.0298ZM38.4137 34.0298C38.2052 34.0908 38.0191 34.2014 37.8663 34.3463C37.8518 34.3347 37.8362 34.3245 37.8198 34.3158L34.0994 32.167V32.632C34.0994 32.7717 34.0834 32.9044 34.0516 33.0305L37.4331 34.9837C37.4505 34.9931 37.4664 35.0011 37.4837 35.0077C37.4343 35.216 37.4343 35.433 37.4837 35.6414C37.4678 35.648 37.4505 35.6559 37.4345 35.6653L33.993 37.6519L33.9916 37.6533V37.6519L30.5486 39.6398C30.5327 39.6492 30.5167 39.6595 30.5036 39.6703C30.3485 39.5233 30.1609 39.4149 29.9561 39.3539C29.9589 39.3366 29.9603 39.3178 29.9603 39.2995V35.1895C29.83 35.1947 29.7011 35.1975 29.5736 35.1975C29.4461 35.1975 29.3158 35.1947 29.1855 35.1895V39.2995C29.1855 39.3183 29.1869 39.3366 29.1897 39.3539C28.9825 39.4148 28.7964 39.5255 28.6436 39.6703C28.6291 39.6595 28.6131 39.6492 28.5972 39.6398L25.1556 37.6519C25.1477 37.6481 25.1411 37.6439 25.1345 37.6411L21.7117 35.6653C21.6958 35.6559 21.6798 35.648 21.6625 35.6414C21.6878 35.5392 21.6995 35.4328 21.6995 35.3241C21.6995 35.2153 21.6873 35.1089 21.6625 35.0077C21.6798 35.0011 21.6972 34.9931 21.7131 34.9837L25.0947 33.0305C25.063 32.9 25.047 32.7663 25.0469 32.632V32.167L21.3264 34.3158C21.3105 34.3252 21.2945 34.3345 21.28 34.3463C21.1254 34.1992 20.9383 34.0908 20.7339 34.0298C20.7367 34.0111 20.7381 33.9928 20.7381 33.9741V26.0241C20.7381 26.0053 20.7367 25.987 20.7339 25.9697C20.9411 25.9073 21.1272 25.7981 21.28 25.6523C21.2945 25.6641 21.3105 25.6748 21.3264 25.6842L25.0469 27.8316V27.368C25.0469 27.2283 25.0642 27.0956 25.0947 26.9681L21.7131 25.0162C21.6972 25.0069 21.6798 24.9975 21.6625 24.9909C21.6878 24.8902 21.6995 24.7838 21.6995 24.6745C21.6995 24.5658 21.6873 24.4594 21.6625 24.3572C21.6798 24.3506 21.6958 24.3427 21.7117 24.3347L25.1547 22.3467V22.3453L25.1561 22.3467L28.5977 20.3587C28.6136 20.3494 28.6295 20.3391 28.6441 20.3283C28.7984 20.4756 28.9856 20.584 29.1902 20.6447C29.1873 20.6634 29.1859 20.6817 29.1859 20.7005V24.8105C29.3162 24.8039 29.4466 24.8011 29.5741 24.8011C29.7016 24.8011 29.8305 24.8039 29.9608 24.8105V20.7C29.9608 20.6812 29.9594 20.663 29.9566 20.6442C30.1637 20.5833 30.3512 20.4727 30.5041 20.3278C30.5172 20.3386 30.5331 20.3489 30.5491 20.3583L33.992 22.3463C33.9986 22.35 34.0052 22.3542 34.0131 22.358L37.4345 24.3337C37.4505 24.3417 37.4678 24.3497 37.4837 24.3563C37.4598 24.4584 37.4467 24.5648 37.4467 24.6736C37.4467 24.7823 37.4598 24.8887 37.4837 24.99C37.4664 24.9966 37.4505 25.0059 37.4331 25.0153L34.0516 26.9672C34.0834 27.0947 34.0994 27.2278 34.0994 27.367V27.8306L37.8198 25.6833C37.8372 25.6739 37.8517 25.6631 37.8663 25.6514C38.0191 25.7977 38.2052 25.9064 38.4137 25.9688C38.4109 25.9861 38.4095 26.0048 38.4095 26.0231V33.9731C38.41 33.9928 38.4114 34.0116 38.4137 34.0298ZM32.5609 31.9772C32.8281 31.8483 33.0939 31.6875 33.3264 31.4948V32.632C33.3264 33.622 31.6455 34.4231 29.5741 34.4231C27.5012 34.4231 25.8217 33.622 25.8217 32.632V31.4948C26.0542 31.6875 26.3186 31.8483 26.5872 31.9772C27.4881 32.4075 28.5817 32.5777 29.5741 32.5777C30.5664 32.5777 31.6586 32.4075 32.5609 31.9772ZM29.5736 29.9334C31.135 29.9334 32.5112 29.4858 33.3259 28.8028V30.0108C33.3259 31.0008 31.645 31.8033 29.5736 31.8033C27.5008 31.8033 25.8212 31.0008 25.8212 30.0108V28.8028C26.6345 29.4858 28.0113 29.9334 29.5736 29.9334ZM33.3259 27.368C33.3259 28.3552 31.6398 29.1591 29.5736 29.1591C27.5059 29.1591 25.8212 28.3552 25.8212 27.368C25.8212 26.3808 27.5059 25.5755 29.5736 25.5755C31.6398 25.5755 33.3259 26.3803 33.3259 27.368Z"
                  fill="#FFC327"
                />
              </svg>

              <div className="flex flex-col items-start">
                <p className="leading-[36px] font-semibold	text-[30px] text-[#000000]">
                  {userActionList.totalUniqueModels}
                </p>
                <p className="leading-[21.82px] font-normal		text-[16px] text-[#787878] !mt-[6px] whitespace-nowrap">
                  Total Unique Models
                </p>
              </div>
            </div>

            <div className="bg-[#FFFFFF] border-[1px] rounded-[15px]  h-[116px] flex gap-[23px] pl-[28px] justify-start items-center text-center ">
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  opacity="0.1"
                  width="60"
                  height="60"
                  rx="30"
                  fill="#FF8F6B"
                />
                <path
                  d="M28.8835 26.5062L22 22.7516V30.1438C22 30.2562 22.0302 30.3666 22.0876 30.4632C22.145 30.5599 22.2273 30.6394 22.326 30.6932L28.8835 34.2701V26.5062ZM29.5092 25.4224L36.3927 21.6677L29.809 18.0765C29.717 18.0263 29.614 18 29.5092 18C29.4045 18 29.3014 18.0263 29.2095 18.0765L22.6258 21.6677L29.5092 25.4224ZM30.135 26.5068V34.2701L36.6924 30.6932C36.7911 30.6394 36.8735 30.5599 36.9308 30.4632C36.9882 30.3666 37.0185 30.2562 37.0184 30.1438V22.7522L30.135 26.5068Z"
                  fill="#FF8F6B"
                />
                <path
                  d="M24.2612 37.1201L24.2612 37.1202L24.2736 37.1212C24.9531 37.1728 25.5889 37.4754 26.0574 37.9698C26.2164 38.1626 26.2703 38.2397 26.3166 38.306L26.3229 38.315L26.3296 38.3237C26.6342 38.7215 26.9649 39.0986 27.3195 39.4525C27.6482 39.8119 28.0147 40.1348 28.4127 40.4154C28.9409 40.8486 29.3124 41.4432 29.4699 42.1081L29.561 42.4929H29.9564H35.4605L35.471 42.4942C35.4823 42.4956 35.4989 42.4975 35.5185 42.4987L35.827 42.5179L35.9821 42.2505C36.083 42.0765 36.1878 41.9024 36.3133 41.7155L36.3142 41.7142C36.6746 41.1743 36.8682 40.7053 36.9639 40.171C37.0536 39.6695 37.0536 39.121 37.0536 38.4522L37.0536 38.416V33.0508C37.0536 32.3796 36.5094 31.8354 35.8382 31.8354C35.4637 31.8354 35.1287 32.0048 34.9058 32.2712C34.8724 31.6298 34.3417 31.1201 33.6921 31.1201C33.2876 31.1201 32.9292 31.3177 32.7083 31.6216C32.5561 31.1241 32.0932 30.7623 31.5459 30.7623C31.1723 30.7623 30.8381 30.9309 30.6152 31.1961V27.7519C30.6282 27.0985 30.1395 26.5429 29.489 26.473L29.4748 26.4715L29.4606 26.4708C29.2959 26.4625 29.1313 26.4879 28.9768 26.5452C28.8223 26.6026 28.681 26.6908 28.5616 26.8045L28.9065 27.1666C28.8362 27.2335 28.7803 27.314 28.7421 27.4032C28.7039 27.4924 28.6843 27.5884 28.6844 27.6855L28.1844 27.6852V27.6855C28.1844 27.6857 28.1844 27.6859 28.1844 27.6861L28.1809 35.5543L28.1809 35.555C28.1809 35.593 28.1707 35.6304 28.1515 35.6631L28.5824 35.9168L28.1515 35.6631C28.1323 35.6958 28.1047 35.7227 28.0716 35.7411C28.0373 35.76 27.9985 35.7693 27.9593 35.7682C27.9204 35.7671 27.8824 35.7557 27.8493 35.7352C26.715 35.0125 25.7682 34.6001 24.3241 34.6969C23.6906 34.7278 23.1868 35.2411 23.1685 35.8759L23.1685 35.876C23.1503 36.5129 23.627 37.056 24.2612 37.1201Z"
                  fill="#FF8F6B"
                  stroke="#FFF4F0"
                />
              </svg>

              <div className="flex flex-col items-start">
                <p className="leading-[36px] font-semibold	text-[30px] text-[#000000]">
                  {userActionList.actionsPerModel &&
                    Object.keys(userActionList.actionsPerModel).map(
                      (model, index) => (
                        <p key={index} className="text-gray-600">
                          <span className="font-semibold">
                            {userActionList.actionsPerModel[model]}
                          </span>
                        </p>
                      )
                    )}
                </p>
                <p className="leading-[21.82px] font-normal		text-[16px] text-[#787878] !mt-[6px]">
                  Actions Per Model
                </p>
              </div>
            </div>
          </div>

          {/* Table */}

          <div className="p-8  overflow-x-auto  ">
            <div className="bg-white rounded-[10px]  py-6 overflow-x-auto">
              <div className="max-w-full overflow-x-auto">
                <table className="table-auto  w-full border-collapse  ">
                  <thead>
                    <tr className="text-[#000000] text-[12px] leading-[14.4px] font-bold  border-b mb-4 border-gray-200 whitespace-nowrap   ">
                      <th className="text-start px-4 ">OTP</th>
                      <th className="text-start px-4 ">Last Log In</th>
                      <th className="text-start px-4 ">Last Log Out</th>

                      <th className="text-start px-4 ">Model</th>
                      <th className="text-start px-4 ">Type</th>
                      <th className="text-start px-4 ">Style</th>
                      <th className="text-start px-4 ">Listing URL</th>

                      <th className="text-start px-4 ">Input Image</th>
                      <th className="text-start px-4 ">Image Output</th>
                      <th className="text-start px-4 ">Generated At</th>

                      <th className="text-start px-4 ">Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userActionList?.results?.length > 0 ? (
                      userActionList?.results?.map((item, index) => {
                        const otp = usersList.results[index]?.otp || "";

                        return (
                          <tr
                            key={index}
                            className="bg-white border-b whitespace-nowrap"
                          >
                            <td className="px-4 py-4 text-green-600 text-xs font-normal  ">
                              {otp}
                            </td>
                            <td className="px-4 py-4 text-slate-950 text-xs font-normal ">
                              {formatDate(user.lastLoggedIn)}
                            </td>
                            <td className="px-4 py-4 text-slate-950 text-xs font-normal  ">
                              {formatDate(user.lastActive)}
                            </td>

                            <td className="px-4 py-4 text-slate-950 text-xs font-normal">
                              {item.optJson.model === "decluttering"
                                ? "Refurnishing"
                                : item.optJson.model}
                            </td>

                            <td className="px-4 py-4  text-slate-950 text-xs font-normal">
                              {item.optJson.apiFields.room_type}
                            </td>
                            <td className="px-4 py-4 text-slate-950 text-xs font-normal ">
                              {item.optJson.apiFields.architecture_style}
                            </td>
                            <td className="px-4 py-4 text-slate-950 text-xs font-normal ">
                              {item.optJson.apiFields.app_URL}
                            </td>
                            <td className="px-4 py-4">
                              {" "}
                              <img
                                src={item.optJson.image}
                                alt="User Action"
                                className="w-[75px] h-[75px] rounded-lg object-cover "
                              />
                            </td>
                            <td className="px-4 py-4 ">
                              <div className="grid grid-cols-2  ">
                                {item.response.map((imageUrl, imgIndex) => (
                                  <img
                                    key={imgIndex}
                                    src={imageUrl}
                                    alt={`User Action ${imgIndex + 1}`}
                                    className="w-[75px] h-[75px] rounded-lg object-cover"
                                  />
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-neutral-400 text-xs font-normal ">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4 ">
                              <WidgetFeedback
                                id={`feedback-${index}`}
                                item={item}
                              />
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <TableNoDataAvailable loading={loading} />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  } else {
    router.push("/");
  }
};

export default WidgetCTAModal;
