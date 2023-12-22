import React, { useState, useEffect, useRef } from "react";
import {
  Select,
  Option,
  Card,
  CardBody,
  Typography,
  CardFooter,
  Button,
  Drawer,
  IconButton,
  Input,
  SpeedDial,
  SpeedDialHandler,
  SpeedDialContent,
  SpeedDialAction,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  ArrowTopRightOnSquareIcon,
  CogIcon,
  HomeIcon,
  InboxArrowDownIcon,
  PencilSquareIcon,
  PlusIcon,
  Square3Stack3DIcon,
  PrinterIcon,
  TrashIcon,
  PlusCircleIcon,
  FolderPlusIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { ExpenseChart } from "./components/Chart/ExpenseChart";
import { useCreateReducer } from "@/hooks/useCreateReducer";
import { BudgetsInitialState, initialState } from "./Budgets.state";
import BudgetsContext from "./Budgets.context";
import {
  DEFAULT_CATEGORY_GROUP,
  biWeeklyFactor,
  checkIsMobile,
  convertFileName,
  formatCurrency,
  getDrawerPlacement,
  weeksInMonth,
} from "@/constants/Budgets.constant";
import { IncomeChart } from "./components/Chart/IncomeChart";
import { InExChart } from "./components/Chart/InExChart";
import { CategoryChart } from "./components/Chart/CategoryChart";
import { CategoryGroupTable } from "./components/Table/CategoryGroupTable";
import { SurplusCard } from "./components/Card/SurplusCard";
import { CategoryTabs } from "./components/Tabs/CategoryTabs";
import { CustomSelect } from "../Custom/Dropdown/CustomSelect";
import { OptionItem } from "../Custom/Dropdown/CustomOption";
import { PencilIcon } from "@heroicons/react/24/solid";
import { ShineExpenseChart } from "./components/Chart/ShineExpenseChart";
import { ShineIncomeChart } from "./components/Chart/ShineIncomeChart";
import ReactToPrint from "react-to-print";
import { ImportButton } from "./components/Button/ImportButton";
import { ExpenseTable } from "./components/Table/ExpenseTable";
import { IncomeTable } from "./components/Table/incomeTable";
import { BudgetChartData, BudgetIncome, ExpenseCategoryData, ExpenseData, LimitData } from "../../type/Budgets.type";
import { BudgeExpenseTable } from "./components/Table/BudgetExpenseTable";

// const userId = "6c91afd4-f157-48cd-9a0c-6cce9eab705d";

const Budgets = () => {
  const isMobile = checkIsMobile();

  const budgetsContextValue = useCreateReducer<BudgetsInitialState>({
    initialState,
  });

  const {
    state: { budgets, currentBudget },
    dispatch: budgetsDispatch,
  } = budgetsContextValue;

  const [budgetData, setBudgetData] = useState<BudgetChartData[]>([]);
  const [budgetDataForOptions, setBudgetDataForOptions] = useState<OptionItem[]>([]);
  const [currentBudgetData, setCurrentBudgetData] = useState<BudgetChartData>({});
  const [expenseCategoriesData, setExpenseCategoriesData] = useState<ExpenseCategoryData[]>([]);
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
  const [incomeData, setIncomeData] = useState<BudgetIncome[]>([]);
  const [limitData, setLimitData] = useState<LimitData[]>([]);
  const [hasIncomeDataUpdated, setHasIncomeDataUpdated] = useState<boolean>(false)
  const [hasExpenseDataUpdated, setHasExpenseDataUpdated] = useState<boolean>(false)
  const [hasExpenseCategoryUpdated, setHasExpenseCategoryUpdated] = useState<boolean>(false)
  const [collectiveExpenseData, setCollectiveExpenseData] = useState({})
  const [direct, setDirect] = useState<string>("");
  let user = JSON.parse(localStorage.getItem('user'))

  const setCurrentBudget = (id: string) => {
    const budget = budgetData.find((item) => item.id === id);
    console.log('selected budget', budget)
    setCurrentBudgetData(budget)
    // fetchIncome(budget?.id)
    // fetchExpenseCategories()
    // fetchExpenseData()
  };

  const onUpdateIncomeData = (value) => {
    setHasIncomeDataUpdated(value)
}
  const onUpdateExpenseData = (value) => {
  setHasExpenseDataUpdated(value)
  }

  const onUpdateExpenseCategory = (value) => {
    setHasExpenseCategoryUpdated(value)
    }

  const fetchBudgetCharts = async ()=>{
    if(!user?._id){
      alert('Seems like your token has expired!')
      return
    }
    try {
      const response = await fetch(`/api/budget/chart?id=${user._id}`);
      const data = await response.json();
      console.log('budget data chart', data)
      if (response.ok) {
        if (data?.data?.length > 0) {
          const transformedData: BudgetChartData[] = data?.data.map((budget: any) => {
            return {
              chartName: budget.chartName,
              pieChartName: budget.pieChartName,
              updatedAt: budget.updatedAt,
              userId: budget.userId,
              id: budget._id
            };
          });
          const optionsAndValues = data?.data.map(d => {
            return { name: d?.chartName, value: d?._id }
        }) || []
          console.log('transformed data', transformedData)
          console.log('options and value', optionsAndValues)
          setBudgetDataForOptions(optionsAndValues)
          setCurrentBudgetData(transformedData?.[0])
          setBudgetData(transformedData)
        }
      }
    } catch (error) {
      console.error("Error fetching budgets Chart Data:", error);
    }
  }

  const fetchLimitData = async ()=>{
    if(!user?._id){
      alert('Seems like your token has expired!')
      return
    }
    try {
      const response = await fetch(`/api/budget/expenses/limit?budgetId=${currentBudgetData.id}`);
      const data = await response.json();
      console.log('budget limit data', data)
      if (response.ok) {
        if (data?.data?.length > 0) {
          const transformedData: LimitData[] = data?.data.map((limit: any) => {
            return {
              upper: limit.upper,
              lower: limit.lower,
              chartId: limit.chartId,
              categoryId: limit.categoryId,
              id: limit._id
            };
          });
          setLimitData(transformedData)
        }
        else{
          setLimitData([])
        }
      }
    } catch (error) {
      console.error("Error fetching budgets Chart Data:", error);
    }
  }

  const fetchExpenseCategories = async ()=>{
    if(!user?._id){
      alert('Seems like your token has expired!')
      return
    }
    try {
      console.log('current budget id', currentBudgetData.id)
      const response = await fetch(`/api/budget/expensecategories?budgetId=${currentBudgetData.id}`);
      const data = await response.json();
      console.log('expense dataaa', data)
      if (response.ok) {
        if (data?.data?.length > 0) {
          console.log('expense category data categories',data?.data)
          const transformedData: ExpenseCategoryData[] = data?.data.map((cat: any) => {
            return {
              categoryName: cat.categoryName,
              chartId: cat.chartId,
              parentId: cat.parentId,
              type: cat.type,
              id: cat._id
            };
          });
          
          setExpenseCategoriesData(transformedData)
          setHasExpenseCategoryUpdated(false)
        }
        else{
          setExpenseCategoriesData([])
        }
      }
    } catch (error) {
      console.error("Error fetching budgets Chart Data:", error);
    }
  }

  const fetchExpenseData = async ()=>{
    if(!user?._id){
      alert('Seems like your token has expired!')
      return
    }
    try {
      console.log('current budget id', currentBudgetData.id)
      const response = await fetch(`/api/budget/expenses?budgetId=${currentBudgetData.id}`);
      const data = await response.json();
      console.log('expense dataaa', data)
      if (response.ok) {
        if (data?.data?.length > 0) {
          console.log('expense category data categories',data?.data)
          const transformedData: ExpenseData[] = data?.data.map((expense: any) => {
            return {
              expense: expense.expense,
              chartId: expense.chartId,
              categoryId: expense.categoryId,
              active: expense.active,
              id: expense._id,
              monthlyAmount: expense.monthlyAmount
            };
          });
          
          setExpenseData(transformedData)
          setHasExpenseDataUpdated(false)
        }
        else{
          setExpenseData([])
        }
      }
    } catch (error) {
      console.error("Error fetching budgets Chart Data:", error);
    }
  }

  useEffect(()=>{
      fetchCollectiveExpenseData(expenseData)
  },[expenseData, expenseCategoriesData])
  const fetchCollectiveExpenseData = (data: ExpenseData[])=>{
    let temp = {}
    console.log('expense category dataaa', expenseCategoriesData)
    const expCategory = expenseCategoriesData.map(exp=>{
      const catName = exp.categoryName
      const expensesOfCategory = data.filter(d=>d.categoryId === exp.id && d.active)
      const total = expensesOfCategory.reduce(
        (total, expense) => total + Number(expense.monthlyAmount),
        0
      );
      temp[catName] = total;
    })
    console.log('tempppp', temp)
    setCollectiveExpenseData(temp)
  }

  const fetchIncome = async (bid?: string)=>{
    if(!user?._id){
      alert('Seems like your token has expired!')
      return
    }
    try {
      const budgetId = currentBudgetData.id || bid
      const response = await fetch(`/api/budget/income?budgetId=${bid}`);
      const data = await response.json();
      console.log('budget data chart', data)
      if (response.ok) {
        if (data?.data?.length > 0) {
          const transformedData: BudgetIncome[] = data?.data.map((income: any) => {
            return {
              id: income._id,
              name: income.name,
              monthlyAmount: income.monthlyAmount,
              note: income.note,
              chartId: income.chartId
            };
          });
          setIncomeData([...transformedData])
          setHasIncomeDataUpdated(false)
        }
      else{
        setIncomeData([])
      }
      }
    } catch (error) {
      console.error("Error fetching Income", error);
    }
  }
  
  async function fetchBudget() {
    try {
      const response = await fetch("/api/budget");
      const data = await response.json();

      if (response.ok) {
        if (data.length > 0) {
          const transformedData: Budget[] = data.map((budget: any) => {
            return {
              id: budget.id,
              name: budget.name,
              categoryGroups: budget.CategoryGroup.map((group: any) => {
                return {
                  id: group.id,
                  name: group.name,
                  description: group.description,
                  categories: group.Category.map((item: any) => {
                    return {
                      id: item.id,
                      name: item.name,
                      monthlyAmount: parseFloat(item.monthlyAmount),
                      note: item.note,
                    };
                  }),
                };
              }),
            };
          });

          budgetsDispatch({
            field: "budgets",
            value: transformedData,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  }
  useEffect(() => {
    fetchBudgetCharts();
  }, []);

  useEffect(()=>{
    fetchIncome(currentBudgetData.id)
  }, [currentBudgetData, hasIncomeDataUpdated])
  
  useEffect(()=>{
    fetchExpenseCategories()
  }, [currentBudgetData, hasExpenseCategoryUpdated])

  useEffect(()=>{
    fetchExpenseData()
  }, [currentBudgetData, hasExpenseDataUpdated])

  useEffect(()=>{
    fetchLimitData()
  }, [currentBudgetData, expenseData, expenseCategoriesData])

  function convertToCSV(
    data: CategoryGroup[],
    delimiter: string = ","
  ): string {
    let csvString =
      "Group" +
      delimiter +
      "Category" +
      delimiter +
      "Weekly" +
      delimiter +
      "BWeekly" +
      delimiter +
      "Monthly" +
      delimiter +
      "Yearly\n";

    data.forEach((group) => {
      group.categories.forEach((category) => {
        const weekly = category.monthlyAmount / weeksInMonth;
        const biWeekly = weekly * 2;
        const yearly = category.monthlyAmount * 12;

        csvString += `${group.name}${delimiter}${
          category.name
        }${delimiter}${weekly.toFixed(2)}${delimiter}${biWeekly.toFixed(
          2
        )}${delimiter}${category.monthlyAmount.toFixed(
          2
        )}${delimiter}${yearly.toFixed(2)}\n`;

        console.log(csvString);
      });
    });

    return csvString;
  }

  const handleExport = () => {
    if (
      currentBudget?.categoryGroups &&
      currentBudget?.categoryGroups.length > 0
    ) {
      const csvString = convertToCSV(currentBudget?.categoryGroups);
      const a = document.createElement("a");
      a.style.display = "none";
      const blob = new Blob([csvString], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = `${convertFileName(currentBudget.name)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  };

  const handleUpdateBudget = (_budget: Budget | undefined, isDel: boolean) => {
    if (_budget == undefined) return;

    const idExists = budgets.some((group) => group.id == _budget.id);

    // Remove
    if (isDel) {
      let updatedBudgets = budgets.filter((budget) => budget.id !== _budget.id);
      return budgetsDispatch({ field: "budgets", value: updatedBudgets });
    }

    // Update
    if (idExists) {
      const updatedBudgets = budgets.map((budget) => {
        const tmp =
          budget.id === _budget.id
            ? {
                ...budget,
                name: _budget.name,
              }
            : budget;
        return tmp;
      });

      budgetsDispatch({ field: "budgets", value: updatedBudgets });
    }

    // Insert
    else {
      budgetsDispatch({
        field: "budgets",
        value: [...budgets, _budget],
      });
    }
  };

  const handleGetCategoryGroup = (groupName: string) => {
    return currentBudget?.categoryGroups.find(
      (item: CategoryGroup) => item.name == groupName
    );
  };

  const handleUpdateCategoryGroup = (
    categoryGroup: CategoryGroup | undefined,
    isDel: boolean = false
  ) => {
    const categoryGroups = currentBudget?.categoryGroups;

    if (categoryGroup == undefined || categoryGroups == null) return;

    const idExists = categoryGroups.some(
      (group) => group.id == categoryGroup.id
    );

    // Remove
    if (isDel) {
      const updatedGroups = categoryGroups.filter(
        (group) => group.id !== categoryGroup.id
      );

      const updateBudget = {
        ...currentBudget,
        categoryGroups: updatedGroups,
      };

      const updateBudgets = budgets.map((x) =>
        x.id === updateBudget.id ? updateBudget : x
      );

      budgetsDispatch({ field: "budgets", value: updateBudgets });
      return;
    }

    // Update
    if (idExists) {
      const updatedGroups = categoryGroups.map((group) => {
        const tmp =
          group.id === categoryGroup.id
            ? {
                ...group,
                name: categoryGroup.name,
                description: categoryGroup.description,
              }
            : group;
        return tmp;
      });

      const updateBudget = {
        ...currentBudget,
        categoryGroups: updatedGroups,
      };

      const updateBudgets = budgets.map((x) =>
        x.id === updateBudget.id ? updateBudget : x
      );

      budgetsDispatch({ field: "budgets", value: updateBudgets });
    }

    // Insert
    else {
      const updateBudget = {
        ...currentBudget,
        categoryGroups: [
          ...categoryGroups,
          { ...categoryGroup, categories: [] },
        ],
      };

      const updateBudgets = budgets.map((x) =>
        x.id === updateBudget.id ? updateBudget : x
      );

      budgetsDispatch({ field: "budgets", value: updateBudgets });
    }
  };

  const [openInsert, setOpenInsert] = useState(false);
  const [insertItem, setInsertItem] = useState({
    chartName: "",
    pieChartName:""
  });

  const handleOpenInsert = () => {
    setInsertItem({
      chartName: "",
      pieChartName:""
    });
    setOpenInsert(!openInsert);
  };

  const handleAddInputChange = (event: any) => {
    setInsertItem({
      ...insertItem,
      [event.target.name]: event.target.value,
    });
  };

  const insertBudgetAPI = async () => {
    if(!user._id){
      alert('User Not Present!')
      return
    }
    const response = await fetch(`/api/budget/chart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id ,
        chartName: insertItem.chartName,
        pieChartName: insertItem.pieChartName
      }),
    });
    if (response.ok) {
      // handleUpdateBudget(data, false);

      // setCurrentBudget("");
      // setDirect(newBudget.id);

      setOpenInsert(!openInsert);
    }
  };

  // Update budget
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updateItem, setUpdateItem] = useState<any>({
    id: "",
    name: "",
  });

  const handleOpenUpdate = () => {
    setUpdateItem({
      id: currentBudget?.id,
      name: currentBudget?.name,
    });
    setOpenUpdate(!openUpdate);
  };

  const handleUpdateInputChange = (event: any) => {
    setUpdateItem({
      ...updateItem,
      [event.target.name]: event.target.value,
    });
  };

  const updateBudgetAPI = async () => {
    const response = await fetch(`/api/budget?id=${updateItem.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: updateItem.name,
      }),
    });
    if (response.ok) {
      const newBudget = await response.json();
      handleUpdateBudget(newBudget, false);

      setCurrentBudget("");
      setDirect(newBudget.id);

      setOpenUpdate(!openUpdate);
    }
  };

  const deleteBudgetGroupAPI = async () => {
    const response = await fetch(`/api/budget?id=${currentBudget?.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      handleUpdateBudget(currentBudget, true);
      setCurrentBudget("");
    }
  };

  const contentRef = useRef(null);

  return (
    <>
      <div ref={contentRef}>
        {/* <button onClick={()=>console.log('sdsd', incomeData)}>current budget chart id {currentBudgetData?.id}</button> */}
        <div className="flex flex-col lg:p-3 p-1 w-screen lg:w-full printable-content">
          <div className="flex flex-col  lg:mb-5 lg:gap-2 ">
            <div className="flex gap-2 z-10 lg:w-1/3 lg:ml-auto">
              <CustomSelect
                options={budgetDataForOptions}
                value={currentBudgetData ? currentBudgetData.id : ""}
                onChange={setCurrentBudget}
              />
              <Menu placement="bottom-end">
                <MenuHandler>
                  <button className="flex bg-softGreenApp items-center justify-center py-1 px-2.5 rounded-lg">
                    <PencilIcon
                      strokeWidth={2}
                      className="w-7 h-7  text-white rounded-lg "
                    />
                  </button>
                </MenuHandler>
                <MenuList>
                  <MenuItem
                    className="flex items-center gap-3"
                    onClick={handleOpenInsert}
                  >
                    <ClipboardDocumentListIcon className="h-5 w-5" />
                    New budget
                  </MenuItem>
                  <hr className="my-3 hover:outline-none" />
                  <MenuItem
                    className="flex items-center gap-3"
                    onClick={handleOpenUpdate}
                  >
                    <ClipboardDocumentIcon className="h-5 w-5" />
                    Edit
                  </MenuItem>
                  <MenuItem
                    className="flex items-center gap-3"
                    onClick={deleteBudgetGroupAPI}
                  >
                    <TrashIcon className="h-5 w-5" />
                    Delete
                  </MenuItem>

                  <ReactToPrint
                    pageStyle={`
                    @media print {
                      body {
                         -webkit-print-color-adjust: exact;
                      }
                   }
        @page {
          size: 410mm 497mm;
          margin: 10mm;
        }
      }`}
                    trigger={() => (
                      <MenuItem className="flex items-center gap-3">
                        <PrinterIcon className="h-5 w-5" />
                        Print
                      </MenuItem>
                    )}
                    content={() => contentRef.current}
                  />

                  <ImportButton
                    budgetId={currentBudget?.id}
                    reloalData={fetchBudget}
                  />
                  <MenuItem
                    className="flex items-center gap-3"
                    onClick={handleExport}
                  >
                    <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                    Export
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>

            <div
              className={`bg-softPurpleApp rounded-xl lg:py-5 my-4 flex justify-center`}
            >
              <ShineExpenseChart 
               expenseData={collectiveExpenseData}
               incomeData={incomeData}
               currentBudget={currentBudgetData}
               />
            </div>
          </div>
          {/* <button onClick={()=>console.log('expen cat da',expenseCategoriesData)}>chccckk</button> */}
          <div className=" gap-5 flex flex-col">
            <div className="flex flex-col lg:flex-row w-full  gap-5">
              <IncomeTable 
               incomeData={incomeData}
               selectedBudgetId={currentBudgetData?.id }
               onUpdate={onUpdateIncomeData}
               />
              {/* {currentBudget &&
                DEFAULT_CATEGORY_GROUP.map((x) => (
                  <CategoryGroupTable key={x.name} groupName={x.name} />
                ))} */}
              <ExpenseTable data={collectiveExpenseData} />
            </div>
            {
              expenseCategoriesData && expenseCategoriesData.map(category=>{
                const expData = expenseData.filter(exp=>exp.categoryId === category.id) || []
                const limitOfCategory = limitData.find(l=>l.categoryId === category.id)
                // console.log('mappings', expData)
                return (<div className="flex flex-col lg:flex-row w-full  gap-5">
                <BudgeExpenseTable
                 expenseData={expData}
                 selectedBudgetId={currentBudgetData?.id }
                 onUpdate={onUpdateExpenseData}
                 tableTitle={category.categoryName}
                 expenseCategoryId={category.id}
                 upper={limitOfCategory?.upper || null}
                 lower={limitOfCategory?.lower || null}
                 limitId={limitOfCategory?.id || null}
                 />
              </div>)
              })
            }
            <InExChart data={collectiveExpenseData} />
            <SurplusCard expenseData={collectiveExpenseData} incomeData={incomeData} />
            <CategoryTabs selectedChartId={currentBudgetData.id} onUpdate={onUpdateExpenseCategory} />
            {/* <CategoryChart /> */}
          </div>
        </div>
      </div>

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
              New budget
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
          <Input
            crossOrigin=""
            size="lg"
            color="blue-gray"
            label="Budget name"
            className="text-lg"
            value={insertItem.chartName}
            name="chartName"
            ref={(input) => input && input.focus()}
            onChange={handleAddInputChange}
          />
        </div>
        <div className="flex flex-col gap-3 mb-3">
          <Input
            crossOrigin=""
            size="lg"
            color="blue-gray"
            label="Pie Chart Name"
            className="text-lg"
            value={insertItem.pieChartName}
            name="pieChartName"
            ref={(input) => input && input.focus()}
            onChange={handleAddInputChange}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button color="green" size="md" onClick={insertBudgetAPI}>
            Add new
          </Button>
        </div>
      </Drawer>

      <Drawer
        size={330}
        placement={getDrawerPlacement()}
        open={openUpdate}
        className="lg:p-4 p-2"
        onClose={handleOpenUpdate}
      >
        <div className="lg:mb-5 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PencilIcon strokeWidth={4} className="h-5 w-5 text-gray-800" />
            <Typography variant="h5" color="blue-gray">
              Update budget
            </Typography>
          </div>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={handleOpenUpdate}
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
          <Input
            crossOrigin=""
            size="lg"
            color="blue-gray"
            label="Budget name"
            className="text-lg"
            value={updateItem.name}
            name="name"
            ref={(input) => input && input.focus()}
            onChange={handleUpdateInputChange}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button color="green" size="sm" onClick={updateBudgetAPI}>
            Update
          </Button>
        </div>
      </Drawer>
    </>
  );
};


export default Budgets;