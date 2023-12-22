import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

interface SelectOptionProps {
    data?: {
        option: string | number;
        value: string | number
    }[],
    handleOptionChange?: any
}

const SelectOption: React.FC<SelectOptionProps> = ({ data, handleOptionChange }) => {
    const [selectedValue, setSelectedValue] = useState(data?.[0]?.value);
    
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        handleOptionChange(event.target.value)
    };

    return (
        // <FormControl>
        <Select
            labelId="select-label"
            id="demo-simple-select"
            value={selectedValue}
            label="Select Option"
            onChange={handleChange}
            size='small'
            sx={{
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'row',
                minWidth: '200px',
            }}
        >
            {data?.length > 0 && data?.map(item => (
                <MenuItem value={item.value}>{item.option}</MenuItem>
            ))}

        </Select>
        // </FormControl>
    );
};

export default SelectOption;
