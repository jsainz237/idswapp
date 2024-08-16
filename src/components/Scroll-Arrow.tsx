import { motion, useScroll, useTransform } from "framer-motion";

export const ScrollArrow = () => {
  const { scrollYProgress } = useScroll({ offset: [0, "100px"] });

  const rotationPos = useTransform(scrollYProgress, [0, 1], [35, 0]);
  const rotationNeg = useTransform(scrollYProgress, [0, 1], [-35, 0]);

  const translateXPos = useTransform(scrollYProgress, [0, 1], [4, 1]);
  const translateXNeg = useTransform(scrollYProgress, [0, 1], [-4, -1]);

  return (
    <div className="flex">
      <motion.div
        className="h-1 w-7 rounded-full bg-foreground"
        style={{ rotate: rotationPos, translateX: translateXPos }}
      />
      <motion.div
        className="h-1 w-7 rounded-full bg-foreground"
        style={{ rotate: rotationNeg, translateX: translateXNeg }}
      />
    </div>
  );
};
