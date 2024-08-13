import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import axiosIns from '@/libs/axios'

export const fetchModelList = createAsyncThunk('chat/model', async () => {
  const response = await axiosIns.get('/chat/model')
  return response.data
})

export const fetchChatList = createAsyncThunk('chat/list', async () => {
  const response = await axiosIns.get('/chat')
  return response.data
})

export const fetchChatConversations = createAsyncThunk('chat', async (sessionId: string) => {
  if (sessionId != '') {
    const response = await axiosIns.get(`/chat/${sessionId}`)
    return response.data
  }
  return []
})

const getLastAssistantMessage = conversations => {
  const lastMessageIndex = conversations
    .slice()
    .reverse()
    .findIndex(message => message.sender === 'Assistant')

  if (lastMessageIndex !== -1) {
    const actualIndex = conversations.length - 1 - lastMessageIndex
    return conversations[actualIndex]
  }
  return null
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    sessionId: '',
    modelList: [],
    chatList: [],
    selectedModel: null,
    conversations: [] as { sender: string; message: string; image: string; metadata: {} }[]
  },
  reducers: {
    setModel: (state, action) => {
      state.selectedModel = action.payload
      state.sessionId = uuidv4()
      state.conversations = []
    },
    setSessionId: (state, action) => {
      state.sessionId = action.payload
    },
    removeSelectedModel: state => {
      state.selectedModel = null
    },
    appendReceivedToken: (state, action) => {
      const lastMessage = getLastAssistantMessage(state.conversations)
      if (lastMessage) {
        lastMessage.message += action.payload
      }
    },
    setReceivedToken: (state, action) => {
      const lastMessage = getLastAssistantMessage(state.conversations)
      if (lastMessage) {
        lastMessage.message = action.payload.message
        lastMessage.metadata = {
          elapsedTime: action.payload.elapsedTime,
          token: action.payload.tokens
        }
      }
    },
    addConversation: (state, action) => {
      state.conversations.push(action.payload)
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchModelList.fulfilled, (state, action) => {
        state.modelList = action.payload
      })
      .addCase(fetchChatList.fulfilled, (state, action) => {
        state.chatList = action.payload
      })
      .addCase(fetchChatConversations.fulfilled, (state, action) => {
        state.conversations = action.payload
      })
  }
})

export const { setModel, setSessionId, removeSelectedModel, appendReceivedToken, setReceivedToken, addConversation } =
  chatSlice.actions
export default chatSlice.reducer
