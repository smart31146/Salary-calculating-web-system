import { Bars3Icon } from "@heroicons/react/24/outline";
import { Breadcrumbs, Typography, button } from "@material-tailwind/react";
import React from "react";

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

export const Navbar = ({ sidebarOpen, setSidebarOpen }: Props) => {
  return (
    <div
      className={`flex h-[60px] px-3 bg-white
      
     gap-5 border-softGreenApp  border-b-2
     items-center `}
    >
      <button onClick={() => setSidebarOpen(!sidebarOpen)}>
        <Bars3Icon className="w-9 h-9 text-gray-800" />
      </button>

      <div className="flex justify-center items-center gap-2 text-[18px] ">
        <span className="text-gray-800 font-bold">Budgets</span>
      </div>

      <span className="text-gray-800 ml-auto font-normal">Shine Mohandas</span>
    </div>
  );
};
