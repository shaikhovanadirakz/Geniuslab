import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface PlayfulCardProps {
  icon?: LucideIcon;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  gradient?: 'blue' | 'indigo' | 'purple' | 'cyan' | 'sky' | 'pink' | 'orange' | 'rainbow';
  onClick?: () => void;
  className?: string;
  animate?: boolean;
  emoji?: string;
}

const gradients = {
  blue: 'from-blue-400 to-blue-600',
  indigo: 'from-indigo-400 to-indigo-600',
  purple: 'from-purple-400 to-purple-600',
  cyan: 'from-cyan-400 to-cyan-600',
  sky: 'from-sky-400 to-sky-600',
  pink: 'from-pink-500 to-purple-500',
  orange: 'from-orange-400 to-yellow-400',
  rainbow: 'from-pink-500 via-purple-500 to-blue-500',
};

const bgGradients = {
  blue: 'from-blue-50 to-blue-100',
  indigo: 'from-indigo-50 to-indigo-100',
  purple: 'from-purple-50 to-purple-100',
  cyan: 'from-cyan-50 to-cyan-100',
  sky: 'from-sky-50 to-sky-100',
  pink: 'from-pink-50 to-purple-50',
  orange: 'from-orange-50 to-yellow-50',
  rainbow: 'from-pink-50 via-purple-50 to-blue-50',
};

export function PlayfulCard({ 
  icon: Icon, 
  title, 
  subtitle, 
  children, 
  gradient = 'blue',
  onClick,
  className = '',
  animate = true,
  emoji
}: PlayfulCardProps) {
  const CardWrapper = animate ? motion.div : 'div';
  const animationProps = animate ? {
    whileHover: { scale: 1.03, y: -5 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 300 }
  } : {};

  return (
    <CardWrapper
      {...animationProps}
      onClick={onClick}
      className={`
        glass-card rounded-3xl p-6 shadow-xl border-3 border-${gradient}-200
        ${onClick ? 'cursor-pointer card-hover' : ''}
        ${className}
      `}
    >
      {/* Icon or Emoji Header */}
      {(Icon || emoji) && (
        <div className="flex items-center gap-3 mb-4">
          {emoji && <span className="text-4xl animate-bounce-slow">{emoji}</span>}
          {Icon && (
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradients[gradient]} shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          {title && (
            <div className="flex-1">
              <h3 className={`text-gradient-${gradient === 'blue' ? 'blue' : 'playful'} text-xl`}>
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {children && (
        <div className={`${(Icon || emoji || title) ? 'mt-4' : ''}`}>
          {children}
        </div>
      )}

      {/* Decorative corner sparkle */}
      <div className="absolute top-2 right-2 text-xl animate-sparkle opacity-50">✨</div>
    </CardWrapper>
  );
}