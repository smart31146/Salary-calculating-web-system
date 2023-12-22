import React, {useState} from 'react';
import { styled } from '@mui/material/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Stack,
    Typography,
    Grid
} from '@mui/material';
import { creditCardIconClass } from './AssetTable';
import {
    CreditCardIcon,
    PlusIcon,
    TrashIcon,
  } from "@heroicons/react/24/outline";
  import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { getBottomRow } from '../common/totalStack';
import { IncomeDrawer } from './drawers/IncomeDrawer';
import { isMobile } from "../../app/api/helperFunctions/isMobile";
import {
  Chip,
} from "@material-tailwind/react";

interface IncomeProps {
    selectedChartId: string | number 
    selectedIncomeData: any; 
    onUpdateIncomeData?: any;
    onIncomeDelete?: any;
    selectedChartData?: any;
}

function createData(
    incomeSource: string,
    amount: number,
  ) {
    return { incomeSource, amount };
  }
  
  const rows = [
    createData('Dummy Income Source 1', 0),
  //   createData('Dummy Asset 2','dummy Boc2', 200),
  ];

  const tableHead = [
    'Income Source',
    'Amount',
    'Edit',
    'Delete'
  ]

export const AssetLiabilitiesIncomeTable: React.FC<IncomeProps> = ({
    selectedChartId='',
    selectedIncomeData=[],
    onUpdateIncomeData,
    onIncomeDelete,
    selectedChartData={},
}) => {
    const [open, setOpen] = useState(false)
    const [dataToUpdate, setDataToUpdate] = useState({})
    const [action, setAction] = useState<ActionType>('Create');
    const isMobileDevice = isMobile()
    let totalIncome = 0
    selectedIncomeData?.map(income=>{
        totalIncome += parseFloat(income.amount);
    })
    const toggleDrawerState = (value: boolean)=>{
       setOpen(value)
       setAction('Create')
       setDataToUpdate({})
    }
    console.log('income data', selectedIncomeData)
    const addNewRecord = ()=>{
        setOpen(true)
    }
    const onUpdateIncome = (value)=>{
        onUpdateIncomeData(value)
        setAction('Create')
    }

    const handleUpdate = (rowData)=>{
        setOpen(true)
        setDataToUpdate({...rowData})
        setAction('Update')
    }
    const getTableRow = (row, isNonDummy?: boolean)=>{
        return (
          <tr className="border-b border-gray-300">
                <td className={`p-2 md:p-4 border-b border-blue-gray-50 text-center max-w-[150px]`} style={{ wordWrap: 'break-word' }}>
                    <div className="whitespace-normal overflow-hidden">
                          <Typography variant="span" className="whitespace-pre-line overflow-ellipsis" color="blue-gray">
                          {row.incomeSource}
                          </Typography>
                    </div>
                </td>
                <td className={`p-2 md:p-4 border-b border-blue-gray-50 text-center max-w-[150px]`} style={{ wordWrap: 'break-word' }}>
                    <div className="whitespace-normal overflow-hidden">
                    {/* <Typography variant="span" className="whitespace-pre-line overflow-ellipsis" color="white">
                      {parent.categoryName}
                    </Typography> */}
                    <Chip
                variant="ghost"
                color="green"
                value={row.amount}
                />
                    </div>
                </td>
                <td className={`p-2 md:p-4 border-b border-blue-gray-50 text-center max-w-[150px]`} style={{ wordWrap: 'break-word' }}>
                    <div className="whitespace-normal overflow-hidden flex justify-center items-center">
                      <PencilSquareIcon onClick={() => {
                              if (isNonDummy) {
                                handleUpdate(row);
                                   }
                               }}
                       style={{
                      cursor: 'pointer'
                      }}
                     className="h-5 w-5"
                />
               </div>
             </td>
                <td className={`p-2 md:p-4 border-b border-blue-gray-50 text-center max-w-[150px]`} style={{ wordWrap: 'break-word' }}>
                    <div className="whitespace-normal overflow-hidden flex justify-center items-center">
                    <TrashIcon 
                 onClick={()=>{
                    if(isNonDummy){
                    deleteIncome(row)
                    }
                }}
                 style={{
                     cursor: 'pointer'
                 }} className="h-5 w-5" />
                    </div>
                </td>
                </tr>
        )
    }

    const deleteIncome = async (income: any) => {
        try {
            // Fetch registration data from the API
            const response = await fetch(`/api/assetliabilities/income?incomeId=${income._id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            // If registration is successful, navigate to the login page
            if (response.ok) {
            
                onIncomeDelete(true)
            
            }
        } catch (error) {
            console.log('error');
        }
    }
    return (
    <>
        <IncomeDrawer
            openDrawerState={open}
            toggleDrawer={toggleDrawerState}
            selectedChartId={selectedChartId}
            onUpdateIncome={onUpdateIncome}
            dataToUpdate={dataToUpdate}
            action={action}/>
    <Stack>
        <Stack direction='row'
        px={3}
        py={1}
        justifyContent='space-between'
        sx={{
            height: '50px',
            borderRadius: '12px 12px 0 0',
            backgroundColor: '#2196F3'
        }}>
        <Stack direction='row'>
        <Stack mr={1} alignItems='center' justifyContent='center'>
          <CreditCardIcon strokeWidth={2} style={creditCardIconClass} />
        </Stack>
        <Stack justifyContent='center'>
          <Typography fontSize={18} fontWeight={600} sx={{
            color: 'white'
           }}>
               Income
           </Typography>
        </Stack>
        </Stack>
        <Stack direction='row'>
        <Stack mr={1} alignItems='center' justifyContent='center'>
          <PlusIcon strokeWidth={3} style={creditCardIconClass} />
        </Stack>
        <Stack justifyContent='center'>
          <Typography fontSize={18}
           onClick={()=>addNewRecord(null, 'dynamic')}
           fontWeight={600}
           sx={{
            color: 'white', cursor: 'pointer'
           }}>
               New
           </Typography>
        </Stack>
        </Stack>
        </Stack>
        <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack sx={{
              overflowX: 'hidden'
          }}>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <thead>
                  <tr style={{ backgroundColor: '#F5F7F8', color: 'black' }}>
                    {tableHead.map((head, index) => (
                      <th
                        key={head}
                        // colSpan={index ==  0 || index == 1? 2 : 1}
                        className={` bg-blue-gray-50/50 p-2 
                  md:p-4 ${index == 0 ? "text-left" : "text-center"}`}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
     </thead>
        <TableBody>
          {selectedIncomeData.length>0? selectedIncomeData.map(row=> getTableRow(row, true)):
            rows.map(row=>getTableRow(row, false))
          }
        </TableBody>
      </Table>
    </TableContainer>
    </Stack>
    </Grid>
    </Grid>
      {getBottomRow({total: totalIncome, text: 'Liabilities'})}
    </Stack>
    </>
    );
}