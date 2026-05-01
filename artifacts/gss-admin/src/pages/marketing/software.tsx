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
      title: "Automated Tee Sheet",
      desc: "Effortless booking and payment processing. Manage bays, simulator types, and custom pricing schedules with a seamless interface designed for speed and clarity.",
      icon: "📅"
    },
    {
      title: "Integrated POS",
      desc: "Process retail items, track inventory, and manage food & beverage sales directly within the same platform. QR code mobile ordering speeds up the check-out process.",
      icon: "💳"
    },
    {
      title: "Membership Management",
      desc: "Automated billing and renewals. Create unlimited custom membership tiers with automated perks like time credits, discounted rates, and early booking access.",
      icon: "⭐"
    },
    {
      title: "Automated Waitlists",
      desc: "Maximize bay utilization. When a cancelation occurs, our system instantly notifies waitlisted golfers, filling your tee sheet without manual intervention.",
      icon: "⏱️"
    },
    {
      title: "CRM & Loyalty",
      desc: "Track customer preferences, spend history, and booking habits. Built-in loyalty rewards program keeps players coming back to your facility.",
      icon: "🤝"
    },
    {
      title: "Analytics & Reporting",
      desc: "Make data-driven decisions with comprehensive reports on revenue, bay utilization, membership growth, and peak operational hours.",
      icon: "📊"
    }
  ];

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans font-light">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-4xl">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            className="space-y-6"
          >
            <h1 className="font-heading text-5xl md:text-[68px] leading-[1.1] font-bold tracking-tight">
              Powerful Software
            </h1>
            <p className="text-xl text-white/70 leading-relaxed font-light">
              Explore the comprehensive suite of tools built specifically for indoor golf facilities. Everything you need to run your business in one place.
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {features.map((feature, i) => (
              <motion.div 
                key={i} 
                variants={fadeIn} 
                className="bg-[#111] border border-white/5 rounded-2xl p-8 hover:border-[#22c55e]/30 transition-colors"
              >
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-heading font-bold mb-4">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 text-center bg-black border-t border-white/10">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-8">
              See the software in action
            </h2>
            <Link href="/contact">
              <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold rounded-full px-10 py-6 text-lg">
                Request a Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}