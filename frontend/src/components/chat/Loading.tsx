import React from 'react'
import { Box } from '@mui/material'
import { keyframes } from '@emotion/react'

const blink = keyframes`
  0% { opacity: 0.2; }
  20% { opacity: 1; }
  100% { opacity: 0.2; }
`

const LoadingDots = () => {
  const size = 5
  return (
    <Box display='flex' alignItems='center' justifyContent='center' sx={{ pt: 1, pb: 1 }}>
      <Box
        component='span'
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: 'secondary.main',
          animation: `${blink} 1.4s infinite both`,
          animationDelay: '0s',
          mr: 0.5
        }}
      />
      <Box
        component='span'
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: 'secondary.main',
          animation: `${blink} 1.4s infinite both`,
          animationDelay: '0.2s',
          mr: 0.5
        }}
      />
      <Box
        component='span'
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: 'secondary.main',
          animation: `${blink} 1.4s infinite both`,
          animationDelay: '0.4s'
        }}
      />
    </Box>
  )
}

export default LoadingDots
