import { Progress } from "@material-tailwind/react";
import React, { useContext } from "react";
import { formatCurrency } from "@/constants/Budgets.constant";
import BudgetsContext from "../../Budgets.context";

interface InExChartProps {
  data: any
}
export const InExChart: React.FC<InExChartProps> = ({
  data={}
}) => {
  const expenseCategoriesKeys = Object.keys(data)
  const expenseCategoriesValues = Object.values(data)
  const totalMonthlyExpenses = expenseCategoriesValues.reduce(
    (total, x) => Number(total) + Number(x),
    0
  );
  
  return (
    <div className="lg:bg-white lg:rounded-lg lg:shadow-sm mb-1">
      <div className="flex w-full flex-col gap-4 lg:gap-7 p-3">
        <div className="w-full">
          <div className="flex justify-between">
            <div className="mb-2 flex items-center text-xs  gap-4">Income</div>
            <div className="mb-2 flex items-center text-xs  gap-4 ">
              {formatCurrency(totalMonthlyExpenses)}
            </div>
          </div>
          <Progress
            value={totalMonthlyExpenses}
            size="lg"
            color="blue"
            className=" bg-gray-900/5"
          />
        </div>

        <div className="w-full">
          <div className="flex justify-between">
            <div className="mb-2 flex items-center text-xs  gap-4">Expense</div>
            <div className="mb-2 flex items-center text-xs  gap-4 ">
              {formatCurrency(totalMonthlyExpenses)}
            </div>
          </div>
          <Progress
            value={totalMonthlyExpenses}
            size="lg"
            color="orange"
            className="bg-gray-900/5"
          />
        </div>
      </div>
    </div>
  );
};
