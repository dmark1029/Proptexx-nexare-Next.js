"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export const OneCredit = ({ NameModel, onclick }) => {
  const dispatch = useDispatch();
  getuser = useSelector((state) => state.auth.user);
  if (user?.usercredits?.[NameModel] === 1) {
    if (onclick) {
      dispatch({
        ...getuser,
        user: {
          ...getuser.user,
          usercredit: { ...getuser?.user?.usercredit, [NameModel]: 0 },
        },
      });
    }
    return true;
  } else return false;
};
