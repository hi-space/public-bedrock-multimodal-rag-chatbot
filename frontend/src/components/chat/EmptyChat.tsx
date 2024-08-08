import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

const ChatWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  borderRadius: 1,
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: theme.palette.action.hover
}))

const EmptyChat = props => {
  const { handleLeftSidebarToggle } = props

  const theme = useTheme()
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
  const handleStartConversation = () => {
    if (!mdAbove) {
      handleLeftSidebarToggle()
    }
  }

  return (
    <ChatWrapper
      sx={{
        ...(mdAbove ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {})
      }}
    >
      <Box
        onClick={handleStartConversation}
        sx={{
          pt: 7,
          pb: 7,
          px: 7,
          width: 200,
          height: 200,
          boxShadow: 3,
          borderRadius: 50,
          backgroundColor: 'background.paper',
          cursor: mdAbove ? 'default' : 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        <Typography sx={{ fontSize: '3rem', fontWeight: 600, lineHeight: 'normal', color: 'primary.main' }}>
          🤔
        </Typography>

        <Typography sx={{ pt: 2, fontSize: '1.125rem', fontWeight: 600, lineHeight: 'normal', color: 'primary.main' }}>
          Search Anything
        </Typography>
      </Box>
    </ChatWrapper>
  )
}

export default EmptyChat
