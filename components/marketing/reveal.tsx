"use client";

import { motion } from "motion/react";

export function Reveal({
  children,
  className,
  delay = 0,
  eager = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  eager?: boolean;
}) {
  const target = { opacity: 1, y: 0 };
  return (
    <motion.div
      className={className}
      data-marketing-motion
      initial={{ opacity: 0.78, y: 18 }}
      animate={eager ? target : undefined}
      whileInView={eager ? undefined : target}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
