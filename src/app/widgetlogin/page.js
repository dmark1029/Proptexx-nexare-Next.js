"use client";
import Translate from "@/components/Translate";
import { whiteLabeled } from "@/utils/sampleData";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { sendHeartbeat } from "@/utils/heartBeat";
import { setUser } from "@/Redux/slices/authSlice";

const WidgetLogin = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const session = useSession();
  const [googleLoading, setGoogleLoading] = useState(false);
  const { token, user } = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (token && user.phone) {
      router.push(`/dashboard/widgetdashboard`);
      return;
    }
    if (token && !user.phone) {
      router.push(`/`);
      return;
    }
    if (session.data?.user.name && session.data?.user.email && !googleLoading) {
      setGoogleLoading(true);
      console.log(session, "login data");
      console.log("login data yes");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const phone = e.target.phone.value;
    if (!email || !phone) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/api/widget/widgetuserlogin`,
        {
          email,
          phone,
          isAdmin: true,
        }
      );
      console.log(res, "res");
      if (res?.data?.user?._id) {
        await sendHeartbeat(res?.data?.user?._id);
      }
      if (res?.data?.success) {
        toast.success("Logged in successfully");
        dispatch(setUser(res?.data));
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
    console.log(code, "linkdin e");
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_FRONT}/api/oauth`,
        {
          code,
        }
      );
      if (res.data.access_token) {
        console.log("get user data");
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
    console.log(accessToken, "access tokken");
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
    console.log(userData, "google data");
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
    <div className="flex flex-col md:!flex-row">
      {/* left side  */}
      <div className="w-full md:!w-[40%] flex flex-col justify-center pt-24 md:!pt-0">
        <div
          className="cursor-pointer ml-4 md:!ml-14 w-20 h-10"
          onClick={() => router.back()}
        >
          <div className="flex items-center gap-1 mb-7">
            <IoIosArrowBack size={32} className="!text-mainColor" />
            <span className="text-sm">
              <Translate text="Back" />
            </span>
          </div>
        </div>
        <div className="flex flex-col px-14 md:!px-28">
          <h2 className="text-[30px] font-bold">
            <Translate text="Welcome back!" />
          </h2>
          <div className="w-full">
            <form className="pt-6 mb-4" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label
                  className="block text-gray-700 text-sm mb-3"
                  htmlFor="email"
                >
                  <Translate text="Email" />
                </label>
                <input
                  className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  name="email"
                  type="email"
                />
              </div>
              <div className="mb-3">
                <label
                  className="block text-gray-700 text-sm mb-3"
                  htmlFor="Phone"
                >
                  <Translate text="Phone Number" />
                </label>
                <input
                  className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="phone"
                  name="phone"
                  type="text"
                />
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <label className="block text-gray-500 font-semibold">
                    <input className="mr-2 leading-tight" type="checkbox" />
                    <span className="text-sm">
                      <Translate text="Remember me" />
                    </span>
                  </label>
                </div>
              </div>
              <button
                className="!bg-mainColor text-sm hover:!bg-gray-500 text-white w-full py-1.5 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                <Translate text="Log In" />
              </button>
            </form>
            {!whiteLabeled && (
              <Link
                href="mailto:support@proptexx.com"
                className="flex justify-center items-center text-sm text-[#000000] cursor-pointer"
              >
                <span>
                  <Translate text="Contact us" />
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* right side  */}
      <div className="w-full md:!w-[60%] flex flex-col justify-center items-center gap-9 h-[100vh] bg-gradient-to-bl from-mainColor to-[#333333]">
        {!whiteLabeled && (
          <>
            <p className="text-white px-14 md:!px-36 text-[25px] md:!text-[27px] font-bold text-center leading-relaxed">
              <Translate
                text="Join over 10,000+ leading brands, brokerages, service providers
              and realtors."
              />
            </p>
            <img
              src="/images/partner-logos.png"
              height=""
              className="pb-5 px-10 md:!px-36 w-full md:!w-11/12 opacity-80"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default WidgetLogin;
