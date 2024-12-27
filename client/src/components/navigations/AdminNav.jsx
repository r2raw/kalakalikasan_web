import React from "react";
import brand_logo from "../../assets/images/brand_logo.png";
import AdminNavItem from "./AdminNavItem";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import AdminNavList from "./AdminNavList";
import { NavLink } from "react-router-dom";
import { authActions } from "../../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
function AdminNav({ list_nav }) {
  const dispatch = useDispatch();
  const handleLogout = () => {

    dispatch(authActions.logout());
  }
  return (
    <aside className="w-1/5 flex flex-col gap-8 py-8 px-4 fixed h-dvh">
      <NavLink to={'./'} className="flex flex-col justify-center items-center gap-2">
        <img
          className="w-20 h-20 lg:w-32 md:h-32 xl:w-40 lg:h-40"
          src={brand_logo}
          alt="logo"
        />
        <h2 className="text-dark_font font-mono text-ssm md:text-base lg:text-lg xl:text-xl">
          KalaKalikasan
        </h2>
      </NavLink>
      <nav className="flex flex-col justify-between bg-light_gradient_top h-full rounded-2xl py-6 px-4 shadow-2xl relative">
        <AdminNavList list_nav={list_nav} />
        <button className="text-red-500 flex gap-2 items-center">
          <div className="nav-icon">
            <LogoutSharpIcon />
          </div>
          <button onClick={handleLogout}>
            <h5 className="text-dark_font hidden lg:inline-block">Logout</h5>
          </button>
        </button>
      </nav>
    </aside>
  );
}

export default AdminNav;
