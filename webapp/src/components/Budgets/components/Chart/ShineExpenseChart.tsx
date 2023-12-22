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
import { Breadcrumbs } from "@material-tailwind/react";
import { BudgetIncome, BudgetChartData } from "../../../../type/Budgets.type";
import { capitalizeText } from "../../../../app/api/helperFunctions/capitalize";

if (typeof Highcharts === "object") {
  highchartsBellCurve(Highcharts);
}

highcharts3d(Highcharts);

interface ExpenseChartProp{
  expenseData: any;
  incomeData: BudgetIncome[],
  currentBudget: BudgetChartData
}

export const ShineExpenseChart: React.FC<ExpenseChartProp> = ({
  incomeData=[], expenseData={}, currentBudget={}
}) => {
  const expenseCategoriesKeys = Object.keys(expenseData)
  const expenseCategoriesValues = Object.values(expenseData)
  const totalMonthlyExpenses = expenseCategoriesValues.reduce(
    (total, x) => Number(total) + Number(x),
    0
  );
  const totalMonthlyIncome = incomeData.reduce(
    (total, x) => Number(total) + Number(x.monthlyAmount),
    0
  );
  // console.log('hhhhh', totalMonthlyExpenses, )
  const [data, setData] = useState<[string, number, number][]>([]); // Name/Pct/Amount
  const isMobile = checkIsMobile();
  let user = JSON.parse(localStorage.getItem('user'))

  const processData = () => {
    const newList: [string, number, number][] = [];
    expenseCategoriesKeys.forEach((key, index)=>{
       let percentage: number = Number((Number(expenseCategoriesValues[index])/Number(totalMonthlyExpenses)).toFixed(2)) * 100
       const monthlyAmount = Number(expenseCategoriesValues[index])
       newList.push([key, percentage, monthlyAmount])
    })
    console.log('new lists', newList)
    setData(newList);
  };
 
  useEffect(() => {
    currentBudget && processData();
  }, [currentBudget, expenseData, incomeData]);

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
      {/* <button onClick={()=>console.log('tttt', data)}> ttttttt</button> */}
      {data.length > 0 ? (
        <div className="lg w-full ">
          <HighchartsReact
            highcharts={Highcharts}
            options={getChartConfig(
              data,
              capitalizeText(`Monthly Budget`),
              "Expenses",
              totalMonthlyExpenses,
              capitalizeText(`${user?.username} Typical`),
              'Summary of Monthly Budgeted Expense'
            )}
          />
        </div>
      ) : (
        <div
          className="flex 
         lg:w-1/2 justify-center items-center"
        >
          <EllipsisHorizontalIcon color="#fff" className="h-12 w-12" />
        </div>
      )}
    </>
  );
}
