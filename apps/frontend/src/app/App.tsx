import { BrowserRouter } from 'react-router-dom'
import { router } from './router'
import { Providers } from './providers'

function App() {
  return (
    <Providers>
      <BrowserRouter>{router}</BrowserRouter>
    </Providers>
  )
}

export default App

