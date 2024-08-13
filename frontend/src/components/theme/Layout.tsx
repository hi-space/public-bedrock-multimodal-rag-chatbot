'use client'

import React, { useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import MuiAppBar, { AppBarProps } from '@mui/material/AppBar'
import { Box, Typography, Container, Toolbar, IconButton, Drawer, Link } from '@mui/material'

import { navLinks } from '@/app/routes'
import Icon from '@/components/icon'
import Header from '@/components/theme/Header'
import DrawerMenu from '@/components/theme/DrawerMenu'

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  transition: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  color: theme.palette.text.primary
}))

interface Props {
  window?: () => Window
  children?: React.ReactNode
}

const Layout = (props: Props) => {
  const { children, window } = props
  const theme = useTheme()

  const [open, setOpen] = React.useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleDrawerToggle = () => {
    setOpen(prevState => !prevState)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.default,
          justifyContent: 'space-between'
        }}
      >
        <Toolbar disableGutters sx={{ width: '100%', p: theme.spacing(0, 4) }}>
          <Box sx={{ width: '100%', display: 'flex' }}>
            <IconButton color='inherit' onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
              <Icon icon='tabler:menu' color='white' />
            </IconButton>
            <Header />
          </Box>
        </Toolbar>

        {/* <SettingsDialog isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} /> */}
      </AppBar>

      <Drawer
        container={window !== undefined ? () => window().document.body : undefined}
        variant='temporary'
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true
        }}
        sx={{
          display: { sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
            borderTopRightRadius: theme => theme.shape.borderRadius,
            borderBottomRightRadius: theme => theme.shape.borderRadius
          }
        }}
      >
        <Box
          onClick={handleDrawerToggle}
          sx={{
            height: '100%',
            textAlign: 'center',
            backgroundColor: theme.palette.background.default,
            borderColor: 'white'
          }}
        >
          <DrawerMenu />
        </Box>
      </Drawer>

      <Box component='main' sx={{ flexGrow: 1, p: 1, pt: theme.spacing(8), overflow: 'auto' }}>
        <Container maxWidth='xl'>{children}</Container>
      </Box>

      <Box component='footer' sx={{ p: 1, mt: 'auto', textAlign: 'center' }}>
        <Typography variant='body2' color='background.paper'>
          © Copyright{' '}
          <Link href='https://github.com/hi-space' color='primary.main'>
            hi-space
          </Link>{' '}
          All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}

export default Layout
