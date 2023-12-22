import React, { useState, useEffect, useRef } from "react";
import { Stack, Typography, IconButton, TextField, Button } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import {Drawer} from "@material-tailwind/react";
import {
    getDrawerPlacement,
  } from "@/constants/Budgets.constant";

export const NewChartDrawer = ({
    openDrawerState,
    toggleDrawer
}) => {
    const [chartName, setChartName] = useState('')
    const [pieChartName, setPieChartName] = useState('')
    
    const closeDrawer = () => {
        toggleDrawer(false)
    }
    
    const handleFormSubmit = async () => {
        try {
            let user = JSON.parse(localStorage.getItem('user'))
            console.log('user id', user._id);
            
            if(!user?._id){
                alert('You may need to login!')
                return
            }
            // Fetch registration data from the API
            const response = await fetch(`/api/assetliabilities/chartdata`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chartName,
                    pieChartName,
                    userId: user._id
                }),
            });
            if (response.ok) {
                const chart = await response.json();
                console.log('charttttt', chart)
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
                <Typography fontWeight={700}
                    fontSize={22}
                >
                    New Chart
               </Typography>
                <IconButton>
                    <ClearIcon />
                </IconButton>
            </Stack>
            <TextField
                variant="outlined"
                fullWidth
                label='Chart Name'
                onChange={(e)=>setChartName(e.target.value)}
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
                label='Pie Chart Name'
                onChange={(e)=>setPieChartName(e.target.value)}
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
                {/* <Button variant='outlined'
                sx={{
                    borderColor:'red',
                    color: 'red'
                }}
                >
                    Delete
               </Button> */}
               <Button variant='outlined'
               sx={{
                   borderColor:'#058B00',
                   color: '#058B00'
               }}
               onClick={handleFormSubmit}
                >
                    Update
               </Button>
                
            </Stack>
        </Stack>
    </Drawer>
};
