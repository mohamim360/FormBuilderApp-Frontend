
import { Header } from '../components/Header'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <>
      <Header
				user={null} 
        onSignIn={() => console.log("Sign In Clicked")}
        onSignOut={() => console.log("Sign Out Clicked")}
      />
      <Outlet />
    </>
  )
}

export default MainLayout
