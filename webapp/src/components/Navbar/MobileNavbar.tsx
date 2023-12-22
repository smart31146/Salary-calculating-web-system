import React, { useState } from "react";
import { navListItems } from "@/constants/Navbar.constant";

import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Card,
  IconButton,
  Collapse,
  CardBody,
} from "@material-tailwind/react";
import { ChevronDownIcon, Bars3Icon } from "@heroicons/react/24/outline";

interface Props {
  menu: string;
  setMenu: (value: any) => void;
}

export function MobileNavbar({ menu, setMenu }: Props) {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const [open, setOpen] = React.useState(-1);

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  const handleOpen = (value: any) => {
    setOpen(open === value ? -1 : value);
  };

  const handleSetMenu = (value: any) => {
    setMenu(value);
    setIsNavOpen((cur) => !cur);
  };

  function NavList({ items }: any) {
    return (
      <ul className="mb-4 mt-2 flex flex-col gap-2 ">
        {items.map(({ label, icon, children }: any, key: any) => (
          <li key={label}>
            {children != undefined && children.length > 0 ? (
              <div onClick={() => handleOpen(label)}>
                <div
                  className={`flex font-normal text-white py-2 px-3 
             items-center justify-between ml-1 rounded-l-full hover:bg-green-500`}
                >
                  <div className="flex gap-3 items-center">
                    {React.createElement(icon, {
                      className: "h-[18px] w-[18px]",
                    })}{" "}
                    {label}
                  </div>

                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={` text-white h-4 w-4 transition-transform ${
                      open == label ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <Collapse open={open == label}>
                  <NavList items={children} />
                </Collapse>
              </div>
            ) : (
              <div
                className={`flex gap-3 font-normal text-white py-2 px-3 
             items-center ml-1 rounded-l-full hover:bg-green-500`}
                onClick={() => handleSetMenu(label)}
              >
                {React.createElement(icon, {
                  className: "h-[18px] w-[18px]",
                })}{" "}
                {label}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  }

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener(
        "resize",
        () => window.innerWidth >= 960 && setIsNavOpen(false)
      );
    }
  }, []);

  return (
    <Navbar
      className="p-0 
    bg-gradient-to-r 
  
    from-softGreenApp to-greenApp
    rounded-xl "
    >
      <div
        className={`relative gap-4 flex items-center justify-between 
        px-3 py-2  rounded-xl`}
        onClick={toggleIsNavOpen}
      >
        <svg
          width="35"
          height="28"
          viewBox="0 0 35 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 22.1648V24.5C0 26.4305 5.76077 28 12.8612 28C19.9617 28 25.7225 26.4305 25.7225 24.5V22.1648C22.956 23.7562 17.8986 24.5 12.8612 24.5C7.82392 24.5 2.76651 23.7562 0 22.1648ZM21.4354 7C28.5359 7 34.2966 5.43047 34.2966 3.5C34.2966 1.56953 28.5359 0 21.4354 0C14.3349 0 8.57416 1.56953 8.57416 3.5C8.57416 5.43047 14.3349 7 21.4354 7ZM0 16.4281V19.25C0 21.1805 5.76077 22.75 12.8612 22.75C19.9617 22.75 25.7225 21.1805 25.7225 19.25V16.4281C22.956 18.2875 17.8919 19.25 12.8612 19.25C7.83062 19.25 2.76651 18.2875 0 16.4281ZM27.866 17.0297C31.7043 16.4227 34.2966 15.2961 34.2966 14V11.6648C32.7426 12.5617 30.4584 13.1742 27.866 13.5516V17.0297ZM12.8612 8.75C5.76077 8.75 0 10.7078 0 13.125C0 15.5422 5.76077 17.5 12.8612 17.5C19.9617 17.5 25.7225 15.5422 25.7225 13.125C25.7225 10.7078 19.9617 8.75 12.8612 8.75ZM27.5512 11.8289C31.5703 11.2383 34.2966 10.0789 34.2966 8.75V6.41484C31.9187 7.7875 27.8325 8.52578 23.5321 8.70078C25.5081 9.48281 26.9617 10.5328 27.5512 11.8289Z"
            fill="#fff"
          />
        </svg>
        <span className="text-white text-xl">
          <span className="font-bold">Finance</span> Manager
        </span>
        <IconButton size="sm" color="white" variant="text">
          <Bars3Icon className="h-6 w-6" />
        </IconButton>
      </div>
      <Collapse open={isNavOpen} className="">
        <NavList items={navListItems} />
      </Collapse>
    </Navbar>
  );
}
