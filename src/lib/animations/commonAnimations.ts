export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.4 },
};

export const fadeInUpDelayed = {
  ...fadeInUp,
  transition: { ...fadeInUp.transition, delay: 0.1 },
};
