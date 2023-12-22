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

const isMobile = checkIsMobile();

const tableId = generateRandomTableName();

const tableHead = ["Name", "Weekly", "BWeekly", "Monthly", "Yearly"];
export function ExpenseTable() {
  let mainColor = "bg-orangeApp";
  const {
    state: { currentBudget, budgets },
    handleGetCategoryGroup,
    handleUpdateCategory,
    handleUpdateCategoryGroup,
  } = useContext(BudgetsContext);

  const [groupData, setGroupData] = useState<CategoryGroup>();
  const [totalIncome, setTotalIncome] = useState(0);

  const calculateTotalMonthlyAmount = (categoryGroup: CategoryGroup) => {
    return categoryGroup.categories.reduce(
      (total, category) => total + category.monthlyAmount,
      0
    );
  };

  const processData = (categoryGroups: CategoryGroup[]) => {
    const filteredGroups = categoryGroups.filter(
      (group) => group.name == "Income"
    );

    const totalAmount = filteredGroups.reduce(
      (total, group) => total + calculateTotalMonthlyAmount(group),
      0
    );

    setTotalIncome(totalAmount);

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

    setGroupData(expenseGr);
  };

  useEffect(() => {
    const categoryGroups = currentBudget?.categoryGroups;
    if (categoryGroups === undefined) return;
    processData(categoryGroups);
  }, [currentBudget]);

  //Create
  const inputInsertRef = useRef<HTMLInputElement | null>(null);
  const [openInsert, setOpenInsert] = useState(false);
  const [insertItem, setInsertItem] = useState<Category>({
    id: "",
    name: "",
    monthlyAmount: 0,
    note: "",
  });

  const handleOpenInsert = () => {
    if (inputInsertRef.current) {
      if (openInsert) inputInsertRef.current.blur();
      else {
        inputInsertRef.current.focus();
      }
    }

    setInsertItem({
      id: "",
      name: "",
      monthlyAmount: 0,
      note: "",
    });
    setOpenInsert(!openInsert);
  };

  const handleAddInputChange = (event: any) => {
    if (event.target.name == "monthlyAmount") {
      const valueParsed = parseFloat(
        event.target.value.replace(/[^0-9.-]+/g, "")
      );
      const value = isNaN(valueParsed) ? 0 : valueParsed;

      setInsertItem({
        ...insertItem,
        monthlyAmount: value,
      });
    } else {
      setInsertItem({
        ...insertItem,
        [event.target.name]: event.target.value,
      });
    }
  };

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
                    <>{groupData?.description}</>
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
                {groupData?.categories.map((item, index) => {
                  const classes =
                    "p-2 md:p-4 border-b border-blue-gray-50 text-center";

                  const name = item.name;
                  const monthly = item.monthlyAmount;
                  const weekly = monthly / weeksInMonth;
                  const bWeekly = (monthly / weeksInMonth) * biWeeklyFactor;
                  const yearly = monthly * 12;

                  const isLast = index == groupData?.categories.length - 1;
                  let totalMonthly;
                  let totalWeekly;
                  let totalBWeekly;
                  let totalYearly;
                  if (isLast) {
                    totalMonthly = groupData?.categories.reduce(
                      (total, x) => total + x.monthlyAmount,
                      0
                    );
                    totalWeekly = monthly / weeksInMonth;
                    totalBWeekly = (monthly / weeksInMonth) * biWeeklyFactor;
                    totalYearly = monthly * 12;
                  }

                  return (
                    <Fragment key={index}>
                      <tr>
                        <td className="p-2 md:p-4 border-b border-blue-gray-50 text-left">
                          <div className="flex items-center gap-1">
                            {name}
                            <Chip
                              variant="outlined"
                              color="orange"
                              size="sm"
                              className="text-[10px] h-fit py-0.5 px-1"
                              value={`${((monthly / totalIncome) * 100).toFixed(
                                1
                              )}%`}
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
