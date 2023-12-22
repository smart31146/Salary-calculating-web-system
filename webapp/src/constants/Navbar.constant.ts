import Budgets  from "@/components/Budgets/Budgets";
import {
  PresentationChartBarIcon,
  LanguageIcon,
  ClipboardDocumentListIcon,
  ChevronRightIcon,
  MagnifyingGlassCircleIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline";

export const navListItems = [
  {
    label: "Personal Finance",
    icon: PresentationChartBarIcon,
    children: [
      {
        label: "Budgets",
        icon: ChevronRightIcon,
      },
      {
        label: "Asset/Liabilities",
        icon: ChevronRightIcon,
      },
      {
        label: "GDS/TDS",
        icon: ChevronRightIcon,
      },
      {
        label: "Banks",
        icon: ChevronRightIcon,
      },
      {
        label: "Paystub",
        icon: ChevronRightIcon,
      },
    ],
  },
  {
    label: "Stocks",
    icon: NewspaperIcon,
    children: [
      {
        label: "Databank",
        icon: ChevronRightIcon,
      },
      {
        label: "Watchlist",
        icon: ChevronRightIcon,
      },
      {
        label: "Screener",
        icon: ChevronRightIcon,
      },
    ],
  },
  {
    label: "Retirement",
    icon: ClipboardDocumentListIcon,
    children: [],
  },
  {
    label: "Vedic Astrology",
    icon: LanguageIcon,
    children: [],
  },
  {
    label: "Research",
    icon: MagnifyingGlassCircleIcon,
    children: [],
  },
  {
    label: "Users",
    icon: MagnifyingGlassCircleIcon,
    children: [],
  },
];
