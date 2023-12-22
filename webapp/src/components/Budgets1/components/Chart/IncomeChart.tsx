import React, { useEffect, useRef, useState, useContext } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";
import highchartsBellCurve from "highcharts/modules/histogram-bellcurve";
import { checkIsMobile, formatCurrency } from "@/constants/Budgets.constant";
import BudgetsContext from "../../Budgets.context";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Exo_2 } from "next/font/google";

if (typeof Highcharts === "object") {
  highchartsBellCurve(Highcharts);
}
highcharts3d(Highcharts);

export function IncomeChart(props: HighchartsReact.Props) {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [data, setData] = useState<[string, number][]>([]);
  const [totalMonthlyAmount, setTotalMonthlyAmount] = useState(0);
  const isMobile = checkIsMobile();

  const {
    state: { currentBudget },
  } = useContext(BudgetsContext);

  const calculateTotalMonthlyAmount = (categoryGroup: CategoryGroup) => {
    return categoryGroup.categories.reduce(
      (total, category) => total + category.monthlyAmount,
      0
    );
  };

  const processData = (categoryGroups: CategoryGroup[]) => {
    const filteredGroups = categoryGroups.filter(
      (group) => group.name === "Income"
    );

    const totalAmount = filteredGroups.reduce(
      (total, group) => total + calculateTotalMonthlyAmount(group),
      0
    );

    setTotalMonthlyAmount(totalAmount);

    const newList: [string, number][] = [];
    for (const group of filteredGroups) {
      for (const category of group.categories) {
        const percentage = (category.monthlyAmount / totalAmount) * 100;
        newList.push([category.name, Math.round(percentage)]);
      }
    }

    setData(newList);
  };

  useEffect(() => {
    currentBudget && processData(currentBudget.categoryGroups);
  }, [currentBudget]);

  const options: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: {
      type: "pie",

      options3d: {
        enabled: true,
        alpha: isMobile ? 35 : 45,
      },
      backgroundColor: "transparent",
    },
    title: {
      text: `Budget Income (${formatCurrency(totalMonthlyAmount)})`,
      align: "center",

      y: isMobile ? 55 : 10,
    },
    subtitle: {
      text: "Information about monthly income sources",
      align: "center",
      y: isMobile ? 70 : 30,
    },

    plotOptions: {
      pie: {
        innerSize: isMobile ? 50 : 100,
        depth: 45,
      },
    },
    series: [
      {
        type: "pie",
        name: "Percentage",
        data: data,
      },
    ],
  };

  return (
    <>
      {data.length > 0 ? (
        <div className="lg:w-1/2 w-full">
          <div className="rounded-xl overflow-hidden   ">
            <HighchartsReact
              highcharts={Highcharts}
              options={options}
              ref={chartComponentRef}
              {...props}
            />
          </div>
        </div>
      ) : (
        <div
          className="flex 
         lg:w-1/2 justify-center items-center"
        >
          <EllipsisHorizontalIcon color="#868D90" className="h-12 w-12" />
        </div>
      )}
    </>
  );
}
