import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2, ChevronRight, Zap, Shield, BarChart3, Users } from "lucide-react";
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
    <div className="bg-[#080b14] min-h-screen text-white font-sans font-light">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/10 via-transparent to-[#6366f1]/5" />
          <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-[#3b82f6]/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#6366f1]/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="order-2 lg:order-1"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/20 bg-[#0d1220]/80 backdrop-blur-sm">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#111827]/90 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <div className="flex-1 mx-4 bg-white/5 rounded-md px-3 py-1 text-xs text-white/30 font-mono">
                    app.simvault.io/dashboard
                  </div>
                </div>
                {/* Dashboard content */}
                <div className="p-4 space-y-3">
                  {/* Top stats row */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Bays Active", value: "–/–", color: "#3b82f6" },
                      { label: "Today's Revenue", value: "$–,–––", color: "#22c55e" },
                      { label: "Members", value: "–––", color: "#a78bfa" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white/5 rounded-lg p-2.5 border border-white/8">
                        <div className="text-[10px] text-white/40 mb-1">{stat.label}</div>
                        <div className="text-sm font-bold" style={{ color: stat.color }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                  {/* Booking grid */}
                  <div className="bg-white/5 rounded-lg border border-white/8 p-3">
                    <div className="text-[10px] text-white/40 mb-2 font-medium uppercase tracking-wide">Bay Schedule — Today</div>
                    <div className="space-y-1.5">
                      {[
                        { bay: "Bay 1", slots: [1,1,0,1,1,1], name: "" },
                        { bay: "Bay 2", slots: [0,1,1,1,0,1], name: "" },
                        { bay: "Bay 3", slots: [1,0,1,1,1,0], name: "" },
                        { bay: "Bay 4", slots: [1,1,1,0,1,1], name: "" },
                      ].map((row) => (
                        <div key={row.bay} className="flex items-center gap-2">
                          <div className="text-[9px] text-white/30 w-8 shrink-0">{row.bay}</div>
                          <div className="flex gap-0.5 flex-1">
                            {row.slots.map((on, i) => (
                              <div
                                key={i}
                                className="flex-1 h-4 rounded-sm"
                                style={{
                                  background: on
                                    ? `rgba(59,130,246,${0.5 + i * 0.05})`
                                    : "rgba(255,255,255,0.04)",
                                }}
                              />
                            ))}
                          </div>
                          <div className="text-[9px] text-white/25 w-12 text-right shrink-0">{row.name}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      {["9am","11am","1pm","3pm","5pm","7pm"].map(t => (
                        <div key={t} className="flex-1 text-center text-[8px] text-white/20">{t}</div>
                      ))}
                    </div>
                  </div>
                  {/* Bottom row: mini chart + recent bookings */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/5 rounded-lg border border-white/8 p-2.5">
                      <div className="text-[10px] text-white/40 mb-2">Weekly Revenue</div>
                      <div className="flex items-end gap-1 h-12">
                        {[40, 65, 50, 80, 70, 90, 75].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-sm"
                            style={{
                              height: `${h}%`,
                              background: i === 5
                                ? "rgba(59,130,246,0.9)"
                                : "rgba(59,130,246,0.3)",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg border border-white/8 p-2.5">
                      <div className="text-[10px] text-white/40 mb-2">Recent Bookings</div>
                      <div className="space-y-1.5">
                        {[
                          { name: "Member", time: "– –:– –", bay: "Bay –" },
                          { name: "Member", time: "– –:– –", bay: "Bay –" },
                          { name: "Member", time: "– –:– –", bay: "Bay –" },
                        ].map((b, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="text-[9px] text-white/30">{b.name}</span>
                            <span className="text-[9px] text-white/20">{b.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#080b14]/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="order-1 lg:order-2 space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded-full px-4 py-1.5 text-sm text-blue-400 font-medium">
                <Zap className="w-3.5 h-3.5" />
                All-in-one golf simulator facility platform
              </div>
              <h1 className="font-heading text-5xl md:text-[64px] leading-[1.1] font-bold text-white tracking-tight">
                Run Your Sim Facility Smarter
              </h1>
              <p className="text-xl text-white/70 leading-relaxed font-light max-w-xl">
                SimVault brings bookings, memberships, POS, and customer management into one seamless platform — so you can focus on delivering great experiences, not juggling software.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/contact">
                  <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-full px-8 py-6 text-lg">
                    Book a Demo
                  </Button>
                </Link>
                <Link href="/software" className="flex items-center text-white/60 hover:text-white transition-colors text-sm font-medium">
                  Explore features <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platform capability bar */}
      <section className="border-y border-white/10 bg-white/[0.02] backdrop-blur-sm relative z-20">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10"
          >
            {[
              { value: "10", label: "Core Modules", sub: "Bay to CRM" },
              { value: "REST", label: "Built-in API", sub: "Full CRUD Access" },
              { value: "100%", label: "Tenant Isolated", sub: "Your Data, Secured" },
              { value: "1", label: "Platform", sub: "No Stack-Stacking" }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeIn} className="py-12 text-center">
                <div className="text-4xl md:text-5xl font-heading font-bold text-[#3b82f6] mb-2">{stat.value}</div>
                <div className="text-lg font-medium text-white">{stat.label}</div>
                <div className="text-sm text-white/50 uppercase tracking-widest">{stat.sub}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Platform overview */}
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
              One platform. Every tool you need.
            </h2>
            <p className="text-xl text-white/60 mb-8 leading-relaxed">
              Stop stitching together a dozen tools. SimVault is purpose-built for sim facilities — covering everything from bay scheduling and memberships to POS, loyalty, and real-time analytics.
            </p>
            <Link href="/software" className="inline-flex items-center text-[#3b82f6] hover:text-white transition-colors font-medium text-lg">
              See all features <ChevronRight className="ml-2 h-5 w-5" />
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
              { title: "Bay Scheduling", desc: "Intelligent booking and payment processing with real-time availability" },
              { title: "Integrated POS", desc: "Food, beverage, and retail orders processed right from the bay" },
              { title: "Smart Memberships", desc: "Automated renewals, perks, and loyalty rewards without lifting a finger" }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeIn} className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-[#3b82f6]/30 hover:bg-white/[0.05] transition-all">
                <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center mb-6">
                  <div className="w-5 h-5 rounded-sm bg-[#3b82f6]" />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4">{feature.title}</h3>
                <p className="text-white/60">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-24 bg-gradient-to-br from-[#0f1629] to-[#080b14] border-y border-white/10">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
              Sim facilities are growing fast.
            </h2>
            <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
              SimVault gives you the tools to outpace the competition and deliver experiences guests remember.
            </p>
            <Link href="/contact">
              <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-full px-10 py-6 text-lg">
                Book a Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Connect / Manage / Grow */}
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
              { title: "Connect", desc: "Reach new players with seamless online booking and smart notifications" },
              { title: "Manage", desc: "Control every aspect of your facility from one unified dashboard" },
              { title: "Grow", desc: "Drive revenue with loyalty programs, memberships, and automated upsells" }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-[#3b82f6] font-bold text-xl">{i + 1}</span>
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4 text-[#3b82f6] uppercase tracking-wider">{item.title}</h3>
                <p className="text-lg text-white/70">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature icons */}
      <section className="py-24 bg-[#050710]">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: <BarChart3 className="w-8 h-8 text-[#3b82f6]" />,
                title: "Smart Scheduling",
                desc: "Bay management that's effortless for guests and operators alike, with real-time availability and instant confirmations."
              },
              {
                icon: <Users className="w-8 h-8 text-[#3b82f6]" />,
                title: "Membership Engine",
                desc: "Automate renewals and perks — time credits, reduced rates, early access — fully customizable to your business."
              },
              {
                icon: <Zap className="w-8 h-8 text-[#3b82f6]" />,
                title: "Mobile-First POS",
                desc: "QR code ordering for food and drinks at the bay — faster service, happier guests, higher average spend."
              },
              {
                icon: <Shield className="w-8 h-8 text-[#3b82f6]" />,
                title: "Automated Waitlists",
                desc: "When a cancellation happens, SimVault instantly fills the slot — maximizing utilization without manual effort."
              }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeIn} className="text-center p-8 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-[#3b82f6]/20 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-[#3b82f6]/10 flex items-center justify-center mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-heading font-bold mb-4">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why SimVault */}
      <section className="py-32 overflow-hidden relative">
        <div className="absolute inset-0 bg-[#3b82f6]/5" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-heading text-sm font-bold mb-10 text-[#3b82f6] uppercase tracking-widest">
              Built differently
            </h2>
            <p className="text-3xl md:text-4xl font-heading font-medium leading-relaxed mb-12">
              Most booking platforms are generic tools adapted for golf. SimVault is built from the ground up for sim facilities — with a real backend API, tenant isolation, and every tool you need to operate.
            </p>
            <Link href="/software">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-5 text-base">
                See the full feature set
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-32 bg-[#080b14]">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="font-heading text-4xl md:text-[48px] font-bold mb-6">Simple, transparent pricing</h2>
            <p className="text-xl text-white/60">
              No setup fees. No hidden costs. Unlimited support included on every plan.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {/* Starter */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-white/[0.03] rounded-3xl p-8 border border-white/10 flex flex-col"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">$149</span>
                  <span className="text-white/50 ml-2">/month</span>
                </div>
                <p className="text-[#3b82f6] font-medium mb-4">Up to 4 Bays</p>
                <p className="text-sm text-white/50 min-h-[60px]">
                  Perfect for small sim facilities with 1–4 bays and minimal staff requirements.
                </p>
              </div>
              <div className="space-y-4 mb-8 flex-1">
                {["Bay Scheduling", "Membership Management", "Integrated Payments", "Automated Waitlists", "Booking Reminders", "Analytics & CRM"].map((f, i) => (
                  <div key={i} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-[#3b82f6] mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <div>
                <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-full py-6 mb-4 font-bold">
                  Start with Starter
                </Button>
                <p className="text-center text-xs text-white/40">30-day free trial included</p>
              </div>
            </motion.div>

            {/* Growth */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-gradient-to-b from-[#0f1e3d] to-[#080b14] rounded-3xl p-8 border-2 border-[#3b82f6] flex flex-col relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3b82f6] text-white font-bold text-sm px-5 py-1.5 rounded-full whitespace-nowrap">
                Most Popular
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Growth</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">$249</span>
                  <span className="text-white/50 ml-2">/month</span>
                </div>
                <p className="text-[#3b82f6] font-medium mb-4">Up to 10 Bays</p>
                <p className="text-sm text-white/50 min-h-[60px]">
                  For growing facilities adding food & beverage and staff scheduling.
                </p>
              </div>
              <div className="space-y-4 mb-8 flex-1">
                {["Everything in Starter", "POS Essentials", "Staff Scheduler", "Loyalty Rewards"].map((f, i) => (
                  <div key={i} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-[#3b82f6] mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{f}</span>
                  </div>
                ))}
              </div>
              <div>
                <Button className="w-full bg-[#3b82f6] text-white hover:bg-[#2563eb] rounded-full py-6 mb-4 font-bold">
                  Start with Growth
                </Button>
                <p className="text-center text-xs text-white/40">30-day free trial included</p>
              </div>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-white/[0.03] rounded-3xl p-8 border border-white/10 flex flex-col"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">$449</span>
                  <span className="text-white/50 ml-2">/month</span>
                </div>
                <p className="text-[#3b82f6] font-medium mb-4">Unlimited Bays</p>
                <p className="text-sm text-white/50 min-h-[60px]">
                  For large facilities with full restaurant, advanced CRM, and multi-location needs.
                </p>
              </div>
              <div className="space-y-4 mb-8 flex-1">
                {["Everything in Growth", "Full POS Suite", "Pre-Order at Bay", "Advanced CRM & Loyalty", "Priority Support", "Multi-Location Management"].map((f, i) => (
                  <div key={i} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-[#3b82f6] mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <div>
                <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-full py-6 mb-4 font-bold">
                  Start with Pro
                </Button>
                <p className="text-center text-xs text-white/40">30-day free trial included</p>
              </div>
            </motion.div>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-white/40 mb-8">
              +$25/month per additional bay — Onboarding call included — Custom configuration from $200
            </p>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h4 className="text-xl font-bold mb-4">Running multiple locations?</h4>
              <p className="text-white/60">
                Manage all your facilities from one account with centralized reporting and controls. Get in touch for multi-location pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-[#050710] border-t border-white/10">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-[48px] font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-white/60">
              Have more questions? We're always happy to help.
            </p>
          </motion.div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-white/10">
              <AccordionTrigger className="text-lg font-medium py-6 hover:text-[#3b82f6]">
                How does onboarding work?
              </AccordionTrigger>
              <AccordionContent className="text-white/60 leading-relaxed text-base pb-6">
                After you sign up, we'll set up your account with a tailored configuration and invite you to a 1-on-1 onboarding call. Our team walks you through everything and handles the setup so you can go live fast.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-white/10">
              <AccordionTrigger className="text-lg font-medium py-6 hover:text-[#3b82f6]">
                Can you migrate us from another system?
              </AccordionTrigger>
              <AccordionContent className="text-white/60 leading-relaxed text-base pb-6">
                Yes. We support migration from Stripe, Square, and most common booking platforms. We also accept CSV imports for customer lists, menus, and membership data — and provide templates to make it easy.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-white/10">
              <AccordionTrigger className="text-lg font-medium py-6 hover:text-[#3b82f6]">
                What simulator hardware does SimVault support?
              </AccordionTrigger>
              <AccordionContent className="text-white/60 leading-relaxed text-base pb-6">
                SimVault works with any simulator hardware. Our platform manages bookings, F&B, and customer check-ins independently of your hardware setup — so it doesn't matter which brand you use.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-white/10">
              <AccordionTrigger className="text-lg font-medium py-6 hover:text-[#3b82f6]">
                What integrations does SimVault support?
              </AccordionTrigger>
              <AccordionContent className="text-white/60 leading-relaxed text-base pb-6">
                We integrate with Stripe and Square for payments, RemoteLock for automated door access, and QuickBooks for financial reporting. More integrations are added regularly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5" className="border-white/10">
              <AccordionTrigger className="text-lg font-medium py-6 hover:text-[#3b82f6]">
                Is there a free trial?
              </AccordionTrigger>
              <AccordionContent className="text-white/60 leading-relaxed text-base pb-6">
                Yes — every plan comes with a full 30-day free trial. No payment required upfront. We'll ask for a card on file when the trial ends in case you want to continue.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-t from-[#0f1629] to-[#050710] text-center border-t border-white/10">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-8 leading-tight">
              The all-in-one platform for sim facilities that want to grow.
            </h2>
            <p className="text-xl text-white/60 mb-12">
              SimVault helps you simplify operations, fill your bays, and deliver experiences that keep guests coming back.
            </p>
            <Link href="/contact">
              <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-full px-10 py-8 text-xl">
                Book a Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
