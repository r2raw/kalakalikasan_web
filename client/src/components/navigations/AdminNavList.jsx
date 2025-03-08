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
      <li className=" text-base_color">
        <NavLink
          to='.'
          className={({ isActive }) => !isActive ? "flex justify-between items-center py-2 w-full px-2 md:px-4" : "flex justify-between items-center py-2 w-full px-2 md:px-4 text-base_color bg-accent_color rounded-r-2xl"} end
        >
          <div className="flex gap-2 items-center">
            <div className="nav-icon"><DashboardSharpIcon /></div>
            <h3 className="text-lg hidden  lg:inline-block">Dashboard</h3>
          </div>
        </NavLink>
      </li>
      <li className="  text-base_color">
        <NavLink to='stores' onClick={(e) => handleParentNav(e, 'stores')}
          className={({ isActive }) => !isActive ? "flex justify-between items-center py-2 w-full px-2 md:px-4" : "flex justify-between items-center py-2 w-full px-2 md:px-4 text-base_color bg-accent_color rounded-r-2xl"}
        // onClick={handleClick}
        // className={currentRoute != item.title ? "flex justify-between items-center py-2 w-full px-4" : "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font"}
        >
          <div className="flex gap-2 items-center">
            <div className="nav-icon"><StoreSharpIcon /></div>
            <h3 className="text-lg hidden  lg:inline-block">Stores</h3>
          </div>
          <div className="nav-icon-arrow relative">
            <ArrowForwardIosSharpIcon />
            {selectedNav == 'stores' && <ul className=" flex flex-col gap-2 top-0 bg-secondary_color shadow-lg rounded-md ml-10 absolute md:left-full">

              <NavLink to='stores' className={({ isActive }) => isActive ? "flex justify-between items-center py-2 w-full px-4 text-base_color bg-accent_color rounded-t-md" : "flex justify-between items-center py-2 w-full px-4 text-base_color rounded-t-md"} end >
                <div className="flex gap-2 items-center">
                  <div className="nav-icon"><StoreSharpIcon /></div>
                  <h3 className=" text-sm">Register Store</h3>
                </div>
              </NavLink>
              <NavLink to='stores/application-request' className={({ isActive }) => isActive ? "flex justify-between items-center py-2 w-full px-4 text-base_color bg-accent_color" : "flex justify-between items-center py-2 w-full px-4 text-base_color"} >
                <div className="flex gap-2 items-center">
                  <div className="nav-icon"><AddBusinessSharpIcon /></div>
                  <h3 className=" text-sm">Application Request</h3>
                </div>
              </NavLink>
              {/* <NavLink to='stores/archived' className={({ isActive }) => isActive ? "flex justify-between items-center py-2 w-full px-4 text-base_color bg-accent_color rounded-b-md" : "flex justify-between items-center py-2 w-full px-4 text-base_color rounded-b-md"}  >
                <div className="flex gap-2 items-center">
                  <div className="nav-icon"><ArchiveSharpIcon /></div>
                  <h3 className=" text-sm">Archived Stores</h3>
                </div>
              </NavLink> */}

            </ul>}
          </div>
        </NavLink>
      </li>
      <li className="  text-base_color">
        <NavLink to='accounts' onClick={(e) => handleParentNav(e, 'accounts')}
          className={({ isActive }) => !isActive ? "flex justify-between items-center py-2 w-full px-2 md:px-4" : "flex justify-between items-center py-2 w-full px-2 md:px-4 text-base_color  bg-accent_color rounded-r-2xl"}
        // onClick={handleClick}
        // className={currentRoute != item.title ? "flex justify-between items-center py-2 w-full px-4" : "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font"}
        >
          <div className="flex gap-2 items-center">
            <div className="nav-icon"><PeopleAltSharpIcon /></div>
            <h3 className="text-lg hidden  lg:inline-block">Accounts</h3>
          </div>
          <div className="nav-icon-arrow relative">
            <ArrowForwardIosSharpIcon />
            {selectedNav == 'accounts' && <ul className=" flex flex-col gap-2 top-0 bg-secondary_color shadow-lg rounded-md ml-10 absolute md:left-full">

              <NavLink to='accounts' className={({ isActive }) => isActive ? "flex justify-between items-center py-2 w-full px-4 text-base_color bg-accent_color rounded-t-md" : "flex justify-between items-center py-2 w-full px-4 text-base_color rounded-t-md"} end >
                <div className="flex gap-2 items-center">
                  <div className="nav-icon"><ManageAccountsSharpIcon /></div>
                  <h3 className=" text-sm">Manage</h3>
                </div>
              </NavLink>
              <NavLink to='accounts/archived' className={({ isActive }) => isActive ? "flex justify-between items-center py-2 w-full px-4 text-base_color bg-accent_color rounded-b-md" : "flex justify-between items-center py-2 w-full px-4 text-base_color rounded-b-md"} >
                <div className="flex gap-2 items-center">
                  <div className="nav-icon"><ArchiveSharpIcon /></div>
                  <h3 className=" text-sm">Archived Accounts</h3>
                </div>
              </NavLink>

            </ul>}
          </div>
        </NavLink>
      </li>
      <li className=" text-base_color">
        <NavLink to='contents' onClick={(e) => handleParentNav(e, 'contents')}
          className={({ isActive }) => !isActive ? "flex justify-between items-center py-2 w-full px-2 md:px-4" : "flex justify-between items-center py-2 w-full px-2 md:px-4 text-base_color  bg-accent_color rounded-r-2xl"}
        // onClick={handleClick}
        // className={currentRoute != item.title ? "flex justify-between items-center py-2 w-full px-4" : "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font"}
        >
          <div className="flex gap-2 items-center">
            <div className="nav-icon"><NewspaperSharpIcon /></div>
            <h3 className="text-lg hidden  lg:inline-block">Contents</h3>
          </div>
          <div className="nav-icon-arrow relative">
            <ArrowForwardIosSharpIcon />
            {selectedNav == 'contents' && <ul className=" flex flex-col gap-2 top-0 bg-secondary_color shadow-lg rounded-md ml-10 absolute md:left-full">

              <NavLink to='contents' className={({ isActive }) => isActive ? "flex justify-between items-center py-2 w-full px-4 text-base_color bg-accent_color rounded-t-md" : "flex justify-between items-center py-2 w-full px-4 text-base_color rounded-t-md"} end >
                <div className="flex gap-2 items-center">
                  <div className="nav-icon"><SettingsSharpIcon /></div>
                  <h3 className=" text-sm">Manage</h3>
                </div>
              </NavLink>
              <NavLink to='contents/archived' className={({ isActive }) => isActive ? "flex justify-between items-center py-2 w-full px-4 text-base_color bg-accent_color rounded-b-md" : "flex justify-between items-center py-2 w-full px-4 text-base_color rounded-b-md"}  end >
                <div className="flex gap-2 items-center">
                  <div className="nav-icon"><ArchiveSharpIcon /></div>
                  <h3 className=" text-sm">Archived Contents</h3>
                </div>
              </NavLink>

            </ul>}
          </div>
        </NavLink>
      </li>
      <li className=" text-base_color">
        <NavLink
          to='payments'
          className={({ isActive }) => !isActive ? "flex justify-between items-center py-2 w-full px-2 md:px-4" : "flex justify-between items-center py-2 w-full px-2 md:px-4 text-base_color  bg-accent_color rounded-r-2xl"}
        >
          <div className="flex gap-2 items-center">
            <div className="nav-icon"><PaymentsSharpIcon /></div>
            <h3 className="text-lg hidden  lg:inline-block">Payment Request</h3>
          </div>
        </NavLink>
      </li>
      <li className=" text-base_color">
        <NavLink
          to='reports'
          className={({ isActive }) => !isActive ? "flex justify-between items-center py-2 w-full px-2 md:px-4" : "flex justify-between items-center py-2 w-full px-2 md:px-4 text-base_color  bg-accent_color rounded-r-2xl"}
        >
          <div className="flex gap-2 items-center">
            <div className="nav-icon"><AnalyticsSharpIcon /></div>
            <h3 className="text-lg hidden  lg:inline-block">Reports</h3>
          </div>
        </NavLink>
      </li>
    </ul>
  )
}

export default AdminNavList