import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  return (
    <header className="w-full border-b border-black/10 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tight">Brillance</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="#features" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium transition-colors">
                Pricing
              </Link>
              <Link href="#docs" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium transition-colors">
                Documentation
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-700 hover:bg-black/5 hover:text-black">
              Log in
            </Button>
            <Button className="bg-black text-white hover:bg-gray-800 transition-colors">
              Get Started
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
