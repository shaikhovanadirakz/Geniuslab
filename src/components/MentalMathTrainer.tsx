import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { User, saveMentalMathResult, calculateMentalMathPoints, addPoints } from '../utils/storage';
import { toast } from 'sonner@2.0.3';
import { Language, getTranslation } from '../utils/translations';
import { Calculator, Clock, Trophy, CheckCircle2, XCircle, Play, RotateCcw, Target } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface MentalMathTrainerProps {
  user: User;
  language: Language;
}

type Digits = '1' | '2' | '3' | '4' | '5';
type Difficulty = 'easy' | 'hard' | 'mixed';

interface Problem {
  num1: number;
  num2: number;
  answer: number;
  userAnswer: string;
  isCorrect: boolean | null;
}

export function MentalMathTrainer({ user, language }: MentalMathTrainerProps) {
  const t = (key: keyof typeof import('../utils/translations').translations.ru) => 
    getTranslation(language, key);

  const inputRef = useRef<HTMLInputElement>(null);
  const [digits, setDigits] = useState<Digits>('2');
  const [difficulty, setDifficulty] = useState<Difficulty>('mixed');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showingProblem, setShowingProblem] = useState(false);
  const [motivationMessage, setMotivationMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && startTime && !isFinished) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, startTime, isFinished]);

  // Auto-focus input after problem is shown
  useEffect(() => {
    if (showingProblem && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showingProblem, currentProblemIndex]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const generateNumber = (digits: number, allowCarry: boolean, position: 'first' | 'second', firstNum?: number): number => {
    if (position === 'first') {
      // Первое число всегда максимальной разрядности
      const min = Math.pow(10, digits - 1);
      const max = Math.pow(10, digits) - 1;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
      // Второе число может быть от 1 до максимума для данной разрядности
      const max = Math.pow(10, digits) - 1;
      
      if (allowCarry) {
        // Для сложного уровня - любое число от 1 до max
        return Math.floor(Math.random() * max) + 1;
      } else {
        // Для легкого уровня - число должно быть таким, чтобы не было переноса
        if (!firstNum) return Math.floor(Math.random() * max) + 1;

        const firstDigits = firstNum.toString().split('').map(Number);
        let secondDigits: number[] = [];

        for (let i = 0; i < firstDigits.length; i++) {
          const maxDigit = 9 - firstDigits[i];
          secondDigits.push(Math.floor(Math.random() * (maxDigit + 1)));
        }

        const result = parseInt(secondDigits.join(''));
        // Если получился 0, возвращаем случайное число без переноса
        return result === 0 ? Math.floor(Math.random() * 9) + 1 : result;
      }
    }
  };

  const generateProblems = (numDigits: number, diff: Difficulty): Problem[] => {
    const problemsList: Problem[] = [];
    
    for (let i = 0; i < 20; i++) {
      let allowCarry: boolean;
      
      if (diff === 'easy') {
        allowCarry = false;
      } else if (diff === 'hard') {
        allowCarry = true;
      } else {
        // mixed
        allowCarry = Math.random() > 0.5;
      }

      const num1 = generateNumber(numDigits, allowCarry, 'first');
      const num2 = generateNumber(numDigits, allowCarry, 'second', num1);
      
      problemsList.push({
        num1,
        num2,
        answer: num1 + num2,
        userAnswer: '',
        isCorrect: null,
      });
    }
    
    return problemsList;
  };

  const startGame = () => {
    const numDigits = parseInt(digits);
    const newProblems = generateProblems(numDigits, difficulty);
    setProblems(newProblems);
    setCurrentProblemIndex(0);
    setCurrentAnswer('');
    setIsFinished(false);
    setShowingProblem(false);
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
      // Countdown finished (reached 0)
      const timer = setTimeout(() => {
        setCountdown(null);
        if (!isPlaying) {
          // Первый запуск - начинаем игру
          setIsPlaying(true);
          setStartTime(Date.now());
          setElapsedTime(0);
        }
        // Показываем пример после отсчета
        setShowingProblem(true);
      }, 500); // Небольшая задержка после "🚀"
      return () => clearTimeout(timer);
    }
  }, [countdown, isPlaying]);

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) {
      toast.error(t('pleaseFillAnswer'));
      return;
    }

    const updatedProblems = [...problems];
    const userAnswerNum = parseInt(currentAnswer);
    const isCorrect = userAnswerNum === problems[currentProblemIndex].answer;
    
    updatedProblems[currentProblemIndex] = {
      ...updatedProblems[currentProblemIndex],
      userAnswer: currentAnswer,
      isCorrect,
    };
    
    setProblems(updatedProblems);

    // Показываем мотивационное сообщение
    if (isCorrect) {
      const successMessages = ['amazing', 'excellent2', 'fantastic', 'brilliant', 'perfect', 'incredible', 'outstanding', 'superb'];
      const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)] as keyof typeof import('../utils/translations').translations.ru;
      setMotivationMessage({ text: t(randomMessage), type: 'success' });
    } else {
      const supportMessages = ['keepGoing', 'almostThere', 'dontGiveUp', 'tryAgain', 'stayFocused', 'believeInYou', 'learningProcess', 'youCanDoIt'];
      const randomMessage = supportMessages[Math.floor(Math.random() * supportMessages.length)] as keyof typeof import('../utils/translations').translations.ru;
      setMotivationMessage({ text: t(randomMessage), type: 'error' });
    }

    // Скрываем сообщение через 1.5 секунды
    setTimeout(() => setMotivationMessage(null), 1500);

    if (currentProblemIndex < 19) {
      // Скрываем текущий пример
      setShowingProblem(false);
      setCurrentAnswer('');
      
      // Переключаемся на следующий пример
      setCurrentProblemIndex(currentProblemIndex + 1);
      
      // Показываем обратный отсчет 3-2-1 перед следующим примером
      setCountdown(3);
    } else {
      // Finished
      setIsFinished(true);
      setIsPlaying(false);
      
      const correctCount = updatedProblems.filter(p => p.isCorrect).length;
      const finalTime = Date.now() - (startTime || Date.now());
      
      saveMentalMathResult({
        userId: user.id,
        digits: parseInt(digits),
        difficulty,
        correctAnswers: correctCount,
        totalProblems: 20,
        time: finalTime,
      });

      // Award points
      const correctPercentage = (correctCount / 20) * 100;
      const earnedPoints = calculateMentalMathPoints(correctPercentage, difficulty);
      if (earnedPoints > 0) {
        addPoints(user.id, earnedPoints, `Mental Math: ${difficulty}, ${correctCount}/20`);
        toast.success(`${t('completed')}! ${t('score')}: ${correctCount}/20 - +${earnedPoints} ${t('points')}! 🎉`);
      } else {
        toast.success(`${t('completed')}! ${t('score')}: ${correctCount}/20`);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitAnswer();
    }
  };

  const resetGame = () => {
    setProblems([]);
    setCurrentProblemIndex(0);
    setCurrentAnswer('');
    setIsPlaying(false);
    setStartTime(null);
    setElapsedTime(0);
    setIsFinished(false);
    setCountdown(null);
    setShowingProblem(false);
  };

  const correctCount = problems.filter(p => p.isCorrect === true).length;
  const incorrectCount = problems.filter(p => p.isCorrect === false).length;
  const currentProblem = problems[currentProblemIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 text-6xl opacity-30">🧮</div>
          <div className="absolute bottom-4 left-4 text-4xl opacity-20">⚡</div>
          <div className="absolute top-4 left-4 text-4xl opacity-30">➕</div>
          <div className="absolute top-1/2 right-1/3 text-3xl opacity-20">✖️</div>
          <div className="absolute bottom-4 right-1/4 text-3xl opacity-20">🎯</div>
          <h1 className="text-4xl mb-2 relative z-10">{t('mentalMath')} 🧮</h1>
          <p className="text-cyan-100 relative z-10">{t('mentalMathDescription')}</p>
        </motion.div>

        {/* Settings */}
        {!isPlaying && !isFinished && (
          <Card className="p-6 bg-gradient-to-br from-white to-cyan-50 border-4 border-cyan-300 rounded-3xl shadow-xl">
            <h2 className="text-2xl mb-6 flex items-center gap-2 text-cyan-900">
              <Calculator className="w-6 h-6 text-cyan-600" />
              {t('settings')}
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-cyan-900">{t('numberOfDigits')}</Label>
                <Select value={digits} onValueChange={(value) => setDigits(value as Digits)}>
                  <SelectTrigger className="bg-white border-3 border-cyan-400 rounded-2xl hover:border-cyan-500 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-2xl border-3 border-cyan-300">
                    <SelectItem value="1">🔢 {t('oneDigit')} (1-9)</SelectItem>
                    <SelectItem value="2">🔢 {t('twoDigits')} (10-99)</SelectItem>
                    <SelectItem value="3">🔢 {t('threeDigits')} (100-999)</SelectItem>
                    <SelectItem value="4">🔢 {t('fourDigits')} (1000-9999)</SelectItem>
                    <SelectItem value="5">🔢 {t('fiveDigits')} (10000-99999)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-cyan-900">{t('difficulty')}</Label>
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                  <SelectTrigger className="bg-white border-3 border-cyan-400 rounded-2xl hover:border-cyan-500 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-2xl border-3 border-cyan-300">
                    <SelectItem value="easy">
                      🟢 {t('easy')} - {t('noCarry')}
                    </SelectItem>
                    <SelectItem value="hard">
                      🔴 {t('hard')} - {t('withCarry')}
                    </SelectItem>
                    <SelectItem value="mixed">
                      🟡 {t('mixed')} - {t('mixedCarry')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-5 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border-3 border-cyan-200 shadow-inner">
                <p className="text-cyan-900 text-sm leading-relaxed">
                  <strong className="text-cyan-800 flex items-center gap-2 mb-2">
                    💡 {t('aboutDifficulty')}:
                  </strong>
                  • <strong className="text-green-700">🟢 {t('easy')}</strong>: {t('easyExplanation')} <span className="bg-white px-2 py-0.5 rounded font-mono text-green-700">11+22=33</span><br/>
                  • <strong className="text-red-700">🔴 {t('hard')}</strong>: {t('hardExplanation')} <span className="bg-white px-2 py-0.5 rounded font-mono text-red-700">38+46=84</span><br/>
                  • <strong className="text-yellow-700">🟡 {t('mixed')}</strong>: {t('mixedExplanation')}
                </p>
              </div>

              <Button 
                onClick={startGame}
                className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600 text-white rounded-2xl p-6 text-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <Play className="w-6 h-6 mr-2" />
                {t('start')} ⚡
              </Button>
            </div>
          </Card>
        )}

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
                {currentProblemIndex === 0 ? t('getReady') : t('nextProblem')}
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
                className="text-9xl sm:text-[12rem] font-bold bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-2xl"
              >
                {countdown === 0 ? '🚀' : countdown}
              </motion.div>
              <Button
                onClick={resetGame}
                variant="outline"
                className="mt-8 bg-white/90 hover:bg-white border-2 border-white/50 backdrop-blur-sm rounded-2xl px-6 py-3"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                {t('reset')}
              </Button>
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
              className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-[90vw]"
            >
              <div className={`
                px-6 py-4 sm:px-8 sm:py-6 rounded-3xl shadow-2xl border-4 backdrop-blur-sm
                ${motivationMessage.type === 'success' 
                  ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-400 text-green-900' 
                  : 'bg-gradient-to-br from-orange-100 to-yellow-100 border-orange-400 text-orange-900'}
              `}>
                <motion.p 
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-center whitespace-nowrap"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  {motivationMessage.text}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game */}
        {isPlaying && !isFinished && currentProblem && showingProblem && (
          <Card className="p-8 bg-gradient-to-br from-white via-cyan-50 to-blue-50 border-4 border-indigo-300 rounded-3xl shadow-2xl">
            {/* Progress and Timer */}
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white px-4 py-2 rounded-2xl shadow-lg">
                  <span className="text-3xl font-bold">{currentProblemIndex + 1}</span>
                  <span className="text-xl opacity-80"> / 20</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 bg-gradient-to-br from-green-100 to-green-200 px-3 py-2 rounded-xl shadow-md border-2 border-green-300">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-green-900 font-bold">{correctCount}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-gradient-to-br from-red-100 to-red-200 px-3 py-2 rounded-xl shadow-md border-2 border-red-300">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-900 font-bold">{incorrectCount}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-br from-orange-100 to-yellow-100 px-5 py-3 rounded-2xl shadow-lg border-2 border-orange-300">
                <Clock className="w-6 h-6 text-orange-600" />
                <span className="text-2xl text-orange-900 font-mono font-bold">{formatTime(elapsedTime)}</span>
              </div>
            </div>

            {/* Problem */}
            <motion.div 
              key={currentProblemIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-3xl p-12 mb-6 text-center border-4 border-indigo-400 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-4 left-4 text-8xl">✨</div>
                <div className="absolute bottom-4 right-4 text-8xl">⚡</div>
              </div>
              <div className="text-7xl text-white font-bold mb-4 relative z-10 drop-shadow-lg">
                {currentProblem.num1} + {currentProblem.num2} = ?
              </div>
            </motion.div>

            {/* Answer Input */}
            <div className="space-y-4">
              <Input
                ref={inputRef}
                type="number"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('enterAnswer')}
                className="text-center text-4xl p-8 border-4 border-cyan-400 rounded-2xl font-bold bg-white shadow-lg hover:border-cyan-500 focus:border-indigo-500 transition-colors"
                autoFocus
              />
              <Button
                onClick={handleSubmitAnswer}
                className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white rounded-2xl p-6 text-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                {currentProblemIndex < 19 ? `${t('next')} ➡️` : `${t('finish')} 🏁`}
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentProblemIndex + 1) / 20) * 100}%` }}
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 shadow-lg"
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">{currentProblemIndex + 1} {language === 'ru' ? 'из' : language === 'kz' ? '-дан' : 'of'} 20</p>
            </div>
          </Card>
        )}

        {/* Results */}
        {isFinished && (
          <Card className="p-8 bg-gradient-to-br from-white via-cyan-50 to-indigo-100 border-4 border-indigo-400 rounded-3xl shadow-2xl">
            <div className="text-center space-y-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="text-9xl"
              >
                🎉
              </motion.div>
              <h2 className="text-5xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">{t('completed')}!</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl border-3 border-orange-300 shadow-lg"
                >
                  <div className="text-orange-600 mb-2 flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5" />
                    {t('time')}
                  </div>
                  <div className="text-4xl text-orange-900 font-bold">{formatTime(elapsedTime)}</div>
                </motion.div>
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl border-3 border-green-300 shadow-lg"
                >
                  <div className="text-green-600 mb-2 flex items-center justify-center gap-2">
                    <Trophy className="w-5 h-5" />
                    {t('correct')}
                  </div>
                  <div className="text-4xl text-green-900 font-bold">{correctCount}/20</div>
                </motion.div>
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl border-3 border-blue-300 shadow-lg"
                >
                  <div className="text-blue-600 mb-2 flex items-center justify-center gap-2">
                    <Target className="w-5 h-5" />
                    {t('accuracy')}
                  </div>
                  <div className="text-4xl text-blue-900 font-bold">{Math.round((correctCount / 20) * 100)}%</div>
                </motion.div>
              </div>

              {/* Review Answers */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <h3 className="text-3xl bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                  📝 {t('reviewAnswers')}
                </h3>
                <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                  {problems.map((problem, index) => (
                    <motion.div 
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className={`p-4 rounded-2xl border-3 shadow-md ${
                        problem.isCorrect 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
                          : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300'
                      }`}
                    >
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          {problem.isCorrect ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600" />
                          )}
                          <span className={`font-bold text-lg ${problem.isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                            {problem.num1} + {problem.num2} = {problem.answer}
                          </span>
                        </div>
                        <div className={`text-sm px-3 py-1 rounded-lg ${
                          problem.isCorrect 
                            ? 'bg-green-100 border-2 border-green-300' 
                            : 'bg-red-100 border-2 border-red-300'
                        }`}>
                          {t('yourAnswer')}: <span className={`font-bold ${problem.isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                            {problem.userAnswer}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <Button
                onClick={resetGame}
                className="mt-6 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600 text-white rounded-2xl p-6 text-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <RotateCcw className="w-6 h-6 mr-2" />
                {t('playAgain')} 🔄
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
