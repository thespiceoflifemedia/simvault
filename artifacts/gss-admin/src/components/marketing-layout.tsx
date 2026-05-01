import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0a] text-white font-sans font-light selection:bg-green-500/30 flex flex-col">
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link href="/">
            <img 
              src="https://assets.cdn.filesafe.space/44Clcz2HSgOWGKzYAzDh/media/689e37d684b3e354388519f6.webp" 
              alt="Golf 918 Logo" 
              className="h-8 object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link href="/home" className={`hover:text-green-500 transition-colors ${location === "/home" || location === "/" ? "text-green-500" : "text-white/80"}`}>Home</Link>
            <Link href="/about" className={`hover:text-green-500 transition-colors ${location === "/about" ? "text-green-500" : "text-white/80"}`}>About</Link>
            <Link href="/software" className={`hover:text-green-500 transition-colors ${location === "/software" ? "text-green-500" : "text-white/80"}`}>Software</Link>
            <Link href="/contact" className={`hover:text-green-500 transition-colors ${location === "/contact" ? "text-green-500" : "text-white/80"}`}>Contact</Link>
            <a href="https://golf918.zendesk.com/hc/en-us" target="_blank" rel="noreferrer" className="text-white/80 hover:text-green-500 transition-colors">Help Centre</a>
          </div>

          <div className="flex items-center">
            <Link href="/contact">
              <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold rounded-full px-6">
                Request a Demo
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
              <img 
                src="https://assets.cdn.filesafe.space/44Clcz2HSgOWGKzYAzDh/media/689e37d6902d12378ab38c29.webp" 
                alt="Golf 918 Logo" 
                className="h-8 object-contain"
              />
              <div className="space-y-2 text-sm text-gray-600">
                <p><a href="mailto:info@golf918.com" className="hover:text-[#22c55e] transition-colors">info@golf918.com</a></p>
                <p><a href="tel:+12138949846" className="hover:text-[#22c55e] transition-colors">+1 (213) 894-9846</a></p>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#22c55e] hover:text-white transition-colors">in</a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#22c55e] hover:text-white transition-colors">ig</a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#22c55e] hover:text-white transition-colors">fb</a>
              </div>
            </div>

            <div>
              <h4 className="font-heading font-bold text-lg mb-6">Sitemap</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link href="/home" className="hover:text-[#22c55e] transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-[#22c55e] transition-colors">About</Link></li>
                <li><Link href="/software" className="hover:text-[#22c55e] transition-colors">Software</Link></li>
                <li><Link href="/contact" className="hover:text-[#22c55e] transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-lg mb-6 invisible">Links</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link href="/contact" className="hover:text-[#22c55e] transition-colors">Watch Demo</Link></li>
                <li><Link href="/contact" className="hover:text-[#22c55e] transition-colors">Onboarding</Link></li>
                <li><Link href="/contact" className="hover:text-[#22c55e] transition-colors">Updates</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-lg mb-6">Newsletter</h4>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                />
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                />
                <Button className="w-full bg-black text-white hover:bg-gray-800 rounded-md">
                  Submit
                </Button>
              </form>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>©2025 Golf 918. All Rights Reserved. | <Link href="/legal" className="hover:text-[#22c55e]">Privacy & Terms</Link></p>
            <p className="mt-2 md:mt-0">Website by Studio.909</p>
          </div>
        </div>
      </footer>
    </div>
  );
}