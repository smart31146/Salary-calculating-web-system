import React, { useEffect, useRef, useState, useContext } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";
import highchartsBellCurve from "highcharts/modules/histogram-bellcurve";
import {
  checkIsMobile,
  formatCurrency,
  getChartConfig,
} from "@/constants/Budgets.constant";
import BudgetsContext from "../../Budgets.context";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Exo_2 } from "next/font/google";

if (typeof Highcharts === "object") {
  highchartsBellCurve(Highcharts);
}
highcharts3d(Highcharts);

export function ShineIncomeChart(props: HighchartsReact.Props) {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [data, setData] = useState<[string, number, number][]>([]);
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

    const newList: [string, number, number][] = [];
    for (const group of filteredGroups) {
      for (const category of group.categories) {
        const percentage = (category.monthlyAmount / totalAmount) * 100;
        newList.push([
          category.name,
          Math.round(percentage),
          category.monthlyAmount,
        ]);
      }
    }

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

  return (
    <>
      {data.length > 0 ? (
        <div className="lg:w-1/2 w-full">
          <div className="rounded-xl overflow-hidden   ">
            <HighchartsReact
              highcharts={Highcharts}
              options={getChartConfig(data, "Income", totalMonthlyAmount.toString(), 0)}
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
