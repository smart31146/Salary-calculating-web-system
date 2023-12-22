import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     tableCellClasses,
//     Stack,
//     Typography,
//     Button
// } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddButton from '../common/addButtonIcon';
import { AssetsDrawer } from './drawers/AssetsDrawer';
import { useEffect } from 'react';
import { Fragment } from "react";
import { checkIsMobile } from '../../constants/Budgets.constant';
import {
    ArrowPathIcon,
    InboxArrowDownIcon,
    CreditCardIcon,
    PlusIcon,
  } from "@heroicons/react/24/outline";
  import {
    Button,
    Chip,
    Drawer,
    IconButton,
    Input,
    Tooltip,
    Typography,
  } from "@material-tailwind/react";
  import { PencilSquareIcon } from "@heroicons/react/24/solid";
  

interface AssetProps {
    selectedChartId: string | number
    selectedChartAssetData: any;
    onUpdateAssetData?: any;
    onAssetDelete?: any;
    selectedChartData?: any;
}

type ActionType = 'Create' | 'Update';

const tableHead = ['id', 'name', 'email', 'gender']
export const mainColor = "bg-[#1E90FF]";

export const AssetsTable: React.FC<AssetProps> = ({
    selectedChartId = '',
    selectedChartAssetData = [],
    onUpdateAssetData,
    onAssetDelete,
    selectedChartData = {},
}) => {
    const isMobile = checkIsMobile();
    const groupName = 'Liabilities'
    const classes = "p-2 md:p-4 border-b border-blue-gray-50 text-center";
    return <>
     <div
        className={`flex text-textPrimary flex-col bg-white shadow-md rounded-lg overflow-hidden w-full h-fit ${
          isMobile ? "text-[10px]" : "text-[14px]"
        }`}
      >
        <div
          className={`flex justify-between items-center py-2 px-3 ${mainColor} `}
        >
          <div className="flex text-xs lg:text-[14px] font-bold items-center text-white gap-2">
            <button
              className="flex  gap-2 hover:underline"
            //   onClick={}
            >
              {!["Liabilities", "Expense"].includes(groupName) ? (
                <>
                  {'Expense'}
                </>
              ) : (
                <>
                  {groupName == "Income" && (
                    <InboxArrowDownIcon strokeWidth={2} className="w-4 h-4 " />
                  )}

                  {groupName == "Expense" && (
                    <CreditCardIcon strokeWidth={2} className="w-4 h-4 " />
                  )}

                  {groupName}
                </>
              )}
            </button>

            <Tooltip
              className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
              content={
                <div className="w-80">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal opacity-80"
                  >
                    <>{'groupData?.description'}</>
                  </Typography>
                </div>
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#fff"
                strokeWidth={2}
                className="h-5 w-5 cursor-pointer text-blue-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
            </Tooltip>
          </div>
          <button
            className={`flex ${mainColor} items-center justify-center py-1 px-2.5 rounded-md gap-1 text-white text-xs lg:text-[14px] font-bold`}
            onClick={()=>{}}
          >
            <PlusIcon strokeWidth={3} className="w-4 h-4  text-white" />
            New
          </button>
        </div>
        <hr className={`${mainColor} h-0.5`} />
        
        <div className="p-0">
          <div
            id={'tableId'}
            className="w-full  overflow-scroll lg:overflow-hidden "
          >
            <table className={`w-full text-left `}>
              <thead>
                <tr>
                  {tableHead.map((head, index) => (
                    <th
                      key={head}
                      className={` bg-blue-gray-50/50 p-2 
                md:p-4 ${index == 0 ? "text-left" : "text-center"}`}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
              <tr>
                        <td className="p-2 md:p-4 border-b border-blue-gray-50 text-left">
                          <div className="flex">
                            {false ? (
                              <Tooltip
                                className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
                                content={
                                  <div className="text-gray-700 text-xs">
                                    rabbia q
                                  </div>
                                }
                              >
                                omama
                              </Tooltip>
                            ) : (
                              <>
                                {name}{" "}
                                maarij i
                              </>
                            )}
                          </div>
                        </td>
                        <td className={`${classes} text-left`}>
                          <Chip
                            variant="ghost"
                            color="green"
                            value={'sunaim'}
                          />
                        </td>
                        <td className={`${classes} text-left`}>
                          <Chip
                            variant="ghost"
                            color="green"
                            value={'khurram'}
                          />
                        </td>
                        <td className={`${classes} text-left`}>
                          <Chip
                            variant="ghost"
                            color="green"
                            value={'mamma'}
                          />
                        </td>
                        <td className={`${classes} text-left`}>
                          <Chip
                            variant="ghost"
                            color="green"
                            value={'baba'}
                          />
                        </td>

                        {!isMobile && (
                          <td className="p-2 md:p-4 border-b border-blue-gray-50 text-left">
                            <div className="flex justify-center items-center">
                              {'ghafoor'}
                            </div>
                          </td>
                        )}

                        <td className={classes}>
                          <IconButton
                            variant="text"
                            // onClick={() => handleOpenUpdate(item)}
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </IconButton>
                        </td>
                      </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
}

