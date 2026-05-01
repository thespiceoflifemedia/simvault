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
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans font-light">
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
                Get in touch.
              </h1>
              <p className="text-xl text-white/70 leading-relaxed font-light mb-12">
                Interested in learning more about how Golf 918 can transform your facility? Fill out the form or reach out to us directly to schedule a demo.
              </p>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-[#22c55e] font-bold text-sm uppercase tracking-widest mb-2">Email</h3>
                  <a href="mailto:info@golf918.com" className="text-2xl hover:text-[#22c55e] transition-colors">
                    info@golf918.com
                  </a>
                </div>
                <div>
                  <h3 className="text-[#22c55e] font-bold text-sm uppercase tracking-widest mb-2">Phone</h3>
                  <a href="tel:+12138949846" className="text-2xl hover:text-[#22c55e] transition-colors">
                    +1 (213) 894-9846
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Name</label>
                  <Input 
                    type="text" 
                    placeholder="John Doe" 
                    className="bg-black/50 border-white/10 text-white placeholder:text-white/30 h-12 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                  <Input 
                    type="email" 
                    placeholder="john@example.com" 
                    className="bg-black/50 border-white/10 text-white placeholder:text-white/30 h-12 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Phone</label>
                  <Input 
                    type="tel" 
                    placeholder="(555) 123-4567" 
                    className="bg-black/50 border-white/10 text-white placeholder:text-white/30 h-12 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Message</label>
                  <Textarea 
                    placeholder="How can we help you?" 
                    className="bg-black/50 border-white/10 text-white placeholder:text-white/30 min-h-[120px] rounded-lg resize-none"
                  />
                </div>
                <Button className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold rounded-full h-14 text-lg">
                  Submit
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}