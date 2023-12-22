export interface BudgetsInitialState {
  currentBudget: Budget | undefined;
  budgets: Budget[];
}

export const initialState: BudgetsInitialState = {
  currentBudget: undefined,
  budgets: [],
};
