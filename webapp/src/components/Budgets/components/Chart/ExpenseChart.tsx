import React, { useEffect, useRef, useState, useContext } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";
import highchartsBellCurve from "highcharts/modules/histogram-bellcurve";
import { checkIsMobile, formatCurrency } from "@/constants/Budgets.constant";
import BudgetsContext from "../../Budgets.context";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

if (typeof Highcharts === "object") {
  highchartsBellCurve(Highcharts);
}

highcharts3d(Highcharts);

export function ExpenseChart(props: HighchartsReact.Props) {
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
    const newList: [string, number][] = [];

    // 1. Get total amount
    const filteredGroups = categoryGroups.filter(
      (group) => group.name !== "Income"
    );

    const totalAmount = filteredGroups.reduce(
      (total, group) => total + calculateTotalMonthlyAmount(group),
      0
    );

    setTotalMonthlyAmount(totalAmount);

    // 2.Calculate Expense
    const expenseGroup = categoryGroups.find(
      (group) => group.name === "Expense"
    );
    if (expenseGroup) {
      for (const category of expenseGroup.categories) {
        const percentage = (category.monthlyAmount / totalAmount) * 100;
        newList.push([category.name, Math.round(percentage)]);
      }
    }

    // 3.Calculate others
    const otherGroups = categoryGroups.filter(
      (group) => group.name !== "Income" && group.name !== "Expense"
    );

    for (const group of otherGroups) {
      const total = group.categories.reduce(
        (total, category) => total + category.monthlyAmount,
        0
      );
      let percentage = (total / totalAmount) * 100;
      percentage = isNaN(percentage) ? 0 : percentage;
      if (percentage > 0) newList.push([group.name, Math.round(percentage)]);
    }

    setData(newList);
    console.log(newList);

    setData(newList);
  };

  useEffect(() => {
    currentBudget && processData(currentBudget.categoryGroups);
  }, [currentBudget]);

  Highcharts.setOptions({
    colors: [
      "#FFEA5D",
      "#97EE5B",
      "#5B8CFB",
      "#ED6559",
      "#B067FD",
      "#F5AE5E",
      "#5E5BF2",
      "#CC51A8",
    ],
  });

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
      text: `Budget Expense (${formatCurrency(totalMonthlyAmount)})`,
      align: "center",

      // y: isMobile ? 55 : 10,
    },
    subtitle: {
      text: "Information about monthly expense sources",
      align: "center",
      // y: isMobile ? 70 : 30,
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
          <div className="rounded-xl overflow-hidden  ">
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
