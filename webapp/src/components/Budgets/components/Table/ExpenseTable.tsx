import {
  TABLE_HEAD,
  TABLE_HEAD_MOBILE,
  biWeeklyFactor,
  checkIsMobile,
  formatCurrency,
  generateRandomTableName,
  getDrawerPlacement,
  weeksInMonth,
} from "@/constants/Budgets.constant";
import { NumericFormat } from "react-number-format";
import {
  ArrowPathIcon,
  InboxArrowDownIcon,
  CreditCardIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Chip,
  Drawer,
  IconButton,
  Input,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState, useRef, useContext, Fragment } from "react";
import { scroller } from "react-scroll";
import BudgetsContext from "../../Budgets.context";
import { CategoryChartv2 } from "../Chart/CategoryChartv2";

interface ExpenseTableProps {
  data: any
}
const isMobile = checkIsMobile();

const tableId = generateRandomTableName();

const tableHead = ["Name", "Weekly", "BWeekly", "Monthly", "Yearly"];
export const ExpenseTable:React.FC<ExpenseTableProps> = ({
  data={}
}) => {
  let mainColor = "bg-orangeApp";
  const expenseCategoriesKeys = Object.keys(data)
  const expenseCategoriesValues = Object.values(data)
  const totalMonthlyExpenses = expenseCategoriesValues.reduce(
    (total, x) => Number(total) + Number(x),
    0
  );
  console.log('keeeeyss', expenseCategoriesKeys,expenseCategoriesValues )

  return (
    <>
      <div
        className={`flex text-textPrimary flex-col bg-white shadow-md rounded-lg overflow-hidden w-full h-fit ${
          isMobile ? "text-[10px]" : "text-[14px]"
        }`}
      >
        <div
          className={`flex justify-between items-center py-2 px-3 ${mainColor} `}
        >
          <div className="flex text-xs lg:text-[14px] font-bold items-center text-white gap-2">
            <div className="flex  gap-2 hover:underline">
              <>
                <CreditCardIcon strokeWidth={2} className="w-4 h-4 " />
                Expense
              </>
            </div>

            <Tooltip
              className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
              content={
                <div className="w-80">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal opacity-80"
                  >
                    <></>
                  </Typography>
                </div>
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#fff"
                strokeWidth={2}
                className="h-5 w-5 cursor-pointer text-blue-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
            </Tooltip>
          </div>
        </div>
        <hr className={`${mainColor} h-0.5`} />

        <div className="p-0">
          <div
            id={tableId}
            className="w-full  overflow-scroll lg:overflow-hidden "
          >
            <table className={`w-full text-left `}>
              <thead>
                <tr>
                  {tableHead.map((head, index) => (
                    <th
                      key={head}
                      className={` bg-blue-gray-50/50 p-2 
                  md:p-4 ${index == 0 ? "text-left" : "text-center"}`}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenseCategoriesKeys.map((item, index) => {
                  const classes =
                    "p-2 md:p-4 border-b border-blue-gray-50 text-center";

                  const name = item;
                  const monthly = data[item];
                  const weekly = monthly / weeksInMonth;
                  const bWeekly = (monthly / weeksInMonth) * biWeeklyFactor;
                  const yearly = monthly * 12;

                  const isLast = index == expenseCategoriesKeys.length - 1;
                  let totalMonthly;
                  let totalWeekly;
                  let totalBWeekly;
                  let totalYearly;
                  if (isLast) {
                    totalMonthly = expenseCategoriesValues.reduce(
                      (total, x) => total + x,
                      0
                    );
                    totalWeekly = totalMonthly / weeksInMonth;
                    totalBWeekly = (totalMonthly / weeksInMonth) * biWeeklyFactor;
                    totalYearly = totalMonthly * 12;
                  }
                  let percentage = ((monthly/Number(totalMonthlyExpenses)) * 100).toFixed(1) || 0
            

                  return (
                    <Fragment key={index}>
                      <tr>
                        <td className="p-2 md:p-4 border-b border-blue-gray-50 text-left">
                          <div className="flex items-center gap-1">
                            {item}
                            <Chip
                              variant="outlined"
                              color="orange"
                              size="sm"
                              className="text-[10px] h-fit py-0.5 px-1"
                              value={`${isNaN(Number(percentage))? 0 : percentage}%`}
                            />
                          </div>
                        </td>
                        <td className={`${classes} text-left`}>
                          <Chip
                            variant="ghost"
                            color="green"
                            value={formatCurrency(weekly)}
                          />
                        </td>
                        <td className={`${classes} text-left`}>
                          <Chip
                            variant="ghost"
                            color="green"
                            value={formatCurrency(bWeekly)}
                          />
                        </td>
                        <td className={`${classes} text-left`}>
                          <Chip
                            variant="ghost"
                            color="green"
                            value={formatCurrency(monthly)}
                          />
                        </td>
                        <td className={`${classes} text-left`}>
                          <Chip
                            variant="ghost"
                            color="green"
                            value={formatCurrency(yearly)}
                          />
                        </td>
                      </tr>
                      {isLast && (
                        <tr className="bg-softYellowApp  font-semibold">
                          <td className="p-2 md:p-4  text-left">
                            <div className="flex flex-col">Total</div>
                          </td>
                          <td className={`${"p-2 md:p-4 text-center"} `}>
                            {formatCurrency(totalWeekly)}
                          </td>
                          <td className={`${"p-2 md:p-4 text-center"} `}>
                            {formatCurrency(totalBWeekly)}
                          </td>
                          <td className={`${"p-2 md:p-4 text-center"} `}>
                            {formatCurrency(totalMonthly)}
                          </td>
                          <td className={`${"p-2 md:p-4 text-center"} `}>
                            {formatCurrency(totalYearly)}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
