import React, { useContext, useEffect, useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Card,
  CardBody,
  Button,
  Drawer,
  Typography,
  IconButton,
  Input,
} from "@material-tailwind/react";
import {
  checkIsMobile,
  getDrawerPlacement,
} from "@/constants/Budgets.constant";
import { PlusIcon } from "@heroicons/react/24/outline";
import { CategoryGroupTable } from "../Table/CategoryGroupTable";
import BudgetsContext from "../../Budgets.context";

const userId = "18bf1688-a7e2-4647-800c-236a52752353";

export const CategoryTabs = () => {
  const isMobile = checkIsMobile();

  const {
    state: { currentBudget },
    handleUpdateCategoryGroup,
  } = useContext(BudgetsContext);

  const [groupData, setGroupData] = useState<CategoryGroup[]>([]);
  const [openInsert, setOpenInsert] = useState(false);
  const [insertItem, setInsertItem] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const categoryGroups = currentBudget?.categoryGroups;
    if (categoryGroups === undefined) return;
    const group: CategoryGroup[] = categoryGroups.filter(
      (group) => !["Income", "Expense"].includes(group.name)
    );

    setGroupData(group);
  }, [currentBudget]);

  const handleOpenInsert = () => {
    setInsertItem({
      name: "",
      description: "",
    });
    setOpenInsert(!openInsert);
  };

  const handleAddInputChange = (event: any) => {
    setInsertItem({
      ...insertItem,
      [event.target.name]: event.target.value,
    });
  };

  const insertCategoryGroupAPI = async () => {
    const response = await fetch(`/api/budget/category-group`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        budget: { connect: { id: currentBudget?.id } },
        name: insertItem.name,
        description: insertItem.description,
      }),
    });

    const newCategoryGroup = await response.json();

    handleUpdateCategoryGroup(newCategoryGroup, false);

    setOpenInsert(!openInsert);
  };

  return (
    <>
      <div>
        <div className="flex justify-end mb-3">
          <Button
            size="sm"
            onClick={handleOpenInsert}
            className="flex gap-1 justify-center items-center bg-blueApp
            "
          >
            <PlusIcon strokeWidth={3} className="h-4 w-4 text-white" />
            Category
          </Button>
        </div>
        <div className="flex flex-col gap-5">
          {groupData.map((item, index) => {
            return <CategoryGroupTable groupName={item.name} key={index} />;
          })}
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
              New category
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
            label="Description (Optional)"
            className="text-lg"
            value={insertItem.description}
            name="description"
            onChange={handleAddInputChange}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button color="green" size="md" onClick={insertCategoryGroupAPI}>
            Add new
          </Button>
        </div>
      </Drawer>
    </>
  );
};
