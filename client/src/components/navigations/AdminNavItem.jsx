import React, { useState } from "react";
// MATERIAL ICON
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { currentRouteActions } from "../../store/slices/currentRouteSlice";
import { getURLString } from "../../myFunctions/myFunctions";
import {titleCase} from 'title-case';

function AdminNavItem({ item, selectedNav, setSelectedNav }) {
  const hasChild = !item.url;
  const location = useLocation();

  const dispatch = useDispatch();

  const handleClick = () => {
    // setChildItemOpen(!childItemOpen);

    if (!hasChild) {
      setSelectedNav(null);
      dispatch(currentRouteActions.selectedRoute(item.title))
      return;
    };

    if (item.title != selectedNav) {
      return setSelectedNav(item.title);
    }

    setSelectedNav(null);
  };


  const handleChildNav = () => {
    dispatch(currentRouteActions.selectedRoute(item.title))
  }
  let content = (
    <NavLink
      to={item.url}
      onClick={handleClick}
      className={({isActive})=>!isActive ? "flex justify-between items-center py-2 w-full px-4" : "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font"} end
    >
      <div className="flex gap-2 items-center">
        <div className="nav-icon">{item.icon}</div>
        <h3 className="text-lg hidden  lg:inline-block">{item.title}</h3>
      </div>
    </NavLink>
  );

  const handleChildNavActive = ({isActive})=>{
    if( isActive){
      return "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font"
    }

    return "flex justify-between items-center py-2 w-full px-4"
  }
  if (hasChild) {
    let currentRoute = getURLString(location, 2);

    if(currentRoute){
      currentRoute = titleCase(currentRoute)
    }
    
    content = (
      <>
        <button
          onClick={handleClick}
          className={currentRoute != item.title ? "flex justify-between items-center py-2 w-full px-4" : "flex justify-between items-center py-2 w-full px-4 text-white bg-dark_font"}
        >
          <div className="flex gap-2 items-center">
            <div className="nav-icon">{item.icon}</div>
            <h3 className="text-lg hidden  lg:inline-block">{item.title}</h3>
          </div>
          <div className="nav-icon-arrow relative">
            <ArrowForwardIosSharpIcon />
            {selectedNav && selectedNav == item.title && (
              <ul className="px-4 flex flex-col gap-2 top-0 bg-light_gradient_top shadow-lg rounded-md ml-6 absolute left-full">
                {item.children.map((child) => {
                  return (
                    <NavLink key={child.title} to={child.url} onClick={handleChildNav} className={handleChildNavActive} end >
                      <div className="flex gap-2 items-center">
                        <div className="nav-icon">{child.icon}</div>
                        <h3 className=" text-sm">{child.title}</h3>
                      </div>
                    </NavLink>
                  );
                })}
              </ul>
            )}
          </div>
        </button>
      </>
    );
  }

  return <li className=" text-dark_font">{content}</li>;
}

export default AdminNavItem;
