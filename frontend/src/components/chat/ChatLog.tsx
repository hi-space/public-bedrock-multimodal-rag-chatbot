import React, { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store'

import { Box } from '@mui/material'

import Human from '@/components/chat/Human'
import Assistant from '@/components/chat/Assistant'
import AssistantItem from '@/components/chat/AssistantItem'

import { fetchChatConversations } from '@/store/chat'

const ChatLog = () => {
  const chatLog = useRef(null)

  const store = useSelector((state: RootState) => state.chat)
  const dispatch = useDispatch<AppDispatch>()
  const conversations = useSelector((state: RootState) => state.chat.conversations)

  useEffect(() => {
    dispatch(fetchChatConversations(store.sessionId))
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [conversations])

  const scrollToBottom = () => {
    if (chatLog.current) {
      chatLog.current.scrollIntoView({ behaviour: 'smooth' })
      chatLog.current.scrollTop = chatLog.current.scrollHeight
    }
  }

  return (
    <Box
      sx={{
        overflow: 'auto',
        height: 'calc(100% - 4.875rem)',
        paddingBottom: '3rem'
      }}
    >
      <Box sx={{ display: 'flex', height: '100%' }}>
        <Box ref={chatLog} sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
          {conversations.map((item, i) => {
            if (item.sender === 'Assistant') {
              return <Assistant text={item.message} metadata={item.metadata} key={i} />
            } else if (item.sender === 'Human') {
              return <Human text={item.message} image={item.image} key={i} />
            } else if (item.sender === 'AssistantItem') {
              return <AssistantItem data={item.message} key={i} />
            }
          })}
        </Box>
      </Box>
    </Box>
  )
}

export default ChatLog
