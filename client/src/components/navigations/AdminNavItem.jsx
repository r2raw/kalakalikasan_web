import React, { useState } from "react";
// MATERIAL ICON
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { NavLink } from "react-router-dom";

function AdminNavItem({ item }) {
  const hasChild = !item.url;

  const [childItemOpen, setChildItemOpen] = useState(false);

  const handleClick = () => {
    setChildItemOpen(!childItemOpen);
  };
  let content = (
    <NavLink
      to={item.url}
      className="flex justify-between items-center py-2 w-full"
    >
      <div className="flex gap-2 items-center">
        <div className="nav-icon">{item.icon}</div>
        <h3 className="text-lg hidden  lg:inline-block">{item.title}</h3>
      </div>
    </NavLink>
  );

  if (hasChild) {
    content = (
      <>
        <button
          onClick={handleClick}
          className="flex justify-between items-center py-2 w-full"
        >
          <div className="flex gap-2 items-center">
            <div className="nav-icon">{item.icon}</div>
            <h3 className="text-lg hidden  lg:inline-block">{item.title}</h3>
          </div>
          <div className="nav-icon-arrow relative">
            <ArrowForwardIosSharpIcon />
            {childItemOpen && (
              <ul className="px-4 flex flex-col gap-2 top-0 bg-light_gradient_top shadow-lg rounded-md ml-6 absolute left-full">
                {item.children.map((child) => {
                  return (
                    <NavLink to={child.url}>
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
