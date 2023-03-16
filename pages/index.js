import Image from "next/image"
import Link from 'next/link'
import { useContext } from "react"
import { AppContext } from "../context/AppContext"

function Home() {
  const { account, connectWallet, error } = useContext(AppContext)

  return (
    <div className="container">
      <div className="flex flex-col items-center py-5">
        <Image src="/mm.png" width={150} height={150} alt="MetaMask" />
        {
          account
            ?
            (
              <>
                <div className="max-w-md rounded overflow-hidden shadow-lg p-3">
                  {account}
                </div>
                <div className="mt-5 text-blue-900">
                  <Link href="/wallets">Go to Wallets Generator</Link>
                </div>
              </>
            )
            :
            (
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full mt-5" onClick={connectWallet}>
                Connect
              </button>
            )
        }

        {
          error && <p className="text-red-600 mt-5">{`Error: ${error}`}</p>
        }
      </div>
    </div>
  )
}

export default Home