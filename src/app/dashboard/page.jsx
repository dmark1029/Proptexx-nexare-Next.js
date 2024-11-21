import UserAnalytics from "@/components/UserAnalytics";
import GiveWidgetAccess from "@/components/GiveWidgetAccess";
import WidgetUsersAnalytics from "@/components/WidgetUsersAnalytics";
import GiveTrial from "@/components/GiveTrial";
import GiveAPI from "@/components/GiveAPI";
import WidgetAdminAccess from "@/components/WidgetAdminAccess";
import DashBoardAdminMenu from "@/components/DashBoardAdminMenu";
import ExtensionUsersAnalytics from "@/components/ExtensionUsersAnalytics";
import WidgetDocs from "@/components/WidgetDocs";
import { getApiTrialUsers, getContactList } from "@/services/apiandtrialusers";
import ContactList from "@/components/ContactList";

const getDocsList = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}/api/docs/documents`,
      {
        cache: "no-cache",
      }
    );
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const docs = await response.json();
    return docs?.docs;
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
};
const Dashboard = async ({ searchParams }) => {
  const apiUsers = await getApiTrialUsers();
  const getDocs = await getDocsList();
  const getContacts = await getContactList();
  const menuIndex = parseInt(searchParams.index) || 0;
  return (
    <>
      <div className="sticky md:!h-[calc(100vh-200px)] top-20 w-full">
        <div className="flex flex-col md:!flex-row">
          <DashBoardAdminMenu menuIndex={menuIndex} />
          <div className="w-full bg-slate-100 md:!w-9/12 h-[calc(100vh-100px)]  overflow-y-auto">
            {menuIndex == 0 && <UserAnalytics />}
            {menuIndex == 1 && <WidgetUsersAnalytics />}
            {menuIndex == 2 && <ExtensionUsersAnalytics />}
            {menuIndex == 3 && <GiveWidgetAccess />}
            {menuIndex == 4 && <GiveAPI apiUsers={apiUsers?.apiUsers} />}
            {menuIndex == 5 && <GiveTrial trialUsers={apiUsers?.trialUsers} />}
            {menuIndex == 6 && <WidgetAdminAccess />}
            {menuIndex == 7 && <WidgetDocs getDocs={getDocs} />}
            {menuIndex == 8 && <ContactList getContacts={getContacts} />}
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
