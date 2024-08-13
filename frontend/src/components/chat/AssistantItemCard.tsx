import { Grid, Box, Card, CardHeader, CardMedia, CardContent, Typography, Link, Tooltip } from '@mui/material'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import Icon from '@/components/icon'

export default function AssistantItemCard({ item, openDialog }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  function RenderTooltip(item) {
    if (item.embedType) {
      if (item.embedType === 'image') {
        return (
          <img
            src={item.thumbnail}
            alt={item.summary_image}
            style={{ display: 'block', margin: '0 auto', maxWidth: '100%', maxHeight: '200px' }}
          />
        )
      }

      if (item.embedType.split('-')[0] === 'image') {
        return (
          <Box>
            <img
              src={item.thumbnail}
              alt={item.summary_image}
              style={{ display: 'block', margin: '0 auto', maxWidth: '100%', maxHeight: '200px' }}
            />
            <Typography variant='body2' color='white' sx={{ p: 1, whiteSpace: 'pre-wrap', overflow: 'hidden' }}>
              {item.content}
            </Typography>
          </Box>
        )
      }
    }

    return (
      <Typography variant='body2' color='white' sx={{ p: 1, whiteSpace: 'pre-wrap', overflow: 'hidden' }}>
        {item.content}
      </Typography>
    )
  }

  return (
    <Box
      sx={{
        mb: 2,
        p: 1,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Card
        onClick={() => openDialog(item)}
        sx={{
          width: '100%',
          boxShadow: 1,
          borderRadius: theme.shape.borderRadius,
          cursor: 'pointer',
          backgroundColor: 'white'
        }}
      >
        <CardHeader
          title={
            <Typography
              variant='h6'
              noWrap
              sx={{
                color: 'primary.main',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            >
              {item.productDisplayName || 'Unknown'}
            </Typography>
          }
          subheader={
            item.namekor && (
              <Typography
                noWrap
                variant='body1'
                sx={{
                  fontSize: '0.8rem',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}
              >
                {item.namekor}
              </Typography>
            )
          }
          sx={{ p: theme => theme.spacing(1, 2), backgroundColor: theme.palette.grey[50] }}
        />

        <Divider />

        <Grid container>
          <Grid item xs={12} sm={5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CardMedia
              component='img'
              sx={{
                width: 'auto',
                height: '100%',
                maxHeight: 160
              }}
              image={item.thumbnail || '/images/default-product.png'}
              alt={item.sourceId}
            />
          </Grid>
          <Grid item xs={12} sm={7}>
            <CardContent
              sx={{
                p: isMobile ? theme => theme.spacing(3, 6) : theme => theme.spacing(3, 1),
                '&:last-child': {
                  paddingBottom: 2.25
                }
              }}
            >
              {item.displayCategories ? (
                <Grid container alignItems='center'>
                  <Grid item xs={2} sx={{ mr: 1, '& svg': { color: 'primary.main' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'column', alignItems: 'center' }}>
                      <Icon icon='tabler:category-2' fontSize={16} />
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    <Box sx={{ display: 'flex', color: 'text.secondary' }}>
                      <Typography
                        noWrap
                        variant='body2'
                        color='text.secondary'
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        {item.displayCategories}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              ) : null}

              {item.embedType ? (
                <Grid container spacing={1} alignItems='center'>
                  <Grid item xs={2} sx={{ mr: 1, '& svg': { color: 'primary.main' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'column', alignItems: 'center' }}>
                      <Icon icon='tabler:coin' fontSize={16} />
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                      {item.embedType}
                    </Typography>
                  </Grid>
                </Grid>
              ) : null}

              {item.similarity ? (
                <Grid container spacing={1} alignItems='center'>
                  <Grid item xs={2} sx={{ mr: 1, '& svg': { color: 'primary.main' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'column', alignItems: 'center' }}>
                      <Icon icon='tabler:chart-dots' fontSize={16} />
                    </Box>
                  </Grid>

                  <Grid item xs={9}>
                    <Box sx={{ display: 'flex', justifyContent: 'column', alignItems: 'center' }}>
                      <Typography variant='body2' sx={{ color: 'text.secondary', mr: 1 }}>
                        {item.similarity.toFixed(3)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              ) : null}

              {item.content ? (
                <Grid container spacing={1} alignItems='center'>
                  <Grid item xs={2} sx={{ mr: 1, '& svg': { color: 'primary.main' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'column', alignItems: 'center' }}>
                      <Icon icon='tabler:package' fontSize={16} />
                    </Box>
                  </Grid>

                  <Grid item xs={9}>
                    <Box sx={{ display: 'flex', justifyContent: 'column', alignItems: 'center' }}>
                      <Tooltip arrow placement='top' title={RenderTooltip(item)}>
                        <Typography
                          variant='body2'
                          color='primary.main'
                          sx={{
                            whiteSpace: 'pre-wrap',
                            overflow: 'hidden',
                            textDecoration: 'underline'
                          }}
                        >
                          {'참조 문서'}
                        </Typography>
                      </Tooltip>
                    </Box>
                  </Grid>
                </Grid>
              ) : null}
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Box>
  )
}
