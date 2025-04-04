
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { Header } from './components/Header'


function App() {

  return (
    <BrowserRouter>
      <Header
        user={{ name: 'Alice', email: 'alice@example.com' }}
        onSignIn={() => console.log("Sign In Clicked")}
        onSignOut={() => console.log("Sign Out Clicked")}
      />

    </BrowserRouter>
  )
}

export default App
