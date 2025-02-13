import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom';


//ICONS

import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import DashboardSharpIcon from "@mui/icons-material/DashboardSharp";
import StoreSharpIcon from "@mui/icons-material/StoreSharp";
import AddBusinessSharpIcon from "@mui/icons-material/AddBusinessSharp";
import ArchiveSharpIcon from "@mui/icons-material/ArchiveSharp";
import PeopleAltSharpIcon from "@mui/icons-material/PeopleAltSharp";
import ManageAccountsSharpIcon from "@mui/icons-material/ManageAccountsSharp";
import NewspaperSharpIcon from "@mui/icons-material/NewspaperSharp";
import SettingsSharpIcon from "@mui/icons-material/SettingsSharp";
import PaymentsSharpIcon from '@mui/icons-material/PaymentsSharp';
import AnalyticsSharpIcon from "@mui/icons-material/AnalyticsSharp";

function AdminNavList() {

  const [selectedNav, setSelectedNav] = useState(null);
  const navRef = useRef(null);
  const handleParentNav = (e, nav) => {
    e.preventDefault();
    setSelectedNav(nav);
  }

  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setSelectedNav(null); // Close the menu
      }
    };

    // Add event listener for clicks outside
    document.addEventListener('click', handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelectedNav(null)
  }, [location])
  return (
    <ul ref={navRef}>
      <li className=" text-dark_font">
        <NavLink
          to='.'
          className={({ isActive }) => !isActive ? "flex justify-between items-center py-2 w-full px-4" : "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font"} end
        >
          <div className="flex gap-2 items-center">
            <div className="nav-icon"><DashboardSharpIcon /></div>
            <h3 className="text-lg hidden  lg:inline-block">Dashboard</h3>
          </div>
        </NavLink>
      </li>
      <li className=" text-dark_font">
        <NavLink to='stores' onClick={(e) => handleParentNav(e, 'stores')}
          className={({ isActive }) => !isActive ? "flex justify-between items-center py-2 w-full px-4" : "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font"}
        // onClick={handleClick}
        // className={currentRoute != item.title ? "flex justify-between items-center py-2 w-full px-4" : "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font"}
        >
          <div className="flex gap-2 items-center">
            <div className="nav-icon"><StoreSharpIcon /></div>
            <h3 className="text-lg hidden  lg:inline-block">Stores</h3>
          </div>
          <div className="nav-icon-arrow relative">
            <ArrowForwardIosSharpIcon />
            {selectedNav == 'stores' && <ul className=" flex flex-col gap-2 top-0 bg-light_gradient_top shadow-lg rounded-md ml-6 absolute left-full">

              <NavLink to='stores/list' className={({ isActive }) => isActive ? "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font rounded-t-md" : "flex justify-between items-center py-2 w-full px-4 text-dark_font rounded-t-md"} >
                <div className="flex gap-2 items-center">
                  <div className="nav-icon"><StoreSharpIcon /></div>
                  <h3 className=" text-sm">Register Store</h3>
                </div>
              </NavLink>
              <NavLink to='stores/application-request' className={({ isActive }) => isActive ? "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font" : "flex justify-between items-center py-2 w-full px-4 text-dark_font"} >
                <div className="flex gap-2 items-center">
                  <div className="nav-icon"><AddBusinessSharpIcon /></div>
                  <h3 className=" text-sm">Application Request</h3>
                </div>
              </NavLink>
              <NavLink to='stores/archived' className={({ isActive }) => isActive ? "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font rounded-b-md" : "flex justify-between items-center py-2 w-full px-4 text-dark_font rounded-b-md"}  >
                <div className="flex gap-2 items-center">
                  <div className="nav-icon"><ArchiveSharpIcon /></div>
                  <h3 className=" text-sm">Archived Stores</h3>
                </div>
              </NavLink>

            </ul>}
          </div>
        </NavLink>
      </li>
      <li className=" text-dark_font">
        <NavLink to='accounts' onClick={(e) => handleParentNav(e, 'accounts')}
          className={({ isActive }) => !isActive ? "flex justify-between items-center py-2 w-full px-4" : "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font"}
        // onClick={handleClick}
        // className={currentRoute != item.title ? "flex justify-between items-center py-2 w-full px-4" : "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font"}
        >
          <div className="flex gap-2 items-center">
            <div className="nav-icon"><PeopleAltSharpIcon /></div>
            <h3 className="text-lg hidden  lg:inline-block">Accounts</h3>
          </div>
          <div className="nav-icon-arrow relative">
            <ArrowForwardIosSharpIcon />
            {selectedNav == 'accounts' && <ul className=" flex flex-col gap-2 top-0 bg-light_gradient_top shadow-lg rounded-md ml-6 absolute left-full">

              <NavLink to='accounts/active' className={({ isActive }) => isActive ? "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font rounded-t-md" : "flex justify-between items-center py-2 w-full px-4 text-dark_font rounded-t-md"} >
                <div className="flex gap-2 items-center">
                  <div className="nav-icon"><ManageAccountsSharpIcon /></div>
                  <h3 className=" text-sm">Manage</h3>
                </div>
              </NavLink>
              <NavLink to='accounts/archived' className={({ isActive }) => isActive ? "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font rounded-b-md" : "flex justify-between items-center py-2 w-full px-4 text-dark_font rounded-b-md"} >
                <div className="flex gap-2 items-center">
                  <div className="nav-icon"><ArchiveSharpIcon /></div>
                  <h3 className=" text-sm">Archived Accounts</h3>
                </div>
              </NavLink>

            </ul>}
          </div>
        </NavLink>
      </li>
      <li className=" text-dark_font">
        <NavLink to='contents' onClick={(e) => handleParentNav(e, 'contents')}
          className={({ isActive }) => !isActive ? "flex justify-between items-center py-2 w-full px-4" : "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font"}
        // onClick={handleClick}
        // className={currentRoute != item.title ? "flex justify-between items-center py-2 w-full px-4" : "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font"}
        >
          <div className="flex gap-2 items-center">
            <div className="nav-icon"><NewspaperSharpIcon /></div>
            <h3 className="text-lg hidden  lg:inline-block">Contents</h3>
          </div>
          <div className="nav-icon-arrow relative">
            <ArrowForwardIosSharpIcon />
            {selectedNav == 'contents' && <ul className=" flex flex-col gap-2 top-0 bg-light_gradient_top shadow-lg rounded-md ml-6 absolute left-full">

              <NavLink to='contents/list' className={({ isActive }) => isActive ? "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font rounded-t-md" : "flex justify-between items-center py-2 w-full px-4 text-dark_font rounded-t-md"} >
                <div className="flex gap-2 items-center">
                  <div className="nav-icon"><SettingsSharpIcon /></div>
                  <h3 className=" text-sm">Manage</h3>
                </div>
              </NavLink>
              <NavLink to='contents/archived' className={({ isActive }) => isActive ? "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font rounded-b-md" : "flex justify-between items-center py-2 w-full px-4 text-dark_font rounded-b-md"} >
                <div className="flex gap-2 items-center">
                  <div className="nav-icon"><ArchiveSharpIcon /></div>
                  <h3 className=" text-sm">Archived Contents</h3>
                </div>
              </NavLink>

            </ul>}
          </div>
        </NavLink>
      </li>
      <li className=" text-dark_font">
        <NavLink
          to='payments'
          className={({ isActive }) => !isActive ? "flex justify-between items-center py-2 w-full px-4" : "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font"}
        >
          <div className="flex gap-2 items-center">
            <div className="nav-icon"><PaymentsSharpIcon /></div>
            <h3 className="text-lg hidden  lg:inline-block">Payment Request</h3>
          </div>
        </NavLink>
      </li>
      <li className=" text-dark_font">
        <NavLink
          to='analytics'
          className={({ isActive }) => !isActive ? "flex justify-between items-center py-2 w-full px-4" : "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font"}
        >
          <div className="flex gap-2 items-center">
            <div className="nav-icon"><AnalyticsSharpIcon /></div>
            <h3 className="text-lg hidden  lg:inline-block">Analytics</h3>
          </div>
        </NavLink>
      </li>
    </ul>
  )
}

export default AdminNavList