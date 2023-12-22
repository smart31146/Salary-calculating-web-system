
import React, { useState, useEffect, useRef } from "react";
import { Stack, Typography, IconButton, TextField, Button } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { DrawerProps } from '../types';
import {
    ArrowPathIcon,
    InboxArrowDownIcon,
    CreditCardIcon,
    PlusIcon,
  } from "@heroicons/react/24/outline";
import {Drawer} from "@material-tailwind/react";
import {
    getDrawerPlacement,
  } from "@/constants/Budgets.constant";


export const AssetsDrawer: React.FC<DrawerProps> = ({
    openDrawerState,
    toggleDrawer,
    selectedChartId,
    onUpdate,
    dataToUpdate={},
    action='Create',
    selectedAssetCategory={}
}) => {
    const [asset, setAsset] = useState('')
    const [amount, setAmount] = useState('')
    const [financialInstitution, setFinancialInstitution] = useState('')
    const [assetId, setAssetId] = useState('')
    const [assetsError, setAssetsError] = useState('');
    const [amountError, setAmountError] = useState('');
    const [financialInstitutionError, setFinancialInstitutionError] = useState('');
    
    
    useEffect(() => {
        // Update local state when dataToUpdate changes
        setAsset(dataToUpdate?.asset || '');
        setAmount(dataToUpdate?.amount || '');
        setAssetId(dataToUpdate?._id || '');
        setFinancialInstitution(dataToUpdate?.financialInstitution || '');
        setAssetsError('')
        setAmountError('')
        setFinancialInstitutionError('')
    }, [dataToUpdate]);
     
    const validateFields = () => {
        let isValid = true;

        if (!asset) {
            setAssetsError('Asset Name cannot be empty.');
            isValid = false;
        } else {
            setAssetsError('');
        }

        if (!amount) {
            setAmountError('Amount cannot be empty.');
            isValid = false;
        } else {
            setAmountError('');
        }
        if (!financialInstitution) {
            setFinancialInstitutionError('Financial Institution Name cannot be empty.');
            isValid = false;
        } else {
            setFinancialInstitutionError('');
        }

        return isValid;
    };

    const closeDrawer = () => {
        toggleDrawer(false)
    }
    const CreateAssetData = async () => {
        if (!validateFields()) {
            return;
        }
        try {
            let user = JSON.parse(localStorage.getItem('user'))
            console.log('userrrrr', user?._id)
            if(!user?._id){
                alert('You may need to login!')
                return
            }
            // Fetch registration data from the API
            const response = await fetch(`/api/assetliabilities/assets?docId=${selectedChartId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    financialInstitution,
                    amount: Number(amount),
                    asset,
                    categoryId: selectedAssetCategory?._id,
                    chartId: selectedChartId
                }),
            });
            if (response.ok) {
                const chart = await response.json();
                onUpdate(true)
                closeDrawer()
            }
        } catch (error) {
            console.log('error');
        }
    }

    const updateAssetData = async () => {
        if (!validateFields()) {
            return;
        }
        try {
            let user = JSON.parse(localStorage.getItem('user'))
            console.log('userrrrr', user?._id)
            if(!user?._id){
                alert('You may need to login!')
                return
            }
            // Fetch registration data from the API
            const response = await fetch(
                `/api/assetliabilities/assets?chartId=${selectedChartId}&assetId=${assetId}`,
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                      asset,
                      amount: Number(amount), 
                      financialInstitution,
                      assetId,
                      selectedChartId
                  }),
                }
              );
              if (response.ok) {
                  onUpdate(true)
                  closeDrawer()
              }
        } catch (error) {
            console.log('error');
        }
      };

    return <Drawer
    size={330}
    placement={getDrawerPlacement()}
    open={openDrawerState}
    className="lg:p-4 p-2"
    onClose={closeDrawer}
  >
        <Stack width={300}
            px={3}
            py={3}
        >
            <Stack direction='row'
                justifyContent='space-between'
                alignItems='center'
                mb={3}
                gap={1}
            >
            <Stack direction='row' justifyContent='center' alignItems='center' gap={1}>   
            <PlusIcon strokeWidth={3} className="w-5 h-5  text-black" />
                <Typography fontWeight={700}
                    fontSize={22}
                >
                    {action} Asset
               </Typography>
            </Stack>
                <IconButton onClick={closeDrawer}>
                    <ClearIcon />
                </IconButton>
            </Stack>
            <TextField
                variant="outlined"
                fullWidth
                label='Asset'
                value={asset}
                error={!!assetsError}
                helperText={assetsError}
                onChange = {(e)=>setAsset(e.target.value)}
                sx={{
                    borderRadius: '20px', // Adjust the value as needed
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '15px', // Ensure the border-radius matches
                    },
                    marginBottom:3,
                }}
            />
            <TextField
                variant="outlined"
                fullWidth
                type='number'
                label='amount'
                error={!!amountError}
                helperText={amountError}
                value={amount}
                onChange={(e)=>setAmount(e.target.value)}
                sx={{
                    borderRadius: '20px', // Adjust the value as needed
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '15px', // Ensure the border-radius matches
                    },
                    marginBottom: 3
                }}
            />
            <TextField
                variant="outlined"
                fullWidth
                label='Financial Institution'
                error={!!financialInstitutionError}
                helperText={financialInstitutionError}
                value={financialInstitution}
                onChange={(e)=>setFinancialInstitution(e.target.value)}
                sx={{
                    borderRadius: '20px', // Adjust the value as needed
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '15px', // Ensure the border-radius matches
                    },
                    marginBottom: 3
                }}
            />
            <Stack direction='row'
                justifyContent='end'
                alignItems='center'
                mb={3}
            >
               <Button variant='outlined'
               sx={{
                   borderColor:'#058B00',
                   color: '#058B00'
               }}
               onClick={action === 'Create'? CreateAssetData : updateAssetData}
                >
                    {action} 
               </Button>
                
            </Stack>
        </Stack>
    </Drawer>
};
