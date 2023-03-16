import React, { createContext, useEffect, useState } from "react"

export const AppContext = createContext()

const { ethereum } = typeof window !== "undefined" ? window : {}

const AppProvider = ({ children }) => {
  const [account, setAccount] = useState("")
  const [error, setError] = useState("")
  const [isAccessGranted, setIsAccessGranted] = useState(false)

  const checkEthereumExists = () => {
    if (!ethereum) {
      setError("Please Install MetaMask")
      return false
    }
    return true
  }

  const isWhitelisted = (wallet) => {
    // Hardcoded for test
    const whiteList = [
      '0x44b1785D9E6eDD6B9cFdC3BF841DEA1749F3781E',
      '0xe974D12D4BFBF512b58c6173961e827533335E21'
    ]

    //return whiteList.includes(wallet)
    return whiteList.find(address => address.toLowerCase() === wallet.toLowerCase())
  }

  const getConnectedAccounts = async () => {
    setError("")
    try {
      const accounts = await ethereum.request({
        method: "eth_accounts",
      })

      if (!isWhitelisted(accounts[0])) {
        setIsAccessGranted(false)
        return setError('You are not authorised to access this page, sorry!')
      }

      setIsAccessGranted(true)
      setAccount(accounts[0])
    } catch (err) {
      setError(err.message)
    }
  }

  const connectWallet = async () => {
    setError("")
    if (checkEthereumExists()) {
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        })

        if (!isWhitelisted(accounts[0])) {
          setIsAccessGranted(false)
          return setError('You are not authorised to access this page, sorry!')
        }

        setIsAccessGranted(true)
        setAccount(accounts[0])
      } catch (err) {
        setError(err.message)
      }
    }
  }

  useEffect(() => {
    if (checkEthereumExists()) {
      ethereum.on("accountsChanged", getConnectedAccounts)
      getConnectedAccounts()
    }
    return () => {
      if (checkEthereumExists()) {
        ethereum.removeListener("accountsChanged", getConnectedAccounts)
      }
    }
  }, [])

  return (
    <AppContext.Provider value={{ account, connectWallet, error, isAccessGranted }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider