import { configureStore } from '@reduxjs/toolkit'

import chat from '@/store/chat'

export const store = configureStore({
  reducer: {
    chat
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
