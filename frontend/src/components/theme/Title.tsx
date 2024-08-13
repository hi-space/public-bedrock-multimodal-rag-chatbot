'use client'
import Link from 'next/link'
import Logo from '@/components/theme/Logo'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

const LinkStyled = styled(Link)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
}))

export default function Title() {
  return (
    <LinkStyled href='/'>
      <Logo />
      <Typography
        variant='h5'
        color='grey.300'
        sx={{ ml: 2.5, fontWeight: 700, lineHeight: '24px', wordWrap: 'normal' }}
      >
        Multimodal RAG Chatbot
      </Typography>
    </LinkStyled>
  )
}
