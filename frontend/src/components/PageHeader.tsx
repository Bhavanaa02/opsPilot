import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-12"
  >
    <div className="flex items-center gap-3 mb-2">
      {icon || <Zap className="w-8 h-8 text-indigo-500" />}
      <h1 className="text-4xl font-bold gradient-text">{title}</h1>
    </div>
    {subtitle && <p className="text-gray-400 text-lg mt-2">{subtitle}</p>}
  </motion.div>
)
