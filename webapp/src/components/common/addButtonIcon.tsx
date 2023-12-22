import React from 'react';
import { Button, IconButton, Typography, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { PlusIcon } from "@heroicons/react/24/outline";

const AddButton = ({ onClick }) => {
  return (
    <Button variant="contained"
    size='small'
    sx={{
        backgroundColor:'white',
        color: '#058B00',
        borderRadius: '60px'
    }}
    onClick={onClick}
    >
      <Stack direction='row'
      justifyContent="start"
      alignItems="center"
      >
      <PlusIcon strokeWidth={3} className="w-4 h-4  text-white" />
      <Typography fontWeight={600}
      fontSize={15}
      >
                <i>
                    New
               </i>
      </Typography>
      </Stack>
    </Button>
  );
};

export default AddButton;
