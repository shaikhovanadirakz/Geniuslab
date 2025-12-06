import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { loginUser, User } from '../utils/storage';
import { Language, getTranslation } from '../utils/translations';
import { LogIn } from 'lucide-react';
import { Logo } from './Logo';

interface AuthProps {
  onLogin: (user: User) => void;
  language: Language;
}

export function Auth({ onLogin, language }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const t = (key: keyof typeof import('../utils/translations').translations.ru) => 
    getTranslation(language, key);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = loginUser(email, password);
    if (user) {
      onLogin(user);
    } else {
      setError(t('invalidEmailOrPassword'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-playful relative overflow-hidden">
      {/* Floating gradient blobs */}
      <div className="floating-shape floating-shape-1"></div>
      <div className="floating-shape floating-shape-2"></div>
      <div className="floating-shape floating-shape-3"></div>
      <div className="floating-shape floating-shape-4"></div>
      
      {/* Decorative stars */}
      <div className="fixed top-10 left-10 text-5xl animate-sparkle">⭐</div>
      <div className="fixed top-20 right-20 text-4xl animate-sparkle animation-delay-1000">✨</div>
      <div className="fixed bottom-32 left-1/4 text-5xl animate-bounce-slow">🌟</div>
      <div className="fixed top-1/3 right-10 text-4xl animate-wiggle animation-delay-2000">💫</div>
      
      {/* Decorative clouds */}
      <div className="fixed top-16 left-1/3 text-5xl opacity-40 animate-float">☁️</div>
      <div className="fixed top-40 right-1/4 text-6xl opacity-30 animate-float animation-delay-1000">☁️</div>
      <div className="fixed bottom-40 left-20 text-5xl opacity-35 animate-float animation-delay-2000">☁️</div>
      
      {/* Decorative balloons */}
      <div className="fixed top-24 right-1/3 text-4xl animate-bounce-slow">🎈</div>
      <div className="fixed bottom-20 left-1/4 text-4xl animate-bounce-slow animation-delay-2000">🎈</div>
      
      {/* Rainbow and playful elements */}
      <div className="fixed top-1/2 left-10 text-4xl animate-float animation-delay-1000">🌈</div>
      <div className="fixed bottom-1/3 right-20 text-3xl animate-spin-slow">🎯</div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card rounded-3xl shadow-2xl p-10 border-4 border-indigo-200 card-hover">
          <div className="flex flex-col items-center justify-center mb-8">
            <motion.div 
              className="mb-6 animate-pulse-glow rounded-3xl"
              initial={{ scale: 0.5, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            >
              <Logo size={120} />
            </motion.div>
            <h1 className="text-center text-gradient-playful text-3xl mb-2 tracking-wide">
              {t('appName')} ✨
            </h1>
            <p className="text-center text-indigo-600 font-medium">
              {t('appSlogan')} 🚀
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-indigo-700">📧 {t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'ru' ? 'введите email' : language === 'kz' ? 'email-ды енгізіңіз' : 'enter email'}
                className="border-3 border-indigo-200 focus:border-indigo-500 rounded-2xl py-3 px-4 bg-white/50 transition-all hover:bg-white shadow-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-indigo-700">🔐 {t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={language === 'ru' ? 'введите пароль' : language === 'kz' ? 'құпия сөзді енгізіңіз' : 'enter password'}
                className="border-3 border-indigo-200 focus:border-indigo-500 rounded-2xl py-3 px-4 bg-white/50 transition-all hover:bg-white shadow-md"
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border-3 border-red-300 rounded-2xl text-red-700 shadow-lg"
              >
                ❌ {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full btn-gradient-blue text-white py-7 rounded-2xl shadow-2xl text-lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              {t('login')} 🚀
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}