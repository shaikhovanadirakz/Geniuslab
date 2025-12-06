import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, getAvailableRewards, getUserRewards, purchaseReward, getUserPoints, getPointsTransactions, getUserAchievements, Reward } from '../utils/storage';
import { Language, getTranslation } from '../utils/translations';
import { Trophy, Star, Coins, ShoppingBag, Award, Sparkles, Check, Lock, TrendingUp, Calendar, Zap } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface RewardsShopProps {
  user: User;
  language: Language;
  onPointsUpdate: () => void;
}

export function RewardsShop({ user, language, onPointsUpdate }: RewardsShopProps) {
  const t = (key: keyof typeof import('../utils/translations').translations.ru) => 
    getTranslation(language, key);

  const [selectedTab, setSelectedTab] = useState<'shop' | 'inventory' | 'achievements' | 'history'>('shop');
  const [userPoints, setUserPoints] = useState(getUserPoints(user.id));
  const availableRewards = getAvailableRewards();
  const userRewards = getUserRewards(user.id);
  const achievements = getUserAchievements(user.id);
  const transactions = getPointsTransactions(user.id);

  const handlePurchase = (reward: Reward) => {
    if (userPoints < reward.cost) {
      toast.error(t('notEnoughPoints'));
      return;
    }

    const success = purchaseReward(user.id, reward.id);
    
    if (success) {
      setUserPoints(getUserPoints(user.id));
      onPointsUpdate();
      toast.success(t('rewardPurchased'));
    } else {
      toast.error(t('purchaseFailed'));
    }
  };

  const isOwned = (rewardId: string) => {
    return userRewards.some(r => r.rewardId === rewardId);
  };

  const getRewardName = (reward: Reward) => {
    if (language === 'ru') return reward.nameRu;
    if (language === 'kz') return reward.nameKz;
    return reward.nameEn;
  };

  const getRewardDescription = (reward: Reward) => {
    if (language === 'ru') return reward.descriptionRu;
    if (language === 'kz') return reward.descriptionKz;
    return reward.descriptionEn;
  };

  const groupedRewards = {
    avatar: availableRewards.filter(r => r.type === 'avatar'),
    badge: availableRewards.filter(r => r.type === 'badge'),
    theme: availableRewards.filter(r => r.type === 'theme'),
    'power-up': availableRewards.filter(r => r.type === 'power-up'),
    certificate: availableRewards.filter(r => r.type === 'certificate')
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-8 bg-gradient-to-br from-yellow-50 to-amber-100 border-4 border-yellow-300 rounded-3xl shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <ShoppingBag className="w-8 h-8 text-yellow-600" />
                <h2 className="text-3xl text-yellow-900">{t('rewardsShop')}</h2>
              </div>
              <p className="text-lg text-gray-700">{t('shopDescription')}</p>
            </div>
            <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-4 rounded-2xl border-4 border-yellow-600 shadow-lg">
              <Coins className="w-10 h-10 text-white" />
              <div className="text-center">
                <p className="text-sm text-yellow-100">{t('yourPoints')}</p>
                <p className="text-4xl font-bold text-white">{userPoints}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl">
          <TabsTrigger 
            value="shop" 
            className="text-lg py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            {t('shop')}
          </TabsTrigger>
          <TabsTrigger 
            value="inventory"
            className="text-lg py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            <Trophy className="w-5 h-5 mr-2" />
            {t('myRewards')}
          </TabsTrigger>
          <TabsTrigger 
            value="achievements"
            className="text-lg py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white"
          >
            <Award className="w-5 h-5 mr-2" />
            {t('achievements')}
          </TabsTrigger>
          <TabsTrigger 
            value="history"
            className="text-lg py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            {t('history')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shop" className="mt-6">
          <div className="space-y-6">
            {Object.entries(groupedRewards).map(([type, rewards]) => (
              rewards.length > 0 && (
                <Card key={type} className="p-6 bg-white border-3 border-blue-200 rounded-3xl shadow-lg">
                  <h3 className="text-2xl text-blue-900 mb-4 flex items-center gap-2">
                    {type === 'avatar' && <span className="text-3xl">👤</span>}
                    {type === 'badge' && <span className="text-3xl">🏅</span>}
                    {type === 'theme' && <span className="text-3xl">🎨</span>}
                    {type === 'power-up' && <span className="text-3xl">⚡</span>}
                    {type === 'certificate' && <span className="text-3xl">📜</span>}
                    {t(type as any)}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rewards.map((reward) => {
                      const owned = isOwned(reward.id);
                      const canAfford = userPoints >= reward.cost;
                      
                      return (
                        <motion.div
                          key={reward.id}
                          whileHover={{ scale: 1.05 }}
                          className={`p-6 rounded-2xl border-3 shadow-md ${
                            owned 
                              ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-400'
                              : canAfford
                              ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 hover:border-blue-500'
                              : 'bg-gray-100 border-gray-300 opacity-60'
                          }`}
                        >
                          <div className="text-center space-y-3">
                            <div className="text-6xl">{reward.icon}</div>
                            <h4 className={`text-lg font-semibold ${owned ? 'text-green-900' : 'text-blue-900'}`}>
                              {getRewardName(reward)}
                            </h4>
                            <p className="text-sm text-gray-700">
                              {getRewardDescription(reward)}
                            </p>
                            <div className="flex items-center justify-center gap-2 text-xl font-bold text-yellow-700">
                              <Coins className="w-6 h-6" />
                              {reward.cost}
                            </div>
                            {owned ? (
                              <div className="flex items-center justify-center gap-2 text-green-700 font-semibold">
                                <Check className="w-5 h-5" />
                                {t('owned')}
                              </div>
                            ) : (
                              <Button
                                onClick={() => handlePurchase(reward)}
                                disabled={!canAfford}
                                className={`w-full ${
                                  canAfford
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                }`}
                              >
                                {canAfford ? (
                                  <>
                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                    {t('buy')}
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-4 h-4 mr-2" />
                                    {t('locked')}
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </Card>
              )
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="mt-6">
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-4 border-purple-300 rounded-3xl shadow-xl">
            {userRewards.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-20 h-20 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl text-purple-900 mb-2">{t('noRewardsYet')}</h3>
                <p className="text-gray-700">{t('startEarningPoints')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userRewards.map((userReward) => {
                  const reward = availableRewards.find(r => r.id === userReward.rewardId);
                  if (!reward) return null;
                  
                  return (
                    <motion.div
                      key={userReward.id}
                      whileHover={{ scale: 1.05 }}
                      className="p-6 bg-gradient-to-br from-purple-100 to-purple-200 border-3 border-purple-400 rounded-2xl shadow-md"
                    >
                      <div className="text-center space-y-3">
                        <div className="text-6xl">{reward.icon}</div>
                        <h4 className="text-lg font-semibold text-purple-900">
                          {getRewardName(reward)}
                        </h4>
                        <p className="text-sm text-gray-700">
                          {getRewardDescription(reward)}
                        </p>
                        <div className="text-xs text-purple-700">
                          {t('purchased')}: {new Date(userReward.purchasedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <Card className="p-8 bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-300 rounded-3xl shadow-xl">
            {achievements.length === 0 ? (
              <div className="text-center py-12">
                <Award className="w-20 h-20 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl text-green-900 mb-2">{t('noAchievementsYet')}</h3>
                <p className="text-gray-700">{t('completeExercises')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-gradient-to-br from-green-100 to-green-200 border-3 border-green-400 rounded-2xl shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-5xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-green-900 mb-1">
                          {achievement.name}
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-yellow-700 font-semibold">
                            <Star className="w-4 h-4" />
                            +{achievement.points} {t('points')}
                          </div>
                          <div className="flex items-center gap-1 text-green-700">
                            <Calendar className="w-4 h-4" />
                            {new Date(achievement.earnedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="p-8 bg-gradient-to-br from-orange-50 to-orange-100 border-4 border-orange-300 rounded-3xl shadow-xl">
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="w-20 h-20 text-orange-400 mx-auto mb-4" />
                <h3 className="text-2xl text-orange-900 mb-2">{t('noTransactions')}</h3>
                <p className="text-gray-700">{t('completeExercises')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice().reverse().map((transaction: any) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-2xl border-3 shadow-md ${
                      transaction.type === 'earn'
                        ? 'bg-gradient-to-r from-green-100 to-green-200 border-green-400'
                        : 'bg-gradient-to-r from-red-100 to-red-200 border-red-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {transaction.type === 'earn' ? (
                          <Zap className="w-6 h-6 text-green-600" />
                        ) : (
                          <ShoppingBag className="w-6 h-6 text-red-600" />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{transaction.reason}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(transaction.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className={`text-2xl font-bold ${
                        transaction.type === 'earn' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
