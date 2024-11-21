"use client";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const AuhtProvider = ({ children }) => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth.user);

  return <SessionProvider>{children}</SessionProvider>;
};

export default AuhtProvider;
