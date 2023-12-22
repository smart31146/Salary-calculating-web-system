import { Typography, Stack } from '@mui/material'
export const getBottomRow = ({ total, text, isMobile }) => {
  return (
    <Stack
      direction="row"
      alignItems="end"
      justifyContent="end"
      p={3}
      sx={{
        // '&:last-child td, &:last-child th': { border: 0 }, // Remove border for last row
        height: '80px', // Adjust the height of each row
        backgroundColor: '#FFEDB6',
        borderBottom: '2px solid #ccc',
        borderRadius: '0 0 16px 16px',
        // Border color for each row
      }}
    >
      <Typography fontWeight={700} fontSize={isMobile? 17 :22}>
        <i>Total {text}: {total}</i>
      </Typography>
    </Stack>
  )
}
