"use client";

import { MobileNavbar } from "@/components/Navbar/MobileNavbar";
import { Navbar } from "@/components/Navbar/Navbar";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { navListItems } from "@/constants/Navbar.constant";
import { ThemeProvider } from "@material-tailwind/react";
import { ReactElement, useEffect, useState } from "react";
import Budgets from "@/components/Budgets/Budgets";
import { MainContent } from "@/components/MainContent/MainContent";
import { checkIsMobile } from "@/constants/Budgets.constant";
import { firebase } from "firebase/app";
import { firebaseConfig } from "../../../firebaseConfig";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [menu, setMenu] = useState<string>(navListItems[0].children[0].label);
  const isMobile = checkIsMobile();
  const userData: any = typeof window !== "undefined" ? window.localStorage.getItem('user') : false;

  async function fetchUser() {
    try {
      const response = await fetch(`/api/auth/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: JSON.parse(userData)?.email,
          id: JSON.parse(userData)?._id,
        }),
      });
      if (response.ok) {
        const user = await response.json();
        console.log(user)
      } else {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  useEffect(() => {
    if (userData) {
      fetchUser()
    }else {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }, [userData])

  // useEffect(()=>{
  //   if (!firebase.apps.length) {
  //     firebase.initializeApp(firebaseConfig);
  //   }
  // },[])


  return (
    <ThemeProvider>
      <main className="flex bg-gray-200 min-h-screen ">
        {!isMobile && (
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            menu={menu}
            setMenu={setMenu}
          />
        )}

        <div
          className={`flex flex-col transition-width duration-300 flex-grow 
           ${!isMobile && sidebarOpen ? "ml-72" : "ml-0"}`}
        >
          {isMobile ? (
            <div className="p-1 mb-3 lg:mb-0">
              <MobileNavbar menu={menu} setMenu={setMenu} />
            </div>
          ) : (
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}

          <div className={`h-full sm:p-5 `}>
            <MainContent _menu={menu} />
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}

