import React, { useState, useEffect, useRef } from "react";
import SelectOption from "../common/selectComponent";
import { Stack, Button, Select } from "@mui/material";
import { NewChartDrawer } from "./drawers/NewChartDrawer";
import ReactToPrint from "react-to-print";
import { CustomSelect } from "../Custom/Dropdown/CustomSelect";
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
import { PencilIcon } from "@heroicons/react/24/solid";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { ImportButton } from "../Budgets/components/Button/ImportButton";

interface SelectedChartProps {
  selectedChartId: any;
  allCharts: any;
  handleOptionChange?: any
  assetList?: any
  incomeList?: any
  liabilitiesList?: any
}

export const AssetLiabilitiesHeader: React.FC<SelectedChartProps> = ({ selectedChartId, allCharts, handleOptionChange,
assetList=[], incomeList=[], liabilitiesList=[]
}) => {
  const [open, setOpen] = useState(false)
  let user = JSON.parse(localStorage.getItem('user'))
  console.log('selectediddd', selectedChartId)
  console.log('allcharts', allCharts)
  const optionsAndValues = allCharts?.map(d => {
    return { name: d?.option, value: d?.value }
}) || []

  const [selectedValue, setSelectedValue] = useState(selectedChartId);

  const handleChange = (value) => {
    setSelectedValue(value);
    handleOptionChange(value)
  };
  const toggleDrawerState = (value: boolean) => {
    setOpen(value)
  }

  const handleExport = async () => {
    try {
        if (!user?.userId) {
            alert('You may need to login!')
            return
        }
        // Fetch registration data from the API
        const response = await fetch(`/api/assetliabilities/export?chartId=${selectedChartId}&userId=${user?.userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                incomeList,
                assetList,
                liabilitiesList
            }),
        });
        if (response.ok) {
            console.log('responsee csv')
            // Convert the response to Blob (binary data)
            const blob = await response.blob();

            // Create a temporary URL for the Blob
            const url = window.URL.createObjectURL(blob);

            // Create a link element to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.download = 'exported_data.csv';

            // Append the link to the body and trigger the download
            document.body.appendChild(link);
            link.click();

            // Remove the link from the body
            document.body.removeChild(link);
        }
    } catch (error) {
        console.log('error in csv');
    }
}
    return (
      <div>
        <div className="flex flex-col lg:p-3 p-1 w-screen lg:w-full printable-content">
          <div className="flex flex-col  lg:mb-5 lg:gap-2 ">
            <div className="flex gap-2 z-10 lg:w-1/3 lg:ml-auto">
              <CustomSelect
                options={optionsAndValues}
                value={selectedChartId ? selectedChartId:''}
                onChange={handleChange}
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
                    onClick={() => setOpen(true)}
                  >
                    <ClipboardDocumentListIcon className="h-5 w-5" />
                    New budget
                  </MenuItem>
                  <hr className="my-3 hover:outline-none" />
                  <MenuItem
                    className="flex items-center gap-3"
                    // onClick={handleOpenUpdate}
                  >
                    <ClipboardDocumentIcon className="h-5 w-5" />
                    Edit
                  </MenuItem>
                  <MenuItem
                    className="flex items-center gap-3"
                    // onClick={deleteBudgetGroupAPI}
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
                    // content={() => contentRef.current}
                  />

                  {/* <ImportButton
                    budgetId={currentBudget?.id}
                    reloalData={fetchBudget}
                  /> */}
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
            </div>
            </div>
               <NewChartDrawer
                   openDrawerState={open}
                   toggleDrawer={toggleDrawerState}
                 />
            </div>
    )
  // return <Stack direction='row'
  //   justifyContent="space-between"
  //   alignItems="center"
  // >
  //   <NewChartDrawer
  //     openDrawerState={open}
  //     toggleDrawer={toggleDrawerState}
  //   />
  //   <Stack gap={3}>
  //     <Button variant='contained'
  //       onClick={() => setOpen(true)}
  //       sx={{
  //         backgroundColor: '#058B00',
  //         '&:hover': {
  //           backgroundColor: '#058B00',
  //         }
  //       }}
  //     >
  //       Create New Chart
  //     </Button>
  //     {/* <Button variant='contained'
  //       onClick={handleExport}
  //       sx={{
  //         backgroundColor: '#058B00',
  //         '&:hover': {
  //           backgroundColor: '#058B00',
  //         }
  //       }}
  //     >
  //       Export Data
  //     </Button>
  //     <Button variant='contained'
  //       // onClick={}
  //       sx={{
  //         backgroundColor: '#058B00',
  //         '&:hover': {
  //           backgroundColor: '#058B00',
  //         }
  //       }}
  //     >
  //       Clone
  //     </Button> */}
  //   </Stack>
  //   <Stack direction='row' gap={4}>
  //     <select
  //       value={selectedValue}
  //       onChange={handleChange}
  //       style={{
  //         backgroundColor: 'white',
  //         borderRadius: '8px', // Adjust the border radius as needed
  //         width: '200px', // Adjust the width as needed
  //         padding: '8px', // Adjust the padding as needed
  //         border: '1px solid #ccc', // Border color
  //         // Add more styles as needed
  //       }}
  //     >
  //       {allCharts?.length > 0 && allCharts?.map((item) => (
  //         <option key={item.value} value={item.value}>
  //           {item.option}
  //         </option>
  //       ))}
  //     </select>
  //     <SelectOption />
  //   </Stack>
  // </Stack>
};
