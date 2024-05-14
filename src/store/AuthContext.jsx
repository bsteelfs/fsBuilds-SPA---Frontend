import { createContext, useContext, useState } from "react"
import BasicAxios from "../lib/axios"
import PropTypes from "prop-types"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  AuthProvider.propTypes = {
    children: PropTypes.node,
  }

  const [user, setUser] = useState(null)
  const [fastspringAccount, setFastspringAccount] = useState(null)
  const [mainSubscription, setMainSubscription] = useState(null)
  const [secondarySubscription, setSecondarySubscription] = useState(null)
  const [lastSubscriptionId, setLastSubscriptionId] = useState(null)
  const [managementUrl, setManagementUrl] = useState(null)
  const [loading, setLoading] = useState(true)

  const login = async () => {
    try {
      await BasicAxios.get("/user").then(({ data }) => {
        setUser(data.user)
        setManagementUrl(data.management_url)
        setFastspringAccount(data.fastspring_account)
        setMainSubscription(data.subscriptions.main)
        setSecondarySubscription(data.subscriptions.secondary)
        setLastSubscriptionId(data.subscriptions.last_subscription_id)
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    loading,
    fastspringAccount,
    mainSubscription,
    secondarySubscription,
    managementUrl,
    lastSubscriptionId,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
