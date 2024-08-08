import Logo from '@/components/theme/Logo'
import { Typography, Box } from '@mui/material'
import { Suspense } from 'react'

const Home = () => {
  return (
    <Suspense>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Logo />
        <Typography variant='h3' sx={{ p: 2, color: 'white', fontWeight: 600 }}>
          Multimodal RAG Chatbot
        </Typography>
        <Typography sx={{ color: 'white' }}>
          This is a Multimodal RAG Chatbot Application using Amazon Bedrock and OpenSearch Service.
        </Typography>
      </Box>
    </Suspense>
  )
}

export default Home
