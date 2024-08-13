import { Box, Typography } from '@mui/material'
import Avatar from '@/components/mui/avatar'
import { useTheme } from '@mui/material/styles'

export default function Human({ text = null, image = null }) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row-reverse',
        mb: 2
      }}
    >
      <Avatar
        skin='light'
        color='primary'
        sx={{
          width: 34,
          height: 34,
          ml: 2,
          fontSize: theme => theme.typography.body1.fontSize
        }}
      >
        H
      </Avatar>
      <Box className='chat-body' sx={{ maxWidth: ['calc(100% - 5.75rem)', '75%', '65%'] }}>
        {image ? (
          <Typography
            sx={{
              boxShadow: 1,
              borderRadius: theme.shape.borderRadius,
              maxWidth: '100%',
              width: 'fit-content',
              wordWrap: 'break-word',
              p: theme => theme.spacing(1, 2),
              mb: 1,
              ml: 'auto',
              borderTopRightRadius: 0,
              color: 'common.white',
              backgroundColor: 'primary.main'
            }}
          >
            <img src={image} alt='chat image' style={{ maxWidth: '100%', maxHeight: '200px' }} />
          </Typography>
        ) : null}
        {text ? (
          <Typography
            sx={{
              boxShadow: 1,
              borderRadius: 5,
              maxWidth: '100%',
              width: 'fit-content',
              wordWrap: 'break-word',
              p: theme => theme.spacing(1, 2),
              ml: 'auto',
              borderTopRightRadius: 0,
              color: 'common.white',
              backgroundColor: 'primary.main'
            }}
          >
            {text}
          </Typography>
        ) : null}
      </Box>
    </Box>
  )
}
