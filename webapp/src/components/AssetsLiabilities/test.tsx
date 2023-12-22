import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    tableCellClasses,
    Stack,
    Typography,
    Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddButton from '../common/addButtonIcon';
import { AssetsDrawer } from './drawers/AssetsDrawer';
import { useEffect } from 'react';
import { PlusIcon } from "@heroicons/react/24/outline";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'white',
        color: theme.palette.common.black,
        fontSize: 18,
        fontweight: 700
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 15,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: '#F5F5F5'
        // theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));



interface AssetProps {
    selectedChartId: string | number
    selectedChartAssetData: any;
    onUpdateAssetData?: any;
    onAssetDelete?: any;
    selectedChartData?: any;
}

type ActionType = 'Create' | 'Update';

export const AssetsTable: React.FC<AssetProps> = ({
    selectedChartId = '',
    selectedChartAssetData = [],
    onUpdateAssetData,
    onAssetDelete,
    selectedChartData = {},
}) => {
    return <>Omama</>
}

// export const AssetsTable: React.FC<AssetProps> = ({
//     selectedChartId = '',
//     selectedChartAssetData = [],
//     onUpdateAssetData,
//     onAssetDelete,
//     selectedChartData = {},
// }) => {
//     const [open, setOpen] = useState(false)
//     const [dataToUpdate, setDataToUpdate] = useState({})
//     const [action, setAction] = useState<ActionType>('Create');
//     const [assetCategories, setAssetCategories] = useState([]);
//     const [parentAssetCategories, setParentAssetCategories] = useState([]);
//     const [nonParentAssetCategories, setNonParentAssetCategories] = useState({});
//     const [selectedAssetCategory, setSelectedAssetCategory] = useState({});
//     let totalAssets = 0
//     selectedChartAssetData?.map(income => {
//         totalAssets += parseFloat(income.amount);
//     })
//     const toggleDrawerState = (value: boolean) => {
//         setOpen(value)
//         setAction('Create')
//         setDataToUpdate({})
//     }
//     console.log('asset data', selectedChartAssetData)
//     const addNewRecord = (category) => {
//         setOpen(true)
//         if(category){
//             setSelectedAssetCategory({ ...category })
//         }
//     }
//     const onUpdateAsset = (value) => {
//         onUpdateAssetData(value)
//         setAction('Create')
//         setSelectedAssetCategory({})
//     }

//     const handleUpdate = (rowData) => {
//         setOpen(true)
//         setDataToUpdate({ ...rowData })
//         setAction('Update')
//     }

//     const deleteAsset = async (asset: any) => {
//         try {
//             // Fetch registration data from the API
//             const response = await fetch(`/api/assetliabilities/assets?chartId=${selectedChartId}&assetId=${asset.id}`, {
//                 method: "DELETE",
//                 headers: { "Content-Type": "application/json" },
//             });

//             // If registration is successful, navigate to the login page
//             if (response.ok) {
//                 onAssetDelete(true)
//             }
//         } catch (error) {
//             console.log('error');
//         }
//     }

//     const fetchAssetCategories = async () => {
//         const response = await fetch(`/api/assetliabilities/assets/fixed`, {
//             method: "GET",
//             headers: { "Content-Type": "application/json" },
//         });
//         if (response.ok) {
//             let data = await response.json()
//             data = data?.data;
//             const parentsData = data.parentsData
//             const parents = data.parents
//             // const nonParents = data.filter(d=>d.parentId !== '')
//             setParentAssetCategories([...parents])
//             setNonParentAssetCategories({ ...parentsData })
//             console.log('res asset categories', data)
//         } else {
//             console.log('eeeeeee', response)
//             // setErrMsg('User not found or email already verified');
//         }
//     }

//     useEffect(() => {
//         fetchAssetCategories()
//     }, [])
//     const getLevel1Parents = (parent, showAddButton: boolean)=>{
//         return <StyledTableRow>
//                 <StyledTableCell
//                     sx={{backgroundColor: '#F77F00'}}
//                     colspan={4}
//                     align="left">
//                     <Typography
//                         fontSize={22}
//                         fontWeight={700}>
//                         {parent.categoryName}
//                     </Typography>
//                 </StyledTableCell>
//                 <StyledTableCell
//                     sx={{backgroundColor: '#F77F00'}}
//                     colspan={2}
//                     align="right">

//                     {showAddButton && <Button onClick={() => addNewRecord(parent)}>
//                         <PlusIcon strokeWidth={3} className="w-4 h-4  text-black" />
//                     </Button>}
//                 </StyledTableCell>
//             </StyledTableRow>
//     }
//    const getParentChildrens = (parentChildren)=>{
//        return  parentChildren.map(subCat => {
//             const selectedAssetCategoryAssetsData = selectedChartAssetData.filter(item => item.categoryId === subCat.id)
//             return (
//             <>
//             <StyledTableRow>
//                     <StyledTableCell
//                         sx={{
//                             backgroundColor: '#B0C4DE'
//                         }}
//                         colspan={4}
//                         align="left">
//                         <Typography
//                             fontSize={17}
//                             fontWeight={600}>
//                             {subCat.categoryName}
//                         </Typography>
//                     </StyledTableCell>
//                     <StyledTableCell
//                         sx={{
//                             backgroundColor: '#B0C4DE'
//                         }}
//                         colspan={2}
//                         align="right">
//                         <Button onClick={() => addNewRecord(subCat)}>
//                             <PlusIcon strokeWidth={3} className="w-4 h-4  text-black" />
//                         </Button>
//                     </StyledTableCell>
//             </StyledTableRow>
//                 {
//                     selectedAssetCategoryAssetsData.map(row => {
//                         return (
//                         <StyledTableRow key={row.id}>
//                             <StyledTableCell align="center">
//                                 <b>{row.asset}</b>
//                             </StyledTableCell>
//                             <StyledTableCell align="center">
//                                 <b>{row.financialInstitution}</b>
//                             </StyledTableCell>
//                             <StyledTableCell align="center">
//                                 <b>{row.amount}</b>
//                             </StyledTableCell>
//                             <StyledTableCell align='center'>
//                                 <DeleteIcon
//                                     onClick={() => deleteAsset(row)}
//                                     sx={{
//                                         color: '#058B00',
//                                         cursor: 'pointer'
//                                     }}
//                                 />
//                                 <EditIcon
//                                     onClick={() => handleUpdate(row)}
//                                     sx={{
//                                         color: '#058B00',
//                                         cursor: 'pointer'
//                                     }}
//                                 />
//                             </StyledTableCell>
//                         </StyledTableRow>
//                         )
//                     })
//                 }
//                 </>
//             )
//         })
    
//    }
//     return (
//         <Stack>
//             <AssetsDrawer
//                 openDrawerState={open}
//                 toggleDrawer={toggleDrawerState}
//                 selectedChartId={selectedChartId}
//                 onUpdate={onUpdateAsset}
//                 dataToUpdate={dataToUpdate}
//                 action={action}
//                 selectedAsset={selectedAssetCategory}
//             />
//             <Stack
//                 direction='row'
//                 justifyContent="space-between"
//                 alignItems="center"
//                 height='50px'
//                 px={4}
//                 sx={{
//                     backgroundColor: '#058B00',
//                     borderRadius: '12px 12px 0 0',
//                 }}
//             >
//                 <Typography
//                     fontWeight={600}
//                     fontSize={20}
//                     color='white'
//                 >
//                     Net Assets 
//                     {/* <Button onClick={() => console.log('asset categories', parentAssetCategories, nonParentAssetCategories)}> hahhaha</Button> */}
//                 </Typography>
//                 <Stack direction='row'
//                     justifyContent="space-between"
//                     alignItems="center"
//                     mt={1}
//                 >
//                     <Typography
//                         fontWeight={600}
//                         fontSize={20}
//                         color='white'
//                         mr={4}
//                         sx={{ textTransform: 'capitalize' }}
//                     >
//                         {selectedChartData?.chartName}
//                     </Typography>
//                     <AddButton onClick={addNewRecord} />
//                 </Stack>
//             </Stack>
//             <Stack>
//                 <TableContainer component={Paper}>
//                     <Table sx={{ minWidth: 700, }} aria-label="customized table">
//                         <TableHead sx={{
//                             backgroundColor: '#058B00',
//                             fontSize: 20
//                         }}>
//                             <TableRow>
//                                 <StyledTableCell align="center">Asset</StyledTableCell>
//                                 <StyledTableCell align="center">Financial Institution</StyledTableCell>
//                                 <StyledTableCell align="center">Amount</StyledTableCell>
//                                 <StyledTableCell align="center">Action</StyledTableCell>
//                                 <StyledTableCell align="center"></StyledTableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {
//                                 parentAssetCategories.map(parent => {
//                                     //  this will bring all the parents <an></an>d their children. if parent has no children then its an individual category
//                                     let parentChildren = nonParentAssetCategories[parent.categoryName]
//                                     console.log('parent children', parentChildren)
//                                     if (parentChildren.length > 0) {
//                                         return (<>
//                                             {getLevel1Parents(parent, false)}
//                                             {getParentChildrens(parentChildren)}
//                                         </>)
//                                     }
//                                     else {
//                                         const selectedAssetCategoryAssetsData = selectedChartAssetData.filter(item => item.categoryId === parent.id)
//                                         return (<>
//                                            {getLevel1Parents(parent, true)}
//                                             {
//                                             selectedAssetCategoryAssetsData.map(row => {
//                                                                     return (
//                                             <StyledTableRow key={row.id}>
//                                                 <StyledTableCell align="center">
//                                                     <b>{row.asset}</b>
//                                                 </StyledTableCell>
//                                                 <StyledTableCell align="center">
//                                                     <b>{row.financialInstitution}</b>
//                                                 </StyledTableCell>
//                                                 <StyledTableCell align="center">
//                                                     <b>{row.amount}</b>
//                                                 </StyledTableCell>
//                                                 <StyledTableCell align='center'>
//                                                     <DeleteIcon
//                                                         onClick={() => deleteAsset(row)}
//                                                         sx={{
//                                                             color: '#058B00',
//                                                             cursor: 'pointer'
//                                                         }}
//                                                     />
//                                                     <EditIcon
//                                                         onClick={() => handleUpdate(row)}
//                                                         sx={{
//                                                             color: '#058B00',
//                                                             cursor: 'pointer'
//                                                         }}
//                                                     />
//                                                 </StyledTableCell>
//                                                 <StyledTableCell align='center'></StyledTableCell>
//                                             </StyledTableRow>

//                                                     )
//                                                 })
//                                             }
//                                         </>)
//                                     }


//                                 })
//                             }
//                             {/* {
//                                 assetCategories && assetCategories.map(cat => {
//                                     const selectedAssetCategoryAssetsData = selectedChartAssetData.filter(item => item.categoryId === cat.id)
//                                     console.log('klkl', selectedChartAssetData, cat)
//                                     return (
//                                         <>
//                                             <StyledTableRow>
//                                                 <StyledTableCell
//                                                     colspan={4}
//                                                     align="left">
//                                                         <Typography fontWeight={700}>
//                                                           {cat.categoryName}
//                                                         </Typography>
//                                                 </StyledTableCell>
//                                                 <StyledTableCell
//                                                     colspan={2}
//                                                     align="right">
//                                                     <Button onClick={() => addNewRecord(cat)}>
//                                                         <PlusIcon strokeWidth={3} className="w-4 h-4  text-black" />
//                                                     </Button>
//                                                 </StyledTableCell>
//                                             </StyledTableRow>
//                                             {selectedAssetCategoryAssetsData?.map((row, index) => (
//                                                 <StyledTableRow key={row.id}>
//                                                     <StyledTableCell align="right">
//                                                         <b>{row.asset}</b>
//                                                     </StyledTableCell>
//                                                     <StyledTableCell align="right">
//                                                         <b>{row.financialInstitution}</b>
//                                                     </StyledTableCell>
//                                                     <StyledTableCell align="right">
//                                                         <b>{row.amount}</b>
//                                                     </StyledTableCell>
//                                                     <StyledTableCell align='center'>
//                                                         <DeleteIcon
//                                                             onClick={() => deleteAsset(row)}
//                                                             sx={{
//                                                                 color: '#058B00',
//                                                                 cursor: 'pointer'
//                                                             }}
//                                                         />
//                                                     </StyledTableCell>
//                                                     <StyledTableCell align='center'>
//                                                         <EditIcon
//                                                             onClick={() => handleUpdate(row)}
//                                                             sx={{
//                                                                 color: '#058B00',
//                                                                 cursor: 'pointer'
//                                                             }}
//                                                         />
//                                                     </StyledTableCell>
//                                                 </StyledTableRow>
//                                             ))}
//                                         </>
//                                     )
//                                 }
//                                 )

//                             } */}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </Stack>
//             <Stack direction='row'
//                 justifyContent='end'
//                 alignItems='center'
//                 p={3}
//                 sx={{
//                     backgroundColor: '#F77F00',
//                     height: '50px',
//                     borderRadius: '0 0 12px 12px'
//                 }}
//             >
//                 <Typography
//                     fontSize={19}
//                     fontWeight={800}
//                     color='white'
//                 >
//                     <i>Total Assets: {totalAssets} </i>
//                 </Typography>
//             </Stack>
//         </Stack>
//     );
// }
