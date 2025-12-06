import { motion } from 'motion/react';
import { Card } from './ui/card';
import { 
  getSchulteResults, 
  getNumbersResults, 
  getReadingResults, 
  getMemoryResults,
  getMentalMathResults,
  getMazeResults,
  getMultiplicationResults,
  getDiagnosticResults,
  getConcentrationResults,
  getUserPoints,
  User 
} from '../utils/storage';
import { Language, getTranslation } from '../utils/translations';
import { TrendingUp, Clock, Target, Trophy, Calendar, Grid3x3, Zap, Book, Brain, Gauge, Eye, Timer, Calculator, Waypoints, Activity, BookOpen, Star, Coins } from 'lucide-react';

interface DashboardProps {
  user: User;
  language: Language;
}

export function Dashboard({ user, language }: DashboardProps) {
  const t = (key: keyof typeof import('../utils/translations').translations.ru) => 
    getTranslation(language, key);

  const schulteResults = getSchulteResults(user.id);
  const numbersResults = getNumbersResults(user.id);
  const readingResults = getReadingResults(user.id);
  const memoryResults = getMemoryResults(user.id);
  const mentalMathResults = getMentalMathResults(user.id);
  const mazeResults = getMazeResults(user.id);
  const multiplicationResults = getMultiplicationResults(user.id);
  const diagnosticResults = getDiagnosticResults(user.id);
  const concentrationResults = getConcentrationResults(user.id);
  const userPoints = getUserPoints(user.id);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : language === 'kz' ? 'kk-KZ' : 'en-US');
  };

  const totalExercises = schulteResults.length + numbersResults.length + readingResults.length + memoryResults.length + mentalMathResults.length + mazeResults.length + multiplicationResults.length + diagnosticResults.length + concentrationResults.length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="btn-gradient-blue rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-300/20 rounded-full blur-2xl"></div>
        <div className="absolute top-8 right-8 text-6xl animate-bounce-slow opacity-60">🎉</div>
        <div className="absolute bottom-8 right-24 text-5xl animate-sparkle opacity-50">✨</div>
        <div className="absolute top-8 left-8 text-5xl animate-wiggle opacity-40">⭐</div>
        <div className="absolute bottom-8 left-8 text-4xl animate-float opacity-50">🌟</div>
        <h2 className="text-4xl mb-3 relative z-10 drop-shadow-lg">{t('hello')}, {user.name}! 👋</h2>
        <p className="text-blue-100 text-lg relative z-10">{t('keepTraining')} 🚀</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          className="glass-card p-7 bg-gradient-to-br from-yellow-50 to-amber-100 border-4 border-yellow-300 rounded-3xl shadow-2xl card-hover relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 text-3xl animate-sparkle opacity-50">💰</div>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-4 rounded-2xl shadow-lg animate-pulse-glow">
              <Coins className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm text-yellow-700 font-medium">{t('yourPoints')}</p>
              <p className="text-4xl font-bold text-gradient-playful">{userPoints}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card p-7 bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-300 rounded-3xl shadow-xl card-hover"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl animate-bounce-slow">🎯</div>
            <div>
              <p className="text-sm text-blue-700 font-medium">{t('totalExercises')}</p>
              <p className="text-3xl font-bold text-blue-900">{totalExercises}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card p-7 bg-gradient-to-br from-purple-50 to-purple-100 border-4 border-purple-300 rounded-3xl shadow-xl card-hover"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl animate-wiggle">🏆</div>
            <div>
              <p className="text-sm text-purple-700 font-medium">{t('schulteTables')}</p>
              <p className="text-3xl font-bold text-purple-900">{schulteResults.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card p-7 bg-gradient-to-br from-indigo-50 to-indigo-100 border-4 border-indigo-300 rounded-3xl shadow-xl card-hover"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl animate-float">📚</div>
            <div>
              <p className="text-sm text-indigo-700 font-medium">{t('readingSessions')}</p>
              <p className="text-3xl font-bold text-indigo-900">{readingResults.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card p-7 bg-gradient-to-br from-cyan-50 to-cyan-100 border-4 border-cyan-300 rounded-3xl shadow-xl card-hover"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl animate-bounce-slow animation-delay-1000">🧠</div>
            <div>
              <p className="text-sm text-cyan-700 font-medium">{t('memoryGames')}</p>
              <p className="text-3xl font-bold text-cyan-900">{memoryResults.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card p-7 bg-gradient-to-br from-sky-50 to-sky-100 border-4 border-sky-300 rounded-3xl shadow-xl card-hover"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl animate-wiggle animation-delay-2000">🧮</div>
            <div>
              <p className="text-sm text-sky-700 font-medium">{t('mentalMathSessions')}</p>
              <p className="text-3xl font-bold text-sky-900">{mentalMathResults.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card p-7 bg-gradient-to-br from-emerald-50 to-emerald-100 border-4 border-emerald-300 rounded-3xl shadow-xl card-hover"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl animate-float animation-delay-1000">🌳</div>
            <div>
              <p className="text-sm text-emerald-700 font-medium">{t('mazeSessions')}</p>
              <p className="text-3xl font-bold text-emerald-900">{mazeResults.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card p-7 bg-gradient-to-br from-violet-50 to-violet-100 border-4 border-violet-300 rounded-3xl shadow-xl card-hover"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl animate-sparkle">✖️</div>
            <div>
              <p className="text-sm text-violet-700 font-medium">{t('multiplicationSessions')}</p>
              <p className="text-3xl font-bold text-violet-900">{multiplicationResults.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {diagnosticResults.length > 0 && (
        <Card className="glass-card p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-4 border-purple-300 rounded-3xl shadow-2xl card-hover">
          <h3 className="mb-6 flex items-center gap-3 text-gradient-playful text-2xl">
            <span className="text-3xl animate-bounce-slow">🔍</span>
            {t('diagnosticTrainer')} - {t('recentResults')}
          </h3>
          <div className="space-y-3">
            {diagnosticResults.slice(-5).reverse().map((result) => (
              <div key={result.id} className="p-4 bg-white rounded-2xl shadow-md border-2 border-purple-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${result.overallScore >= 80 ? 'bg-green-500' : result.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold">{result.overallScore}%</span>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(result.date)}
                  </span>
                </div>
                <div className="flex gap-2 text-sm text-gray-700 pl-6 flex-wrap">
                  <span className="flex items-center gap-1.5 bg-pink-50 px-3 py-1 rounded-lg">
                    <Brain className="w-4 h-4 text-pink-600" />
                    <span className="text-pink-900">{result.memoryScore}%</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-lg">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-900">{result.concentrationScore}%</span>
                    {result.concentrationTime && (
                      <span className="text-xs text-blue-700">({result.concentrationTime}s)</span>
                    )}
                  </span>
                  <span className="flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-lg">
                    <BookOpen className="w-4 h-4 text-green-600" />
                    <span className="text-green-900">{result.wpm} WPM</span>
                  </span>
                  {result.comprehensionScore !== undefined && (
                    <span className="flex items-center gap-1.5 bg-purple-50 px-3 py-1 rounded-lg">
                      <Target className="w-4 h-4 text-purple-600" />
                      <span className="text-purple-900">{result.comprehensionScore}%</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {concentrationResults.length > 0 && (
        <Card className="glass-card p-8 bg-gradient-to-br from-cyan-50 to-cyan-100 border-4 border-cyan-300 rounded-3xl shadow-2xl card-hover">
          <h3 className="mb-6 flex items-center gap-3 text-gradient-blue text-2xl">
            <span className="text-3xl animate-wiggle">🎯</span>
            {t('concentrationTrainer')} - {t('recentResults')}
          </h3>
          <div className="space-y-3">
            {concentrationResults.slice(-5).reverse().map((result) => (
              <div key={result.id} className="p-4 bg-white rounded-2xl shadow-md border-2 border-cyan-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${result.accuracy >= 80 ? 'bg-green-500' : result.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-cyan-600" />
                      <span className="font-semibold">{result.score} {t('points')}</span>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(result.date)}
                  </span>
                </div>
                <div className="flex gap-2 text-sm text-gray-700 pl-6 flex-wrap">
                  <span className="flex items-center gap-1.5 bg-cyan-50 px-3 py-1 rounded-lg">
                    <Target className="w-4 h-4 text-cyan-600" />
                    <span className="text-cyan-900">{result.accuracy}%</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-green-900">{result.correct} / {result.correct + result.incorrect}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-lg">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-900">{t(result.mode)}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-purple-50 px-3 py-1 rounded-lg">
                    <Gauge className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-900">{t(result.difficulty)}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {schulteResults.length > 0 && (
        <Card className="glass-card p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-300 rounded-3xl shadow-2xl card-hover">
          <h3 className="mb-6 flex items-center gap-3 text-gradient-blue text-2xl">
            <span className="text-3xl animate-sparkle">🏆</span>
            {t('schulteTable')} - {t('recentResults')}
          </h3>
          <div className="space-y-3">
            {schulteResults.slice(-5).reverse().map((result) => (
              <div key={result.id} className="p-4 bg-white rounded-2xl shadow-md border-2 border-blue-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${result.time < 30000 ? 'bg-green-500' : result.time < 60000 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">{formatTime(result.time)}</span>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(result.date)}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-gray-700 pl-6">
                  <span className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-lg">
                    <Grid3x3 className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-900">{result.size}×{result.size}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-purple-50 px-3 py-1 rounded-lg">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-900">{result.mode === 'speed' ? t('speed') : t('understanding')}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {numbersResults.length > 0 && (
        <Card className="glass-card p-8 bg-gradient-to-br from-orange-50 to-orange-100 border-4 border-orange-300 rounded-3xl shadow-2xl card-hover">
          <h3 className="mb-6 flex items-center gap-3 text-2xl">
            <span className="text-3xl">🎯</span>
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              {t('numbersTrainer')} - {t('recentResults')}
            </span>
          </h3>
          <div className="space-y-3">
            {numbersResults.slice(-5).reverse().map((result) => (
              <div key={result.id} className="p-4 bg-white rounded-2xl shadow-md border-2 border-orange-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${result.time < 60000 ? 'bg-green-500' : result.time < 120000 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <span className="font-semibold">{formatTime(result.time)}</span>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(result.date)}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-gray-700 pl-6">
                  <span className="flex items-center gap-1.5 bg-orange-50 px-3 py-1 rounded-lg">
                    <Target className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-900">{t('range')}: {result.range}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {readingResults.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-300 rounded-3xl shadow-xl">
          <h3 className="mb-4 flex items-center gap-2 text-blue-900">
            <span className="text-2xl">📚</span>
            {t('readingTrainer')} - {t('recentResults')}
          </h3>
          <div className="space-y-3">
            {readingResults.slice(-5).reverse().map((result) => {
              const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
              return (
                <div key={result.id} className="p-4 bg-white rounded-2xl shadow-md border-2 border-blue-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${result.correctAnswers === result.totalQuestions ? 'bg-green-500' : result.correctAnswers >= result.totalQuestions / 2 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold">{result.correctAnswers}/{result.totalQuestions} ({percentage}%)</span>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(result.date)}
                    </span>
                  </div>
                  <div className="flex gap-2 text-sm text-gray-700 pl-6 flex-wrap">
                    <span className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-lg">
                      <Book className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-900">{result.difficulty}</span>
                    </span>
                    <span className="flex items-center gap-1.5 bg-purple-50 px-3 py-1 rounded-lg">
                      <Eye className="w-4 h-4 text-purple-600" />
                      <span className="text-purple-900">{result.mode}</span>
                    </span>
                    <span className="flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-lg">
                      <Gauge className="w-4 h-4 text-green-600" />
                      <span className="text-green-900">{result.wpm} WPM</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {memoryResults.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-teal-50 to-teal-100 border-4 border-teal-300 rounded-3xl shadow-xl">
          <h3 className="mb-4 flex items-center gap-2 text-teal-900">
            <span className="text-2xl">🧠</span>
            {t('memoryTrainer')} - {t('recentResults')}
          </h3>
          <div className="space-y-3">
            {memoryResults.slice(-5).reverse().map((result) => (
              <div key={result.id} className="p-4 bg-white rounded-2xl shadow-md border-2 border-teal-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${result.score > 50 ? 'bg-green-500' : result.score > 20 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-teal-600" />
                      <span className="font-semibold">{t('score')}: {result.score}</span>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(result.date)}
                  </span>
                </div>
                <div className="flex gap-2 text-sm text-gray-700 pl-6 flex-wrap">
                  <span className="flex items-center gap-1.5 bg-teal-50 px-3 py-1 rounded-lg">
                    <Target className="w-4 h-4 text-teal-600" />
                    <span className="text-teal-900">{t('level')} {result.level}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-lg">
                    <Brain className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-900">{result.sequenceLength} {language === 'ru' ? 'элементов' : language === 'kz' ? 'элемент' : 'items'}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-purple-50 px-3 py-1 rounded-lg">
                    <Timer className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-900">{result.displayTime}s</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {mentalMathResults.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-300 rounded-3xl shadow-xl">
          <h3 className="mb-4 flex items-center gap-2 text-blue-900">
            <span className="text-2xl">🧮</span>
            {t('mentalMath')} - {t('recentResults')}
          </h3>
          <div className="space-y-3">
            {mentalMathResults.slice(-5).reverse().map((result) => {
              const percentage = Math.round((result.correctAnswers / result.totalProblems) * 100);
              return (
                <div key={result.id} className="p-4 bg-white rounded-2xl shadow-md border-2 border-blue-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${percentage >= 90 ? 'bg-green-500' : percentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold">{result.correctAnswers}/{result.totalProblems} ({percentage}%)</span>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(result.date)}
                    </span>
                  </div>
                  <div className="flex gap-2 text-sm text-gray-700 pl-6 flex-wrap">
                    <span className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-lg">
                      <Calculator className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-900">{result.digits} {language === 'ru' ? result.digits === 1 ? 'разряд' : 'разряда' : language === 'kz' ? 'разряд' : result.digits === 1 ? 'digit' : 'digits'}</span>
                    </span>
                    <span className="flex items-center gap-1.5 bg-purple-50 px-3 py-1 rounded-lg">
                      <Target className="w-4 h-4 text-purple-600" />
                      <span className="text-purple-900">{result.difficulty === 'easy' ? t('easy') : result.difficulty === 'hard' ? t('hard') : t('mixed')}</span>
                    </span>
                    <span className="flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-lg">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-green-900">{formatTime(result.time)}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {mazeResults.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-4 border-green-300 rounded-3xl shadow-xl">
          <h3 className="mb-4 flex items-center gap-2 text-green-900">
            <span className="text-2xl">🌳</span>
            {t('mazeTrainer')} - {t('recentResults')}
          </h3>
          <div className="space-y-3">
            {mazeResults.slice(-5).reverse().map((result) => (
              <div key={result.id} className="p-4 bg-white rounded-2xl shadow-md border-2 border-green-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${result.time < 60 ? 'bg-green-500' : result.time < 120 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span className="font-semibold">{Math.floor(result.time / 60)}:{(result.time % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(result.date)}
                  </span>
                </div>
                <div className="flex gap-2 text-sm text-gray-700 pl-6 flex-wrap">
                  <span className="flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-lg">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="text-green-900">
                      {result.difficulty <= 2 ? '🟢' : result.difficulty <= 5 ? '🟡' : result.difficulty <= 7 ? '🟠' : '🔴'} 
                      {' '}{t('level')} {result.difficulty}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-orange-50 px-3 py-1 rounded-lg">
                    <Waypoints className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-900">{result.moves} {t('moves')}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {multiplicationResults.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 border-4 border-indigo-300 rounded-3xl shadow-xl">
          <h3 className="mb-4 flex items-center gap-2 text-indigo-900">
            <span className="text-2xl">✖️</span>
            {t('multiplicationTrainer')} - {t('recentResults')}
          </h3>
          <div className="space-y-3">
            {multiplicationResults.slice(-5).reverse().map((result) => (
              <div key={result.id} className="p-4 bg-white rounded-2xl shadow-md border-2 border-indigo-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${(result.correctAnswers / result.totalProblems) >= 0.9 ? 'bg-green-500' : (result.correctAnswers / result.totalProblems) >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    <div className="flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-indigo-600" />
                      <span className="font-semibold">
                        {result.mode === 'single' ? `${t('table')} ${result.table}` : t('mixedTables')}
                      </span>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(result.date)}
                  </span>
                </div>
                <div className="flex gap-2 text-sm text-gray-700 pl-6 flex-wrap">
                  <span className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1 rounded-lg">
                    <Target className="w-4 h-4 text-indigo-600" />
                    <span className="text-indigo-900">{result.correctAnswers}/{result.totalProblems} {t('correct')}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-purple-50 px-3 py-1 rounded-lg">
                    <Trophy className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-900">{Math.round((result.correctAnswers / result.totalProblems) * 100)}%</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-lg">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-900">{result.time}s</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {totalExercises === 0 && (
        <Card className="p-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-4 border-blue-300 rounded-3xl shadow-xl text-center">
          <div className="max-w-md mx-auto">
            <div className="text-8xl mb-4">🎯</div>
            <h3 className="text-blue-700 mb-2">{t('noResults')}</h3>
            <p className="text-blue-600">{t('startTraining')}</p>
          </div>
        </Card>
      )}
    </div>
  );
}
