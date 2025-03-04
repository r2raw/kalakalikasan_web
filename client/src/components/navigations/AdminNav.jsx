import React from "react";
// import brand_logo from "../../assets/images/brand_logo_no_circle_fit.png";
// import brand_logo from "../../assets/images/new_brand_logo.png";
import brand_logo from '../../assets/logo/logo_transparent.png'
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import AdminNavList from "./AdminNavList";
import { NavLink, useNavigate } from "react-router-dom";
import { authActions } from "../../store/slices/authSlice";
import { useDispatch } from "react-redux";
function AdminNav({ list_nav }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('id');
    navigate('/login')
    // dispatch(authActions.logout());
  }
  return (
    <aside className="w-1/5 flex flex-col gap-8 py-8 px-4 fixed h-dvh z-50">
      <NavLink to={'./'} className="flex flex-col justify-center items-center gap-2">
        <img
          className="w-24 h-24 lg:w-32 md:h-32 xl:w-56 lg:h-56"
          src={brand_logo}
          alt="logo"
        />
        {/* <h2 className="text-dark_font font-mono text-ssm md:text-base lg:text-lg xl:text-xl">
          KalaKalikasan
        </h2> */}
      </NavLink>
      <nav className="flex flex-col justify-between bg-secondary_color h-full rounded-2xl py-6 pr-2 md:pr-4 shadow-2xl relative">
        <AdminNavList list_nav={list_nav} />
        <button onClick={handleLogout} className="text-red_highlight flex gap-2 items-center py-2 px-4">
          <div className="nav-icon">
            <LogoutSharpIcon />
          </div>
          <h5 className=" hidden lg:inline-block text-red_highlight">Logout</h5>
        </button>
      </nav>
    </aside>
  );
}

export default AdminNav;
