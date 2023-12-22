interface Category {
  id: string;
  name: string;
  monthlyAmount: number;
  note: string;
}

interface CategoryGroup {
  id: string;
  name: string;
  description: string;
  categories: Category[];
}

interface Budget {
  id: string;
  name: string;
  categoryGroups: CategoryGroup[];
}
