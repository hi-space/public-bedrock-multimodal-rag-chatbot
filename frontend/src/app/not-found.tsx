import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Button from '@mui/material/Button'

export default function NotFound() {
  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Typography variant='h3' sx={{ mb: 1.5, color: 'white', fontWeight: 600 }}>
          Page Not Found
        </Typography>
        <Typography sx={{ color: 'secondary.light', mb: 3 }}>
          The requested URL was not found on this server.
        </Typography>

        <Button href='/' variant='contained' color='primary'>
          Back to Home
        </Button>
      </Box>
    </Box>
  )
}
