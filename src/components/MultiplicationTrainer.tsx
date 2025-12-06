import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { saveMultiplicationResult, getMultiplicationResults, MultiplicationResult, User, calculateMultiplicationPoints, addPoints } from '../utils/storage';
import { Language, getTranslation } from '../utils/translations';
import { Calculator, CheckCircle, XCircle, Play, RotateCcw, Trophy, Target, Clock, Sparkles, Lightbulb, Eye, EyeOff, Grid3x3 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface MultiplicationTrainerProps {
  user: User;
  language: Language;
}

type GameState = 'idle' | 'countdown' | 'playing' | 'finished';

interface Problem {
  num1: number;
  num2: number;
  answer: number;
  userAnswer: string;
  isCorrect: boolean | null;
}

const MOTIVATIONAL_MESSAGES = {
  correct: ['amazing', 'excellent2', 'fantastic', 'brilliant', 'perfect', 'incredible', 'outstanding'],
  wrong: ['keepGoing', 'tryAgain', 'almostThere', 'dontGiveUp', 'youCanDoIt', 'believeInYourself', 'stayFocused'],
};

export function MultiplicationTrainer({ user, language }: MultiplicationTrainerProps) {
  const [mode, setMode] = useState<'single' | 'mixed'>('single');
  const [selectedTable, setSelectedTable] = useState<number>(2);
  const [problemsCount, setProblemsCount] = useState<number>(10);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [results, setResults] = useState<MultiplicationResult[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hintEnabled, setHintEnabled] = useState(true);
  const [showVisualization, setShowVisualization] = useState(false);

  const t = (key: keyof typeof import('../utils/translations').translations.ru) => 
    getTranslation(language, key);

  useEffect(() => {
    setResults(getMultiplicationResults(user.id));
  }, [user.id]);

  const generateProblems = useCallback(() => {
    const newProblems: Problem[] = [];
    for (let i = 0; i < problemsCount; i++) {
      let num1: number;
      let num2: number;
      
      if (mode === 'single') {
        num1 = selectedTable;
        num2 = Math.floor(Math.random() * 10) + 1;
      } else {
        num1 = Math.floor(Math.random() * 9) + 2; // 2-10
        num2 = Math.floor(Math.random() * 10) + 1; // 1-10
      }
      
      newProblems.push({
        num1,
        num2,
        answer: num1 * num2,
        userAnswer: '',
        isCorrect: null,
      });
    }
    return newProblems;
  }, [mode, selectedTable, problemsCount]);

  const startGame = () => {
    setGameState('countdown');
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameState('playing');
      setProblems(generateProblems());
      setCurrentProblemIndex(0);
      setStartTime(Date.now());
      setCountdown(null);
      setShowHint(false);
      setShowVisualization(false);
    }
  }, [countdown, generateProblems]);

  const showMotivationalMessage = (isCorrect: boolean) => {
    const messages = isCorrect ? MOTIVATIONAL_MESSAGES.correct : MOTIVATIONAL_MESSAGES.wrong;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const message = t(randomMessage as any);
    
    if (isCorrect) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const checkAnswer = () => {
    if (!currentAnswer.trim()) {
      toast.error(t('pleaseFillAnswer'));
      return;
    }

    const currentProblem = problems[currentProblemIndex];
    const userAnswerNum = parseInt(currentAnswer);
    const isCorrect = userAnswerNum === currentProblem.answer;

    const updatedProblems = [...problems];
    updatedProblems[currentProblemIndex] = {
      ...currentProblem,
      userAnswer: currentAnswer,
      isCorrect,
    };
    setProblems(updatedProblems);

    showMotivationalMessage(isCorrect);

    // Move to next problem or finish
    if (currentProblemIndex < problems.length - 1) {
      setTimeout(() => {
        setCurrentProblemIndex(currentProblemIndex + 1);
        setCurrentAnswer('');
        setShowHint(false);
        setShowVisualization(false);
      }, 1000);
    } else {
      setTimeout(() => {
        finishGame(updatedProblems);
      }, 1000);
    }
  };

  const finishGame = (finalProblems: Problem[]) => {
    setEndTime(Date.now());
    setGameState('finished');

    const correctCount = finalProblems.filter(p => p.isCorrect).length;
    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    saveMultiplicationResult({
      userId: user.id,
      mode,
      table: mode === 'single' ? selectedTable : undefined,
      correctAnswers: correctCount,
      totalProblems: problemsCount,
      time: timeTaken,
    });

    // Award points
    const correctPercentage = (correctCount / problemsCount) * 100;
    const earnedPoints = calculateMultiplicationPoints(correctPercentage, mode);
    if (earnedPoints > 0) {
      addPoints(user.id, earnedPoints, `Multiplication: ${correctCount}/${problemsCount} in ${timeTaken}s`);
      toast.success(`${t('completed')}! +${earnedPoints} ${t('points')}! 🎉`, {
        duration: 3000,
      });
    }

    setResults(getMultiplicationResults(user.id));
  };

  const resetGame = () => {
    setGameState('idle');
    setProblems([]);
    setCurrentProblemIndex(0);
    setCurrentAnswer('');
    setStartTime(0);
    setEndTime(0);
    setCountdown(null);
    setShowHint(false);
    setShowVisualization(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && gameState === 'playing') {
      checkAnswer();
    }
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const toggleVisualization = () => {
    setShowVisualization(!showVisualization);
  };

  // Generate hint steps
  const getHintSteps = (num1: number, num2: number) => {
    const steps = [];
    
    if (language === 'ru') {
      steps.push(`🎯 Нужно узнать: ${num1} × ${num2}`);
      steps.push(`📝 Это значит: взять число ${num1} ровно ${num2} раз(а)`);
      
      if (num2 <= 5) {
        const parts = [];
        for (let i = 0; i < num2; i++) {
          parts.push(num1.toString());
        }
        steps.push(`➕ Сложи: ${parts.join(' + ')}`);
      } else {
        steps.push(`🧮 Посчитай: ${num1} + ${num1} + ... (${num2} раз)`);
      }
    } else if (language === 'kz') {
      steps.push(`🎯 Табу керек: ${num1} × ${num2}`);
      steps.push(`📝 Бұл дегеніміз: ${num1} санын ${num2} рет алу`);
      
      if (num2 <= 5) {
        const parts = [];
        for (let i = 0; i < num2; i++) {
          parts.push(num1.toString());
        }
        steps.push(`➕ Қос: ${parts.join(' + ')}`);
      } else {
        steps.push(`🧮 Сана: ${num1} + ${num1} + ... (${num2} рет)`);
      }
    } else {
      steps.push(`🎯 Find: ${num1} × ${num2}`);
      steps.push(`📝 This means: take ${num1} exactly ${num2} time(s)`);
      
      if (num2 <= 5) {
        const parts = [];
        for (let i = 0; i < num2; i++) {
          parts.push(num1.toString());
        }
        steps.push(`➕ Add: ${parts.join(' + ')}`);
      } else {
        steps.push(`🧮 Calculate: ${num1} + ${num1} + ... (${num2} times)`);
      }
    }
    
    return steps;
  };

  // Generate visual grid
  const renderVisualization = (num1: number, num2: number) => {
    const rows = [];
    const maxDisplay = 10; // Don't display more than 10x10
    
    if (num1 > maxDisplay || num2 > maxDisplay) {
      return (
        <div className="text-center text-gray-600 py-8">
          {language === 'ru' ? '📊 Слишком большое число для визуализации' :
           language === 'kz' ? '📊 Визуализация үшін тым үлкен сан' :
           '📊 Number too large for visualization'}
        </div>
      );
    }
    
    for (let i = 0; i < num2; i++) {
      const cols = [];
      for (let j = 0; j < num1; j++) {
        cols.push(
          <motion.div
            key={`${i}-${j}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: (i * num1 + j) * 0.03 }}
            className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg shadow-md flex items-center justify-center"
          >
            <span className="text-xs text-white font-bold">●</span>
          </motion.div>
        );
      }
      rows.push(
        <div key={i} className="flex gap-2 justify-center">
          {cols}
        </div>
      );
    }
    
    return (
      <div className="space-y-2 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-300">
        {rows}
        <div className="text-center mt-4 text-sm text-gray-700 font-medium">
          {language === 'ru' ? `${num2} ряд(а) по ${num1} кружков` :
           language === 'kz' ? `${num2} қатар, әрқайсысында ${num1} дөңгелек` :
           `${num2} row(s) of ${num1} circles`}
        </div>
      </div>
    );
  };

  const currentProblem = problems[currentProblemIndex];
  const timeTaken = endTime > 0 ? Math.round((endTime - startTime) / 1000) : 0;
  const correctCount = problems.filter(p => p.isCorrect).length;
  const accuracy = problems.length > 0 ? Math.round((correctCount / problems.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl flex items-center justify-center shadow-xl transform rotate-12">
              <Calculator className="w-10 h-10 text-white transform -rotate-12" />
            </div>
          </motion.div>
          <h1 className="text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {t('multiplicationTrainerFull')}
          </h1>
          <p className="text-gray-600">
            {language === 'ru' ? '✖️ Учи таблицу умножения с подсказками!' : 
             language === 'kz' ? '✖️ Көбейту кестесін кеңестермен үйреніңіз!' : 
             '✖️ Learn multiplication tables with hints!'}
          </p>
        </div>

        {/* Countdown */}
        <AnimatePresence>
          {gameState === 'countdown' && countdown !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            >
              <motion.div
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="text-9xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
              >
                {countdown > 0 ? countdown : t('start')}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Settings Card */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-4 border-blue-200 rounded-3xl shadow-xl">
              <div className="space-y-6">
                {/* Hint Toggle */}
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lightbulb className="w-6 h-6 text-yellow-600" />
                      <div>
                        <div className="font-semibold text-gray-800">
                          {language === 'ru' ? '💡 Режим подсказок' :
                           language === 'kz' ? '💡 Кеңес режимі' :
                           '💡 Hint Mode'}
                        </div>
                        <div className="text-xs text-gray-600">
                          {language === 'ru' ? 'Показывать объяснения и визуализацию' :
                           language === 'kz' ? 'Түсіндірулер мен визуализацияны көрсету' :
                           'Show explanations and visualization'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setHintEnabled(!hintEnabled)}
                      className={`px-4 py-2 rounded-xl border-2 transition-all ${
                        hintEnabled
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-yellow-500 shadow-lg'
                          : 'bg-white text-gray-600 border-gray-300'
                      }`}
                    >
                      {hintEnabled ? (language === 'ru' ? 'ВКЛ' : language === 'kz' ? 'ҚОС' : 'ON') : 
                                     (language === 'ru' ? 'ВЫКЛ' : language === 'kz' ? 'ӨШІР' : 'OFF')}
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">{t('mode')}</Label>
                  <RadioGroup value={mode} onValueChange={(value) => setMode(value as 'single' | 'mixed')}>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <label className={`flex items-center space-x-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          mode === 'single' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
                        }`}>
                          <RadioGroupItem value="single" id="single" />
                          <span>📋 {t('singleTable')}</span>
                        </label>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <label className={`flex items-center space-x-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          mode === 'mixed' ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-300'
                        }`}>
                          <RadioGroupItem value="mixed" id="mixed" />
                          <span>🎲 {t('mixedTables')}</span>
                        </label>
                      </motion.div>
                    </div>
                  </RadioGroup>
                </div>

                {mode === 'single' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Label className="mb-3 block">{t('selectTable')}</Label>
                    <div className="grid grid-cols-5 gap-3">
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <motion.button
                          key={num}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedTable(num)}
                          className={`p-4 rounded-2xl border-2 transition-all font-bold ${
                            selectedTable === num
                              ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg'
                              : 'border-gray-300 hover:border-blue-400 bg-white'
                          }`}
                        >
                          {num}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div>
                  <Label className="mb-3 block">{t('problemsCount')}: {problemsCount}</Label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="5"
                    value={problemsCount}
                    onChange={(e) => setProblemsCount(parseInt(e.target.value))}
                    className="w-full h-3 bg-blue-200 rounded-full appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>5</span>
                    <span>10</span>
                    <span>15</span>
                    <span>20</span>
                  </div>
                </div>

                <Button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-6 rounded-2xl shadow-xl"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {t('start')}
                </Button>
              </div>
            </Card>

            {/* Results Card */}
            {results.length > 0 && (
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-4 border-indigo-200 rounded-3xl shadow-xl">
                <h3 className="mb-4 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  {t('yourResults')}
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {results.slice(-5).reverse().map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {result.mode === 'single' ? '📋' : '🎲'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">
                              {result.mode === 'single' 
                                ? `${t('table')} ${result.table}` 
                                : t('mixedTables')}
                            </div>
                            <div className="text-sm text-gray-600">
                              {result.correctAnswers}/{result.totalProblems} • {result.time}s
                            </div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                          {Math.round((result.correctAnswers / result.totalProblems) * 100)}%
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {gameState === 'playing' && currentProblem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Progress */}
            <Card className="p-4 bg-white/80 backdrop-blur-sm border-4 border-blue-200 rounded-3xl shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">
                    {currentProblemIndex + 1} / {problems.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold">
                    {correctCount} {t('correct')}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentProblemIndex + 1) / problems.length) * 100}%` }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                />
              </div>
            </Card>

            {/* Problem Card */}
            <Card className="p-8 bg-white/90 backdrop-blur-sm border-4 border-purple-200 rounded-3xl shadow-2xl">
              <motion.div
                key={currentProblemIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {currentProblem.num1} × {currentProblem.num2} = ?
                </div>

                {/* Auto-show Hints */}
                {hintEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-300"
                  >
                    <div className="space-y-3">
                      {getHintSteps(currentProblem.num1, currentProblem.num2).map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 }}
                          className="text-lg text-gray-700 font-medium"
                        >
                          {step}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Visualization Button */}
                {hintEnabled && (
                  <div className="flex justify-center">
                    <Button
                      onClick={toggleVisualization}
                      variant="outline"
                      className={`border-2 rounded-xl ${
                        showVisualization 
                          ? 'bg-blue-50 border-blue-400 text-blue-700' 
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      <Grid3x3 className="w-4 h-4 mr-2" />
                      {showVisualization ? (language === 'ru' ? 'Скрыть сетку' : language === 'kz' ? 'Торды жасыру' : 'Hide grid') :
                                          (language === 'ru' ? 'Показать сетку' : language === 'kz' ? 'Торды көрсету' : 'Show grid')}
                    </Button>
                  </div>
                )}

                {/* Visual Grid */}
                <AnimatePresence>
                  {showVisualization && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {renderVisualization(currentProblem.num1, currentProblem.num2)}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Answer Input */}
                <div className="space-y-4">
                  <Label htmlFor="answer" className="text-xl text-center block">
                    {language === 'ru' ? '⌨️ Введи ответ:' :
                     language === 'kz' ? '⌨️ Жауапты енгіз:' :
                     '⌨️ Enter answer:'}
                  </Label>
                  <Input
                    id="answer"
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    autoFocus
                    className="text-center text-4xl p-8 border-4 border-blue-300 focus:border-blue-500 rounded-2xl font-bold"
                    placeholder="?"
                  />
                </div>

                <Button
                  onClick={checkAnswer}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-6 rounded-2xl shadow-xl text-lg"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {t('checkAnswer')}
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {gameState === 'finished' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Results Summary */}
            <Card className="p-8 bg-white/90 backdrop-blur-sm border-4 border-yellow-300 rounded-3xl shadow-2xl">
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  className="text-8xl"
                >
                  {accuracy >= 90 ? '🏆' : accuracy >= 70 ? '🎉' : accuracy >= 50 ? '👍' : '💪'}
                </motion.div>

                <h2 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('congratulations')}!
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-300">
                    <div className="text-3xl font-bold text-blue-600">{correctCount}/{problems.length}</div>
                    <div className="text-sm text-gray-600">{t('correctAnswers')}</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-300">
                    <div className="text-3xl font-bold text-purple-600">{accuracy}%</div>
                    <div className="text-sm text-gray-600">{t('accuracy')}</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border-2 border-indigo-300">
                    <div className="text-3xl font-bold text-indigo-600">{timeTaken}s</div>
                    <div className="text-sm text-gray-600">{t('time')}</div>
                  </div>
                </div>

                <Button
                  onClick={resetGame}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-6 rounded-2xl shadow-xl"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  {t('tryAgain')}
                </Button>
              </div>
            </Card>

            {/* Review Answers */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-4 border-indigo-200 rounded-3xl shadow-xl">
              <h3 className="mb-4">{t('reviewAnswers')}</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {problems.map((problem, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between ${
                      problem.isCorrect
                        ? 'bg-green-50 border-green-300'
                        : 'bg-red-50 border-red-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {problem.isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                      <span className="text-lg font-semibold">
                        {problem.num1} × {problem.num2} = {problem.answer}
                      </span>
                    </div>
                    {!problem.isCorrect && (
                      <span className="text-sm text-gray-600">
                        {t('yourAnswer')}: {problem.userAnswer}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}