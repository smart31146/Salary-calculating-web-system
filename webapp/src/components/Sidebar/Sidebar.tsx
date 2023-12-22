import React, { ReactComponentElement, ReactElement, useState } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  PowerIcon,
  CircleStackIcon,
  LanguageIcon,
} from "@heroicons/react/24/solid";
import {
  PresentationChartBarIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  MagnifyingGlassCircleIcon,
  NewspaperIcon,
  ClipboardDocumentListIcon,
  StopCircleIcon,
} from "@heroicons/react/24/outline";

import { navListItems } from "@/constants/Navbar.constant";

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  menu: string;
  setMenu: (value: any) => void;
}

export function Sidebar({ sidebarOpen, setSidebarOpen, menu, setMenu }: Props) {
  const [open, setOpen] = React.useState(-1);

  const handleOpen = (value: any) => {
    setOpen(open === value ? -1 : value);
  };

  const handleLogout = () => {
    console.log('Log out');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <aside
      className={`fixed transition-transform duration-300 transform top-0 left-0 h-full w-72  
      shadow-lg ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <Card
        className={`min-h-screen w-full max-w-[20rem] 
        bg-white rounded-none
`}
      >
        <div className="mb-0 flex items-center gap-5 h-16 justify-center">
          <svg
            width="35"
            height="28"
            viewBox="0 0 35 28"
            fill="#437E00"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 22.1648V24.5C0 26.4305 5.76077 28 12.8612 28C19.9617 28 25.7225 26.4305 25.7225 24.5V22.1648C22.956 23.7562 17.8986 24.5 12.8612 24.5C7.82392 24.5 2.76651 23.7562 0 22.1648ZM21.4354 7C28.5359 7 34.2966 5.43047 34.2966 3.5C34.2966 1.56953 28.5359 0 21.4354 0C14.3349 0 8.57416 1.56953 8.57416 3.5C8.57416 5.43047 14.3349 7 21.4354 7ZM0 16.4281V19.25C0 21.1805 5.76077 22.75 12.8612 22.75C19.9617 22.75 25.7225 21.1805 25.7225 19.25V16.4281C22.956 18.2875 17.8919 19.25 12.8612 19.25C7.83062 19.25 2.76651 18.2875 0 16.4281ZM27.866 17.0297C31.7043 16.4227 34.2966 15.2961 34.2966 14V11.6648C32.7426 12.5617 30.4584 13.1742 27.866 13.5516V17.0297ZM12.8612 8.75C5.76077 8.75 0 10.7078 0 13.125C0 15.5422 5.76077 17.5 12.8612 17.5C19.9617 17.5 25.7225 15.5422 25.7225 13.125C25.7225 10.7078 19.9617 8.75 12.8612 8.75ZM27.5512 11.8289C31.5703 11.2383 34.2966 10.0789 34.2966 8.75V6.41484C31.9187 7.7875 27.8325 8.52578 23.5321 8.70078C25.5081 9.48281 26.9617 10.5328 27.5512 11.8289Z"
              fill="#currentColor"
            />
          </svg>

          <span className="text-textPrimary text-xl">
            <span className="font-bold">Finance</span> Manager
          </span>
        </div>
        <List className="p-4">
          {navListItems.map((item, index) => (
            <div key={index}>
              {item.children != undefined && item.children.length > 0 ? (
                <Accordion
                  open={open === index}
                  icon={
                    <ChevronDownIcon
                      strokeWidth={2.5}
                      className={`mx-auto  h-4 w-4 transition-transform  
                      ${open === index ? "rotate-180" : ""}`}
                    />
                  }
                >
                  <ListItem
                    className={`p-0 
                    `}
                    selected={open === index}
                  >
                    <AccordionHeader
                      onClick={() => handleOpen(index)}
                      className="border-b-0 p-3"
                    >
                      <ListItemPrefix>
                        {React.createElement(item.icon, {
                          className: "h-[18px] w-[18px] ",
                        })}
                      </ListItemPrefix>
                      <Typography
                        color="blue-gray"
                        className="mr-auto font-normal"
                      >
                        {item.label}
                      </Typography>
                    </AccordionHeader>
                  </ListItem>
                  <AccordionBody className="py-1">
                    <List className="p-0">
                      {item.children.map((sub, index) => (
                        <ListItem
                          key={index}
                          onClick={() => setMenu(sub.label)}
                        >
                          <ListItemPrefix>
                            <ChevronRightIcon
                              strokeWidth={3}
                              className="h-3 w-5 "
                            />
                          </ListItemPrefix>
                          <span>{sub.label}</span>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionBody>
                </Accordion>
              ) : (
                <ListItem onClick={() => setMenu(item.label)}>
                  <ListItemPrefix>
                    {React.createElement(item.icon, {
                      className: "h-[18px] w-[18px] ",
                    })}
                  </ListItemPrefix>
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    {item.label}
                  </Typography>
                </ListItem>
              )}
            </div>
          ))}

          <ListItem onClick={handleLogout}>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5  " />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Log Out
            </Typography>
          </ListItem>
        </List>
      </Card>
    </aside>
  );
}
