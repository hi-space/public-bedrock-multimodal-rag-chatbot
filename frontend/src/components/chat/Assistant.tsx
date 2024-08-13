import { useState } from 'react'
import { Link, Dialog, DialogTitle, Box, Typography, IconButton, Tooltip } from '@mui/material'

import Icon from '@/components/icon'
import Avatar from '@/components/mui/avatar'
import LoadingDots from '@/components/chat/Loading'
import ProductDetail from '@/components/product/ProductDetail'

export default function Assistant({ text, metadata = {} }) {
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const handleDetailOpen = item => {
    const cleanedItem = item.replace(/[\[\]]/g, '') // Remove [ and ]
    const id = cleanedItem.split('-')[0]
    setSelectedItem({ id: id })
    if (id) {
      setDetailOpen(true)
    }
  }

  const handleDetailClose = () => {
    setDetailOpen(false)
  }

  const renderTooltip = content => {
    const formatContent = (content, prefix = '') => {
      return Object.entries(content)
        .map(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            return formatContent(value, `${key}.`)
          } else {
            return `[${key}] ${value}`
          }
        })
        .join('\n')
    }

    if (Object.keys(content).length === 0) {
      return null
    }

    return (
      <Typography variant='body2' color='white' sx={{ whiteSpace: 'pre-wrap', overflow: 'hidden' }}>
        {formatContent(content)}
      </Typography>
    )
  }

  const renderContent = content => {
    return content.split('\n').map((line, lineIndex) => {
      const match = line.match(/\[\[(\d+)\]\]#\[\[([^\]]+)\]\]#\[\[(https?:\/\/[^\s]+)\]\]/)

      if (match) {
        const [_, id, name, imageUrl] = match
        return (
          <Box key={lineIndex} sx={{ marginBottom: '10px' }}>
            <Link
              color='primary.main'
              underline='always'
              variant='h6'
              sx={{ cursor: 'pointer', fontWeight: 600 }}
              onClick={() => handleDetailOpen(id)}
            >
              ✨ {name}
            </Link>
            <img src={imageUrl} alt='image' style={{ maxWidth: '100px', display: 'block', margin: '10px 0' }} />
          </Box>
        )
      }

      return (
        <Typography key={lineIndex} variant='body1' component='div'>
          {line}
          <br />
        </Typography>
      )
    })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        mb: 2
      }}
    >
      <Tooltip arrow placement='left' title={renderTooltip(metadata)}>
        <Avatar
          skin='light'
          color='secondary'
          sx={{
            width: 32,
            height: 32,
            mr: 2,
            fontSize: theme => theme.typography.body1.fontSize
          }}
        >
          A
        </Avatar>
      </Tooltip>

      <Box sx={{ maxWidth: ['calc(100% - 5.75rem)', '75%', '65%'], '&:not(:last-of-type)': { mb: 3 } }}>
        <Typography
          sx={{
            boxShadow: 1,
            borderRadius: theme => theme.shape.borderRadius,
            maxWidth: '100%',
            width: 'fit-content',
            wordWrap: 'break-word',
            p: theme => theme.spacing(1, 2),
            borderTopLeftRadius: 0,
            color: 'text.primary',
            backgroundColor: 'background.paper'
          }}
        >
          {text === '' ? <LoadingDots /> : renderContent(text)}
        </Typography>
      </Box>

      <Dialog open={detailOpen} onClose={handleDetailClose} fullWidth maxWidth={'md'}>
        <DialogTitle>
          <Typography variant='h6' component='span'>
            상세 정보
          </Typography>
          <IconButton
            aria-label='close'
            onClick={handleDetailClose}
            sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='tabler:x' />
          </IconButton>
        </DialogTitle>

        {selectedItem ? <ProductDetail id={selectedItem.id} /> : null}
      </Dialog>
    </Box>
  )
}
