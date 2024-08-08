import { useState, useEffect, ChangeEvent, ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store'
import { setModel, fetchModelList, fetchChatList } from '@/store/chat'

import {
  Box,
  List,
  Drawer,
  ListItem,
  IconButton,
  Typography,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
  InputAdornment
} from '@mui/material'

import CustomTextField from '@/components/mui/text-field'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Avatar from '@/components/mui/avatar'
import Icon from '@/components/icon'
import { hexToRGBA } from '@/components/utils/hex-to-rgba'
import PerfectScrollbar from 'react-perfect-scrollbar'

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ height: '100%', overflow: 'auto' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
  }
}

export type ChatModelType = {
  id: number
  name: string
  value: string
}

const SidebarLeft = props => {
  const { leftSidebarOpen, handleLeftSidebarToggle } = props

  const theme = useTheme()

  const dispatch = useDispatch<AppDispatch>()
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))

  const [query, setQuery] = useState<string>('')
  const modelList = useSelector((state: RootState) => state.chat.modelList)
  const chatList = useSelector((state: RootState) => state.chat.chatList)

  const [filteredChat, setFilteredChat] = useState<ChatModelType[]>([])
  const [active, setActive] = useState<null | { type: string; id: string | number }>(null)

  const handleModelClick = chat => {
    dispatch(setModel(chat))
    if (!mdAbove) {
      handleLeftSidebarToggle()
    }
  }

  const handleChatClick = chat => {
    //TODO
    if (!mdAbove) {
      handleLeftSidebarToggle()
    }
  }

  useEffect(() => {
    dispatch(fetchModelList())
    dispatch(fetchChatList())
  }, [])

  const renderModels = () => {
    if (modelList && modelList.length) {
      if (query.length && !filteredChat.length) {
        return (
          <ListItem>
            <Typography sx={{ color: 'text.secondary', p: 1 }}>Not Found Models</Typography>
          </ListItem>
        )
      } else {
        const arrToMap = query.length && filteredChat.length ? filteredChat : modelList

        return arrToMap.map((model: ChatModelType, index: number) => {
          const activeCondition = active !== null && active.id === model.id && active.type === 'chat'

          return (
            <ListItem key={index} disablePadding sx={{ '&:not(:last-child)': { mb: 1 } }}>
              <ListItemButton
                disableRipple
                onClick={() => handleModelClick(model)}
                sx={{
                  py: 2,
                  px: 3,
                  width: '100%',
                  borderRadius: 2,
                  alignItems: 'flex-start',
                  '&.MuiListItemButton-root:hover': { backgroundColor: 'action.hover' },
                  ...(activeCondition && {
                    background: theme =>
                      `linear-gradient(72.47deg, ${theme.palette.primary.main} 22.16%, ${hexToRGBA(
                        theme.palette.primary.main,
                        0.7
                      )} 76.47%) !important`
                  })
                }}
              >
                <ListItemAvatar sx={{ m: 0, alignSelf: 'center' }}>
                  <Avatar
                    skin='light'
                    sx={{
                      width: 38,
                      height: 38,
                      fontSize: theme => theme.typography.body1.fontSize
                    }}
                  >
                    {model.name[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    my: 0,
                    '& .MuiTypography-root': { ...(activeCondition && { color: 'common.white' }) }
                  }}
                  primary={
                    <Typography noWrap variant='h6'>
                      {model.name}
                    </Typography>
                  }
                  secondary={
                    <Typography noWrap sx={{ ...(!activeCondition && { color: 'text.disabled' }) }}>
                      {model.value}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          )
        })
      }
    }
  }

  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    if (modelList !== null) {
      const searchFilterFunction = (chat: ChatModelType) => {
        const searchValue = e.target.value.toLowerCase()
        return chat.value.toLowerCase().includes(searchValue) || chat.name.toLowerCase().includes(searchValue)
      }
      const filteredChatsArr = modelList.filter(searchFilterFunction)
      setFilteredChat(filteredChatsArr)
    }
  }

  return (
    <Drawer
      open={leftSidebarOpen}
      onClose={handleLeftSidebarToggle}
      variant={mdAbove ? 'permanent' : 'temporary'}
      ModalProps={{
        disablePortal: true,
        keepMounted: true
      }}
      sx={{
        zIndex: theme.zIndex.drawer,
        height: '100%',
        display: 'block',
        position: mdAbove ? 'static' : 'absolute',
        '& .MuiDrawer-paper': {
          boxShadow: 'none',
          width: useMediaQuery(theme.breakpoints.up('sm')) ? 300 : 260,
          position: mdAbove ? 'static' : 'absolute',
          borderTopRightRadius: theme => theme.shape.borderRadius,
          borderBottomRightRadius: theme => theme.shape.borderRadius
        },
        '& > .MuiBackdrop-root': {
          borderRadius: 1,
          position: 'absolute',
          zIndex: theme => theme.zIndex.drawer - 1
        }
      }}
    >
      <Box
        sx={{
          py: 2,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <CustomTextField
          fullWidth
          value={query}
          onChange={handleFilter}
          placeholder='Search for chat list ...'
          sx={{ '& .MuiInputBase-root': { borderRadius: '30px !important' } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start' sx={{ color: 'text.secondary' }}>
                <Icon fontSize='1.25rem' icon='tabler:search' />
              </InputAdornment>
            )
          }}
        />
        {!mdAbove ? (
          <IconButton sx={{ p: 1, ml: 1 }} onClick={handleLeftSidebarToggle}>
            <Icon icon='tabler:x' />
          </IconButton>
        ) : null}
      </Box>
      <Box>
        <ScrollWrapper hidden={useMediaQuery(theme.breakpoints.down('lg'))}>
          <Box sx={{ py: 3 }}>
            <Typography variant='h5' sx={{ ml: 3, mb: 2, color: 'primary.main' }}>
              Models
            </Typography>
            <List sx={{ p: 0 }}>{renderModels()}</List>
          </Box>
        </ScrollWrapper>
      </Box>
    </Drawer>
  )
}

export default SidebarLeft
