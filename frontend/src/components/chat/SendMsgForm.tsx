import { useState, SyntheticEvent } from 'react'

import Fab from '@mui/material/Fab'

import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import { Input } from '@mui/material'

import CustomTextField from '@/components/mui/text-field'
import Icon from '@/components/icon'

import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store'
import { addConversation, appendReceivedToken, setReceivedToken } from '@/store/chat'

const ChatFormWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  width: '98%',
  display: 'flex',
  alignItems: 'center',
  margin: theme.spacing(1),
  padding: theme.spacing(1),
  boxShadow: theme.shadows[1],
  justifyContent: 'space-between',
  borderRadius: '50px',
  backgroundColor: theme.palette.background.paper
}))

export type SendMsgType = {
  model: string
  content: string
}

const SendMsgForm = ({}) => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.chat)

  const [inputValue, setInputValue] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isSendable = !isLoading && (inputValue !== '' || selectedImage !== null)

  const sendMessage = async (e: SyntheticEvent) => {
    e.preventDefault()

    if (!isSendable) return

    if (store && store.selectedModel) {
      const newMessage = { sender: 'Human', message: inputValue, image: selectedImagePreview }

      dispatch(addConversation(newMessage))

      try {
        const formData = new FormData()
        formData.append('model', store.selectedModel.value)
        formData.append('text', inputValue)
        formData.append('sessionId', store.sessionId)

        if (selectedImage) {
          formData.append('file', selectedImage)
        }

        setIsLoading(true)
        setInputValue('')
        setSelectedImage(null)
        setSelectedImagePreview(null)

        dispatch(
          addConversation({
            sender: 'Assistant',
            message: ''
          })
        )

        const response = await fetch(process.env.NEXT_PUBLIC_SERVER_HOST + '/chat', {
          method: 'POST',
          body: formData
        })

        var reader = response.body.getReader()
        var decoder = new TextDecoder('utf-8')
        reader.read().then(function processResult(result) {
          if (result.done) {
            setIsLoading(false)
            return
          }

          let value = decoder.decode(result.value, { stream: true }).toString()
          value.split('\n\n').map(token => {
            try {
              let jsonToken = JSON.parse(token)

              switch (jsonToken.type) {
                case 'token':
                  dispatch(appendReceivedToken(jsonToken.data))
                  break
                case 'sources':
                  dispatch(
                    addConversation({
                      sender: 'AssistantItem',
                      message: jsonToken.sources
                    })
                  )
                  break
                case 'end_token':
                  dispatch(setReceivedToken(jsonToken.data))
                  return
              }
            } catch (error) {}
          })

          return reader.read().then(processResult)
        })
      } catch (error) {
        console.error('Error sending message:', error)
      } finally {
        setIsLoading(false)
        setInputValue('')
        setSelectedImage(null)
        setSelectedImagePreview(null)
      }
    }
  }

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      setSelectedImage(selectedFile)

      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImagePreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)

      e.target.value = ''
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setSelectedImagePreview(null)
  }

  return (
    <form onSubmit={sendMessage}>
      <ChatFormWrapper>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
            {selectedImagePreview && (
              <Box sx={{ position: 'relative', marginBottom: 1 }}>
                <IconButton
                  color='primary'
                  size='small'
                  onClick={removeImage}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    zIndex: 1,
                    borderRadius: '50%',
                    '&:hover': {
                      background: 'background.paper'
                    }
                  }}
                >
                  <Icon icon='ic:baseline-close' />
                </IconButton>
                <img
                  src={selectedImagePreview}
                  alt='Selected Image Preview'
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                />
              </Box>
            )}
            <CustomTextField
              autoFocus
              fullWidth
              value={inputValue}
              placeholder='Type your message here…'
              onChange={e => setInputValue(e.target.value)}
              sx={{
                '& .Mui-focused': { boxShadow: 'none !important' },
                '& .MuiInputBase-input:not(textarea).MuiInputBase-inputSizeSmall': {
                  p: theme => theme.spacing(1.875, 2.5)
                },
                '& .MuiInputBase-root': { border: '0 !important' }
              }}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size='small' component='label' htmlFor='upload-img' sx={{ mr: 3, color: 'text.primary' }}>
            <Icon icon='tabler:photo' />
            <Input
              type='file'
              inputProps={{
                accept: 'image/*'
              }}
              onChange={uploadImage}
              sx={{ display: 'none' }}
              id='upload-img'
            />
          </IconButton>

          <Fab aria-label='send' color='primary' size='small' onClick={sendMessage} disabled={!isSendable}>
            <Icon icon='tabler:send' />
          </Fab>
        </Box>
      </ChatFormWrapper>
    </form>
  )
}

export default SendMsgForm
