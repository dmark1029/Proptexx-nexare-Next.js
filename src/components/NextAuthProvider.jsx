"use client";
import { SessionProvider } from "next-auth/react";

const NextAuhtProvider = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuhtProvider;
