import { forwardRef, useState, ReactElement, Ref } from 'react'
import { Dialog, DialogTitle, Box, Typography, IconButton } from '@mui/material'
import Slide, { SlideProps } from '@mui/material/Slide'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

import Icon from '@/components/icon'
import AssistantItemCard from '@/components/chat/AssistantItemCard'
import ProductDetail from '@/components/product/ProductDetail'

const Transition = forwardRef(function Transition(
  props: SlideProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

export default function AssistantItem({ data }) {
  const [detailOpen, setDetailOpen] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 2000 },
      items: 2,
      slidesToSlide: 2
    },
    desktop: {
      breakpoint: { max: 2000, min: 1024 },
      items: 2,
      slidesToSlide: 2
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  }

  const handleDetailOpen = item => {
    setSelectedItem(item)
    if (item.id) {
      setDetailOpen(true)
    }
  }

  const handleDetailClose = () => {
    setDetailOpen(false)
  }

  return (
    <Box
      sx={{
        borderRadius: theme => theme.shape.borderRadius,
        mb: 3,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          mr: 2
        }}
      ></Box>
      <Box sx={{ width: ['calc(100% - 5.75rem)', '75%', '65%'], '&:not(:last-of-type)': { mb: 3 } }}>
        <Box
          justifyContent='start'
          sx={{
            overflowX: 'auto',
            msOverflowStyle: 'none',
            width: '100%'
          }}
        >
          <Carousel
            responsive={responsive}
            swipeable={true}
            draggable={true}
            keyBoardControl={true}
            showDots={true}
            infinite={false}
            autoPlay={false}
          >
            {data.map((item, idx) => (
              <AssistantItemCard key={idx} item={item} openDialog={handleDetailOpen} />
            ))}
          </Carousel>

          <Dialog
            open={detailOpen}
            onClose={handleDetailClose}
            fullWidth
            maxWidth={'md'}
            onClick={handleDetailClose}
            TransitionComponent={Transition}
          >
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
      </Box>
    </Box>
  )
}
