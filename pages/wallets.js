import { ethers } from 'ethers'
import { useState, useContext, useEffect } from 'react'
import { AppContext } from "../context/AppContext"
import { useRouter } from "next/router"

function Wallets() {
  const router = useRouter()

  const { isAccessGranted, error } = useContext(AppContext)

  useEffect(() => {
    if (!isAccessGranted) {
      setTimeout(() => router.push('/'), 3000)
    }
  }, [router])

  const walletsQty = [1, 2, 3, 5, 10, 20, 50, 100]
  const [wallets, setWallets] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)

  const makeCSV = (content) => {
    let csv = ''
    content.forEach(value => {
      csv += value.address + ',' + value.privateKey + '\n'
    })
    return csv
  }

  const handleGenerateWallet = (event, qty) => {
    setIsGenerating(true)
    const wallets = []

    for (let i = 0; i < qty; i++) {
      const wallet = ethers.Wallet.createRandom()
      wallets.push({
        address: wallet.address,
        mnemonic: wallet.mnemonic.phrase,
        privateKey: wallet.privateKey
      })
    }

    setWallets(wallets)
    setIsGenerating(false)
  }

  const handleSaveWallets = (event) => {
    event.preventDefault()

    const fileData = makeCSV(wallets)
    const blob = new Blob([fileData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = 'wallets.csv'
    link.href = url
    link.click()
  }

  return (
    <>
      {
        !isAccessGranted
          ?
          <div className="flex flex-col items-center py-5">
            <p className="text-red-600 mt-5">{`Error: ${error}`}</p>
          </div>
          :
          <div>
            <div className="flex flex-col items-center py-5">
              <h2 className="font-bold text-xl">Generate Wallets</h2>
              <div className='flex flex-row mt-5'>
                {
                  isGenerating
                    ?
                    <h2>Generating...</h2>
                    :
                    walletsQty.map(qty => (
                      <button
                        key={qty}
                        onClick={event => handleGenerateWallet(event, qty)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full mx-1"
                      >
                        {qty}
                      </button>
                    ))
                }
              </div>
            </div>

            <div className="flex flex-col items-center py-5 max-h-64 overflow-y-auto">
              {
                wallets.length > 0 &&
                wallets.map((wallet, i) => (
                  <div key={wallet.address} className="flex flex-row justify-between items-center">
                    <div className="bg-zinc-500 text-white rounded-md px-2 mr-2">Wallet&nbsp;{i + 1}</div>
                    <input
                      className="bg-transparent border-2 rounded-md w-full text-sm text-gray-700 mr-3 py-1 px-2 mb-2 leading-tight"
                      disabled
                      type="text"
                      name="address"
                      defaultValue={mask(wallet.address)}
                    />
                    <input
                      className="bg-transparent border-2 rounded-md w-full text-sm text-gray-700 mr-3 py-1 px-2 mb-2 leading-tight"
                      disabled
                      type="password"
                      name="privateKey"
                      defaultValue={wallet.privateKey}
                    />
                  </div>
                ))
              }
            </div>

            {
              wallets.length > 0 &&
              <div className="flex flex-col items-center py-5">
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full mt-5" onClick={handleSaveWallets}>
                  Save Wallets
                </button>
              </div>
            }
          </div>
      }
    </>
  )
}

export default Wallets

function mask(str) {
  return str.slice(0, 10) + '...' + str.slice(str.length - 10)
}