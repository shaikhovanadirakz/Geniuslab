import { Card } from './ui/card';
import { Language, getTranslation } from '../utils/translations';
import { Trophy, Star, Gift, Target, TrendingUp, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface MotivationInfoProps {
  language: Language;
}

export function MotivationInfo({ language }: MotivationInfoProps) {
  const t = (key: keyof typeof import('../utils/translations').translations.ru) =>
    getTranslation(language, key);

  const features = [
    {
      icon: Trophy,
      title: t('earnPoints'),
      description: t('earnPointsDesc'),
      color: 'from-yellow-400 to-orange-500',
    },
    {
      icon: Target,
      title: t('achievements'),
      description: t('achievementsDesc'),
      color: 'from-blue-400 to-indigo-500',
    },
    {
      icon: Gift,
      title: t('rewardsShop'),
      description: t('rewardsShopDesc'),
      color: 'from-pink-400 to-purple-500',
    },
    {
      icon: TrendingUp,
      title: t('progress'),
      description: t('progressDesc'),
      color: 'from-green-400 to-emerald-500',
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="flex items-center justify-center gap-2">
          <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
          <h2 className="text-3xl">{t('motivationSystem')}</h2>
          <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
        </div>
        <p className="text-gray-600">{t('motivationSystemDesc')}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 border-2 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${feature.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="p-6 border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2">{t('howToEarnPoints')}</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span>{t('pointsSchulte')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span>{t('pointsReading')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span>{t('pointsMemory')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span>{t('pointsMath')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span>{t('pointsMaze')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span>{t('pointsMultiplication')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span>{t('pointsDiagnostic')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span>{t('pointsConcentration')}</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2">{t('availableRewards')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                <div>
                  <div>{t('customAvatars')}</div>
                  <div className="text-xs text-gray-500">50-200 {t('points')}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <div>
                  <div>{t('achievementBadges')}</div>
                  <div className="text-xs text-gray-500">100-300 {t('points')}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📜</span>
                <div>
                  <div>{t('certificates')}</div>
                  <div className="text-xs text-gray-500">500 {t('points')}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <div>
                  <div>{t('bonusFeatures')}</div>
                  <div className="text-xs text-gray-500">200-1000 {t('points')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
