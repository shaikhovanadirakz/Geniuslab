import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { User } from '../utils/storage';
import { Language, getTranslation } from '../utils/translations';
import { 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Star, 
  Play, 
  Volume2, 
  Award, 
  ArrowLeft, 
  Sparkles,
  Trophy,
  Target,
  MessageCircle,
  GraduationCap,
  Zap,
  Book,
  PenTool,
  Dumbbell
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { WORDS_BY_LEVEL, getCategoriesForLevel, getWordsByCategory, Word as DBWord } from './english-full-database';
import { GRAMMAR_TOPICS_FULL } from './english-grammar-full';

interface EnglishTrainerProps {
  user: User;
  language: Language;
}

type Mode = 'level-select' | 'main-menu' | 'grammar-topics' | 'grammar-lesson' | 'grammar-test' | 'vocabulary-topics' | 'vocabulary-learn' | 'vocabulary-practice' | 'exercises' | 'practice' | 'conversation';
type Level = 'beginner' | 'elementary' | 'pre-intermediate' | 'intermediate' | 'upper-intermediate';

interface Word {
  english: string;
  russian: string;
  kazakh: string;
  category: string;
  level: Level;
}

interface GrammarTopic {
  id: string;
  title: { ru: string; kz: string };
  level: Level;
  description: { ru: string; kz: string };
  content: {
    introduction: { ru: string; kz: string };
    rules: Array<{ ru: string; kz: string }>;
    examples: Array<{ english: string; ru: string; kz: string }>;
    tips: Array<{ ru: string; kz: string }>;
  };
  testQuestions: Array<{
    question: { ru: string; kz: string };
    options: string[];
    correctAnswer: number;
    explanation: { ru: string; kz: string };
  }>;
}

interface ConversationPhrase {
  english: string;
  russian: string;
  kazakh: string;
  situation: string;
  level: Level;
}

// Переводы названий уровней
const LEVEL_NAMES = {
  beginner: {
    ru: 'Начальный',
    kz: 'Бастапқы',
    icon: '🌱',
    color: 'green'
  },
  elementary: {
    ru: 'Элементарный',
    kz: 'Элементарлы',
    icon: '🌿',
    color: 'blue'
  },
  'pre-intermediate': {
    ru: 'Ниже среднего',
    kz: 'Орташадан төмен',
    icon: '🌳',
    color: 'purple'
  },
  intermediate: {
    ru: 'Средний',
    kz: 'Орташа',
    icon: '🌲',
    color: 'indigo'
  },
  'upper-intermediate': {
    ru: 'Выше среднего',
    kz: 'Орташадан жоғары',
    icon: '🎓',
    color: 'violet'
  }
};

export function EnglishTrainer({ user, language }: EnglishTrainerProps) {
  const [mode, setMode] = useState<Mode>('level-select');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedGrammarTopic, setSelectedGrammarTopic] = useState<GrammarTopic | null>(null);
  const [testAnswers, setTestAnswers] = useState<(number | null)[]>([]);
  const [showTestResults, setShowTestResults] = useState(false);
  const [currentTestQuestion, setCurrentTestQuestion] = useState(0);
  const [selectedVocabCategory, setSelectedVocabCategory] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [learnedWords, setLearnedWords] = useState<Set<string>>(new Set());
  const [practiceScore, setPracticeScore] = useState(0);
  const [practiceTotal, setPracticeTotal] = useState(0);

  // Озвучивание текста на английском
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Экран выбора уровня (первый экран)
  if (mode === 'level-select') {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-4 border-blue-300 rounded-3xl shadow-2xl">
            <div className="text-center space-y-4">
              <div className="text-6xl">🇬🇧</div>
              <h2 className="text-4xl text-blue-900">
                {language === 'ru' ? 'Английский язык' : 'Ағылшын тілі'}
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                {language === 'ru' 
                  ? 'Выбери свой уровень английского языка' 
                  : 'Ағылшын тілінің деңгейін таңда'}
              </p>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(LEVEL_NAMES) as Level[]).map((level, idx) => {
            const levelInfo = LEVEL_NAMES[level];
            const grammarCount = GRAMMAR_TOPICS_FULL.filter(t => t.level === level).length;
            
            return (
              <motion.div
                key={level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  onClick={() => {
                    setSelectedLevel(level);
                    setMode('main-menu');
                  }}
                  className={`p-6 bg-gradient-to-br from-${levelInfo.color}-50 to-${levelInfo.color}-100 border-4 border-${levelInfo.color}-300 rounded-2xl shadow-lg cursor-pointer hover:shadow-2xl transition-all`}
                  style={{
                    background: `linear-gradient(to bottom right, ${
                      levelInfo.color === 'green' ? '#f0fdf4' : 
                      levelInfo.color === 'blue' ? '#eff6ff' : 
                      levelInfo.color === 'purple' ? '#faf5ff' : 
                      levelInfo.color === 'indigo' ? '#eef2ff' : '#faf5ff'
                    }, ${
                      levelInfo.color === 'green' ? '#dcfce7' : 
                      levelInfo.color === 'blue' ? '#dbeafe' : 
                      levelInfo.color === 'purple' ? '#f3e8ff' : 
                      levelInfo.color === 'indigo' ? '#e0e7ff' : '#f3e8ff'
                    })`,
                    borderColor: levelInfo.color === 'green' ? '#86efac' : 
                                levelInfo.color === 'blue' ? '#93c5fd' : 
                                levelInfo.color === 'purple' ? '#d8b4fe' : 
                                levelInfo.color === 'indigo' ? '#a5b4fc' : '#d8b4fe'
                  }}
                >
                  <div className="text-center space-y-3">
                    <div className="text-5xl">{levelInfo.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {levelInfo[language]}
                    </h3>
                    <p className="text-sm text-gray-600 uppercase tracking-wide">
                      {level.replace('-', ' ')}
                    </p>
                    <Badge className={`bg-${levelInfo.color}-500 text-white`}>
                      {grammarCount} {language === 'ru' ? 'тем грамматики' : 'грамматика тақырыптары'}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Главное меню после выбора уровня
  if (mode === 'main-menu' && selectedLevel) {
    const levelInfo = LEVEL_NAMES[selectedLevel];
    
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="p-6 bg-gradient-to-br from-white to-blue-50 border-4 border-blue-200 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => {
                setSelectedLevel(null);
                setMode('level-select');
              }}
              variant="outline"
              className="border-2 border-blue-400 text-blue-700 hover:bg-blue-100 rounded-xl px-4 py-2"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {language === 'ru' ? 'Сменить уровень' : 'Деңгейді өзгерту'}
            </Button>
            <Badge className="text-lg px-6 py-3 flex items-center gap-2" style={{
              backgroundColor: levelInfo.color === 'green' ? '#22c55e' : 
                              levelInfo.color === 'blue' ? '#3b82f6' : 
                              levelInfo.color === 'purple' ? '#a855f7' : 
                              levelInfo.color === 'indigo' ? '#6366f1' : '#a855f7'
            }}>
              <span>{levelInfo.icon}</span>
              <span className="text-white">{levelInfo[language]}</span>
            </Badge>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Грамматика */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              onClick={() => setMode('grammar-topics')}
              className="p-8 bg-gradient-to-br from-orange-50 to-orange-100 border-4 border-orange-300 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-all h-full"
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">✍️</div>
                <h3 className="text-2xl text-orange-900">
                  {language === 'ru' ? 'Грамматика' : 'Грамматика'}
                </h3>
                <p className="text-gray-700">
                  {language === 'ru' 
                    ? 'Понятные правила с примерами' 
                    : 'Мысалдармен түсінікті ережелер'}
                </p>
                <Badge className="bg-orange-500 text-white">
                  {GRAMMAR_TOPICS_FULL.filter(t => t.level === selectedLevel).length} {language === 'ru' ? 'тем' : 'тақырып'}
                </Badge>
              </div>
            </Card>
          </motion.div>

          {/* Словарный запас */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              onClick={() => setMode('vocabulary-topics')}
              className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-4 border-purple-300 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-all h-full"
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">📚</div>
                <h3 className="text-2xl text-purple-900">
                  {language === 'ru' ? 'Словарный запас' : 'Сөздік қоры'}
                </h3>
                <p className="text-gray-700">
                  {language === 'ru' 
                    ? 'Учи новые слова по темам' 
                    : 'Тақырыптар бойынша жаңа сөздерді үйрен'}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Упражнения */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              onClick={() => toast.info(language === 'ru' ? 'Скоро будет доступно!' : 'Жақында қолжетімді болады!')}
              className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-300 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-all h-full"
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">📝</div>
                <h3 className="text-2xl text-blue-900">
                  {language === 'ru' ? 'Упражнения' : 'Жаттығулар'}
                </h3>
                <p className="text-gray-700">
                  {language === 'ru' 
                    ? 'Практические задания' 
                    : 'Практикалық тапсырмалар'}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Практика */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              onClick={() => toast.info(language === 'ru' ? 'Скоро будет доступно!' : 'Жақында қолжетімді болады!')}
              className="p-8 bg-gradient-to-br from-pink-50 to-pink-100 border-4 border-pink-300 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-all h-full"
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">💪</div>
                <h3 className="text-2xl text-pink-900">
                  {language === 'ru' ? 'Практика' : 'Практика'}
                </h3>
                <p className="text-gray-700">
                  {language === 'ru' 
                    ? 'Интерактивные игры' 
                    : 'Интерактивті ойындар'}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Разговорный */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              onClick={() => toast.info(language === 'ru' ? 'Скоро будет доступно!' : 'Жақында қолжетімді болады!')}
              className="p-8 bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-300 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-all h-full"
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">💬</div>
                <h3 className="text-2xl text-green-900">
                  {language === 'ru' ? 'Разговорный' : 'Сөйлеу'}
                </h3>
                <p className="text-gray-700">
                  {language === 'ru' 
                    ? 'Полезные фразы' 
                    : 'Пайдалы тіркестер'}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Список тем грамматики
  if (mode === 'grammar-topics' && selectedLevel) {
    const topics = GRAMMAR_TOPICS_FULL.filter(t => t.level === selectedLevel);
    const levelInfo = LEVEL_NAMES[selectedLevel];

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-yellow-100 border-4 border-orange-300 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => setMode('main-menu')}
              variant="outline"
              className="border-2 border-orange-400 text-orange-700 hover:bg-orange-100 rounded-xl px-4 py-2"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {language === 'ru' ? 'Назад' : 'Артқа'}
            </Button>
            <Badge className="text-lg px-6 py-3" style={{
              backgroundColor: levelInfo.color === 'green' ? '#22c55e' : 
                              levelInfo.color === 'blue' ? '#3b82f6' : 
                              levelInfo.color === 'purple' ? '#a855f7' : 
                              levelInfo.color === 'indigo' ? '#6366f1' : '#a855f7'
            }}>
              <span className="text-white">{levelInfo[language]}</span>
            </Badge>
          </div>

          <div className="text-center space-y-4 mb-8">
            <div className="text-6xl">✍️</div>
            <h2 className="text-3xl text-orange-900">
              {language === 'ru' ? 'Темы грамматики' : 'Грамматика тақырыптары'}
            </h2>
          </div>

          <div className="space-y-4">
            {topics.map((topic, idx) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  onClick={() => {
                    setSelectedGrammarTopic(topic);
                    setMode('grammar-lesson');
                  }}
                  className="p-6 bg-gradient-to-br from-white to-orange-50 border-4 border-orange-200 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl text-orange-900 mb-2">
                        {topic.title[language]}
                      </h3>
                      <p className="text-gray-700">
                        {topic.description[language]}
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="text-4xl">📖</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // Урок грамматики
  if (mode === 'grammar-lesson' && selectedGrammarTopic) {
    const topic = selectedGrammarTopic;
    
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="p-8 bg-gradient-to-br from-orange-50 to-yellow-100 border-4 border-orange-300 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button
                onClick={() => {
                  setSelectedGrammarTopic(null);
                  setMode('grammar-topics');
                }}
                variant="outline"
                className="border-2 border-orange-400 text-orange-700 hover:bg-orange-100 rounded-xl px-4 py-2"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {language === 'ru' ? 'К темам' : 'Тақырыптарға'}
              </Button>
            </div>

            {/* Title */}
            <div className="text-center space-y-3">
              <div className="text-6xl">📖</div>
              <h2 className="text-3xl text-orange-900">
                {topic.title[language]}
              </h2>
              <p className="text-xl text-gray-700">
                {topic.description[language]}
              </p>
            </div>

            {/* Introduction */}
            <Card className="p-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-4 border-yellow-300 rounded-2xl">
              <p className="text-lg text-gray-800 leading-relaxed">
                {topic.content.introduction[language]}
              </p>
            </Card>

            {/* Rules */}
            <div className="space-y-3">
              <h3 className="text-2xl text-orange-900 flex items-center gap-2">
                <Book className="w-6 h-6" />
                {language === 'ru' ? 'Правила' : 'Ережелер'}
              </h3>
              {topic.content.rules.map((rule, idx) => (
                <Card key={idx} className="p-4 bg-white border-2 border-orange-200 rounded-xl">
                  <p className="text-lg text-gray-800">{rule[language]}</p>
                </Card>
              ))}
            </div>

            {/* Examples */}
            <div className="space-y-3">
              <h3 className="text-2xl text-orange-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                {language === 'ru' ? 'Примеры' : 'Мысалдар'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {topic.content.examples.map((example, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.03 }}
                    className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-xl border-2 border-green-300 shadow-sm cursor-pointer"
                    onClick={() => speak(example.english)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-lg font-bold text-green-900 mb-1">
                          {example.english}
                        </div>
                        <div className="text-md text-gray-700">
                          {example[language]}
                        </div>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(example.english);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 ml-2"
                        size="sm"
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="space-y-3">
              <h3 className="text-2xl text-orange-900 flex items-center gap-2">
                <Star className="w-6 h-6" />
                {language === 'ru' ? 'Полезные советы' : 'Пайдалы кеңестер'}
              </h3>
              {topic.content.tips.map((tip, idx) => (
                <Card key={idx} className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300 rounded-xl">
                  <p className="text-lg text-gray-800">{tip[language]}</p>
                </Card>
              ))}
            </div>

            {/* Test Button */}
            <div className="text-center pt-6">
              <Button
                onClick={() => {
                  setCurrentTestQuestion(0);
                  setTestAnswers(new Array(topic.testQuestions.length).fill(null));
                  setShowTestResults(false);
                  setMode('grammar-test');
                }}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-6 rounded-2xl shadow-lg text-xl"
              >
                <Target className="w-6 h-6 mr-2" />
                {language === 'ru' ? 'Пройти тест' : 'Тестті тапсыру'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Тест по грамматике
  if (mode === 'grammar-test' && selectedGrammarTopic) {
    const topic = selectedGrammarTopic;
    const currentQ = topic.testQuestions[currentTestQuestion];
    const isLastQuestion = currentTestQuestion === topic.testQuestions.length - 1;

    if (showTestResults) {
      const correctCount = testAnswers.filter((answer, idx) => 
        answer === topic.testQuestions[idx].correctAnswer
      ).length;
      const percentage = Math.round((correctCount / topic.testQuestions.length) * 100);

      return (
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-100 border-4 border-purple-300 rounded-3xl shadow-2xl">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="text-7xl">
                  {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
                </div>
                <h2 className="text-3xl text-purple-900">
                  {language === 'ru' ? 'Результаты теста' : 'Тест нәтижелері'}
                </h2>
                <div className="text-6xl font-bold text-purple-900">
                  {correctCount} / {topic.testQuestions.length}
                </div>
                <p className="text-2xl text-gray-700">
                  {percentage}% {language === 'ru' ? 'правильных ответов' : 'дұрыс жауап'}
                </p>
              </div>

              {/* Ответы с пояснениями */}
              <div className="space-y-4">
                {topic.testQuestions.map((q, idx) => {
                  const userAnswer = testAnswers[idx];
                  const isCorrect = userAnswer === q.correctAnswer;

                  return (
                    <Card 
                      key={idx}
                      className={`p-4 border-4 rounded-2xl ${
                        isCorrect 
                          ? 'bg-green-50 border-green-300' 
                          : 'bg-red-50 border-red-300'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          {isCorrect ? (
                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                          )}
                          <div className="flex-1">
                            <p className="text-lg font-semibold text-gray-900 mb-2">
                              {q.question[language]}
                            </p>
                            <p className="text-md text-gray-700">
                              {language === 'ru' ? 'Ваш ответ:' : 'Сіздің жауабыңыз:'} <strong>{q.options[userAnswer!]}</strong>
                            </p>
                            {!isCorrect && (
                              <p className="text-md text-gray-700">
                                {language === 'ru' ? 'Правильный ответ:' : 'Дұрыс жауап:'} <strong>{q.options[q.correctAnswer]}</strong>
                              </p>
                            )}
                            <p className="text-sm text-gray-600 mt-2 italic">
                              {q.explanation[language]}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => {
                    setShowTestResults(false);
                    setCurrentTestQuestion(0);
                    setTestAnswers(new Array(topic.testQuestions.length).fill(null));
                  }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-2xl shadow-lg"
                >
                  {language === 'ru' ? 'Пройти снова' : 'Қайталау'}
                </Button>
                <Button
                  onClick={() => {
                    setSelectedGrammarTopic(null);
                    setMode('grammar-topics');
                  }}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-4 rounded-2xl shadow-lg"
                >
                  {language === 'ru' ? 'К темам' : 'Тақырыптарға'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-100 border-4 border-purple-300 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-purple-900">
                <span>{language === 'ru' ? 'Вопрос' : 'Сұрақ'} {currentTestQuestion + 1} / {topic.testQuestions.length}</span>
                <span>{Math.round(((currentTestQuestion + 1) / topic.testQuestions.length) * 100)}%</span>
              </div>
              <Progress value={((currentTestQuestion + 1) / topic.testQuestions.length) * 100} className="h-3" />
            </div>

            {/* Question */}
            <div className="text-center space-y-4">
              <div className="text-5xl">❓</div>
              <h3 className="text-2xl text-purple-900">
                {currentQ.question[language]}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => {
                      const newAnswers = [...testAnswers];
                      newAnswers[currentTestQuestion] = idx;
                      setTestAnswers(newAnswers);
                      
                      setTimeout(() => {
                        if (isLastQuestion) {
                          setShowTestResults(true);
                        } else {
                          setCurrentTestQuestion(currentTestQuestion + 1);
                        }
                      }, 500);
                    }}
                    className={`w-full p-6 text-lg rounded-2xl border-4 ${
                      testAnswers[currentTestQuestion] === idx
                        ? 'bg-purple-500 text-white border-purple-600'
                        : 'bg-white text-purple-900 border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    {option}
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Back button */}
            <div className="text-center">
              <Button
                onClick={() => {
                  setMode('grammar-lesson');
                }}
                variant="outline"
                className="border-2 border-purple-400 text-purple-700 hover:bg-purple-100 rounded-xl px-4 py-2"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {language === 'ru' ? 'К уроку' : 'Сабаққа'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Список категорий словарного запаса
  if (mode === 'vocabulary-topics' && selectedLevel) {
    const categories = getCategoriesForLevel(selectedLevel);
    const levelInfo = LEVEL_NAMES[selectedLevel];

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-100 border-4 border-purple-300 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => setMode('main-menu')}
              variant="outline"
              className="border-2 border-purple-400 text-purple-700 hover:bg-purple-100 rounded-xl px-4 py-2"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {language === 'ru' ? 'Назад' : 'Артқа'}
            </Button>
            <Badge className="text-lg px-6 py-3" style={{
              backgroundColor: levelInfo.color === 'green' ? '#22c55e' : 
                              levelInfo.color === 'blue' ? '#3b82f6' : 
                              levelInfo.color === 'purple' ? '#a855f7' : 
                              levelInfo.color === 'indigo' ? '#6366f1' : '#a855f7'
            }}>
              <span className="text-white">{levelInfo[language]}</span>
            </Badge>
          </div>

          <div className="text-center space-y-4 mb-8">
            <div className="text-6xl">📚</div>
            <h2 className="text-3xl text-purple-900">
              {language === 'ru' ? 'Категории словарного запаса' : 'Сөздік қоры категориялары'}
            </h2>
          </div>

          <div className="space-y-4">
            {categories.map((category, idx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  onClick={() => {
                    setSelectedVocabCategory(category);
                    setMode('vocabulary-learn');
                  }}
                  className="p-6 bg-gradient-to-br from-white to-purple-50 border-4 border-purple-200 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl text-purple-900 mb-2">
                        {category}
                      </h3>
                      <p className="text-gray-700">
                        {language === 'ru' ? 'Учим новые слова' : 'Жаңа сөздерді үйрен'}
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="text-4xl">📖</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // Изучение слов
  if (mode === 'vocabulary-learn' && selectedLevel && selectedVocabCategory) {
    const words = getWordsByCategory(selectedLevel, selectedVocabCategory);
    
    // Проверка на пустой массив или некорректный индекс
    if (!words || words.length === 0) {
      return (
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-100 border-4 border-purple-300 rounded-3xl shadow-2xl">
            <div className="text-center space-y-6">
              <div className="text-6xl">📚</div>
              <h2 className="text-2xl text-purple-900">
                {language === 'ru' ? 'Слова еще не добавлены' : 'Сөздер әлі қосылмаған'}
              </h2>
              <Button
                onClick={() => setMode('vocabulary-topics')}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-4 rounded-2xl"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {language === 'ru' ? 'Назад' : 'Артқа'}
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    const currentWord = words[currentWordIndex];
    
    // Проверка на существование текущего слова
    if (!currentWord) {
      setCurrentWordIndex(0);
      return null;
    }

    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-100 border-4 border-purple-300 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button
                onClick={() => {
                  setSelectedVocabCategory(null);
                  setCurrentWordIndex(0);
                  setMode('vocabulary-topics');
                }}
                variant="outline"
                className="border-2 border-purple-400 text-purple-700 hover:bg-purple-100 rounded-xl px-4 py-2"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {language === 'ru' ? 'К категориям' : 'Санаттарға'}
              </Button>
              <Badge className="text-lg px-6 py-3 bg-purple-500 text-white">
                {selectedVocabCategory}
              </Badge>
            </div>

            {/* Progress */}
            <div className="text-center">
              <p className="text-lg text-purple-900 mb-2">
                {language === 'ru' ? 'Слово' : 'Сөз'} {currentWordIndex + 1} / {words.length}
              </p>
            </div>

            {/* Word */}
            <Card className="p-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-4 border-yellow-300 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {currentWord.english}
                  </div>
                  <div className="text-md text-gray-700">
                    {currentWord[language]}
                  </div>
                </div>
                <Button
                  onClick={() => speak(currentWord.english)}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 ml-2"
                  size="sm"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  if (currentWordIndex > 0) {
                    setCurrentWordIndex(currentWordIndex - 1);
                  }
                }}
                disabled={currentWordIndex === 0}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-2xl disabled:opacity-50"
              >
                {language === 'ru' ? '← Предыдущее' : '← Алдыңғы'}
              </Button>
              <Button
                onClick={() => {
                  if (currentWordIndex < words.length - 1) {
                    setCurrentWordIndex(currentWordIndex + 1);
                  }
                }}
                disabled={currentWordIndex === words.length - 1}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-2xl disabled:opacity-50"
              >
                {language === 'ru' ? 'Следующее →' : 'Келесі →'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}