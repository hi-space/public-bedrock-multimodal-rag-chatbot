'use client'
import Box from '@mui/material/Box'
import Navigation from './Navigation'
import Title from '@/components/theme/Title'

export default function Header() {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 1
      }}
    >
      <Title />
      <Navigation />
    </Box>
  )
}
