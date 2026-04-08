import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import App from './App.jsx'
import {Provider} from 'react-redux'
import store from './store/store.js'
import "./i18n";
const queryClient=new QueryClient()
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient} >
      <Provider store={store}>
      <App />
    </Provider>
    </QueryClientProvider >
  </StrictMode>,
)
