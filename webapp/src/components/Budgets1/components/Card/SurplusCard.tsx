import {
  biWeeklyFactor,
  checkIsMobile,
  formatCurrency,
  weeksInMonth,
} from "@/constants/Budgets.constant";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import BudgetsContext from "../../Budgets.context";

export const SurplusCard = () => {
  const {
    state: { currentBudget },
  } = useContext(BudgetsContext);

  const [totalIncomeAmount, setTotalIncomeAmount] = useState(0);
  const [totalExpenseAmount, setTotalExpenseAmount] = useState(0);
  const isMobile = checkIsMobile();

  useEffect(() => {
    const categoryGroups = currentBudget?.categoryGroups;
    if (categoryGroups === undefined || categoryGroups.length == 0) {
      setTotalIncomeAmount(0);
      setTotalExpenseAmount(0);
      return;
    }
    const incomeGroup = categoryGroups.find((group) => group.name === "Income");
    if (incomeGroup) {
      setTotalIncomeAmount(
        incomeGroup.categories.reduce(
          (total, category) => total + category.monthlyAmount,
          0
        )
      );
    }

    const expenseGr: CategoryGroup = {
      id: "",
      name: "Expense",
      description:
        "Effortlessly track and manage your expenditures with the 'Expense' table. Organize spending by week, half-week, month, or year in your financial management app. Stay in control of your finances like a pro!",
      categories: [],
    };

    const otherGroups = categoryGroups.filter(
      (group) => group.name != "Income"
    );

    for (const group of otherGroups) {
      const total = group.categories.reduce(
        (total, category) => total + category.monthlyAmount,
        0
      );

      const tmpCategory: Category = {
        id: "",
        name: group.name,
        monthlyAmount: total,
        note: "",
      };
      expenseGr.categories.push(tmpCategory);
    }
    if (expenseGr) {
      setTotalExpenseAmount(
        expenseGr.categories.reduce(
          (total, category) => total + category.monthlyAmount,
          0
        )
      );
    }
  }, [currentBudget]);

  const surplusData = [
    {
      name: "Weekly",
      monthlyAmount: formatCurrency(
        (totalIncomeAmount - totalExpenseAmount) / weeksInMonth
      ),
    },
    {
      name: "Bi-Weekly",
      monthlyAmount: formatCurrency(
        ((totalIncomeAmount - totalExpenseAmount) / weeksInMonth) *
          biWeeklyFactor
      ),
    },
    {
      name: "Monthly",
      monthlyAmount: formatCurrency(totalIncomeAmount - totalExpenseAmount),
    },
    {
      name: "Yearly",
      monthlyAmount: formatCurrency(
        (totalIncomeAmount - totalExpenseAmount) * 12
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
