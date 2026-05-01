import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans font-light">
      {/* Section 1: Hero */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://assets.cdn.filesafe.space/44Clcz2HSgOWGKzYAzDh/media/68a4dd931f29543d7f3d08d0.webp" 
            alt="Golf facility" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={fadeIn}
              className="order-2 lg:order-1"
            >
              <img 
                src="/src/assets/laptop-mockup.png" 
                alt="Golf 918 Dashboard" 
                className="w-full max-w-2xl mx-auto drop-shadow-[0_0_40px_rgba(34,197,94,0.15)] rounded-lg"
              />
            </motion.div>
            
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={fadeIn}
              className="order-1 lg:order-2 space-y-8"
            >
              <h1 className="font-heading text-5xl md:text-[68px] leading-[1.1] font-bold text-white tracking-tight">
                The Ultimate Sim Facility Solution
              </h1>
              <p className="text-xl text-white/80 leading-relaxed font-light max-w-xl">
                Attract. Retain. Engage. Fill bays with effortless booking and smart reminders, wow guests with personalized service, and keep revenue flowing through loyalty rewards and automated membership perks.
              </p>
              <div>
                <Link href="/contact">
                  <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold rounded-full px-8 py-6 text-lg">
                    Request a Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Stats bar */}
      <section className="border-y border-white/10 bg-black/50 backdrop-blur-sm relative z-20">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10"
          >
            {[
              { value: "8-12%", label: "Efficiency", sub: "Increase" },
              { value: "50+", label: "Happy", sub: "Customers" },
              { value: "1K+", label: "Games", sub: "Streamlined" },
              { value: "100K", label: "Revenue", sub: "Generated" }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeIn} className="py-12 text-center">
                <div className="text-4xl md:text-5xl font-heading font-bold text-[#22c55e] mb-2">{stat.value}</div>
                <div className="text-lg font-medium text-white">{stat.label}</div>
                <div className="text-sm text-white/60 uppercase tracking-widest">{stat.sub}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 3: Platform overview */}
      <section className="py-32">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <h2 className="font-heading text-4xl md:text-[48px] font-bold mb-6">
              One platform to power your entire operation.
            </h2>
            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              The complete solution for any golf facility. Tee sheet, POS, membership management, loyalty rewards, notifications, automation, reporting & more. Golf 918 helps you simplify, scale and deliver epic experiences.
            </p>
            <Link href="/software" className="inline-flex items-center text-[#22c55e] hover:text-white transition-colors font-medium text-lg">
              View Pricing <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { title: "Tee Sheet", desc: "Automated scheduling, booking and payments" },
              { title: "Integrated POS", desc: "Food and beverage orders and retail sales streamlined" },
              { title: "Smart Solutions", desc: "Tee Sheet, Membership Management and POS optimized" }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeIn} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
                <h3 className="text-2xl font-heading font-bold mb-4">{feature.title}</h3>
                <p className="text-white/70">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 4: CTA banner */}
      <section className="py-24 bg-gradient-to-br from-[#111] to-[#1a1a1a] border-y border-white/10">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-8">
              The golf industry is evolving.<br/>Lead the way with Golf 918.
            </h2>
            <Link href="/contact">
              <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold rounded-full px-8 py-6 text-lg">
                Request a Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section 5: Attract/Attain/Retain */}
      <section className="py-32">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {[
              { title: "Attract", desc: "User-Friendly Online Booking" },
              { title: "Attain", desc: "Maximize Control With Minimal Workload" },
              { title: "Retain", desc: "Go Above With Built-In Loyalty Rewards" }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-[#22c55e] font-bold text-xl">{i + 1}</span>
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4 text-[#22c55e] uppercase tracking-wider">{item.title}</h3>
                <p className="text-xl font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 6: Feature icons */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { 
                icon: "https://assets.cdn.filesafe.space/44Clcz2HSgOWGKzYAzDh/media/68788dd8e8df5499779129f3.svg",
                title: "Optimize Bookings",
                desc: "Tee Sheet software that is easy to use for customers and easy to manage for owners and staff."
              },
              {
                icon: "https://assets.cdn.filesafe.space/44Clcz2HSgOWGKzYAzDh/media/6894f237297c86c4b8956e18.svg",
                title: "Membership Management",
                desc: "Automated renewals and automated perks such as time credits and reduced rates - unlimited and customizable."
              },
              {
                icon: "https://assets.cdn.filesafe.space/44Clcz2HSgOWGKzYAzDh/media/68788dd8e8df543fa49129f4.svg",
                title: "Custom POS",
                desc: "QR code mobile ordering for food and beverages with a simplified and speedy check-out process."
              },
              {
                icon: "https://assets.cdn.filesafe.space/44Clcz2HSgOWGKzYAzDh/media/68788dd84216d0c9be7dc17b.svg",
                title: "Waitlist Technology",
                desc: "Fill your tee sheet and reduce no-shows with tech that instantly notifies golfers of cancelations."
              }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeIn} className="text-center p-8 bg-[#111] rounded-2xl border border-white/5">
                <img src={feature.icon} alt={feature.title} className="w-16 h-16 mx-auto mb-6" />
                <h3 className="text-xl font-heading font-bold mb-4">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 7: Testimonials */}
      <section className="py-32 overflow-hidden relative">
        <div className="absolute inset-0 bg-[#22c55e]/5" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-heading text-3xl font-bold mb-16 text-[#22c55e] uppercase tracking-widest">
              What our customers say about our solution
            </h2>
            <p className="text-3xl md:text-4xl font-heading font-medium leading-relaxed mb-12">
              "918 Booking is the easiest and most efficient platform we've ever used for running our tee sheet. Easy to navigate, customize, and stay organized."
            </p>
            <div className="flex items-center justify-center">
              <img 
                src="https://assets.cdn.filesafe.space/44Clcz2HSgOWGKzYAzDh/media/687ec116c4e6b054ffdaa4c8.webp" 
                alt="Cody Fisher" 
                className="w-16 h-16 rounded-full mr-4 border-2 border-[#22c55e]"
              />
              <div className="text-left">
                <div className="font-bold text-lg">Cody Fisher</div>
                <div className="text-white/60">Facility Owner</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 8: Pricing */}
      <section className="py-32 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="font-heading text-4xl md:text-[48px] font-bold mb-6">Choose your plan</h2>
            <p className="text-xl text-white/70">
              Select a plan to gain access to our management software. With no startup fees and unlimited support.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {/* Par Plan */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-[#111] rounded-3xl p-8 border border-white/10 flex flex-col"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Par Plan</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">$150</span>
                  <span className="text-white/60 ml-2">/month</span>
                </div>
                <p className="text-[#22c55e] font-medium mb-4">up to 5 Bays</p>
                <p className="text-sm text-white/60 min-h-[60px]">
                  Great for Sim Facilities With 1-4 Bays, Staff-less or Limited Staff, No Food & Drink or Retail
                </p>
              </div>
              <div className="space-y-4 mb-8 flex-1">
                {["Tee Sheet", "Membership Management", "Integrated Payments", "Automated Waitlists", "Confirmation Reminders", "Analytics & CRM"].map((f, i) => (
                  <div key={i} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-[#22c55e] mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <div>
                <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-full py-6 mb-4 font-bold">
                  Get Started with Par
                </Button>
                <p className="text-center text-xs text-white/60">30 Day-Free Trial Available</p>
              </div>
            </motion.div>

            {/* Birdie Plan */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-gradient-to-b from-[#1a2e1f] to-[#111] rounded-3xl p-8 border-2 border-[#22c55e] flex flex-col relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#22c55e] text-black font-bold text-sm px-4 py-1 rounded-full whitespace-nowrap">
                🔥 Most Popular
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Birdie Plan</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">$250</span>
                  <span className="text-white/60 ml-2">/month</span>
                </div>
                <p className="text-[#22c55e] font-medium mb-4">up to 5 Bays</p>
                <p className="text-sm text-white/60 min-h-[60px]">
                  Great for Sim Facilities With Limited Food and Drink Offerings
                </p>
              </div>
              <div className="space-y-4 mb-8 flex-1">
                {["Everything in Par", "Partial POS Features*", "Scheduler"].map((f, i) => (
                  <div key={i} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-[#22c55e] mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{f}</span>
                  </div>
                ))}
              </div>
              <div>
                <Button className="w-full bg-[#22c55e] text-black hover:bg-[#16a34a] rounded-full py-6 mb-4 font-bold">
                  Get Started with Birdie
                </Button>
                <p className="text-center text-xs text-white/60">30 Day-Free Trial Available</p>
              </div>
            </motion.div>

            {/* Eagle Plan */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-[#111] rounded-3xl p-8 border border-white/10 flex flex-col"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Eagle Plan</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">$500</span>
                  <span className="text-white/60 ml-2">/month</span>
                </div>
                <p className="text-[#22c55e] font-medium mb-4">up to 5 Bays</p>
                <p className="text-sm text-white/60 min-h-[60px]">
                  Great for Large Sim Facilities With Full Restaurant
                </p>
              </div>
              <div className="space-y-4 mb-8 flex-1">
                {["Everything in Birdie", "Full POS Features*", "Pre-Order Food & Beverages", "Advanced CRM and Loyalty", "Advanced Notifications and Messaging"].map((f, i) => (
                  <div key={i} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-[#22c55e] mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <div>
                <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-full py-6 mb-4 font-bold">
                  Get Started with Eagle
                </Button>
                <p className="text-center text-xs text-white/60">30 Day-Free Trial Available</p>
              </div>
            </motion.div>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-white/50 mb-8">
              + $25USD per each additional bay — Basic training library and introductory call included — Custom onboarding and configuration starting at $250USD
            </p>
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
              <h4 className="text-xl font-bold mb-4">Scalable Solutions</h4>
              <p className="text-white/70">
                More than one facility? Easily manage multiple locations from one system with our scalable solutions. Contact us for more information on how it works and pricing!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 9: FAQ */}
      <section className="py-32 bg-black border-t border-white/10">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-[48px] font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-white/70">
              Still have questions? Don't worry, we're happy to answer any questions.
            </p>
          </motion.div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-white/10">
              <AccordionTrigger className="text-lg font-medium py-6 hover:text-[#22c55e]">
                How does the onboarding process work?
              </AccordionTrigger>
              <AccordionContent className="text-white/70 leading-relaxed text-base pb-6">
                Once you submit your information, we'll create your account with some templated content to get you started. You'll then be invited to book a 1-on-1 onboarding call, where we'll walk you through everything you need to know and help customize your setup.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-white/10">
              <AccordionTrigger className="text-lg font-medium py-6 hover:text-[#22c55e]">
                Can you transfer us from another provider?
              </AccordionTrigger>
              <AccordionContent className="text-white/70 leading-relaxed text-base pb-6">
                Yes! If you're currently using Stripe, Square, or Payarc as your payment provider, we can seamlessly transfer your account and get you up and running quickly. We support csv formatted imports for customer lists and food and beverage menu items with templates available in-software.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-white/10">
              <AccordionTrigger className="text-lg font-medium py-6 hover:text-[#22c55e]">
                What type of golf simulators can use Golf 918?
              </AccordionTrigger>
              <AccordionContent className="text-white/70 leading-relaxed text-base pb-6">
                Golf 918 works with any simulator. Our system manages bookings, food & beverage orders, and customer check-ins independently of your simulator hardware. That said, we offer a direct integration with TruGolf for an enhanced golfer experience.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-white/10">
              <AccordionTrigger className="text-lg font-medium py-6 hover:text-[#22c55e]">
                What does Golf 918 system integrate with?
              </AccordionTrigger>
              <AccordionContent className="text-white/70 leading-relaxed text-base pb-6">
                We currently integrate with TruGolf for hardware & Stripe and Payarc for payments; Remote Lock for automated door access; and QuickBooks for financial reporting.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5" className="border-white/10">
              <AccordionTrigger className="text-lg font-medium py-6 hover:text-[#22c55e]">
                Do you offer a free trial?
              </AccordionTrigger>
              <AccordionContent className="text-white/70 leading-relaxed text-base pb-6">
                Yes! We offer a full 30-day free trial—no payment required. We'll ask for a card on file in case you decide to continue with a month-to-month subscription after the trial ends.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Section 10: Final CTA */}
      <section className="py-32 bg-gradient-to-t from-[#111] to-black text-center border-t border-white/10">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-8 leading-tight">
              The ultimate all-in-one golf simulator management software.
            </h2>
            <p className="text-xl text-white/70 mb-12">
              Golf 918 can help you simplify operations, reach more golfers & drive revenue.
            </p>
            <Link href="/contact">
              <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold rounded-full px-10 py-8 text-xl">
                Watch Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}