import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

function SimVaultLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-[#3b82f6] flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="6" height="6" rx="1" fill="white"/>
          <rect x="10" y="2" width="6" height="6" rx="1" fill="white" fillOpacity="0.6"/>
          <rect x="2" y="10" width="6" height="6" rx="1" fill="white" fillOpacity="0.6"/>
          <rect x="10" y="10" width="6" height="6" rx="1" fill="white"/>
        </svg>
      </div>
      <span className="font-heading font-bold text-xl tracking-tight text-white">SimVault</span>
    </div>
  );
}

function SimVaultLogoDark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-[#3b82f6] flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="6" height="6" rx="1" fill="white"/>
          <rect x="10" y="2" width="6" height="6" rx="1" fill="white" fillOpacity="0.6"/>
          <rect x="2" y="10" width="6" height="6" rx="1" fill="white" fillOpacity="0.6"/>
          <rect x="10" y="10" width="6" height="6" rx="1" fill="white"/>
        </svg>
      </div>
      <span className="font-heading font-bold text-xl tracking-tight text-black">SimVault</span>
    </div>
  );
}

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] bg-[#080b14] text-white font-sans font-light selection:bg-blue-500/30 flex flex-col">
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#080b14]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <SimVaultLogo />
          </Link>

          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/about" className={`hover:text-blue-400 transition-colors ${location === "/about" ? "text-blue-400" : "text-white/70"}`}>About</Link>
            <Link href="/software" className={`hover:text-blue-400 transition-colors ${location === "/software" ? "text-blue-400" : "text-white/70"}`}>Software</Link>
            <Link href="/contact" className={`hover:text-blue-400 transition-colors ${location === "/contact" ? "text-blue-400" : "text-white/70"}`}>Contact</Link>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/login" className="text-white/60 hover:text-white text-sm font-medium transition-colors hidden md:block">
              Login
            </Link>
            <Link href="/contact">
              <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-full px-6 py-2 text-sm">
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="bg-white text-black pt-16 pb-8 border-t border-gray-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <SimVaultLogoDark />
              <div className="space-y-2 text-sm text-gray-600">
                <p><a href="mailto:hello@simvault.io" className="hover:text-[#3b82f6] transition-colors">hello@simvault.io</a></p>
                <p><a href="tel:+18005551234" className="hover:text-[#3b82f6] transition-colors">+1 (800) 555-1234</a></p>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#3b82f6] hover:text-white transition-colors text-xs font-bold">in</a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#3b82f6] hover:text-white transition-colors text-xs font-bold">ig</a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#3b82f6] hover:text-white transition-colors text-xs font-bold">x</a>
              </div>
            </div>

            <div>
              <h4 className="font-heading font-bold text-lg mb-6">Sitemap</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link href="/home" className="hover:text-[#3b82f6] transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-[#3b82f6] transition-colors">About</Link></li>
                <li><Link href="/software" className="hover:text-[#3b82f6] transition-colors">Software</Link></li>
                <li><Link href="/contact" className="hover:text-[#3b82f6] transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-lg mb-6">Resources</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link href="/contact" className="hover:text-[#3b82f6] transition-colors">Book a Demo</Link></li>
                <li><Link href="/contact" className="hover:text-[#3b82f6] transition-colors">Onboarding</Link></li>
                <li><Link href="/contact" className="hover:text-[#3b82f6] transition-colors">Release Notes</Link></li>
                <li><a href="/api/healthz" className="hover:text-[#3b82f6] transition-colors">API Status</a></li>
                <li><a href="#" className="hover:text-[#3b82f6] transition-colors">Help Centre</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-lg mb-6">Newsletter</h4>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                />
                <Button className="w-full bg-black text-white hover:bg-gray-800 rounded-md">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>©2025 SimVault. All Rights Reserved. | <Link href="/legal" className="hover:text-[#3b82f6]">Privacy & Terms</Link></p>
            <p className="mt-2 md:mt-0">Built for the sim industry</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
