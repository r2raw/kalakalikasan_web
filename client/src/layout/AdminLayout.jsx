import React, { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import brand_logo from "../assets/images/brand_logo.png";
import _ from 'lodash';
import AdminNav from "../components/navigations/AdminNav";

// MATERIAL ICONS
import DashboardSharpIcon from "@mui/icons-material/DashboardSharp";
import StoreSharpIcon from "@mui/icons-material/StoreSharp";
import AddBusinessSharpIcon from "@mui/icons-material/AddBusinessSharp";
import ArchiveSharpIcon from "@mui/icons-material/ArchiveSharp";
import PeopleAltSharpIcon from "@mui/icons-material/PeopleAltSharp";
import ManageAccountsSharpIcon from "@mui/icons-material/ManageAccountsSharp";
import NewspaperSharpIcon from "@mui/icons-material/NewspaperSharp";
import SettingsSharpIcon from "@mui/icons-material/SettingsSharp";
import RecyclingSharpIcon from "@mui/icons-material/RecyclingSharp";
import AnalyticsSharpIcon from "@mui/icons-material/AnalyticsSharp";
import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";

import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import { useSelector } from "react-redux";
const list_nav = [
  {
    title: "Dashboard",
    icon: <DashboardSharpIcon />,
    url: "./",
  },
  {
    title: "Stores",
    icon: <StoreSharpIcon />,
    children: [
      {
        title: "Apllication Request",
        icon: <AddBusinessSharpIcon />,
        url: "application-request",
      },
      {
        title: "Registered Stores",
        icon: <StoreSharpIcon />,
        url: "registered-stores",
      },
      {
        title: "Archived Stores",
        icon: <ArchiveSharpIcon />,
        url: "archived-stores",
      },
    ],
  },
  {
    title: "Accounts",
    icon: <PeopleAltSharpIcon />,
    children: [
      {
        title: "Manage Accounts",
        icon: <ManageAccountsSharpIcon />,
        url: "manage-accounts",
      },
      {
        title: "Archived Accounts",
        icon: <ArchiveSharpIcon />,
        url: "archived-accounts",
      },
    ],
  },
  {
    title: "Contents",
    icon: <NewspaperSharpIcon />,
    children: [
      {
        title: "Manage",
        icon: <SettingsSharpIcon />,
        url: "manage-contents",
      },
      {
        title: "Archived Contents",
        icon: <ArchiveSharpIcon />,
        url: "archived-contents",
      },
    ],
  },
  {
    title: "Collection Schedules",
    icon: <CalendarMonthSharpIcon />,
    url: "collection-schedules",
  },
  {
    title: "Materials",
    icon: <RecyclingSharpIcon />,
    children: [
      {
        title: "Manage",
        icon: <SettingsSharpIcon />,
        url: "manage-materials",
      },
      {
        title: "Archive",
        icon: <ArchiveSharpIcon />,
        url: "archived-materials",
      },
    ],
  },
  {
    title: "Analytics",
    icon: <AnalyticsSharpIcon />,
    url: "analytics",
  },
];

function AdminLayout() {
  const location = useLocation();
  let currRoute = location.pathname.replace("/admin/", "");

  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated])

  if (!currRoute) currRoute = 'Dashboard';
  if (currRoute && currRoute.includes('-')) currRoute = currRoute.replace('-', ' ');
  return (
    <div className="flex bg-gradient-to-b from-light_gradient_top to-white min-h-dvh">
      <AdminNav list_nav={list_nav} />
      <main className="h-full w-full ml-[20%] px-4">
        <div className="px-4 py-16 flex justify-between items-center text-dark_font">
          <h1 className="text-lg md:text-2xl lg:text-4xl">{_.startCase(currRoute)}</h1>
          <NavLink to={'my-profile'} className="flex gap-2 items-center">
            <AccountCircleSharpIcon />
            <h4 className="text-sm md:text-lg lg:text-xl">Administrator</h4>
          </NavLink>
        </div>
        <div className=" bg-white_fb min-h-[80dvh] w-full rounded-md shadow-2xl px-4 py-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
