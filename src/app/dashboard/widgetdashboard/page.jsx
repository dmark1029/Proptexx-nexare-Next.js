"use client";
import { useState, useEffect } from "react";
import WidgetTheme from "@/components/WidgetDashboard/WidgetTheme";
import WidgetUserCount from "@/components/WidgetDashboard/WidgetUserCount";
import WidgetAnalytics from "@/components/WidgetDashboard/WidgetAnalytics";
import WidgetUsersTable from "@/components/WidgetDashboard/WidgetUsersTable";
import WidgetUsageTable from "@/components/WidgetDashboard/WidgetUsageTable";
import axios from "axios";
import { useSelector } from "react-redux";

const WidgetDashboard = () => {
  const [widgetAxis, setWidgetAxis] = useState({
    xAxis: "",
    yAxis: "",
    isNotfloatingIcon: false,
  });

  const [widgetLogo, setWidgetLogo] = useState({
    logoText: "",
    logoIcon: "",
  });

  const [isDoorinsiderAdmin, setIsDoorinsiderAdmin] = useState(false);

  const { token, user } = useSelector((state) => state.auth.user);

  const checkForDoorinsider = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/api/widget/isDoorinsiderAdmin`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data.flag) {
        setIsDoorinsiderAdmin(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkForDoorinsider();
  }, []);
  return (
    <>
      <div className="grid !grid-cols-1 md:!grid-cols-[1fr_4fr] gap-0 md:gap-6">
        <WidgetTheme
          widgetAxis={widgetAxis}
          setWidgetAxis={setWidgetAxis}
          widgetLogo={widgetLogo}
          setWidgetLogo={setWidgetLogo}
        />
        <div className="flex-grow bg-[#F1F5F9] p-1 md:p-8 max-h-[100vh] overflow-y-auto">
          <WidgetUserCount />
          <WidgetAnalytics />
          <WidgetUsersTable
            widgetAxis={widgetAxis}
            setWidgetAxis={setWidgetAxis}
            widgetLogo={widgetLogo}
            setWidgetLogo={setWidgetLogo}
          />

          {isDoorinsiderAdmin && <WidgetUsageTable />}
        </div>
      </div>
    </>
  );
};

export default WidgetDashboard;
