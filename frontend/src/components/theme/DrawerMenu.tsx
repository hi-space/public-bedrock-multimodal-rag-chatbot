import Link from 'next/link'
import { Box, Divider, List, ListItem, ListItemIcon, ListItemButton, ListItemText, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { navLinks } from '@/app/routes'
import Title from '@/components/theme/Title'
import Icon from '@/components/icon'

const DrawerMenu = () => {
  const theme = useTheme()
  return (
    <Box sx={{ p: 3 }}>
      <Title />

      <Divider sx={{ background: 'grey', mt: theme.spacing(2), mb: theme.spacing(1) }} />

      <List>
        {navLinks.map(item => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Icon icon={item.icon} color='white' />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Link href={item.href}>
                    <Typography variant='h6' sx={{ color: 'secondary.light' }}>
                      {item.label}
                    </Typography>
                  </Link>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default DrawerMenu
