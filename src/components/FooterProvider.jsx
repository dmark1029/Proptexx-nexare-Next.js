"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Footer from "./Footer";
import FooterPricing from "./FooterPricing";

const FooterProvider = () => {
  const pathname = usePathname();

  return <>{pathname == "/plans" ? <FooterPricing /> : pathname != "/login" && pathname != "/register" && pathname != "/forget-password"  ? <div className="mt-28 md:!12"><Footer /></div>:null}</>;
};

export default FooterProvider;
