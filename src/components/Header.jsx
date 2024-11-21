"use client";
import {
  resetUser,
  selectUserId,
  setLanguage,
  setUser,
} from "@/Redux/slices/authSlice";
import { sendHeartbeat } from "@/utils/heartBeat";
import { whiteLabeled } from "@/utils/sampleData";
import { Box, Modal, Tooltip } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CTAModalAPI from "./CTAModalAPI";
import TooltipThemeProvider from "./TooltipThemeProvider";
import Translate from "./Translate";
import { HEARTBEAT_INTERVAL } from "@/constant";
import { persistor } from "@/Redux/store";
import { parse, serialize } from 'cookie';
import "../app/globals.css"

const style = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
const Header = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const { user } = useSelector((state) => state.auth.user);
  const params = useSearchParams();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [credits, setCredits] = useState(null);
  const [open2, setOpen2] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [api, setApi] = useState(null);
  const [copy, setCopy] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [logo, setLogo] = useState("");
  const { language } = useSelector((state) => state.auth);
  const [themeColor, setThemeColor] = useState('');
  const [fontColor, setFontColor] = useState('');

  useEffect(() => {
    const fetchOrigin = async () => {
      const currentUrl = window.location.href;
      switch (true) {
        case currentUrl.includes('ilist'):
          setThemeColor('bg-ilist');
          setFontColor('text-ilist');
          break;
        case currentUrl.includes('exp'):
          setThemeColor('bg-exp');
          setFontColor('text-exp');
          break;
        case currentUrl.includes('viking'):
          setThemeColor('bg-viking');
          setFontColor('text-viking');
          break;
        case currentUrl.includes('kwcp'):
          setThemeColor('bg-kwcp');
          setFontColor('text-kwcp');
          break;
        case currentUrl.includes('cb'):
          setFontColor('text-cb');
          setThemeColor('bg-cb')
          break;
        case currentUrl.includes('c21'):
          setFontColor('text-c21');
          setThemeColor('bg-c21')
          break;
        case currentUrl.includes('realsmart'):
          setFontColor('text-realsmart');
          setThemeColor('bg-realsmart')
          break;
        case currentUrl.includes('realty'):
          setFontColor('text-realty');
          setThemeColor('bg-realty')
          break;
        default:
          setThemeColor('bg-default');
          setFontColor('text-default');
          console.warn('No matching provider found.');
      }


      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch (error) {
        console.error("Error fetching region:ssss", error);
      }
      const logoUrl = getLogo();
      setLogo(logoUrl);
      console.log('signed in user', user);
    };

    fetchOrigin();
  }, []);

  const gotoPlans = () => {
    router.push("/plans");
  }

  const logout = async () => {
    try {
      if (userId) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URI}/api/users/logout`,
          { userId }
        );
      }
      await persistor.purge();
      dispatch(resetUser({}));
      localStorage.clear();
      setDropdownOpen(false);
      setTimeout(() => {
        router.push("/login");
      }, 500);
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (user?.phone && pathname !== "/dashboard/widgetdashboard") {
      router.push("/dashboard/widgetdashboard");
    } else if (pathname === "/dashboard/widgetdashboard" && !user?.phone) {
      router.push("/");
    }
    let intervalId;
    const doSendHeartbeat = () => {
      if (!userId) {
        if (intervalId) {
          clearInterval(intervalId);
        }
        return;
      }

    };
    doSendHeartbeat();
    intervalId = setInterval(doSendHeartbeat, HEARTBEAT_INTERVAL);

    return () => clearInterval(intervalId);
  }, [userId, dispatch, user]);

  const handleLanguageChange = (e) => {
    dispatch(setLanguage(e.target.value));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose2 = () => {
    setOpen2(false);
    setApi(null);
  };
  const submitTrial = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/api/payment/paymenttrial/${process.env.NEXT_PUBLIC_API_FRONT}`,
        { name, email, password }
      );
      if (res?.data?.success) {
        setEmail(null);
        setPassword(null);
        setName(null);
        router.push(res.data.session?.url);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if (error.response) toast.error(error.response.data.message);
    }
  };

  const submitApi = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/api/payment/paymenttrial/${process.env.NEXT_PUBLIC_API_FRONT}`,
        { name, email, password, credits }
      );
      if (res?.data?.success) {
        setApi(res.data.api);
        setEmail("");
        setName("");
        setPassword("");
        setCredits("");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if (error.response) toast.error(error.response.data.message);
    }
  };

  const copyToClipboard = () => {
    setCopy(true);
    navigator.clipboard.writeText(api);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  };

  const getLogo = () => {
    let url = window.location.href;
    console.log('url', url);
    if (url.includes('exp')) return '/logos/exp.png';
    if (url.includes('viking')) return '/logos/viking.png';
    if (url.includes('c21')) return '/logos/c21.png';
    if (url.includes('cb')) return '/logos/cb.png';
    if (url.includes('kwcp')) return '/logos/kwcp.png';
    if (url.includes('realsmart')) return '/logos/realsmart.png';
    if (url.includes('realty')) return '/logos/realty.png';
    return '/logos/ilist.png'
  }

  // const handleLoginClick = (e) => {
  //   e.preventDefault();
  //   const currentUrl = window.location.href;
  //   document.cookie = serialize('loginUrl', '', { path: '/', maxAge: -1 });
  //   document.cookie = `loginUrl=${encodeURIComponent(currentUrl)}; path=/;`
  //   // router.push('/login');
  // }

  return (
    <header className="z-[1001] sticky top-0 left-0 right-0">
      <nav className="!bg-white backdrop-blur-[10px] border-[0.5px] border-[#e9e9e9] px-2 sm:!px-4 lg:!px-14 py-3">
        <div className="flex justify-between items-center flex-row mx-auto gap-5">
          <div className="flex items-center">
            <img
              src={logo}
              className="mr-3 h-[30px] sm:!h-[35px]"
              alt="Proptexx Logo"
            />
          </div>
          <div className="flex items-center lg:!order-2">
            {user && (
              <div
                className="relative flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >

                <OutsideClickHandler
                  onOutsideClick={() => {
                    setDropdownOpen(false);
                  }}
                >
                  <div
                    onClick={async () => {
                      setDropdownOpen(!dropdownOpen);
                      console.log('latest value', user)
                    }}
                    className={`cursor-pointer flex items-center gap-2 text-white ${themeColor} border-[1px] !border-Color font-bold rounded-lg text-sm px-3 py-2 mr-2 uppercase text-center transform transition-transform duration-500 hover:scale-110`}
                  >
                    <p className="header_plan_name">
                      <Translate text={user?.planName?.replace("_", " ")} />
                    </p>
                    <p
                      className={`flex justify-center items-center rounded-full h-5 w-5 text-xs ${toggle
                        ? `${themeColor} text-white`
                        : `bg-white ${fontColor}`
                        }`}
                    >
                      {user?.name?.[0]}
                    </p>
                  </div>
                  {dropdownOpen && (
                    <div className="absolute right-0 top-9 mt-2 bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg z-10">
                      <div className="flex items-center justify-start gap-2 px-4 py-2">
                        <p
                          className={`flex justify-center items-center rounded-full h-10 w-10 text-sm font-bold ${themeColor} text-white`}
                        >
                          {user?.name?.[0]}
                        </p>
                        <div className="">
                          <p>
                            <Translate text={user?.name} />
                          </p>
                          <p className="text-sm">
                            <Translate text={user?.email} />
                          </p>
                        </div>
                      </div>

                      {!whiteLabeled && (
                        <>
                          <div className="px-4 py-2 text-gray-800 hover:!bg-gray-100 flex justify-between cursor-pointer" onClick={gotoPlans}>
                            <div>
                              <Translate text="Plans" />{" "}
                            </div>
                          </div>
                          <div className="px-4 py-2 text-gray-800 hover:!bg-gray-100 flex justify-between">
                            <div>
                              <Translate text="Credits" />{" "}
                              <span className="font-bold">
                                <Translate
                                  text={user.creditsPerMonth || "0"}
                                />
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </OutsideClickHandler>
              </div>
            )}
            <select
              id="language"
              className="language-select h-[40px] px-[8px] max-w-[125px] border border-[#9c9c9c] bg-white rounded-[4px]"
              onChange={handleLanguageChange}
              value={language.slice(0, 2)}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="es">Español</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
              <option value="ru">Русский</option>
              <option value="bg">български</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
              <option value="ar">العربية</option>
              <option value="hi">हिंदी</option>
              <option value="bn">বাংলা</option>
              <option value="ur">اردو</option>
              <option value="id">Indonesian</option>
              <option value="ms">Malay</option>
              <option value="mn">Монгол</option>
              <option value="vi">Tiếng Việt</option>
              <option value="th">ภาษาไทย</option>
              <option value="sw">Kiswahili</option>
              <option value="kk">қазақ</option>
              <option value="nl">Dutch</option>
              <option value="sr">српски</option>
              <option value="sv">Svenska</option>
              <option value="fi">Suomi</option>
              <option value="sq">shqip</option>
              <option value="no">Norsk</option>
              <option value="da">Dansk</option>
              <option value="pl">Polski</option>
              <option value="pt">Português</option>
              <option value="cs">Čeština</option>
              <option value="el">Ελληνικά</option>
              <option value="tr">Türkçe</option>
              <option value="he">עברית</option>
              <option value="fa">فارسی</option>
            </select>
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Header;
