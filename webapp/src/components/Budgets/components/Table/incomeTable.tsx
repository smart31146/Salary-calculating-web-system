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
import { IncomeTableProps } from "../../../../type/Budgets.type";
  
  interface incomeInputProps {
      id?: string;
      name: string;
      monthlyAmount: number;
      note: string;
  }
  
  const isMobile = checkIsMobile();
  
  const tableId = generateRandomTableName();
  
  const tableHead = isMobile ? TABLE_HEAD_MOBILE : TABLE_HEAD;
  
  export const IncomeTable: React.FC<IncomeTableProps> = ({incomeData=[], selectedBudgetId='', onUpdate}) => {
    let mainColor = "bg-[#1E90FF]";
    mainColor = "bg-softGreenApp";
    const inputInsertRef = useRef<HTMLInputElement | null>(null);
    const [openInsert, setOpenInsert] = useState(false);
    const [insertItem, setInsertItem] = useState<incomeInputProps>({
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
  
    const insertIncomeAPI = async () => {
      const response = await fetch(`/api/budget/income`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chartId: selectedBudgetId,
          name: insertItem.name,
          monthlyAmount: insertItem.monthlyAmount,
          note: insertItem.note,
        }),
      });
      if (response.ok) {
        onUpdate(true);
      }
    };
  
    // Update
    const inputUpdateRef = useRef<HTMLInputElement | null>(null);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [updateItem, setUpdateItem] = useState<incomeInputProps>({
      id: "",
      name: "",
      monthlyAmount: 0,
      note: "",
    });
  
    const handleOpenUpdate = (item: incomeInputProps) => {
      if (inputUpdateRef.current) {
        if (openUpdate) inputUpdateRef.current.blur();
        else {
          inputUpdateRef.current.focus();
        }
      }
      setUpdateItem(item);
      setOpenUpdate(!openUpdate);
    };
  
    const handleUpdateInputChange = (event: any) => {
      if (event.target.name == "monthlyAmount") {
        const valueParsed = parseFloat(
          event.target.value.replace(/[^0-9.-]+/g, "")
        );
        const value = isNaN(valueParsed) ? 0 : valueParsed;
  
        setUpdateItem({
          ...updateItem,
          monthlyAmount: value,
        });
      } else {
        setUpdateItem({
          ...updateItem,
          [event.target.name]: event.target.value,
        });
      }
    };
  
    const updateIncomeAPI = async () => {
      const response = await fetch(`/api/budget/income`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updateItem.name,
          monthlyAmount: Number(updateItem.monthlyAmount),
          note: updateItem.note,
          incomeId: updateItem.id
        }),
      });
  
      if (response.ok) {
        onUpdate(true);
      }
    };

    const deleteIncomeAPI = async () => {
        const response = await fetch(`/api/budget/income`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: updateItem.name,
            monthlyAmount: Number(updateItem.monthlyAmount),
            note: updateItem.note,
            incomeId: updateItem.id
          }),
        });
    
        if (response.ok) {
          onUpdate(true);
        }
      };
  
    const deleteCategoryAPI = async () => {
      const response = await fetch(`/api/budget/income?incomeId=${updateItem.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.ok) {
        onUpdate(true)
      }
    };
  
    // Group

    const [openGroupUpdate, setOpenGroupUpdate] = useState(false);
  
    const handleOpenGroupUpdate = () => {
      setOpenGroupUpdate(!openGroupUpdate);
    };
    
  
    const calculateTotalMonthlyAmount = (categoryGroup: CategoryGroup) => {
      return categoryGroup.categories.reduce(
        (total, category) => total + category.monthlyAmount,
        0
      );
    };
    const getTotalPct = () => {
      const categoryGroups = currentBudget?.categoryGroups;
  
      if (!categoryGroups) return 0;
  
      const newList: [string, number][] = [];
  
      // 1. Get total income amount
      const filteredGroups = categoryGroups.filter(
        (group) => group.name == "Income"
      );
  
      const totalAmount = filteredGroups.reduce(
        (total, group) => total + calculateTotalMonthlyAmount(group),
        0
      );
  
      // 2.Calculate others
      const otherGroups = categoryGroups.filter(
        (group) => group.name == groupName
      );
  
      for (const group of otherGroups) {
        const total = group.categories.reduce(
          (total, category) => total + category.monthlyAmount,
          0
        );
        const percentage = (total / totalAmount) * 100;
        if (!isNaN(percentage))
          newList.push([group.name, Math.round(percentage)]);
      }
  
      if (newList.length > 0) return newList[0][1];
      else return 0;
    };
  
    const getTotalAmount = () => {
      const categoryGroups = currentBudget?.categoryGroups;
  
      if (!categoryGroups) return 0;
  
      let total = 0;
  
      // 2.Calculate others
      const otherGroups = categoryGroups.filter(
        (group) => group.name == groupName
      );
  
      for (const group of otherGroups) {
        total = group.categories.reduce(
          (total, category) => total + category.monthlyAmount,
          0
        );
      }
      return total;
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
              <button
                className="flex  gap-2 hover:underline"
                onClick={handleOpenGroupUpdate}
              >
                <>
                <InboxArrowDownIcon strokeWidth={2} className="w-4 h-4 " />
                Income
                </>
              </button>
  
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
            <button
              className={`flex ${mainColor} items-center justify-center py-1 px-2.5 rounded-md gap-1 text-white text-xs lg:text-[14px] font-bold`}
              onClick={handleOpenInsert}
            >
              <PlusIcon strokeWidth={3} className="w-4 h-4  text-white" />
              New
            </button>
          </div>
          <hr className={`${mainColor} h-0.5`} />
          {/* {!["Income", "Expense"].includes(groupName) && (
            <CategoryChartv2 groupName={groupName} />
          )} */}
  
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
                  {incomeData?.map((item, index) => {
                    const classes =
                      "p-2 md:p-4 border-b border-blue-gray-50 text-center";
                    const monthly = Number(item.monthlyAmount);
                    const weekly = monthly / weeksInMonth;
                    const bWeekly = (monthly / weeksInMonth) * biWeeklyFactor;
                    const yearly = monthly * 12;
  
                    const isLast = index == incomeData?.length - 1;
                    const tmpTotal =incomeData?.reduce(
                        (total, x) => total + x.monthlyAmount,
                        0
                      );
                    let totalMonthly;
                    let totalWeekly;
                    let totalBWeekly;
                    let totalYearly;
                    if (isLast) {
                      totalMonthly = incomeData?.reduce(
                        (total, x) => total + x.monthlyAmount,
                        0
                      );
                      totalWeekly = totalMonthly / weeksInMonth;
                      totalBWeekly = (totalMonthly / weeksInMonth) * biWeeklyFactor;
                      totalYearly = totalMonthly * 12;
                    }
  
                    return (
                      <Fragment key={index}>
                        <tr>
                          <td className="p-2 md:p-4 border-b border-blue-gray-50 text-left">
                            <div className="flex">
                            <Tooltip
                                  className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
                                  content={
                                    <div className="text-gray-700 text-xs">
                                      {item.note}
                                    </div>
                                  }
                                >
                            
                               {item.name} 
                               {/* ${((monthly / tmpTotal) * 100).toFixed(2)}%`} */}
                            </Tooltip>
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
  
                          {!isMobile && (
                            <td className="p-2 md:p-4 border-b border-blue-gray-50 text-left">
                              <div className="flex justify-center items-center">
                                {item.note}
                              </div>
                            </td>
                          )}
  
                          <td className={classes}>
                            <IconButton
                              variant="text"
                              onClick={() => handleOpenUpdate(item)}
                            >
                              <PencilSquareIcon className="h-5 w-5" />
                            </IconButton>
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
                            <td className={`${"p-2 md:p-4 text-center"} `}></td>
  
                            {!isMobile && (
                              <td className={`${"p-2 md:p-4 text-center"} `}></td>
                            )}
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
  
        <div
          className={`${
            !openInsert && !openUpdate && !openGroupUpdate && "hidden"
          }`}
        >
          {/* Category Update */}
          <Drawer
            size={330}
            placement={getDrawerPlacement()}
            open={openUpdate}
            className="lg:p-4 p-2"
            onClose={() => setOpenUpdate(false)}
          >
            <div className="lg:mb-5 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowPathIcon
                  strokeWidth={3}
                  className="h-5 w-5 text-gray-800"
                />
                <Typography variant="h5" color="blue-gray">
                  Update Income
                </Typography>
              </div>
              <IconButton
                variant="text"
                color="blue-gray"
                onClick={() => setOpenUpdate(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </IconButton>
            </div>
  
            <div className="flex flex-col gap-3 mb-3">
              idd{updateItem.id}
              <NumericFormat
                value={updateItem.monthlyAmount}
                onChange={handleUpdateInputChange}
                prefix="$"
                defaultValue="0"
                getInputRef={inputUpdateRef}
                thousandSeparator
                placeholder="Monthly amount"
                decimalScale={2}
                inputMode="decimal"
                name="monthlyAmount"
                className="py-2 text-2xl text-center text-[#4C606A] hover:outline-none outline-none px-2 text  rounded-lg"
              />
              <Input
                crossOrigin=""
                size="md"
                color="blue-gray"
                label="name"
                className="text-lg"
                value={updateItem.name}
                name="name"
                onChange={handleUpdateInputChange}
              />
  
              <Input
                crossOrigin=""
                size="md"
                color="blue-gray"
                label="Note (Optional)"
                className="text-lg"
                value={updateItem.note}
                name="note"
                onChange={handleUpdateInputChange}
              />
              <div
                className={`flex lg:flex-col justify-between flex-row text-gray-800 gap-1 p-2 ${
                  isMobile ? "text-[10px]" : "text-xs"
                } bg-[#F1F3F6] rounded-md opacity-75`}
              >
                <div
                  className="flex justify-between  gap-1
              font-semibold"
                >
                  <span>Weekly</span>
                  <span>
                    {formatCurrency(updateItem.monthlyAmount / weeksInMonth)}
                  </span>
                </div>
  
                <div
                  className="flex justify-between  gap-1
              font-semibold"
                >
                  <span>Bi-Weekly</span>
                  <span>
                    {formatCurrency(
                      (updateItem.monthlyAmount / weeksInMonth) * biWeeklyFactor
                    )}
                  </span>
                </div>
  
                <div
                  className="flex justify-between   gap-1
              font-semibold"
                >
                  <span>Yearly</span>
                  <span>{formatCurrency(updateItem.monthlyAmount * 12)}</span>
                </div>
              </div>
            </div>
  
            <div className="flex gap-2 justify-between">
              <Button
                color="red"
                size="sm"
                variant="outlined"
                onClick={deleteCategoryAPI}
              >
                Delete
              </Button>
              <Button color="green" size="sm" onClick={updateIncomeAPI}>
                Update
              </Button>
            </div>
          </Drawer>
  
          {/* Category Create */}
          <Drawer
            size={330}
            placement={getDrawerPlacement()}
            open={openInsert}
            className="lg:p-4 p-2"
            onClose={handleOpenInsert}
          >
            <div className="lg:mb-5 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusIcon strokeWidth={4} className="h-5 w-5 text-gray-800" />
                <Typography variant="h5" color="blue-gray">
                  New Income
                </Typography>
              </div>
              <IconButton
                variant="text"
                color="blue-gray"
                onClick={handleOpenInsert}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </IconButton>
            </div>
  
            <div className="flex flex-col gap-3 mb-3">
              <NumericFormat
                value={insertItem.monthlyAmount}
                onChange={handleAddInputChange}
                prefix="$"
                defaultValue="0"
                getInputRef={inputInsertRef}
                thousandSeparator
                placeholder="Monthly amount"
                decimalScale={2}
                inputMode="decimal"
                name="monthlyAmount"
                className="py-2 text-2xl text-center text-[#4C606A] hover:outline-none outline-none px-2 text  rounded-lg"
              />
              <Input
                crossOrigin=""
                size="md"
                color="blue-gray"
                label="Category name"
                className="text-lg"
                value={insertItem.name}
                name="name"
                onChange={handleAddInputChange}
              />
  
              <Input
                crossOrigin=""
                size="md"
                color="blue-gray"
                label="Note (Optional)"
                className="text-lg"
                value={insertItem.note}
                name="note"
                onChange={handleAddInputChange}
              />
              <div
                className={`flex lg:flex-col justify-between flex-row text-gray-800 gap-1 p-2 ${
                  isMobile ? "text-[10px]" : "text-xs"
                } bg-[#F1F3F6] rounded-md opacity-75`}
              >
                <div
                  className="flex justify-between  gap-1
              font-semibold"
                >
                  <span>Weekly</span>
                  <span>
                    {formatCurrency(insertItem.monthlyAmount / weeksInMonth)}
                  </span>
                </div>
  
                <div
                  className="flex justify-between  gap-1
              font-semibold"
                >
                  <span>Bi-Weekly</span>
                  <span>
                    {formatCurrency(
                      (insertItem.monthlyAmount / weeksInMonth) * biWeeklyFactor
                    )}
                  </span>
                </div>
  
                <div
                  className="flex justify-between   gap-1
              font-semibold"
                >
                  <span>Yearly</span>
                  <span>{formatCurrency(insertItem.monthlyAmount * 12)}</span>
                </div>
              </div>
            </div>
  
            <div className="flex gap-2 justify-end">
              <Button color="green" size="md" onClick={insertIncomeAPI}>
                Add new
              </Button>
            </div>
          </Drawer>
  
          {/* Group Update */}
        </div>
      </>
    );
  }
  