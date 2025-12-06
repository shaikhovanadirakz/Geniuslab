import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { saveMemoryResult, User, calculateMemoryPoints, addPoints } from '../utils/storage';
import { Language, getTranslation } from '../utils/translations';
import { Play, Trophy, Brain, Settings } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface MemoryTrainerProps {
  user: User;
  language: Language;
}

export function MemoryTrainer({ user, language }: MemoryTrainerProps) {
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [currentShowIndex, setCurrentShowIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [sequenceLength, setSequenceLength] = useState(4);
  const [displayTime, setDisplayTime] = useState(0.6);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [motivationMessage, setMotivationMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  const t = (key: keyof typeof import('../utils/translations').translations.ru) => 
    getTranslation(language, key);

  const colors = [
    { id: 0, color: 'from-red-500 to-orange-500', name: 'Red' },
    { id: 1, color: 'from-blue-500 to-cyan-500', name: 'Blue' },
    { id: 2, color: 'from-green-500 to-emerald-500', name: 'Green' },
    { id: 3, color: 'from-yellow-500 to-orange-500', name: 'Yellow' },
    { id: 4, color: 'from-purple-500 to-indigo-500', name: 'Purple' },
    { id: 5, color: 'from-teal-500 to-cyan-500', name: 'Teal' },
  ];

  const startGame = () => {
    setGameOver(false);
    setMotivationMessage(null);
    // Начинаем обратный отсчет
    setCountdown(3);
  };

  // Countdown effect
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Countdown finished
      const timer = setTimeout(() => {
        setCountdown(null);
        // Начинаем показ последовательности
        const newSequence = Array.from({ length: sequenceLength + level - 1 }, () => 
          Math.floor(Math.random() * 6)
        );
        setSequence(newSequence);
        setUserSequence([]);
        setIsShowingSequence(true);
        setIsUserTurn(false);
        setCurrentShowIndex(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [countdown, sequenceLength, level]);

  useEffect(() => {
    if (isShowingSequence && currentShowIndex < sequence.length) {
      const timer = setTimeout(() => {
        setCurrentShowIndex(prev => prev + 1);
      }, displayTime * 1000);
      return () => clearTimeout(timer);
    } else if (isShowingSequence && currentShowIndex >= sequence.length) {
      setTimeout(() => {
        setIsShowingSequence(false);
        setIsUserTurn(true);
      }, 500);
    }
  }, [isShowingSequence, currentShowIndex, sequence, displayTime]);

  const handleColorClick = (colorId: number) => {
    if (!isUserTurn) return;

    const newUserSequence = [...userSequence, colorId];
    setUserSequence(newUserSequence);

    const currentIndex = newUserSequence.length - 1;
    
    if (sequence[currentIndex] !== colorId) {
      // Ошибка - показываем поддерживающее сообщение
      const supportMessages = ['keepGoing', 'almostThere', 'dontGiveUp', 'tryAgain', 'stayFocused', 'believeInYou', 'learningProcess', 'youCanDoIt'];
      const randomMessage = supportMessages[Math.floor(Math.random() * supportMessages.length)] as keyof typeof import('../utils/translations').translations.ru;
      setMotivationMessage({ text: t(randomMessage), type: 'error' });
      
      setGameOver(true);
      setIsUserTurn(false);
      saveMemoryResult({
        userId: user.id,
        level,
        score,
        sequenceLength,
        displayTime,
      });
      
      // Award points based on performance
      const totalAttempts = score + 1; // including current failed attempt
      const correctPercentage = (score / totalAttempts) * 100;
      const earnedPoints = calculateMemoryPoints(correctPercentage, level);
      if (earnedPoints > 0) {
        addPoints(user.id, earnedPoints, `Memory: Level ${level}, Score ${score}`);
        setTimeout(() => {
          toast.success(`+${earnedPoints} ${t('points')}! 🎉`, {
            duration: 3000,
          });
        }, 500);
      }
      
      // Скрываем сообщение через 3 секунды
      setTimeout(() => setMotivationMessage(null), 3000);
    } else if (newUserSequence.length === sequence.length) {
      // Правильно - показываем мотивирующее сообщение
      const successMessages = ['amazing', 'excellent2', 'fantastic', 'brilliant', 'perfect', 'incredible', 'outstanding', 'superb'];
      const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)] as keyof typeof import('../utils/translations').translations.ru;
      setMotivationMessage({ text: t(randomMessage), type: 'success' });
      
      const newScore = score + (10 * level);
      setScore(newScore);
      setLevel(prev => prev + 1);
      setIsUserTurn(false);
      
      // Скрываем сообщение и начинаем следующий раунд
      setTimeout(() => {
        setMotivationMessage(null);
        startGame();
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Panel */}
      <Card className="p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 border-3 border-indigo-300 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-6 h-6 text-indigo-600" />
          <h3 className="text-indigo-900">{t('settings')}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-indigo-800">{t('sequenceLength')}</Label>
              <div className="flex items-center gap-2 bg-white/60 rounded-lg px-3 py-1.5 border-2 border-indigo-200">
                <span className="text-indigo-900">{sequenceLength}</span>
                <span className="text-indigo-600 text-sm">{t('items')}</span>
              </div>
            </div>
            <Slider
              value={[sequenceLength]}
              onValueChange={(value) => setSequenceLength(value[0])}
              min={2}
              max={10}
              step={1}
              className="w-full"
              disabled={isShowingSequence || isUserTurn}
            />
            <div className="flex justify-between text-xs text-indigo-600">
              <span>2</span>
              <span>10</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-purple-800">{t('displayTime')}</Label>
              <div className="flex items-center gap-2 bg-white/60 rounded-lg px-3 py-1.5 border-2 border-purple-200">
                <span className="text-purple-900">{displayTime.toFixed(1)}</span>
                <span className="text-purple-600 text-sm">{t('seconds')}</span>
              </div>
            </div>
            <Slider
              value={[displayTime]}
              onValueChange={(value) => setDisplayTime(value[0])}
              min={0.1}
              max={1}
              step={0.1}
              className="w-full"
              disabled={isShowingSequence || isUserTurn}
            />
            <div className="flex justify-between text-xs text-purple-600">
              <span>0.1{t('seconds')}</span>
              <span>1.0{t('seconds')}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-100 to-indigo-100 border-2 border-purple-200">
          <div className="text-center">
            <p className="text-sm text-purple-700 mb-1">{t('level')}</p>
            <p className="text-3xl text-purple-900">{level}</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200">
          <div className="text-center">
            <p className="text-sm text-blue-700 mb-1">{t('score')}</p>
            <p className="text-3xl text-blue-900">{score}</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-200">
          <div className="text-center">
            <p className="text-sm text-green-700 mb-1">{t('sequence')}</p>
            <p className="text-3xl text-green-900">{sequence.length}</p>
          </div>
        </Card>
      </div>

      {/* Countdown */}
      {countdown !== null && countdown >= 0 && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl sm:text-4xl text-white font-bold"
            >
              {t('getReady')}
            </motion.p>
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
              animate={{ 
                scale: [1, 1.1, 1], 
                opacity: 1, 
                rotate: 0 
              }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ 
                scale: { 
                  repeat: countdown > 0 ? Infinity : 0,
                  duration: 0.6,
                  ease: "easeInOut"
                },
                rotate: { type: 'spring', stiffness: 200, damping: 15 },
                opacity: { duration: 0.3 }
              }}
              className="text-9xl sm:text-[12rem] font-bold bg-gradient-to-br from-purple-400 via-indigo-500 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl"
            >
              {countdown === 0 ? '🧠' : countdown}
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Motivation Message */}
      <AnimatePresence>
        {motivationMessage && countdown === null && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-[90vw]"
          >
            <div className={`
              px-6 py-4 sm:px-8 sm:py-6 rounded-3xl shadow-2xl border-4 backdrop-blur-sm
              ${motivationMessage.type === 'success' 
                ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-400 text-green-900' 
                : 'bg-gradient-to-br from-orange-100 to-yellow-100 border-orange-400 text-orange-900'}
            `}>
              <motion.p 
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                {motivationMessage.text}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isShowingSequence && !isUserTurn && !gameOver && countdown === null && (
        <div className="text-center">
          <Button
            onClick={startGame}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 px-12 rounded-xl shadow-lg"
          >
            <Play className="w-5 h-5 mr-2" />
            {level === 1 ? t('start') : t('nextLevel')}
          </Button>
        </div>
      )}

      {isShowingSequence && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl border-2 border-blue-200 text-center"
        >
          <Brain className="w-12 h-12 mx-auto mb-3 text-blue-600" />
          <p className="text-blue-900">{t('watchSequence')}</p>
        </motion.div>
      )}

      {isUserTurn && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border-2 border-green-200 text-center"
        >
          <p className="text-green-900">{t('yourTurn')}</p>
          <p className="text-green-700 mt-2">{userSequence.length} / {sequence.length}</p>
        </motion.div>
      )}

      {gameOver && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-6 bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl border-2 border-red-300"
        >
          <div className="text-center">
            <Trophy className="w-16 h-16 mx-auto mb-3 text-red-600" />
            <h3 className="text-red-900 mb-2">{t('gameOver')}</h3>
            <p className="text-red-700 mb-4">{t('finalScore')}: {score}</p>
            <Button
              onClick={() => {
                setLevel(1);
                setScore(0);
                startGame();
              }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {t('playAgain')}
            </Button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {colors.map((color) => (
          <motion.button
            key={color.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleColorClick(color.id)}
            disabled={!isUserTurn}
            className={`
              aspect-square rounded-2xl shadow-xl flex items-center justify-center
              text-white text-2xl transition-all
              bg-gradient-to-br ${color.color}
              ${isShowingSequence && currentShowIndex > 0 && sequence[currentShowIndex - 1] === color.id
                ? 'ring-8 ring-white scale-110'
                : ''
              }
              ${isUserTurn ? 'hover:shadow-2xl cursor-pointer' : 'opacity-50 cursor-not-allowed'}
            `}
          >
            <AnimatePresence>
              {isShowingSequence && currentShowIndex > 0 && sequence[currentShowIndex - 1] === color.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <div className="w-16 h-16 bg-white rounded-full animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
        <p className="text-purple-800 text-sm">
          <strong>{t('howToPlay')}:</strong> {t('howToPlayMemory')}
        </p>
      </div>
    </div>
  );
}
