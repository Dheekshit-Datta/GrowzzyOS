import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-black/5 border border-black/10 text-sm font-medium text-gray-700 mb-8">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black/80 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
            </span>
            Now with AI-powered contract analysis
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-8 max-w-4xl mx-auto leading-tight">
            Modern Billing for <span className="relative">
              <span className="relative z-10">Complex Contracts</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-black/10 -z-0"></span>
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Automate your most complex billing scenarios with Brillance's powerful contract management platform. 
            Designed for businesses that need more than just basic invoicing.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="group h-12 px-8 bg-black text-white hover:bg-gray-900 transition-all duration-200 hover:shadow-lg">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" className="h-12 px-8 border-gray-300 hover:bg-gray-50">
              Schedule Demo
            </Button>
          </div>
          
          {/* Trusted by */}
          <div className="mt-16">
            <p className="text-sm text-gray-500 mb-6">TRUSTED BY INNOVATIVE TEAMS WORLDWIDE</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              {['Stripe', 'Vercel', 'Notion', 'Vercel', 'Linear'].map((company) => (
                <div key={company} className="text-gray-700 font-medium">{company}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-black/5 to-transparent rounded-full opacity-30"></div>
      </div>
    </section>
  )
}
