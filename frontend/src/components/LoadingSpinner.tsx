import { motion } from 'framer-motion'

export const LoadingSpinner: React.FC = () => (
  <motion.div
    className="flex items-center justify-center gap-2"
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
    <div className="w-2 h-2 bg-purple-500 rounded-full" />
    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
  </motion.div>
)
