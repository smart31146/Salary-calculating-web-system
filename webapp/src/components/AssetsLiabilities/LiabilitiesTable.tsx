import React, {useState, useEffect} from 'react';
import { styled } from '@mui/material/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    Stack,
    Typography,
    Button
} from '@mui/material';
import { LiabilityDrawer } from './drawers/LiabilitiesDrawer';
import { LiabilityProps, ActionType } from './types';
import { PlusIcon, TrashIcon, CreditCardIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { LiabilityCategoryDrawer } from './drawers/LiabilityCategoryDrawer';
import { getBottomRow } from '../common/totalStack';
import { isMobile } from "../../app/api/helperFunctions/isMobile";
import {
    Chip,
    IconButton
  } from "@material-tailwind/react";

export const creditCardIconClass = {
    height: '20px',
    width: '20px',
    color: 'white',
}

function createData(
    liability: string,
    financialInstitution: string,
    monthlyAmount: number,
    balance: number,
    limit: number,
  ) {
    return { liability, financialInstitution, monthlyAmount, balance, limit };
  }
  
  const rows = [
    createData('Dummy Liability 1','dummy Boc1', 0,0,0),
  //   createData('Dummy Asset 2','dummy Boc2', 200),
  ];

  const tableHead = [
      'Liability',
      'Financial Institution',
      'Balance',
      'Limit',
      'Monthly Amount',
      'Yearly Amount',
      'Edit',
      'Delete'
  ]
  

export const LiabilitiesTable: React.FC<LiabilityProps> = ({
    selectedChartId='',
    selectedChartLiabilitiesData=[],
    onUpdateLiabilityData,
    onLiabilityDelete,
    selectedChartData={},
}) => {
    const [parentLiabilityCategories, setParentLiabilityCategories] = React.useState([]);
    const [nonParentLiabilityCategories, setNonParentLiabilityCategories] = useState({});
    const [categoryDataToUpdate, setCategoryDataToUpdate] = useState({})
    const [selectedLiabilityCategory, setSelectedLiabilityCategory] = useState({});
    const [open, setOpen] = useState(false)
    const [openCategory, setOpenCategory] = useState(false);
    const [dataToUpdate, setDataToUpdate] = useState({})
    const [action, setAction] = useState<ActionType>('Create');
    const isMobileDevice = isMobile()
    let totalLiabilities = 0
    selectedChartLiabilitiesData?.map(liabilities=>{
        totalLiabilities += parseFloat(liabilities?.monthlyAmount);
    })

    const toggleCategoryDrawerState = (value: boolean) => {
        setOpenCategory(value)
        setAction('Create')
        setCategoryDataToUpdate({})
    }
    
    const toggleDrawerState = (value: boolean)=>{
       setOpen(value)
       setAction('Create')
       setDataToUpdate({})
    }
    console.log('liability data', selectedChartLiabilitiesData)
    const addNewRecord = (category, type) => {
        if(type === 'fixed'){
        setOpen(true)
        if(category){
            setSelectedLiabilityCategory({ ...category })
         }
      }else{
          setOpenCategory(true)
        }
      }
    const onUpdateLiability = (value, isMainParent=false)=>{
        onUpdateLiabilityData(value)
        setAction('Create')
        setSelectedLiabilityCategory({})
        if(isMainParent === true){
            fetchLiabilityCategories()
        }
    }

    const handleUpdate = (rowData)=>{
        setOpen(true)
        setDataToUpdate({...rowData})
        setAction('Update')
    }

    const deleteLiabilityAndLiabilityCategory = async (url: string) => {
        try {
            // Fetch registration data from the API
            const response = await fetch(url, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            // If registration is successful, navigate to the login page
            if (response.ok) {
                onLiabilityDelete(true)
            }
        } catch (error) {
            console.log('error');
        }
    }

    const getLevel1Parents = (parent, showAddButton: boolean)=>{
        return (
            <tr style={{ backgroundColor: '#F77F00' }}>
                <td colSpan={7} className={`p-2 md:p-4 border-b border-blue-gray-50 text-left max-w-[150px]`} style={{ wordWrap: 'break-word' }}>
                    <div className="whitespace-normal overflow-hidden">
                    <Typography variant="span" className="whitespace-pre-line overflow-ellipsis" color="white">
                      {parent.categoryName}
                    </Typography>
                    </div>
                </td>
                <td className={`text-left`}>
                <div className="flex items-right">
                {showAddButton && 
                        <PlusIcon strokeWidth={3} className="w-5 h-5  text-white cursor:pointer" onClick={() => addNewRecord(parent, 'fixed')} />
                }
                {parent.type === 'dynamic' && 
                        <TrashIcon strokeWidth={3}
                         onClick={()=>{
                            if(showAddButton){
                                deleteLiabilityAndLiabilityCategory(`/api/assetliabilities/liabilities/fixed?liabilityCategoryId=${parent._id}`)
                                fetchLiabilityCategories()
                            }
                        }}
                        className="w-5 h-5  text-white" />
                }
                </div>
                </td>
                </tr>
        )
    }

    const getTableRow = (row, isNonDummy?: boolean)=>{
        return (
        <TableRow key={row.id}
            sx={{
                // '&:last-child td, &:last-child th': { border: 0 }, // Remove border for last row
                // height: isMobileDevice? '20px': '80px', // Adjust the height of each row
                borderBottom: '2px solid #ccc', // Border color for each row
              }}
            >
                <TableCell align="center">
                <Stack justifyContent='center' alignItems='center'>
                <Chip
                variant="ghost"
                color="green"
                value={row.liability}
                />
                 </Stack>
                </TableCell>
                <TableCell align="center">
                <Stack justifyContent='center' alignItems='center'>
                <Chip
                variant="ghost"
                color="green"
                value={row.financialInstitution}
                    />
                 </Stack>
                </TableCell>
                <TableCell align="center">
                <Stack justifyContent='center' alignItems='center'>
                <Chip
                variant="ghost"
                color="green"
                value={row.balance}
                    />
                 </Stack>
                </TableCell>
                <TableCell align="center">
                <Stack justifyContent='center' alignItems='center'>
                <Chip
                variant="ghost"
                color="green"
                value={row.limit}
                    />
                 </Stack>
                </TableCell>
                <TableCell align="center">
                <Stack justifyContent='center' alignItems='center'>
                <Chip
                variant="ghost"
                color="green"
                value={row.monthlyAmount}
                    />
                 </Stack>
                </TableCell>
                <TableCell align="center">
                <Stack justifyContent='center' alignItems='center'>
                <Chip
                variant="ghost"
                color="green"
                value={row.monthlyAmount * 12}
                    />
                 </Stack>
                </TableCell>
                <TableCell align="center">
                <Stack justifyContent='center' alignItems='center'>
                    <PencilSquareIcon 
                    onClick={()=>{
                        if(isNonDummy){
                        handleUpdate(row)
                        }
                    }}
                    style={{
                        cursor: 'pointer'
                    }} className="h-5 w-5" />
                </Stack>
                </TableCell>
                <TableCell align="center">
                <Stack justifyContent='center' alignItems='center'>
                 <TrashIcon 
                 onClick={()=>{
                    if(isNonDummy){
                        deleteLiabilityAndLiabilityCategory(`/api/assetliabilities/liabilities?liabilityId=${row._id}`)
                    }
                }}
                 style={{
                     cursor: 'pointer'
                 }} className="h-5 w-5" />
                </Stack>
                </TableCell>
            </TableRow>
            )
    }
    const getParentChildrens = (parentChildren)=>{
        return  parentChildren.map(subCat => {
             const selectedLiabilityCategoryLiabilityData = selectedChartLiabilitiesData.filter(item => item.categoryId === subCat._id)
             return (
             <>
               <TableRow>
                     <TableCell
                         sx={{
                             backgroundColor: '#0A0459'
                         }}
                         colspan={7}
                         align="left">
                         <Typography
                             fontSize={17}
                             fontWeight={600}
                             color='white'
                             >
                             {subCat.categoryName}
                         </Typography>
                     </TableCell>
                     <TableCell
                         sx={{
                             backgroundColor: '#0A0459'
                         }}
                         colspan={2}
                         align="right">
                         <Button onClick={() => addNewRecord(subCat, 'fixed')}>
                             <PlusIcon strokeWidth={3} className="w-4 h-4  text-white" />
                         </Button>
                     </TableCell>
               </TableRow>
                 {  selectedLiabilityCategoryLiabilityData.length>0?
                     selectedLiabilityCategoryLiabilityData.map(row => getTableRow(row, true)) :
                     rows.map(row => getTableRow(row, false)) 
                 }
                 </>
             )
         })
     
    }

    const fetchLiabilityCategories = async () => {
        const response = await fetch(`/api/assetliabilities/liabilities/fixed?id=${selectedChartId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            let data = await response.json()
            data = data?.data;
            const parentsData = data.parentsData
            const parents = data.parents
            // const nonParents = data.filter(d=>d.parentId !== '')
            setParentLiabilityCategories([...parents])
            setNonParentLiabilityCategories({ ...parentsData })
            console.log('res liability categories', data)
        } else {
            console.log('eeeeeee', response)
            // setErrMsg('User not found or email already verified');
        }
    }

    useEffect(() => {
        if(selectedChartId){
            fetchLiabilityCategories()
        }
    }, [selectedChartId ])
    return (
        <>
    <LiabilityDrawer
                openDrawerState={open}
                toggleDrawer={toggleDrawerState}
                selectedChartId={selectedChartId}
                onUpdate={onUpdateLiability}
                dataToUpdate={dataToUpdate}
                action={action}
                selectedLiabilityCategory={selectedLiabilityCategory}
            />
            <LiabilityCategoryDrawer
                openDrawerState={openCategory}
                toggleDrawer={toggleCategoryDrawerState}
                selectedChartId={selectedChartId}
                onUpdate={onUpdateLiability}
                dataToUpdate={categoryDataToUpdate}
                action={action}
                selectedLiabilityCategory={selectedLiabilityCategory}
            />
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
               Liabilities
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
                        className={` bg-blue-gray-50/50 p-2 
                  md:p-4 ${index == 0 ? "text-left" : "text-center"}`}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
     </thead>
        <TableBody>
          {parentLiabilityCategories.map((parent) => {
            let parentChildren = nonParentLiabilityCategories[parent.categoryName]
            console.log('parent children', parentChildren)
            if (parentChildren?.length > 0) {
                return (<>
                    {getLevel1Parents(parent, false)}
                    {getParentChildrens(parentChildren)}
                </>)
            }
            else{
                const selectedLiabilityCategoryLiabilitysData = selectedChartLiabilitiesData.filter(item => item.categoryId === parent._id)
                return (
                    <>
                      {getLevel1Parents(parent, true)}
                      {selectedLiabilityCategoryLiabilitysData.length>0?
                      selectedLiabilityCategoryLiabilitysData.map(row=> getTableRow(row, true)):
                      rows.map(row=> getTableRow(row, false))
                      }
                    </>
                )
            }
        }
          )}
        </TableBody>
      </Table>
    </TableContainer>
    </Stack>
    </Grid>
    </Grid>
      {getBottomRow({total: totalLiabilities, text: 'Liabilities'})}
    </Stack>
    </>
    );
}