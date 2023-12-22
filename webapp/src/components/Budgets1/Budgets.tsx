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

const userId = "6c91afd4-f157-48cd-9a0c-6cce9eab705d";

const Budgets = () => {
  const isMobile = checkIsMobile();

  const budgetsContextValue = useCreateReducer<BudgetsInitialState>({
    initialState,
  });

  const {
    state: { budgets, currentBudget },
    dispatch: budgetsDispatch,
  } = budgetsContextValue;

  const [budgetData, setBudgetData] = useState<any>([]);
  const [direct, setDirect] = useState<string>("");

  const setCurrentBudget = (id: string) => {
    const budget = budgets.find((item) => item.id === id);

    budgetsDispatch({ field: "currentBudget", value: budget });
  };

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
    fetchBudget();
  }, []);

  useEffect(() => {
    if (budgets && budgets.length > 0) {
      // Update current budget
      if (currentBudget) {
        const updatedCurrent = budgets.find((x) => x.id === currentBudget.id);
        budgetsDispatch({ field: "currentBudget", value: updatedCurrent });
      } else {
        if (direct) {
          setCurrentBudget(direct);
          setDirect("");
        } else setCurrentBudget(budgets[0].id);
      }
      // Update budget select
      const data = budgets.map((item: any) => {
        return { value: item.id, name: item.name };
      });
      setBudgetData(data);
    } else {
      setBudgetData([]);
    }
  }, [budgets]);

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

  const handleUpdateCategory = (
    groupId: string | undefined,
    _category: Category,
    isDel: boolean = false
  ) => {
    const categoryGroups = currentBudget?.categoryGroups;
    if (categoryGroups == undefined) return;

    const currentGroup = categoryGroups.find(
      (group: CategoryGroup) => group.id === groupId
    );
    const category = {
      ..._category,
      monthlyAmount: +_category.monthlyAmount, // Convert to number
    };

    if (groupId && currentGroup) {
      const idExists = currentGroup.categories.some(
        (item) => item.id == category.id
      );

      // Remove
      if (isDel) {
        const updatedCategory = currentGroup.categories.filter(
          (item) => item.id !== category.id
        );

        const updatedGroup = {
          ...currentGroup,
          categories: updatedCategory,
        };

        const updatedGroups = categoryGroups.map((group) =>
          group.id === updatedGroup.id ? updatedGroup : group
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
        const updatedCategory = currentGroup.categories.map((item) =>
          item.id === category.id ? category : item
        );

        const updatedGroup = {
          ...currentGroup,
          categories: updatedCategory,
        };

        const updatedGroups = categoryGroups.map((group) =>
          group.id === updatedGroup.id ? updatedGroup : group
        );

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
        const updatedGroup = {
          ...currentGroup,
          categories: [...currentGroup.categories, category],
        };

        const updatedGroups = categoryGroups.map((group) =>
          group.id === updatedGroup.id ? updatedGroup : group
        );

        const updateBudget = {
          ...currentBudget,
          categoryGroups: updatedGroups,
        };

        const updateBudgets = budgets.map((x) =>
          x.id === updateBudget.id ? updateBudget : x
        );

        budgetsDispatch({ field: "budgets", value: updateBudgets });
      }
    }
  };

  const [openInsert, setOpenInsert] = useState(false);
  const [insertItem, setInsertItem] = useState({
    name: "",
  });

  const handleOpenInsert = () => {
    setInsertItem({
      name: "",
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
    const response = await fetch(`/api/budget`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: { connect: { id: userId } },
        name: insertItem.name,
      }),
    });
    if (response.ok) {
      const newBudget = await response.json();
      const data = {
        id: newBudget.id,
        name: newBudget.name,
        categoryGroups: newBudget.CategoryGroup.map((group: any) => {
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
      handleUpdateBudget(data, false);

      setCurrentBudget("");
      setDirect(newBudget.id);

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
    <BudgetsContext.Provider
      value={{
        ...budgetsContextValue,
        handleUpdateBudget,
        handleGetCategoryGroup,
        handleUpdateCategoryGroup,
        handleUpdateCategory,
      }}
    >
      <div ref={contentRef}>
        <div className="flex flex-col lg:p-3 p-1 w-screen lg:w-full printable-content">
          <div className="flex flex-col  lg:mb-5 lg:gap-2 ">
            <div className="flex gap-2 z-10 lg:w-1/3 lg:ml-auto">
              <CustomSelect
                options={budgetData}
                value={currentBudget ? currentBudget.id : ""}
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
              <ShineExpenseChart />
            </div>
          </div>

          <div className=" gap-5 flex flex-col">
            <div className="flex flex-col lg:flex-row w-full  gap-5">
              {currentBudget &&
                DEFAULT_CATEGORY_GROUP.map((x) => (
                  <CategoryGroupTable key={x.name} groupName={x.name} />
                ))}
              <ExpenseTable />
            </div>

            <InExChart />
            <SurplusCard />
            <CategoryTabs />
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
            value={insertItem.name}
            name="name"
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
    </BudgetsContext.Provider>
  );
};


export default Budgets;