import { motion } from "framer-motion";

interface Props {
  duration?: number;
  offset: {
    x: number;
    y: number;
  };
  onViewportEnter?: () => void;
  className?: string;
  children: React.ReactNode;
}

export function EaseIn({
  duration = 0.5,
  offset,
  onViewportEnter,
  className,
  children,
}: Props) {
  const variants = {
    offscreen: {
      opacity: 0,
      x: offset.x,
      y: offset.y,
    },
    onscreen: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        type: "ease-in-out",
      },
    },
  };

  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      variants={variants}
      className={className}
      onViewportEnter={onViewportEnter}
      viewport={{ once: true, amount: 0.8 }}
    >
      {children}
    </motion.div>
  );
}
