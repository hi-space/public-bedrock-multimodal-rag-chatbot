import React from 'react'
import { useSelectedLayoutSegments } from 'next/navigation'
import Link from 'next/link'
import { Box, IconButton } from '@mui/material'

import { navLinks } from '@/app/routes'
import Icon from '@/components/icon'

const Navigation = () => {
  const segments = useSelectedLayoutSegments()
  const enhancedNavLinks = navLinks.map(link => {
    const isActive = (link.href === '/' && segments.length === 0) || segments.includes(link.href.replace('/', ''))

    return {
      ...link,
      active: isActive
    }
  })

  return (
    <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
      {enhancedNavLinks.map(link => (
        <Link key={link.label} href={link.href}>
          <IconButton color={link.active ? 'primary' : 'secondary'}>
            <Icon icon={link.icon} />
          </IconButton>
        </Link>
      ))}
    </Box>
  )
}

export default Navigation
