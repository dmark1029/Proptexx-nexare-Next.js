"use client";
import { setUser } from "@/Redux/slices/authSlice";
import Translate from "@/components/Translate";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";

const Success = ({ params }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth.user);
  const { redirection } = useSelector((state) => state.auth);
  const planDetail = params.id.split("_");

  let currentUrl = window.location.href;

  const fetcher = (url) =>
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        planDuration: planDetail[0],
        credits: parseFloat(planDetail[1]),
        price: parseFloat(planDetail[2]),
        planName: planDetail[4]
          ? `${planDetail[3]}_${planDetail[4]}`
          : planDetail[3],
        user: user
      }),
    }).then((r) => {
      if (process.env.REACT_ENV === "production") {
        gtag_report_conversion(`/`);
      }
      return r.json();
    });
  let tempUrl = currentUrl.includes('ilist') ? 'https://backend.proptexx.com' : 'https://backend-rep.proptexx.com'
  const { data } = useSWR(
    `${tempUrl}/api/payment/paymentsuccess`,
    fetcher
  );
  if (data?.success) {
    const creditsPerMonth = data.user.creditsPerMonth;
    const planDuration = data.user.planDuration;
    const stripeCustomerId = data.user.stripeCustomerId;
    setTimeout(() => {
      dispatch(
        setUser({
          user: {
            ...user,
            planDuration,
            creditsPerMonth,
            stripeCustomerId,
          },
        })
      );
      router.push("/plans");
    }, 2000);
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <>
          <img
            src="https://i.gifer.com/7efs.gif"
            alt="Success"
            className="mx-auto"
          />
          <p className="text-green-600 text-center mt-4">
            <Translate text="Your Payment is successful. Thank you for your purchase." />
          </p>
        </>
      </div>
    </div>
  );
};

export default Success;
