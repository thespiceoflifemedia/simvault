import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function About() {
  return (
    <div className="bg-[#080b14] min-h-screen text-white font-sans font-light">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#3b82f6]/10 to-transparent" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#6366f1]/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-4xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="space-y-6"
          >
            <h1 className="font-heading text-5xl md:text-[68px] leading-[1.1] font-bold tracking-tight">
              About SimVault
            </h1>
            <p className="text-xl text-white/60 leading-relaxed font-light">
              We're a team of operators and engineers who got tired of stitching together disconnected software to run a sim facility. So we built the platform we always wished existed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 border-y border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  SimVault was built out of frustration. Indoor golf facilities were growing fast, but the software options were either too generic or too fragmented — one tool for bookings, another for POS, another for memberships.
                </p>
                <p>
                  We set out to build an all-in-one platform tailored specifically to the needs of sim facility operators. Every feature was shaped by conversations with real owners running real facilities.
                </p>
                <p>
                  SimVault is purpose-built for sim facility operators — helping you spend less time on admin and more time delivering great experiences to your guests.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-tr from-[#3b82f6]/10 to-transparent rounded-2xl border border-[#3b82f6]/20 flex items-center justify-center p-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-[#3b82f6] flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="2" width="6" height="6" rx="1" fill="white"/>
                      <rect x="10" y="2" width="6" height="6" rx="1" fill="white" fillOpacity="0.6"/>
                      <rect x="2" y="10" width="6" height="6" rx="1" fill="white" fillOpacity="0.6"/>
                      <rect x="10" y="10" width="6" height="6" rx="1" fill="white"/>
                    </svg>
                  </div>
                  <span className="font-heading font-bold text-3xl text-white tracking-tight">SimVault</span>
                  <span className="text-white/40 text-sm">Est. 2024</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">What drives us</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Operator-first", desc: "Every feature is designed around how real facilities actually work — not how software engineers imagine they do." },
              { title: "Reliability", desc: "Your booking system can't go down on a busy Saturday. We're built for uptime and tested relentlessly." },
              { title: "Simplicity", desc: "Powerful software doesn't have to be complicated. We build for clarity, speed, and ease of use." }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-[#3b82f6]/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center mb-6">
                  <span className="text-[#3b82f6] font-bold">{i + 1}</span>
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 text-[#3b82f6]">{value.title}</h3>
                <p className="text-white/60 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
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
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-8">
              Ready to level up your facility?
            </h2>
            <p className="text-xl text-white/60 mb-10">
              Join the growing network of facilities using SimVault to run smarter operations.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/contact">
                <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-full px-10 py-6 text-lg">
                  Book a Demo
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-10 py-6 text-lg">
                  Client Login
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
