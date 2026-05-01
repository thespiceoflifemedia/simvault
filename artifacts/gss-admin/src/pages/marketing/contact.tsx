import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Contact() {
  return (
    <div className="bg-[#080b14] min-h-screen text-white font-sans font-light">
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16"
          >
            {/* Contact Info */}
            <div>
              <h1 className="font-heading text-5xl md:text-[68px] leading-[1.1] font-bold tracking-tight mb-8">
                Let's talk.
              </h1>
              <p className="text-xl text-white/60 leading-relaxed font-light mb-12">
                Want to see how SimVault can transform your facility? Fill out the form or reach out directly — we'll get back to you within one business day.
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-[#3b82f6] font-bold text-sm uppercase tracking-widest mb-2">Email</h3>
                  <a href="mailto:hello@simvault.io" className="text-2xl hover:text-[#3b82f6] transition-colors">
                    hello@simvault.io
                  </a>
                </div>
                <div>
                  <h3 className="text-[#3b82f6] font-bold text-sm uppercase tracking-widest mb-2">Phone</h3>
                  <a href="tel:+18005551234" className="text-2xl hover:text-[#3b82f6] transition-colors">
                    +1 (800) 555-1234
                  </a>
                </div>
                <div>
                  <h3 className="text-[#3b82f6] font-bold text-sm uppercase tracking-widest mb-2">Response Time</h3>
                  <p className="text-white/60">Within 1 business day</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-12">
              <h2 className="font-heading text-2xl font-bold mb-8">Book a Demo</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">First Name</label>
                    <Input
                      type="text"
                      placeholder="John"
                      className="bg-black/50 border-white/10 text-white placeholder:text-white/20 h-12 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Last Name</label>
                    <Input
                      type="text"
                      placeholder="Doe"
                      className="bg-black/50 border-white/10 text-white placeholder:text-white/20 h-12 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="john@yourfacility.com"
                    className="bg-black/50 border-white/10 text-white placeholder:text-white/20 h-12 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Facility Name</label>
                  <Input
                    type="text"
                    placeholder="Your Sim Facility"
                    className="bg-black/50 border-white/10 text-white placeholder:text-white/20 h-12 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Number of Bays</label>
                  <Input
                    type="number"
                    placeholder="e.g. 4"
                    className="bg-black/50 border-white/10 text-white placeholder:text-white/20 h-12 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Message (optional)</label>
                  <Textarea
                    placeholder="Anything you'd like us to know before the demo?"
                    className="bg-black/50 border-white/10 text-white placeholder:text-white/20 min-h-[100px] rounded-lg resize-none"
                  />
                </div>
                <Button className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-full h-14 text-lg">
                  Request Demo
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
