import WalletAnalyzer from '../components/WalletAnalyzer'
import { Providers } from './providers'

export default function Home() {
  return (
    <Providers>
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <WalletAnalyzer />
      </div>
    </Providers>
  )
}
