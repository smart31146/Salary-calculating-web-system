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

  export interface DrawerProps {
    openDrawerState: boolean;
    toggleDrawer: any;
    selectedChartId: string | number;
    onUpdate?: any;
    dataToUpdate?: any;
    action: 'Create' | 'Update'
    selectedLiabilityCategory?:any
}

  export const LiabilityCategoryDrawer: React.FC<DrawerProps> = ({
    openDrawerState,
    toggleDrawer,
    selectedChartId,
    onUpdate,
    dataToUpdate={},
    action='Create',
}) => {
    const [categoryName, setCategoryName] = useState('')
    const [categoryNameError, setCategoryNameError] = useState('')
    let user = JSON.parse(localStorage.getItem('user'))
    useEffect(() => {
        // Update local state when dataToUpdate changes
        setCategoryName(dataToUpdate?.categoryName || '');
    }, [dataToUpdate]);
     
    const validateFields = () => {
        let isValid = true;

        if (!categoryName) {
            setCategoryNameError('Liability Category Name cannot be empty.');
            isValid = false;
        } else {
            setCategoryNameError('');
        }
        return isValid;
    };

    const closeDrawer = () => {
        toggleDrawer(false)
    }
    const createLiabilityCategoryData = async () => {
        if (!validateFields()) {
            return;
        }
        try {
            if(!user?._id){
                alert('You may need to login!')
                return
            }
            // Fetch registration data from the API
            const response = await fetch(`/api/assetliabilities/liabilities/fixed`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    categoryName,
                    type: 'dynamic',
                    selectedChartId
                }),
            });
            if (response.ok) {
                const chart = await response.json();
                onUpdate(true, true)
                closeDrawer()
            }
        } catch (error) {
            console.log('error');
        }
    }

    const updateLiabilityCategoryData = async () => {
        if (!validateFields()) {
            return;
        }
        try {
            if(!user?._id){
                alert('You may need to login!')
                return
            }
            // Fetch registration data from the API
            const response = await fetch(`/api/assetliabilities/liabilities/fixed`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    categoryName,
                    type: 'dynamic',
                    chartId: selectedChartId
                }),
            });
            if (response.ok) {
                const chart = await response.json();
                onUpdate(true, true)
                closeDrawer()
            }
        } catch (error) {
            console.log('error');
        }
    }

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
         <Stack direction='row' justifyContent='center' alignItems='center' gap={1}>   
            <PlusIcon strokeWidth={3} className="w-5 h-5  text-black" />
                <Typography fontWeight={700}
                    fontSize={22}
                >
                    New Category
               </Typography>
            </Stack>
                <IconButton onClick={closeDrawer}>
                    <ClearIcon />
                </IconButton>
            </Stack>
            <TextField
                variant="outlined"
                fullWidth
                label='Liability Category'
                value={categoryName}
                error={!!categoryNameError}
                helperText={categoryNameError}
                onChange = {(e)=>setCategoryName(e.target.value)}
                sx={{
                    borderRadius: '20px', // Adjust the value as needed
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '15px', // Ensure the border-radius matches
                    },
                    marginBottom:3,
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
               onClick={action === 'Create'? createLiabilityCategoryData : updateLiabilityCategoryData}
                >
                    {action} 
               </Button>
                
            </Stack>
        </Stack>
    </Drawer>
};
