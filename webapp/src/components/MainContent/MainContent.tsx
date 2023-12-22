import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
const Budgets = dynamic(() => import("../Budgets/Budgets"), { ssr: false });
import { Users } from "../Users/index";
import { AssetLiabilitiesContainer } from "../AssetsLiabilities/index";

interface Props {
  _menu: string;
}
export const MainContent = ({ _menu }: Props) => {
  const menuMap = [
    {
      label: "Budgets",
      component: <Budgets />,
    },
    {
      label: "Asset/Liabilities",
      component: <AssetLiabilitiesContainer />,
    },
    {
      label: "GDS/TDS",
      component: <div>GDSTDS</div>,
    },
    {
      label: "Banks",
      component: <div>Banks</div>,
    },
    {
      label: "Users",
      component: <Users />,
    },
    {
      label: "Paystub",
      component: <div>Paystub</div>,
    },
    {
      label: "Databank",
      component: <div>Databank</div>,
    },
    {
      label: "Watchlist",
      component: <div>Watchlist</div>,
    },
    {
      label: "Screener",
      component: <div>Screener</div>,
    },
    {
      label: "Retirement",
      component: <div>Retirement</div>,
    },
    {
      label: "Vedic Astrology",
      component: <div>Vedic Astrology</div>,
    },
    {
      label: "Research",
      component: <div>Research</div>,
    },
    {
      label: "Users",
      component: <Users />,
    },
  ];

  const [menu, setMenu] = useState(menuMap[0]);

  useEffect(() => {
    if (_menu != undefined)
      setMenu(menuMap.filter((item) => item.label == _menu)[0]);
  }, [_menu]);

  return menu.component;
};
