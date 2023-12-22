
import React, { useState, useEffect, useRef } from "react";
import { Stack, Typography, IconButton, TextField, Button } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import {Drawer} from "@material-tailwind/react";
import {
    getDrawerPlacement,
  } from "@/constants/Budgets.constant";

interface IncomeDrawerProps {
    openDrawerState: boolean;
    toggleDrawer: any;
    selectedChartId: string | number;
    onUpdateIncome?: any;
    dataToUpdate?: any;
    action: 'Create' | 'Update'
}

export const IncomeDrawer: React.FC<IncomeDrawerProps> = ({
    openDrawerState,
    toggleDrawer,
    selectedChartId,
    onUpdateIncome,
    dataToUpdate={},
    action='Create',
}) => {
    const [incomeSource, setIncomeSource] = useState('')
    const [amount, setAmount] = useState('')
    const [incomeId, setIncomeId] = useState('')
    const [incomeSourceError, setIncomeSourceError] = useState('');
    const [amountError, setAmountError] = useState('');
    
    
    useEffect(() => {
        // Update local state when dataToUpdate changes
        setIncomeSource(dataToUpdate?.incomeSource || '');
        setAmount(dataToUpdate?.amount || '');
        setIncomeId(dataToUpdate?._id || '');
    }, [dataToUpdate]);
     
    const validateFields = () => {
        let isValid = true;

        if (!incomeSource) {
            setIncomeSourceError('Income source cannot be empty.');
            isValid = false;
        } else {
            setIncomeSourceError('');
        }

        if (!amount) {
            setAmountError('Amount cannot be empty.');
            isValid = false;
        } else {
            setAmountError('');
        }

        return isValid;
    };

    const closeDrawer = () => {
        toggleDrawer(false)
    }
    const CreateIncomeData = async () => {
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
            const response = await fetch(`/api/assetliabilities/income?docId=${selectedChartId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    incomeSource,
                    amount: Number(amount),
                    chartId: selectedChartId
                }),
            });
            if (response.ok) {
                const chart = await response.json();
                onUpdateIncome(true)
                closeDrawer()
            }
        } catch (error) {
            console.log('error');
        }
    }

    const updateIncomeData = async () => {
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
                `/api/assetliabilities/income?chartId=${selectedChartId}&incomeId=${incomeId}`,
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                      incomeSource,
                      amount: Number(amount),
                      incomeId
                  }),
                }
              );
              if (response.ok) {
                  onUpdateIncome(true)
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
                    {action} Income
               </Typography>
                <IconButton onClick={closeDrawer}>
                    <ClearIcon />
                </IconButton>
            </Stack>
            <TextField
                variant="outlined"
                fullWidth
                label='income'
                value={incomeSource}
                error={!!incomeSourceError}
                helperText={incomeSourceError}
                onChange = {(e)=>setIncomeSource(e.target.value)}
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
               onClick={action === 'Create'? CreateIncomeData : updateIncomeData}
                >
                    {action} 
               </Button>
                
            </Stack>
        </Stack>
    </Drawer>
};
