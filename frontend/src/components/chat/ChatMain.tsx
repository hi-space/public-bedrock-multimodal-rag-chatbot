import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Box, IconButton, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import Avatar from '@/components/mui/avatar'
import Icon from '@/components/icon'
import SidebarLeft from '@/components/chat/SidebarLeft'
import ChatLog from '@/components/chat/ChatLog'
import EmptyChat from '@/components/chat/EmptyChat'
import SendMsgForm from '@/components/chat/SendMsgForm'

const ChatMain = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)

  const theme = useTheme()

  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
  const selectedModel = useSelector((state: RootState) => state.chat.selectedModel)
  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

  const renderHeader = () => {
    return (
      <Box
        sx={{
          px: 3,
          py: 1.9,
          display: 'flex',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          justifyContent: 'space-between',
          backgroundColor: 'background.paper',
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {mdAbove ? null : (
            <IconButton onClick={handleLeftSidebarToggle} sx={{ mr: 2 }}>
              <Icon icon='tabler:menu-2' />
            </IconButton>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              skin='light'
              sx={{ width: 38, height: 38, mr: 2, fontSize: theme => theme.typography.body1.fontSize }}
            >
              {selectedModel.name[0]}
            </Avatar>

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='h6'>
                {selectedModel.name}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                {selectedModel.value}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        overflow: 'hidden',
        height: 'calc(100vh - 6.75rem)',
        backgroundColor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <SidebarLeft leftSidebarOpen={leftSidebarOpen} handleLeftSidebarToggle={handleLeftSidebarToggle} />

      {!selectedModel ? (
        <EmptyChat handleLeftSidebarToggle={handleLeftSidebarToggle} />
      ) : (
        <Box
          sx={{
            width: 0,
            flexGrow: 1,
            backgroundColor: theme.palette.action.hover,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {renderHeader()}
          <ChatLog />
          <SendMsgForm />
        </Box>
      )}
    </Box>
  )
}

ChatMain.contentHeightFixed = true

export default ChatMain
