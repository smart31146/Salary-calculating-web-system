import React ,{useState, useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography, Stack, Button, Grid } from "@mui/material";
import { AssetProps, ActionType } from "./types";
import { isMobile } from "../../app/api/helperFunctions/isMobile";
// import { EditIcon } from "@mui/icons-material/Edit";
// import { DeleteIcon } from "@mui/icons-material/Delete";
import {
    ArrowPathIcon,
    InboxArrowDownIcon,
    CreditCardIcon,
    PlusIcon,
    TrashIcon 
  } from "@heroicons/react/24/outline";
import { AssetsDrawer } from './drawers/AssetsDrawer';
import { AssetCategoryDrawer } from './drawers/AssetCategoryDrawer';
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { getBottomRow } from '../common/totalStack';
import {
    Chip,
  } from "@material-tailwind/react";


function createData(
  asset: string,
  financialInstitution: string,
  amount: number,
) {
  return { asset, financialInstitution, amount };
}

const rows = [
  createData('Dummy Asset 1','dummy Boc1', 0),
//   createData('Dummy Asset 2','dummy Boc2', 200),
];

const tableHead = [
    'Assets',
    'Financial Institution',
    'Amount',
    'Edit',
    'Delete'
]

export const creditCardIconClass = {
height: '20px',
width: '20px',
color: 'white',
}

export const AssetsTable: React.FC<AssetProps> = ({
    selectedChartId = '',
    selectedChartAssetData = [],
    onUpdateAssetData,
    onAssetDelete,
    selectedChartData = {},
}) => {
    const [parentAssetCategories, setParentAssetCategories] = React.useState([]);
    const [nonParentAssetCategories, setNonParentAssetCategories] = useState({});
    const [selectedAssetCategory, setSelectedAssetCategory] = useState({});
    const [dataToUpdate, setDataToUpdate] = useState({})
    const [categoryDataToUpdate, setCategoryDataToUpdate] = useState({})
    const [action, setAction] = useState<ActionType>('Create');
    const [open, setOpen] = useState(false);
    const [openCategory, setOpenCategory] = useState(false);
    const isMobileDevice = isMobile()
    console.log('isssmobile device',isMobileDevice)
    let totalAssets = 0
    selectedChartAssetData?.map(asset => {
        totalAssets += parseFloat(asset.amount);
    })

    const deleteAssetAndAssetCategory = async (url: string) => {
        try {
            // Fetch registration data from the API
            const response = await fetch(url, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            // If registration is successful, navigate to the login page
            if (response.ok) {
                onAssetDelete(true)
            }
        } catch (error) {
            console.log('error');
        }
    }


    const addNewRecord = (category, type) => {
      if(type === 'fixed'){
      setOpen(true)
      if(category){
            setSelectedAssetCategory({ ...category })
       }
    }else{
        setOpenCategory(true)
      }
    }
    const onUpdateAsset = (value: boolean, isMainParent=false) => {
        onUpdateAssetData(value)
        setAction('Create')
        setSelectedAssetCategory({})
        if(isMainParent === true){
            fetchAssetCategories()
        }
    }

    const toggleDrawerState = (value: boolean) => {
        setOpen(value)
        setAction('Create')
        setDataToUpdate({})
    }
    const toggleCategoryDrawerState = (value: boolean) => {
        setOpenCategory(value)
        setAction('Create')
        setCategoryDataToUpdate({})
    }
    const handleUpdate = (rowData) => {
        setOpen(true)
        setDataToUpdate({ ...rowData })
        setAction('Update')
    }

    const getLevel1Parents = (parent, showAddButton: boolean)=>{
        return (
            <tr style={{ backgroundColor: '#F77F00' }}>
            <td colSpan={4} className={`p-2 md:p-4 border-b border-blue-gray-50 text-left max-w-[150px]`} style={{ wordWrap: 'break-word' }}>
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
                            deleteAssetAndAssetCategory(`/api/assetliabilities/assets/fixed?assetCategoryId=${parent._id}`)
                            fetchAssetCategories()
                        }
                    }}
                    className="w-5 h-5  text-white" />
            }
            </div>
            </td>
            </tr>
        // <TableRow sx={{backgroundColor: '#F77F00',
        //    height: showAddButton? '30px': '50px'
        // }}>
        //         <TableCell
        //             sx={{backgroundColor: '#F77F00'}}
        //             colSpan={4}
        //             align="left">
        //             <Typography
        //                 fontSize={22}
        //                 fontWeight={700}
        //                 color='white'
        //                 >
        //                 <i>{parent.categoryName}</i>
        //             </Typography>
        //         </TableCell>
        //         <TableCell
        //             sx={{backgroundColor: '#F77F00'}}
        //             colSpan={1}
        //             align="right">
        //            <Stack direction='row' justifyContent='end' alignItems='center'>
        //             {showAddButton && <Button onClick={() => addNewRecord(parent, 'fixed')}>
        //                 <PlusIcon strokeWidth={3} className="w-5 h-5  text-black" />
        //             </Button>}
        //             {parent.type === 'dynamic' && <>
        //             <TrashIcon 
        //             onClick={()=>{
        //                 if(showAddButton){
        //                     deleteAssetAndAssetCategory(`/api/assetliabilities/assets/fixed?assetCategoryId=${parent._id}`)
        //                     fetchAssetCategories()
        //                 }
        //             }}
        //             style={{
        //                 cursor: 'pointer',
        //             }} className="h-5 w-5 text-black"/>
        //             </>}
        //             </Stack>
        //         </TableCell>
        //     </TableRow>
        )
    }
    const getTableRow = (row, isNonDummy?: boolean)=>{
        return (
            <tr className="border-b border-gray-300">
                <td className={`p-2 md:p-4 border-b border-blue-gray-50 text-center max-w-[150px]`} style={{ wordWrap: 'break-word' }}>
                    <div className="whitespace-normal overflow-hidden">
                          <Typography variant="span" className="whitespace-pre-line overflow-ellipsis" color="blue-gray">
                          {row.asset}
                          </Typography>
                    </div>
                </td>
                <td className={`p-2 md:p-4 border-b border-blue-gray-50 text-center max-w-[150px]`} style={{ wordWrap: 'break-word' }}>
                    <div className="whitespace-normal overflow-hidden">
                          <Typography variant="span" className="whitespace-pre-line overflow-ellipsis" color="blue-gray">
                          {row.financialInstitution}
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
                      <PencilSquareIcon onClick={()=>{
                        if(isNonDummy){
                        handleUpdate(row)
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
                    deleteAssetAndAssetCategory(`/api/assetliabilities/assets?assetId=${row._id}`)
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

    const getParentChildrens = (parentChildren)=>{
       return  parentChildren.map(subCat => {
            const selectedAssetCategoryAssetsData = selectedChartAssetData.filter(item => item.categoryId === subCat._id)
            return (
            <>
            <tr style={{ backgroundColor: '#0A0459' }}>
                <td colSpan={4} className={`p-2 md:p-4 border-b border-blue-gray-50 text-left max-w-[150px]`} style={{ wordWrap: 'break-word' }}>
                    <div className="whitespace-normal overflow-hidden">
                    <Typography variant="span" className="whitespace-pre-line overflow-ellipsis" color="white">
                    {subCat.categoryName}
                    </Typography>
                    </div>
                </td>
                <td className={`text-left`}>
                <div className="flex justify-space-around items-center">
                <PlusIcon 
                onClick={() => addNewRecord(subCat, 'fixed')}
                strokeWidth={3}
                className="w-4 h-4  text-white" />
                </div>
                </td>
                </tr>
              {/* <TableRow>
                    <TableCell
                        sx={{
                            backgroundColor: '#0A0459'
                        }}
                        colspan={4}
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
              </TableRow> */}
                {  selectedAssetCategoryAssetsData.length>0?
                    selectedAssetCategoryAssetsData.map(row => getTableRow(row, true)) :
                    rows.map(row => getTableRow(row, false)) 
                }
                </>
            )
        })
    
   }
    const fetchAssetCategories = async () => {
        const response = await fetch(`/api/assetliabilities/assets/fixed?id=${selectedChartId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            let data = await response.json()
            data = data?.data;
            const parentsData = data.parentsData
            const parents = data.parents
            // const nonParents = data.filter(d=>d.parentId !== '')
            setParentAssetCategories([...parents])
            setNonParentAssetCategories({ ...parentsData })
            console.log('res asset categories', data)
        } else {
            console.log('eeeeeee', response)
            // setErrMsg('User not found or email already verified');
        }
    }

        useEffect(() => {
        if(selectedChartId){
            fetchAssetCategories()
        }
    }, [selectedChartId ])

  return (
    <>
    <AssetsDrawer
                openDrawerState={open}
                toggleDrawer={toggleDrawerState}
                selectedChartId={selectedChartId}
                onUpdate={onUpdateAsset}
                dataToUpdate={dataToUpdate}
                action={action}
                selectedAssetCategory={selectedAssetCategory}
            />
            <AssetCategoryDrawer
                openDrawerState={openCategory}
                toggleDrawer={toggleCategoryDrawerState}
                selectedChartId={selectedChartId}
                onUpdate={onUpdateAsset}
                dataToUpdate={categoryDataToUpdate}
                action={action}
                // selectedAssetCategory={selectedAssetCategory}
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
               Assets
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
      <Table sx={{
          width: '100%'
      }} aria-label="simple table">
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
          {parentAssetCategories.map((parent) => {
            let parentChildren = nonParentAssetCategories[parent.categoryName]
            console.log('parent children', parentChildren)
            if (parentChildren?.length > 0) {
                return (<>
                    {getLevel1Parents(parent, false)}
                    {getParentChildrens(parentChildren)}
                </>)
            }
            else{
                const selectedAssetCategoryAssetsData = selectedChartAssetData.filter(item => item.categoryId === parent._id)
                return (
                    <>
                      {getLevel1Parents(parent, true)}
                      {selectedAssetCategoryAssetsData.length>0?
                      selectedAssetCategoryAssetsData.map(row=> getTableRow(row, true)):
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
      {getBottomRow({total: totalAssets, text: 'Assets', isMobile: isMobileDevice})}
      </Stack>
    </>
  );
};
