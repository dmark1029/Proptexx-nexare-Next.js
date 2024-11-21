"use client";
import Translate from "@/components/Translate";
import { whiteLabeled } from "@/utils/sampleData";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

import { useLinkedIn } from "react-linkedin-login-oauth2";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { sendHeartbeat } from "@/utils/heartBeat";
import { setUser } from "@/Redux/slices/authSlice";
import { parse, serialize } from 'cookie';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
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
  }, [session]);

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
        const cookies = parse((typeof window === 'undefined' ? '' : document.cookie) || '');
        const headerCookie = decodeURIComponent(cookies.header);
        let redirectUrl = ''
        switch (true) {
          case headerCookie.includes('exp'):
            redirectUrl = 'https://exp.proptexx.ai/virtual-staging';
            break;
          case headerCookie.includes('viking'):
            redirectUrl = 'https://viking.proptexx.ai/virtual-staging';
            break;
          case headerCookie.includes('kwcp'):
            redirectUrl = 'https://kwcp.proptexx.ai/virtual-staging';
            break;
          case headerCookie.includes('cb'):
            redirectUrl = 'https://cb.proptexx.ai/virtual-staging';
            break;
          case headerCookie.includes('c21'):
            redirectUrl = 'https://c21-online-plus.proptexx.ai/virtual-staging';
            break;
          case headerCookie.includes('realsmart'):
            redirectUrl = 'https://realsmart.proptexx.ai/virtual-staging';
            break;
          default:
            redirectUrl = 'https://ilist.proptexx.ai/virtual-staging';
        }
        const loginUrl = cookies.loginUrl ? decodeURIComponent(cookies.loginUrl) : redirectUrl;
        document.cookie = serialize('loginUrl', '', { path: '/', maxAge: -1 });
        document.cookie = serialize('header', '', { path: '/', maxAge: -1 });
        router.push(loginUrl);
      } else {
        toast.error(res.data.message);
        setGoogleLoading(false);
      }
    } catch (ex) {
      toast.error(ex.response.data.message || "Faild To Login");
      setGoogleLoading(false);
    }
  };

  const responseGoogleFailure = (response) => {
    if (response.error === "popup_closed_by_user") {
      console.log("Failed to authenticate");
    } else {
      console.log("Failed to authenticate");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/api/users/login`,
        {
          email,
          password,
        }
      );
      if (res?.data?.user?._id) {
        await sendHeartbeat(res?.data?.user?._id);
      }
      if (res?.data?.success) {
        toast.success("Logged in successfully");
        dispatch(setUser(res?.data));
        router.push("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if (error.response) toast.error(error.response.data.message);
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
    accessToken, "access tokken";
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

  return (
    <>
      <div className="grid md:grid-cols-2 min-h-[100vh] overflow-hidden">
        <div className="bg-gradient-to-b from-mainColor to-secondColor h-[100%] hidden md:!flex justify-center items-center">
        </div>
        <div className="flex flex-col w-[90%] max-w-[600px] !mx-auto justify-center py-[30px]">
          <div
            className="cursor-pointer w-20 h-10"
            onClick={() => router.back()}
          >
            <div className="flex items-center gap-1 !mb-7">
              <IoIosArrowBack size={19} className="!text-black" />
              <span className="text-sm">
                <Translate text="Back" />
              </span>
            </div>
          </div>
          <h1 className="text-[#242331] font-[800] text-[30px] !font-allround">
            Login
          </h1>
          <form className="pt-6 mb-4" onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                className="border border-[#d2d2d2] w-full py-1.5 px-[20px] h-[60px] rounded-[10px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
              />
            </div>
            <div className="mb-3">
              <input
                className="border border-[#d2d2d2] w-full py-1.5 px-[20px] h-[60px] rounded-[10px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                name="password"
                type="password"
                placeholder="Password"
              />
            </div>
            <div className="flex flex-wrap gap-2 items-center justify-between mb-4 max-w-[95%] !mx-auto mt-[20px]">
              <div className="flex items-center">
                <label className="block text-[#797979] font-[400]">
                  <input className="mr-2 leading-tight" type="checkbox" />
                  <span className="text-sm">
                    <Translate text="Remember me" />
                  </span>
                </label>
              </div>
              <Link
                className="inline-block align-baseline font-[500] text-sm text-[#5f5f5f] hover:!underline"
                href="/forget-password"
              >
                <Translate text="Forgot your password?" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-[10px] sm:!gap-[30px] mt-[40px]">
              <Link
                className="!bg-black h-[54px] font-[500] flex justify-center items-center text-sm rounded-[15px] text-white w-full py-1.5 focus:outline-none focus:shadow-outline"
                href="/register"
              >
                <Translate text="Not a Member" />
              </Link>
              <button
                className="!bg-thirdColor h-[54px] font-[500] text-sm rounded-[15px] text-black w-full py-1.5 focus:outline-none focus:shadow-outline"
                type="submit"
              >
                <Translate text="Login" />
              </button>
            </div>
          </form>

          <fieldset className="border-[#c4c4c4] border-t-[1px] !mt-16 !mb-8">
            <legend className="flex justify-center m-[auto] px-[20px] font-[500] items-center text-center">
              <Translate text="OR" />
            </legend>
          </fieldset>

          <div>
            <div
              onClick={() => {
                signIn("google")
                const currentUrl = window.location.href;
                document.cookie = `header=${encodeURIComponent(currentUrl)}; path=/; max-age=86400`;
              }}
              className="flex w-ful hover:opacity-80 transition-all justify-center width-[100%] border-[2px] border-[#787878] rounded-[10px] text-gray-700 h-[55px] font-medium items-center gap-2 mb-3 cursor-pointer"
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
                  <Translate text="Login with Google" />
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
              className="flex hover:opacity-80 transition-all w-full mt-[20px] border-[2px] border-[#787878] justify-center items-center gap-2 h-[55px] rounded-[10px] text-black cursor-pointer"
            >
              {loading ? (
                <div className="spinner mx-3" id="spinner"></div>
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
                  <Translate text="Login with Linkedin" />
                </span>
              )}
            </button>
          </div>
        </div>
      </div >
    </>
  );
};

export default Login;
