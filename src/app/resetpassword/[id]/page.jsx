"use client";
import { toast } from "react-toastify";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/Redux/slices/authSlice";
import Translate from "@/components/Translate";

const Resetpassword = ({ params }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    if (!confirmPassword || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URI}/api/users/resetpassword/${params.id}`,
        {
          password,
          confirmPassword,
        }
      );
      if (res?.data?.success) {
        toast.success("Password successfully reset");
        dispatch(setUser(res.data));
        router.push("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col md:!flex-row">
      {/* left side  */}
      <div className="w-full md:!w-[40%] flex flex-col justify-center pt-24 md:!pt-0">
        <Link href="/forget-password" className="ml-4 md:!ml-14 w-20 h-10">
          <div className="flex items-center gap-1 mb-7">
            <IoIosArrowBack size={32} color="#4497ce" />
            <span className="text-sm">
              <Translate text="Back" />
            </span>
          </div>
        </Link>
        <div className="flex flex-col px-14 md:!px-28">
          <h2 className="text-[30px] font-bold">
            <Translate text="Reset Password" />
          </h2>

          <div className="w-full">
            <form className="pt-6 mb-4" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label
                  className="block text-gray-700 text-sm mb-3"
                  htmlFor="password"
                >
                  <Translate text="New Password" />
                </label>
                <input
                  className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  name="password"
                  type="password"
                />
              </div>
              <div className="mb-3">
                <label
                  className="block text-gray-700 text-sm mb-3"
                  htmlFor="confirmPassword"
                >
                  <Translate text="Confirm Password" />
                </label>
                <input
                  className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                />
              </div>
              <button
                className="!bg-[#4497ce] text-sm hover:!bg-gray-500 text-white w-full py-1.5 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                <Translate text="Reset Password" />
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* right side  */}
      <div className="w-full md:!w-[60%] flex flex-col justify-center items-center gap-9 h-[100vh] bg-gradient-to-bl from-[#418DFF] to-[#124B70]">
        <p className="text-white px-14 md:!px-36 text-[25px] md:!text-[27px] font-bold text-center leading-relaxed">
          <Translate
            text="Join over 10,000+ leading brands, brokerages, service providers and
          realtors."
          />
        </p>
        <img
          src="/images/partner-logos.png"
          height=""
          className="pb-5 px-10 md:!px-36 w-full md:!w-11/12 opacity-80"
        />
      </div>
    </div>
  );
};

export default Resetpassword;
