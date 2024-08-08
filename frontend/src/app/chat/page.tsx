'use client'
import { useTheme } from '@mui/material/styles'
import { Box } from '@mui/material'
import ChatMain from '@/components/chat/ChatMain'

const Chat = () => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        height: '100%',
        overflow: 'auto'
      }}
    >
      <ChatMain />
    </Box>
  )
}

export default Chat
