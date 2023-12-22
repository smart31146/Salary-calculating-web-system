import { placement } from "@material-tailwind/react/types/components/drawer";

export const checkIsMobile = () => {
  // if (process.env.NODE_ENV == "development")
  //   return (
  //     typeof window !== "undefined" &&
  //     window.matchMedia("(max-width: 800px)").matches
  //   );

  // return window.matchMedia("(max-width: 800px)").matches;
  if (typeof window !== "undefined") {
    return window.matchMedia("(max-width: 800px)").matches;
  }
};

export const DEFAULT_BUDGET_NAME = "Default";
export const weeksInMonth = 4;
export const biWeeklyFactor = 2;

export const TABLE_HEAD = [
  "Name",
  "Weekly",
  "BWeekly",
  "Monthly",
  "Yearly",
  "Note",
  "Edit",
];

export const TABLE_HEAD_MOBILE = [
  "Name",
  "Weekly",
  "BWeekly",
  "Monthly",
  "Yearly",
  "Edit",
];

export const DEFAULT_CATEGORY_GROUP = [
  {
    name: "Income",
    desciption:
      "The Income table empowers users to effortlessly oversee their earnings within a financial management app. It neatly organizes essential details including source names, monthly figures, and optional notes. Streamlining weekly, bi-weekly, monthly, and yearly income tracking, this tool ensures financial clarity with minimal effort.",
  },
  // {
  //   name: "Expense",
  //   desciption:
  //     "Effortlessly track and manage your expenditures with the 'Expense' table. Organize spending by week, half-week, month, or year in your financial management app. Stay in control of your finances like a pro!",
  // },
];

export const formatCurrency = (value: any) => {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const formattedValue = currencyFormatter.format(value);
  return formattedValue.replace(/\.00$/, "");
};

export function generateRandomTableName() {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const randomLength = Math.floor(Math.random() * 4) + 4;
  let randomString = "table-";

  for (let i = 0; i < randomLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return randomString;
}

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

  export const getChartConfig = (
    data: [string, number, number][],
    budgetName: string | undefined,
    type: string,
    totalMonthlyAmount: number,
    userName: string | undefined,
    subtitleText: string = "Summary of Monthly Budgeted "
  ) => {
    const isMobile = checkIsMobile();
    const options: any = {
      credits: {
        enabled: false,
      },
      chart: {
        type: "pie",
        style: {
          fontFamily:
            '"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
        },
        options3d: {
          enabled: true,
          alpha: 20,
        },
        backgroundColor: "transparent",
        height: isMobile && 300,
      },
      title: {
        text: `${userName}'s</br><span style='font-size:${isMobile? '16px':'20px'}; font-weight: bold;'>${budgetName}</span></br><span style='fill: #00C8F5;font-weight: bold;font-size: ${
          isMobile ? "1.2rem" : "1.7rem"
        };'>${formatCurrency(totalMonthlyAmount)}</span>`,
        widthAdjust: isMobile ? -100 : -560,
        align: "center",
        verticalAlign: "middle",
        style: {
          color: "#fff",
          fontSize: isMobile ? "0.7rem" : "1.2rem",
          fontWeight: "bolder",
        },
        y: isMobile ? 30 : 55,
      },
      subtitle: {
        text: subtitleText,
        style: {
          color: "#fff",
          fontSize: isMobile ? "0.9rem" : "1.7rem",
          fontWeight: "bolder",
        },
        y: isMobile ? 20 : 10,
      },
      plotOptions: {
        pie: {
          innerSize: isMobile ? 130 : 250,
          size: isMobile ? 180 : 340,
          depth: isMobile ? 60 : 90,
          startAngle: -65,
          dataLabels: {
            style: {
              fontSize: "20px",
            },
          },
        },
        series: {
          dataLabels: {
            enabled: !0,
            color: "#fff",
          },
        },
      },
      series: [
        {
          name: "Percentage",
          data: data.map((row) => [
            `<span style='stroke-width:0;font-size: ${
              isMobile ? "0.4rem" : "0.9rem"
            }; text-align: center; fill: #fff;'>${
              row[0]
            } - <span style='fill: #F77F00;'>${
              row[1]
            }%</span>: <span style='fill: #00C8F5;'>${formatCurrency(
              row[2]
            )}</span> </span>`,
            row[1],
          ]),
          dataLabels: {
            padding: 1,
            connectorPadding: 0.5 ,

          },
        },
      ],
    };
  
    return options;
  };
export const getDrawerPlacement = (): placement | undefined => {
  return checkIsMobile() ? "bottom" : "right";
};

export const convertFileName = (value: string) => {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
};
