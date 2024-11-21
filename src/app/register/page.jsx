"use client";
import React, { useMemo, useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import countryList from "react-select-country-list";
import Select from "react-select";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { whiteLabeled } from "@/utils/sampleData";
import { useSession, signIn, signOut } from "next-auth/react";
import Translate from "@/components/Translate";
import { setUser } from "@/Redux/slices/authSlice";
const bussinessList = [
  "Property management",
  "Real estate brokeage",
  "Real estate development",
  "Real estate investment",
  "Real estate appraisal",
  "Real estate consulting",
  "Real estate law",
  "Real estate marketing",
  "Real estate photography",
  "Real estate stagging",
  "Others",
];
const Register = () => {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useDispatch();
  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    password: "",
  });
  const options = useMemo(() => countryList().getData(), []);
  const [country, setCountry] = useState("");
  const [typeOfBusiness, setTypeOfBusiness] = useState("");
  const [countdown, setCountdown] = useState(180);
  const [disableResend, setDisableResend] = useState(true);
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const [googleLoading, setGoogleLoading] = useState(false);
  const { token } = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (token) {
      router.push(`/`);
      return;
    }
    if (session.data?.user.name && session.data?.user.email && !googleLoading) {
      setGoogleLoading(true);
      responseGoogleSuccess(
        session.data?.user.name,
        session.data?.user.email,
        session.data?.user.email
      );
      signOut({ redirect: false });
    }

    if (params.get("verifyemail")) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            setDisableResend(false);
            return 0;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
    async function start() {
      const gapi = (await import("gapi-script")).default;
      gapi?.load(
        "client:auth2",
        gapi.client.init({
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT,
          scope: "email",
        })
      );
    }
    start();
  }, [params.get("verifyemail"), session]);

  function convertSecondsToMinutesFormat(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return (
      String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const inputConfirmPassword = e.target[3].value;

    if (
      !name ||
      !email ||
      !password ||
      !inputConfirmPassword ||
      !typeOfBusiness
    ) {
      toast.error("Please fill in all fields");
    } else if (password !== inputConfirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URI}/api/users/register`,
          {
            name,
            email,
            password,
            typeOfBusiness,
            countryCode: country ? country.value : null,
          }
        );
        if (data?.success) {
          toast.success(data.message);
          if (process.env.REACT_ENV === "production") {
            gtag_report_conversion(`/register`);
          }
          // router.push("/plans");
          setUserDetail({
            name,
            email,
            password,
          });
          router.push(`/register?verifyemail=` + true);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data.message || "Please try again");
      }
    }
  };

  const resendEmailHandler = async (e) => {
    e.preventDefault();

    if (disableResend) return;
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URI}/api/users/register`,
      {
        name: userDetail.name,
        email: userDetail.email,
        password: userDetail.password,
        typeOfBusiness,
        countryCode: country ? country.value : null,
      }
    );
    if (data?.success) {
      toast.success(data.message);
      setCountdown(180);
    } else {
      toast.error(data.message);
    }
  };

  const responseGoogleSuccess = async (name, email, googleId) => {
    // localStorage.removeItem('token');
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/api/users/register`,
        {
          name,
          email,
          googleId,
        }
      );
      if (res.data?.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data));
        router.push("/");
      } else {
        toast.error(res.data.message);
        setGoogleLoading(false);
      }
    } catch (ex) {
      toast.error(ex.response.data.message || "Faild To Login");
      setGoogleLoading(false);
    }
  };

  // linkedin login
  let isExchangingToken = false;

  const exchangeCodeForAccessToken = async (code) => {
    if (isExchangingToken) {
      return;
    }
    isExchangingToken = true;
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_FRONT}/api/oauth`,
        {
          code,
        }
      );
      if (res.data.access_token) {
        getLinkedInProfile(res.data.access_token);
        isExchangingToken = false;
      } else {
        toast.error(res.data.error);
        isExchangingToken = false;
        setLoading(false);
      }
    } catch (ex) {
      console.log(ex);
      isExchangingToken = false;
      setLoading(false);
      toast.error("Failed To Generate Access Token");
    }
  };

  const getLinkedInProfile = async (accessToken) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_FRONT}/api/oauth?accesstoken=${accessToken}`
      );
      if (res.data) {
        linkedinRegister(res.data);
      } else {
        toast.error(res.data.error);
        setLoading(false);
      }
    } catch (ex) {
      toast.error("Failed To Get User Data");
      if (ex.response) {
        console.error("Response data:", ex.response.data);
      }
      setLoading(false);
    }
  };

  const linkedinRegister = async (userData) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/api/users/register`,
        userData
      );
      if (res.data?.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data));
        if (process.env.REACT_ENV === "production") {
          gtag_report_conversion(
            `${process.env.NEXT_PUBLIC_API_FRONT}/register`
          );
        }
        router.push("/");
      } else {
        toast.error(res.data.message);
        setLoading(false);
      }
    } catch (ex) {
      console.log(ex);
      setLoading(false);
    }
  };

  const { linkedInLogin } = useLinkedIn({
    clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
    client_secret: process.env.NEXT_PUBLIC_LINKEDIN_SECRET_ID,
    response_type: "code",
    redirectUri: encodeURIComponent(
      `${process.env.NEXT_PUBLIC_API_FRONT}${process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT}`
    ),
    scope: "r_liteprofile r_emailaddress",
    onSuccess: async (code) => {
      await exchangeCodeForAccessToken(code); // Make sure it's awaited
    },
    onError: (error) => {
      console.log(error, "data error");
    },
  });

  return !params.get("verifyemail") && !whiteLabeled ? (
    <>
      <div className="grid lg:grid-cols-[0.5fr_1fr] min-h-[100vh] overflow-hidden">
        <div className=" h-[100%] hidden lg:!flex justify-center items-center relative">
          <div
            className="cursor-pointer absolute right-10 top-20"
            onClick={() => router.back()}
          >
            <svg
              width="35"
              height="35"
              viewBox="0 0 46 46"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M45.6663 20.1667H11.1847L27.023 4.32837L22.9997 0.333374L0.333008 23L22.9997 45.6667L26.9947 41.6717L11.1847 25.8334H45.6663V20.1667Z"
                fill="black"
              />
            </svg>
          </div>
        </div>
        <div className="bg-gradient-to-b from-mainColor to-secondColor  md:rounded-[40px_0px_0px_40px] flex flex-col justify-center items-center">
          <div className="flex flex-col w-[90%] !mx-auto !py-[20px]">
            <div
              className="cursor-pointer w-20 h-10 md:hidden mt-[10px]"
              onClick={() => router.back()}
            >
              <div className="flex items-center gap-1 !mb-7">
                <IoIosArrowBack size={19} className="!text-white" />
                <span className="text-sm text-white font-bold">
                  <Translate text="Back" />
                </span>
              </div>
            </div>
            <h1 className="text-[#ffffff] font-[800] text-[35px] !font-allround">
              <Translate text="Not a Member? Sign Up for Free" />
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 md:gap-5 mt-[30px]">
                <div className="mb-3">
                  <input
                    className="border border-[#d2d2d2] w-full py-1.5 px-[20px] h-[60px] rounded-[10px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="name"
                    type="text"
                    placeholder="Name"
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="border border-[#d2d2d2] w-full py-1.5 px-[20px] h-[60px] rounded-[10px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="email"
                    type="email"
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 md:gap-5">
                <div className="mb-3">
                  <input
                    className="border border-[#d2d2d2] w-full py-1.5 px-[20px] h-[60px] rounded-[10px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="password"
                    type="password"
                    placeholder="Password"
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="border border-[#d2d2d2] w-full py-1.5 px-[20px] h-[60px] rounded-[10px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="confirmpassword"
                    type="password"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 md:gap-5">
                <div className="mb-3">
                  <Select
                    options={options}
                    value={country}
                    className="bg-white flex items-center w-full py-1.5 px-[20px] h-[60px] rounded-[10px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(val) => setCountry(val)}
                    placeholder="Select your Country"
                  />
                </div>
                <div className="mb-3">
                  <select
                    name="bussiness"
                    onChange={(e) => setTypeOfBusiness(e.target.value)}
                    className="border border-[#ffffff] bg-white w-full py-1.5 px-[20px] h-[60px] rounded-[10px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="" selected>
                      <Translate text="Select Bussiness" />
                    </option>
                    {bussinessList.map((item, key) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-center mt-[30px] max-w-[280px] mx-auto text-sm text-[#ffffff] font-[500]">
                <Translate text="By continuing you accept our Terms of" />
                <Link href="/terms" className="mx-[5px] !font-[800]">
                  <Translate text="Terms of Service" />
                </Link>
                and
                <Link href="/policy" className="ml-[5px] !font-[800]">
                  <Translate
                    text="Privacy
                  Policy"
                  />
                </Link>
              </p>

              <button
                className="!bg-thirdColor h-[55px] max-w-[200px] font-[500] text-sm rounded-[15px] text-black w-full py-1.5 focus:outline-none focus:shadow-outline flex mx-auto justify-center items-center mt-[20px]"
                type="submit"
              >
                <Translate text="Sign Up" />
              </button>
            </form>

            <fieldset className="border-[#c4c4c4] max-w-[500px] border-t-[1px] !mt-16 !mb-8 mx-auto w-full">
              <legend className="flex justify-center m-[auto] text-white px-[20px] font-[500] items-center text-center">
                <Translate text="Already have an account? " />
                <Link href="/login" className="ml-[7px] font-[800]">
                  Login
                </Link>
              </legend>
            </fieldset>

            <div
              onClick={() => signIn("google")}
              className="flex  max-w-[500px] mx-auto w-full bg-white w-ful justify-center width-[100%] border-[1px] text-gray-700 h-[55px] rounded-[15px] font-medium items-center gap-2 mb-3 cursor-pointer"
            >
              {!googleLoading ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="25"
                    height="25"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    ></path>
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    ></path>
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                  </svg>
                  <Translate text="Sign up with Google" />
                </>
              ) : (
                <div
                  class="spinner spinnergoogle mx-3 border-[#333333]"
                  id="spinner"
                ></div>
              )}
            </div>
            <button
              // href={LINKEDIN_URL}
              disabled={loading}
              onClick={linkedInLogin}
              className="flex  max-w-[500px] mx-auto w-full bg-white w-ful justify-center width-[100%] border-[1px] text-gray-700 h-[55px] rounded-[15px] font-medium items-center gap-2 mb-3 cursor-pointer"
            >
              {loading ? (
                <div className="spinner mx-3 spinnerlinkdin" id="spinner"></div>
              ) : (
                <span className="text-sm flex justify-center items-center">
                  <svg
                    className="mr-5"
                    xmlns="http://www.w3.org/2000/svg"
                    height="16px"
                    viewBox="0 0 448 512"
                    fill="#0A66C2"
                  >
                    <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                  </svg>
                  <Translate text="Sign up with Linkedin" />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  ) : whiteLabeled ? (
    <div className="grid place-content-center min-h-screen">
      <Translate text="Page not found" />
    </div>
  ) : (
    <>
      <div className="relative flex min-h-fit flex-col items-center justify-center overflow-hidden py-6 sm:!py-12 bg-white">
        <div className="max-w-xl px-5 text-center">
          <h2 className="mb-2 text-[42px] font-bold text-zinc-800">
            <Translate text="Check your inbox" />
          </h2>
          <p className="text-lg !text-mainColor">
            <p className="font-medium">
              <Translate
                text="We are glad that you are with us. We have sent you a
              verification link to your email address."
              />
            </p>
            <p className=" mt-5 !text-mainColor">
              <Translate
                text="If you have not received the email, please click the button below
                to resend the email"
              />
            </p>
          </p>
          <a
            onClick={resendEmailHandler}
            className={`cursor-pointer mt-3 inline-block w-96 rounded !bg-mainColor px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20 ${
              disableResend
                ? "opacity-50 cursor-not-allowed"
                : "hover:!bg-mainColor/80 hover:!shadow-indigo-500/40"
            }`}
            disabled={disableResend}
          >
            <Translate text="Resend Email" /> →
          </a>
          {disableResend && (
            <p className="mt-2">
              <Translate text="You can resend the email in" />{" "}
              {convertSecondsToMinutesFormat(countdown)}{" "}
              <Translate text="seconds" />.
            </p>
          )}
        </div>
      </div>
    </>
  );
};
export default Register;
