import React, { useState, useEffect, useRef } from "react";
import { Stack, Typography, IconButton, TextField, Button } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import {Drawer} from "@material-tailwind/react";
import {
    getDrawerPlacement,
  } from "@/constants/Budgets.constant";

export interface DrawerProps {
    openDrawerState: boolean;
    toggleDrawer: any;
    selectedChartId: string | number;
    onUpdate?: any;
    dataToUpdate?: any;
    action: 'Create' | 'Update'
    selectedLiabilityCategory?:any
}

export const LiabilityDrawer: React.FC<DrawerProps> = ({
    openDrawerState,
    toggleDrawer,
    selectedChartId,
    onUpdate,
    dataToUpdate={},
    action='Create',
    selectedLiabilityCategory={}
}) => {
    const [liability, setLiability] = useState('')
    const [limit, setLimit] = useState(0)
    const [balance, setBalance] = useState(0)
    const [monthlyAmount, setMonthlyAmount] = useState(0)
    const [financialInstitution, setFinancialInstitution] = useState('')
    const [liabilityId, setLiabilityId] = useState('')
    const [liabilityError, setLiabilityError] = useState('');
    const [limitError, setLimitError] = useState('');
    const [balanceError, setBalanceError] = useState('');
    const [monthlyAmountError, setMonthlyAmountError] = useState('');
    const [financialInstitutionError, setFinancialInstitutionError] = useState('');
    
    
    useEffect(() => {
        // Update local state when dataToUpdate changes
        setLiability(dataToUpdate?.liability || '');
        setLimit(dataToUpdate?.limit || 0);
        setBalance(dataToUpdate?.balance || 0);
        setMonthlyAmount(dataToUpdate?.limit || 0);
        setLiabilityId(dataToUpdate?.id || '');
        setFinancialInstitution(dataToUpdate?.financialInstitution || '');
        setLiabilityError('')
        setLimitError('')
        setBalanceError('')
        setMonthlyAmountError('')
        setFinancialInstitutionError('')
    }, [dataToUpdate]);
     
    const validateFields = () => {
        let isValid = true;

        if (!liability) {
            setLiabilityError('Liability Name cannot be empty.');
            isValid = false;
        } else {
            setLiabilityError('');
        }

        if (!limit) {
            setLimitError('Limit cannot be empty.');
            isValid = false;
        } else {
            setLimitError('');
        }
        if (!balance) {
            setBalanceError('Balance cannot be empty.');
            isValid = false;
        } else {
            setBalanceError('');
        }
        if (!monthlyAmount) {
            setMonthlyAmountError('Monthly Amount cannot be empty.');
            isValid = false;
        } else {
            setMonthlyAmountError('');
        }

        return isValid;
    };

    const closeDrawer = () => {
        toggleDrawer(false)
    }
    const CreateLiabilityData = async () => {
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
            const response = await fetch(`/api/assetliabilities/liabilities`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    financialInstitution,
                    monthlyAmount: Number(monthlyAmount),
                    liability,
                    userId: user._id,
                    limit: Number(limit),
                    balance:Number(balance),
                    chartId: selectedChartId,
                    categoryId:selectedLiabilityCategory._id
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

    const updateLiabilityData = async () => {
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
                `/api/assetliabilities/liabilities`,
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    financialInstitution,
                    monthlyAmount: Number(monthlyAmount),
                    liability,
                    limit:Number(limit),
                    balance:Number(balance),
                    chartId: selectedChartId,
                    categoryId:selectedLiabilityCategory._id,
                    liabilityId: dataToUpdate?._id

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
            >
                <Typography fontWeight={700}
                    fontSize={22}
                >
                    {action} Liabilities
               </Typography>
                <IconButton onClick={closeDrawer}>
                    <ClearIcon />
                </IconButton>
            </Stack>
            <TextField
                variant="outlined"
                fullWidth
                label='Liability'
                value={liability}
                error={!!liabilityError}
                helperText={liabilityError}
                onChange = {(e)=>setLiability(e.target.value)}
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
                label='Limit'
                error={!!limitError}
                helperText={limitError}
                value={limit}
                onChange={(e)=>setLimit(e.target.value)}
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
                type='number'
                label='Balance'
                error={!!balanceError}
                helperText={balanceError}
                value={balance}
                onChange={(e)=>setBalance(e.target.value)}
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
                type='number'
                label='Monthly Amount'
                error={!!monthlyAmountError}
                helperText={monthlyAmountError}
                value={monthlyAmount}
                onChange={(e)=>setMonthlyAmount(e.target.value)}
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
               onClick={action === 'Create'? CreateLiabilityData : updateLiabilityData}
                >
                    {action} 
               </Button>
                
            </Stack>
        </Stack>
    </Drawer>
};
