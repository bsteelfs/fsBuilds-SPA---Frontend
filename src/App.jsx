import { Routes, Route } from "react-router-dom"
import Account from "./pages/Account"
import Navigation from "./components/Navigation"
import { useEffect } from "react"
import Spinner from "./components/Spinner"
import { useAuth } from "./store/AuthContext"
import { FastSpringProvider } from "./store/FastSpringContext"

function App() {
  const { user, login, loading } = useAuth()

  useEffect(() => {
    if (!user) login()
  }, [])

  return (
    <>
      <div id="message"></div>
      {loading && <Spinner />}
      {!loading && (
        <FastSpringProvider>
          <Navigation user={user} />
          <Routes>
            <Route path="/" element={<Account user={user} />} />
          </Routes>
        </FastSpringProvider>
      )}
    </>
  )
}

export default App
