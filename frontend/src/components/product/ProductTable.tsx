'use client'
import { useEffect, useState } from 'react'

import { Grid, IconButton, Box, Typography, Divider, Dialog, DialogTitle } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useTheme } from '@mui/material/styles'

import { numberWithCommas } from '@/components/utils/format'
import CustomTextField from '@/components/mui/text-field'
import Icon from '@/components/icon'

import { useDebounce } from '@/hooks/debounce'
import axiosIns from '@/libs/axios'

import ProductAvatar from './ProductAvatar'
import ProductDetail from './ProductDetail'

const ProductTable = () => {
  const [items, setItems] = useState([])

  const theme = useTheme()

  const [prevKeys, setPrevKeys] = useState<string[]>([])
  const [currentKey, setCurrentKey] = useState<string>('')
  const [nextKey, setNextKey] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 30 })

  const [searchValue, setSearchValue] = useState<string>('')
  const debouncedSearchValue = useDebounce(searchValue, 10)

  const [selectedItem, setSelectedItem] = useState(null)
  const [detailOpen, setDetailOpen] = useState<boolean>(false)
  const handleDetailOpen = () => setDetailOpen(true)
  const handleDetailClose = () => setDetailOpen(false)

  useEffect(() => {
    fetchTableData(debouncedSearchValue, '', paginationModel.pageSize)
  }, [paginationModel.pageSize, debouncedSearchValue])

  const handlePaginationModelChange = model => {
    const isNextPage = model.page > paginationModel.page
    const isPreviousPage = model.page < paginationModel.page

    if (isNextPage) {
      prevKeys[model.page - 1] = currentKey
      fetchTableData(searchValue, nextKey, paginationModel.pageSize)
    } else if (isPreviousPage) {
      prevKeys[model.page + 1] = currentKey
      fetchTableData(searchValue, prevKeys[model.page], paginationModel.pageSize)
    }

    setPaginationModel(model)
  }

  const fetchTableData = async (search: string, key: string, pageSize: number) => {
    setItems([])
    try {
      const response = await axiosIns.get(`/product`, {
        params: {
          query: search,
          key: key,
          pageSize: pageSize
        }
      })

      const { results, startKey, lastKey } = response.data

      setCurrentKey(startKey)
      setNextKey(lastKey)

      setItems(results)
    } catch (error) {}
  }

  const onItemClick = item => {
    setSelectedItem(item)
    handleDetailOpen()
  }

  const columns: GridColDef[] = [
    {
      flex: 2,
      width: 100,
      field: 'img',
      headerName: '사진',
      cellClassName: () => 'center-cell',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              alt={params.row.id}
              src={params.row.thumbnail || '/images/default-product.png'}
              style={{ width: 'auto', height: '100%', maxHeight: '200px' }}
            />
          </Box>
        )
      }
    },

    {
      flex: 4,
      minWidth: 200,
      field: 'info',
      headerName: '정보',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              justifyContent: 'center',
              overflow: 'auto'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {ProductAvatar({ item: row })}
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'visible' }}>
                  <Typography
                    noWrap
                    variant='h6'
                    sx={{ color: 'text.primary', fontWeight: 600, whiteSpace: 'pre-wrap' }}
                  >
                    {row.productDisplayName}
                  </Typography>
                  <Typography noWrap variant='caption' sx={{ color: 'text.primary', whiteSpace: 'pre-wrap' }}>
                    {row.namekor}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: theme => `${theme.spacing(3)} !important` }} />

            <Grid container spacing={2}>
              {row.masterCategory ? (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'start',
                      alignItems: 'center',
                      '& svg': { color: 'info.main' }
                    }}
                  >
                    <Icon icon='tabler:category-2' fontSize={20} />
                    <Typography sx={{ ml: 5 }}>{row.masterCategory}</Typography>
                    {row.subCategory ? <Typography sx={{ ml: 3 }}> &gt; &nbsp; {row.subCategory}</Typography> : null}
                    {row.articleType ? <Typography sx={{ ml: 3 }}> &gt; &nbsp; {row.articleType}</Typography> : null}
                  </Box>
                </Grid>
              ) : null}

              {row.usage ? (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'start',
                      alignItems: 'center',
                      '& svg': { color: 'success.main' }
                    }}
                  >
                    <Icon icon='tabler:flag' fontSize={20} />

                    <Box sx={{ ml: 5, display: 'flex', color: 'text.secondary' }}>
                      <Typography sx={{ whiteSpace: 'nowrap', overflow: 'auto', textOverflow: 'ellipsis', mr: 1 }}>
                        {row.usage}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ) : null}

              {row.price ? (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'start',
                      alignItems: 'center',
                      '& svg': { color: 'primary.main' }
                    }}
                  >
                    <Icon icon='tabler:coin' fontSize={20} />
                    <Typography sx={{ ml: 5 }}> {numberWithCommas(row.price)} 원</Typography>
                  </Box>
                </Grid>
              ) : null}

              {row.review && row.review.score != 0 ? (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'start',
                      alignItems: 'center',
                      '& svg': { color: 'warning.main' }
                    }}
                  >
                    <Icon icon='tabler:star' fontSize={20} />
                    <Typography sx={{ ml: 5, mr: 3 }}>{row.review.score || 0}</Typography>({row.review.ratings || 0})
                  </Box>
                </Grid>
              ) : null}
            </Grid>
          </Box>
        )
      }
    }
  ]

  return (
    <Box>
      <Box
        sx={{
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.background.paper,
          m: theme.spacing(2, 0)
        }}
      >
        <CustomTextField
          fullWidth
          value={searchValue}
          placeholder='Search…'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 2, display: 'flex' }}>
                <Icon fontSize='1.25rem' icon='tabler:search' />
              </Box>
            ),
            endAdornment: (
              <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => setSearchValue('')}>
                <Icon fontSize='1.25rem' icon='tabler:x' />
              </IconButton>
            )
          }}
          sx={{
            '& .Mui-focused': { boxShadow: 'none !important' },
            '& .MuiInputBase-input:not(textarea).MuiInputBase-inputSizeSmall': {
              p: theme => theme.spacing(1.875, 2.5)
            },
            '& .MuiInputBase-root': { border: '0 !important' },
            '& .MuiInputBase-root > svg': {
              mr: 2
            }
          }}
        />
      </Box>
      <Box
        sx={{
          borderRadius: 1,
          backgroundColor: 'white',
          m: theme.spacing(2, 0)
        }}
      >
        <DataGrid
          autoHeight
          rows={items}
          rowCount={Number.MAX_VALUE}
          columns={columns}
          rowHeight={250}
          sortingMode='server'
          paginationMode='server'
          disableRowSelectionOnClick
          pageSizeOptions={[10, 30, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          onRowClick={onItemClick}
          slotProps={{
            baseButton: {
              size: 'medium'
            }
          }}
          sx={{
            '& .center-cell': {
              justifyContent: 'center'
            },
            '.MuiTablePagination-displayedRows': {
              display: 'none'
            }
          }}
        />
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

export default ProductTable
