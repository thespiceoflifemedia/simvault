import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Software() {
  const features = [
    {
      title: "Bay Scheduling",
      desc: "Smart tee sheet management with real-time availability, automated confirmations, and flexible pricing rules for peak and off-peak hours.",
      icon: "📅"
    },
    {
      title: "Integrated POS",
      desc: "Sell food, drinks, and retail items directly from the platform. QR code ordering at the bay means faster service and higher average spend.",
      icon: "💳"
    },
    {
      title: "Membership Engine",
      desc: "Automated billing, renewals, and perks. Build unlimited custom membership tiers with time credits, discounted rates, and early booking access.",
      icon: "⭐"
    },
    {
      title: "Automated Waitlists",
      desc: "Never leave a bay empty again. When a cancellation happens, SimVault instantly notifies your waitlist and fills the slot — no manual effort required.",
      icon: "⚡"
    },
    {
      title: "CRM & Loyalty",
      desc: "Track every customer's preferences, history, and spend. Built-in loyalty tools keep players engaged and coming back to your facility.",
      icon: "🤝"
    },
    {
      title: "Analytics & Reporting",
      desc: "Understand your business at a glance. Revenue trends, bay utilization, membership growth, and peak hour reports — all in one dashboard.",
      icon: "📊"
    },
    {
      title: "Staff Scheduling",
      desc: "Plan and manage your team's hours alongside your bay calendar so you're always staffed right for demand.",
      icon: "🗓️"
    },
    {
      title: "Notifications & Reminders",
      desc: "Automated SMS and email reminders reduce no-shows and keep your guests informed before every session.",
      icon: "🔔"
    },
    {
      title: "Multi-Location Support",
      desc: "Running more than one facility? Manage all your locations, staff, and reporting from a single SimVault account.",
      icon: "🏢"
    }
  ];

  return (
    <div className="bg-[#080b14] min-h-screen text-white font-sans font-light">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#3b82f6]/5 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-4xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="space-y-6"
          >
            <h1 className="font-heading text-5xl md:text-[68px] leading-[1.1] font-bold tracking-tight">
              Everything in One Place
            </h1>
            <p className="text-xl text-white/60 leading-relaxed font-light">
              SimVault is the only platform you need to run your indoor golf facility — from the first booking to the final report.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="bg-white/[0.03] border border-white/5 rounded-2xl p-8 hover:border-[#3b82f6]/30 hover:bg-white/[0.05] transition-all"
              >
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-heading font-bold mb-4">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 text-center bg-[#050710] border-t border-white/10">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
              See SimVault in action
            </h2>
            <p className="text-xl text-white/60 mb-10">
              Book a personalized demo and we'll walk you through the platform end-to-end.
            </p>
            <Link href="/contact">
              <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-full px-10 py-6 text-lg">
                Book a Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
