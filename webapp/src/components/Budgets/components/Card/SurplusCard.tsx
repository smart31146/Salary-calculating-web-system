import {
  biWeeklyFactor,
  checkIsMobile,
  formatCurrency,
  weeksInMonth,
} from "@/constants/Budgets.constant";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import BudgetsContext from "../../Budgets.context";
import { BudgetIncome } from "../../../../type/Budgets.type";

interface SurplusCardProps {
  expenseData: any;
  incomeData: BudgetIncome[]
}

export const SurplusCard: React.FC<SurplusCardProps> = ({
  expenseData = {},
  incomeData=[]
}) => {
  
  const expenseCategoriesValues = Object.values(expenseData)
  const totalMonthlyExpenses = expenseCategoriesValues.reduce(
    (total, x) => Number(total) + Number(x),
    0
  );
  const totalMonthlyIncome = incomeData.reduce(
    (total, x) => Number(total) + Number(x.monthlyAmount),
    0
  );
  const isMobile = checkIsMobile();

  

  const surplusData = [
    {
      name: "Weekly",
      monthlyAmount: formatCurrency(
        (totalMonthlyIncome - Number(totalMonthlyExpenses)) / weeksInMonth
      ),
    },
    {
      name: "Bi-Weekly",
      monthlyAmount: formatCurrency(
        ((totalMonthlyIncome - Number(totalMonthlyExpenses)) / weeksInMonth) *
          biWeeklyFactor
      ),
    },
    {
      name: "Monthly",
      monthlyAmount: formatCurrency(totalMonthlyIncome - Number(totalMonthlyExpenses)),
    },
    {
      name: "Yearly",
      monthlyAmount: formatCurrency(
        (totalMonthlyIncome - Number(totalMonthlyExpenses)) * 12
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {surplusData.map((item, index) => {
        return (
          <Card className="w-full" key={index}>
            <CardBody className={`${isMobile && "p-3"}`}>
              <div className="flex flex-col lg:flex-row lg:justify-between items-center">
                <div className="flex flex-col w-full">
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className={`lg:mb-2 ${isMobile && "text-sm"}`}
                  >
                    {item.name}
                  </Typography>
                  <Typography className={`${isMobile && "text-xs"}`}>
                    Surplus / Deficit
                  </Typography>
                </div>
                <Typography
                  variant="h3"
                  color="blue-gray"
                  className={`mt-2 lg:mt-0 ${isMobile && "text-xl"}`}
                >
                  {item.monthlyAmount}
                </Typography>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};
