import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message: string
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="glass rounded-lg p-4 border border-red-500/30 bg-red-500/10"
  >
    <div className="flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-red-400" />
      <p className="text-sm text-red-400">{message}</p>
    </div>
  </motion.div>
)
