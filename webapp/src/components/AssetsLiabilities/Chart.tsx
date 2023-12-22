import React, { useEffect, useRef, useState, useContext } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";
import highchartsBellCurve from "highcharts/modules/histogram-bellcurve";
import {
  checkIsMobile,
  getChartConfig,
} from "@/constants/Budgets.constant";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { capitalizeText } from "../../app/api/helperFunctions/capitalize";


if (typeof Highcharts === "object") {
  highchartsBellCurve(Highcharts);
}

highcharts3d(Highcharts);

interface AssetLiabilitiesChartProps {
  assetData: any[],
  liabilityData: any[],
  incomeData: any[]
  selectedChartData: any
}

export const AssetLiabilitiesChart: React.FC<AssetLiabilitiesChartProps> = ({
  assetData= [],
  liabilityData=[],
  incomeData= [],
  selectedChartData = {}
}) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [totalMonthlyAmount, setTotalMonthlyAmount] = useState(0);
  const isMobile = checkIsMobile();
  let user = JSON.parse(localStorage.getItem('user'))
  let totalAssets = 0
  assetData?.map(asset => {
        totalAssets += parseFloat(asset.amount);
    })
  let totalLiabilities = 0
  liabilityData?.map(liability => {
    totalLiabilities += parseFloat(liability.monthlyAmount);
    })
  let totalIncome = 0
    incomeData?.map(income => {
        totalIncome += parseFloat(income.amount);
    })
  
  const netAssets = totalAssets + totalIncome
  const remainingIncome = netAssets - totalLiabilities
  const assetPercentage = (totalAssets/netAssets) *100
  const liabilitiesPercentage = (totalLiabilities/netAssets) *100
  const raminingIncomePercentage = (remainingIncome/netAssets) *100

  Highcharts.setOptions({
    colors: [
      "#FFEA5D",
      "#97EE5B",
      "#5B8CFB",
      "#ED6559",
      "#B067FD",
      "#F5AE5E",
      "#5E5BF2",
      "#CC51A8",
    ],
  });

  let data = [['assets', totalAssets, assetPercentage],
  ['liabilities', totalLiabilities, liabilitiesPercentage],
  [remainingIncome>0? 'Net Assets':'Net Liabilities', remainingIncome, raminingIncomePercentage],
] || []

  return (
    <>
      {/* <button onClick={()=>console.log('tttt', selectedChartData)}> ttttttt</button> */}
      {data.length > 0 ? (
        <div className="lg:w-1/2 w-full ">
          <HighchartsReact
            highcharts={Highcharts}
            options={getChartConfig(
              data,
              capitalizeText(selectedChartData?.pieChartName),
              "Asset and Liabilities",
              remainingIncome,
              capitalizeText(user?.username),
              'Summary of'
            )}
            ref={chartComponentRef}
            // {...props}
          />
        </div>
      ) : (
        <div
          className="flex 
         lg:w-1/2 justify-center items-center"
        >
          <EllipsisHorizontalIcon color="#fff" className="h-12 w-12" />
        </div>
      )}
    </>
  );
}
