import Avatar from '@/components/mui/avatar'

export const categoryEmoji = (category: string) => {
  switch (category) {
    case 'Apparel':
      return '👕'
    case 'Accessories':
      return '👜'
    case 'Footwear':
      return '👢'
    case 'Free Items':
      return '🎁'
    case 'Sporting Goods':
      return '⚽'
    case 'Personal Care':
      return '🪞'
    case 'Home':
      return '🏠'
  }

  return '❓'
}

const ProductAvatar = ({ item, size = 1.875 }) => {
  const fontSize = (size * 0.5).toString() + 'rem'
  const iconSize = size.toString() + 'rem'

  return (
    <Avatar skin='light' sx={{ mr: 3, fontSize: fontSize, width: iconSize, height: iconSize }}>
      {categoryEmoji(item.masterCategory)}
    </Avatar>
  )
}

export default ProductAvatar
