import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function About() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans font-light">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a2e1f]/20 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-4xl">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            className="space-y-6"
          >
            <h1 className="font-heading text-5xl md:text-[68px] leading-[1.1] font-bold tracking-tight">
              About Golf 918
            </h1>
            <p className="text-xl text-white/70 leading-relaxed font-light">
              We are passionate about golf and technology. Our mission is to provide the ultimate management solution for indoor golf simulator facilities, helping owners streamline operations, engage customers, and grow revenue.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 border-y border-white/10 bg-black/50">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  Golf 918 was born out of a simple observation: indoor golf facilities were struggling with disconnected systems. Owners had to use one software for booking bays, another for POS, and a third for membership management.
                </p>
                <p>
                  We knew there had to be a better way. We built an all-in-one platform specifically designed for the unique needs of simulator facilities. 
                </p>
                <p>
                  Today, Golf 918 powers some of the most successful indoor golf centers, providing an integrated experience that delights golfers and simplifies management for operators.
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
              <div className="aspect-square bg-gradient-to-tr from-[#22c55e]/20 to-transparent rounded-2xl border border-[#22c55e]/30 flex items-center justify-center p-8">
                 <img 
                    src="https://assets.cdn.filesafe.space/44Clcz2HSgOWGKzYAzDh/media/689e37d684b3e354388519f6.webp" 
                    alt="Golf 918 Logo" 
                    className="w-2/3 object-contain opacity-50"
                  />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 text-center">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-8">
              Ready to elevate your facility?
            </h2>
            <p className="text-xl text-white/70 mb-10">
              Join the growing network of facilities using Golf 918 to power their operations.
            </p>
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