import { useEffect, useState } from 'react'

import { Box, Typography, CardContent, CardMedia, Grid, Divider, Skeleton, Tooltip, Chip } from '@mui/material'
import { numberWithCommas } from '@/components/utils/format'
import axisosIns from '@/libs/axios'

import ProductAvatar from './ProductAvatar'

const ProductDetail = ({ id = null, selectedItem = null }) => {
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchItem = async () => {
    setLoading(true)
    if (selectedItem && selectedItem.info) {
      setItem(selectedItem)
      setLoading(false)
    } else {
      const response = await axisosIns.get(`/product/${id}`)
      setItem(response.data)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItem()
  }, [])

  return (
    <Box sx={{ background: 'white' }}>
      {loading ? (
        <Box sx={{ height: '80vh', p: 5 }}>
          <Grid container spacing={6}>
            <Grid item sm={5} xs={12}>
              <Skeleton variant='rectangular' height='30vh' width='100%' />
            </Grid>
            <Grid item sm={7} xs={12}>
              <CardContent>
                <Skeleton variant='text' height={40} width='80%' />
                <Skeleton variant='text' height={20} width='40%' />
                <Divider sx={{ mt: 2, mb: 4 }} />
                <Skeleton variant='text' height={30} width='60%' />
                <Skeleton variant='text' height={30} width='60%' />
                <Skeleton variant='text' height={30} width='60%' />
              </CardContent>
            </Grid>
            <Grid item sm={12}>
              <Skeleton variant='text' height={30} width='100%' />
              <Skeleton variant='text' height={30} width='100%' />
            </Grid>
          </Grid>
        </Box>
      ) : (
        item && (
          <Grid container spacing={6}>
            <Grid item sm={5} xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%'
                }}
              >
                <Tooltip
                  title={<Typography variant='body2'>✨ {item.summary_image || item.image_summary} </Typography>}
                  arrow
                >
                  <CardMedia
                    component='img'
                    image={item.thumbnail || '/images/default-product.png'}
                    sx={{
                      m: 2,
                      height: '30vh',
                      width: 'auto'
                    }}
                    alt='Image'
                  />
                </Tooltip>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={7}
              sx={{
                pt: ['0 !important', '0 !important', '1.5rem !important'],
                pl: ['1.5rem !important', '1.5rem !important', '0 !important']
              }}
            >
              <CardContent sx={{ p: theme => `${theme.spacing(3.25, 5.75, 2)} !important` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  {ProductAvatar({ item: item })}
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Tooltip
                      title={<Typography variant='body2'>✨ {item.summary_text || item.summary} </Typography>}
                      arrow
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'visible' }}>
                        <Typography
                          noWrap
                          variant='h6'
                          sx={{ color: 'text.primary', fontWeight: 600, whiteSpace: 'pre-wrap' }}
                        >
                          {item.productDisplayName}
                        </Typography>
                        <Typography noWrap variant='caption' sx={{ color: 'text.primary', whiteSpace: 'pre-wrap' }}>
                          {item.namekor} ✨
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Box>
                </Box>

                <Divider
                  sx={{
                    mt: theme => `${theme.spacing(2)} !important`,
                    mb: theme => `${theme.spacing(2)} !important`
                  }}
                />

                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Grid
                      container
                      xs={12}
                      spacing={1}
                      sx={{
                        mb: 2,
                        '& svg': { color: 'primary.main', mr: 3 }
                      }}
                    >
                      <Grid item xs={2} sx={{ mr: 1 }}>
                        <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>ID</Typography>
                      </Grid>
                      <Grid item xs={9}>
                        {item.id}
                      </Grid>
                    </Grid>

                    {item.displayCategories ? (
                      <Grid
                        container
                        xs={12}
                        spacing={1}
                        sx={{
                          mb: 2,
                          '& svg': { color: 'primary.main', mr: 3 }
                        }}
                      >
                        <Grid item xs={2} sx={{ mr: 1 }}>
                          <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>Category</Typography>
                        </Grid>
                        <Grid item xs={9}>
                          <Box>
                            {item.displayCategories.split(',').map((r, index) => (
                              <Typography
                                key={index}
                                sx={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'auto',
                                  textOverflow: 'ellipsis',
                                  mr: 1,
                                  mb: 1
                                }}
                              >
                                {r}
                              </Typography>
                            ))}

                            {item.masterCategory ? (
                              <Box sx={{ display: 'flex' }}>
                                <Typography>{item.masterCategory}</Typography>
                                {item.subCategory ? (
                                  <Typography sx={{ ml: 1 }}> &gt; &nbsp; {item.subCategory}</Typography>
                                ) : null}
                                {item.articleType ? (
                                  <Typography sx={{ ml: 1 }}> &gt; &nbsp; {item.articleType}</Typography>
                                ) : null}
                              </Box>
                            ) : null}
                          </Box>
                        </Grid>
                      </Grid>
                    ) : null}

                    {item.brandName ? (
                      <Grid
                        container
                        spacing={1}
                        sx={{
                          mb: 2,
                          '& svg': { color: 'primary.main', mr: 3 }
                        }}
                      >
                        <Grid item xs={2} sx={{ mr: 1 }}>
                          <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>Brand</Typography>
                        </Grid>
                        <Grid item xs={9}>
                          <Typography
                            sx={{ whiteSpace: 'pre-wrap', overflow: 'auto', textOverflow: 'ellipsis', mr: 1 }}
                          >
                            {item.brandName}
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : null}

                    {item.usage ? (
                      <Grid
                        container
                        spacing={1}
                        sx={{
                          mb: 2,
                          '& svg': { color: 'primary.main', mr: 3 }
                        }}
                      >
                        <Grid item xs={2} sx={{ mr: 1 }}>
                          <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>Usage</Typography>
                        </Grid>
                        <Grid item xs={9}>
                          <Typography
                            sx={{ whiteSpace: 'pre-wrap', overflow: 'auto', textOverflow: 'ellipsis', mr: 1 }}
                          >
                            {item.usage}
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : null}

                    {item.price && item.price != 0 ? (
                      <Grid
                        container
                        spacing={1}
                        sx={{
                          mb: 2,
                          '& svg': { color: 'primary.main', mr: 3 }
                        }}
                      >
                        <Grid item xs={2} sx={{ mr: 1 }}>
                          <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>Price</Typography>
                        </Grid>
                        <Grid item xs={9}>
                          <Typography sx={{ color: 'text.secondary' }}>{numberWithCommas(item.price)} 원</Typography>
                        </Grid>
                      </Grid>
                    ) : null}

                    <Divider
                      sx={{
                        mt: theme => `${theme.spacing(1)} !important`,
                        mb: theme => `${theme.spacing(1)} !important`
                      }}
                    />

                    {item.tags ? (
                      <Grid
                        container
                        spacing={1}
                        sx={{
                          mb: 2,
                          '& svg': { color: 'primary.main', mr: 3 }
                        }}
                      >
                        <Grid item xs={2} sx={{ mr: 1, mt: 1 }}>
                          <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>Tags ✨</Typography>
                        </Grid>
                        <Grid item xs={9}>
                          {item.tags.map((value, idx) => {
                            return <Chip sx={{ m: 0.75 }} key={idx} label={value} variant='outlined' />
                          })}
                        </Grid>
                      </Grid>
                    ) : null}
                  </Grid>
                </Grid>
              </CardContent>
            </Grid>
            <Grid item xs={12} sx={{ p: theme => `${theme.spacing(0, 6, 6, 12)} !important` }}>
              <Divider
                sx={{
                  mt: theme => `${theme.spacing(0)} !important`,
                  mb: theme => `${theme.spacing(3)} !important`
                }}
              />

              {item.description ? (
                <Box sx={{ mt: 3 }}>
                  <Typography variant='h5' sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Product Details ✨
                  </Typography>

                  <Typography variant='body1' sx={{ whiteSpace: 'pre-wrap', m: theme => theme.spacing(2, 0) }}>
                    {item.description}
                  </Typography>
                </Box>
              ) : null}

              <Divider
                sx={{
                  mt: theme => `${theme.spacing(3)} !important`,
                  mb: theme => `${theme.spacing(3)} !important`
                }}
              />

              {item.productDescriptors ? (
                <Box sx={{ mt: 3 }}>
                  <Typography variant='h5' sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Features
                  </Typography>
                  <Typography
                    variant='body1'
                    sx={{ whiteSpace: 'pre-wrap', m: theme => theme.spacing(2, 0) }}
                    dangerouslySetInnerHTML={{ __html: item.productDescriptors }}
                  />
                </Box>
              ) : null}
            </Grid>
          </Grid>
        )
      )}
    </Box>
  )
}

export default ProductDetail
