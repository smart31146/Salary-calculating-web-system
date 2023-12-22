import { ActionType } from "@/hooks/useCreateReducer";
import { Dispatch, createContext } from "react";
import { BudgetsInitialState } from "./Budgets.state";
export interface BudgetsContextProps {
  state: BudgetsInitialState;
  dispatch: Dispatch<ActionType<BudgetsInitialState>>;
  handleUpdateBudget: (_budget: Budget | undefined, isDel: boolean) => void;
  handleGetCategoryGroup: (groupName: string) => CategoryGroup | undefined;
  handleUpdateCategoryGroup: (
    categoryGroup: CategoryGroup | undefined,
    isDel: boolean
  ) => void;
  handleUpdateCategory: (
    groupId: string | undefined,
    category: Category,
    isDel: boolean
  ) => void;
}

const BudgetsContext = createContext<BudgetsContextProps>(undefined!);

export default BudgetsContext;
