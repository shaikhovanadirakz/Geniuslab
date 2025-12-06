import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { User } from '../utils/storage';
import { Language } from '../utils/translations';
import { 
  CheckCircle, 
  XCircle, 
  Star, 
  Volume2, 
  ArrowLeft, 
  Sparkles,
  Target,
  Book
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { BEGINNER_WORDS, getCategories, getWordsByCategory } from './english-beginner-database';
import { BEGINNER_GRAMMAR_TOPICS, GrammarTopic } from './english-beginner-grammar';

interface EnglishTrainerProps {
  user: User;
  language: Language;
}

type Mode = 'main-menu' | 'grammar-topics' | 'grammar-lesson' | 'grammar-test' | 'vocabulary-topics' | 'vocabulary-learn';

export function EnglishTrainer({ user, language }: EnglishTrainerProps) {
  const [mode, setMode] = useState<Mode>('main-menu');
  const [selectedGrammarTopic, setSelectedGrammarTopic] = useState<GrammarTopic | null>(null);
  const [testAnswers, setTestAnswers] = useState<(number | null)[]>([]);
  const [showTestResults, setShowTestResults] = useState(false);
  const [currentTestQuestion, setCurrentTestQuestion] = useState(0);
  const [selectedVocabCategory, setSelectedVocabCategory] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Озвучивание текста на английском
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Главное меню
  if (mode === 'main-menu') {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-4 border-blue-300 rounded-3xl shadow-2xl">
            <div className="text-center space-y-4">
              <div className="text-6xl">🇬🇧</div>
              <h2 className="text-4xl text-blue-900">
                {language === 'ru' ? 'Английский для начинающих' : 'Ағылшын тілі бастауыш деңгей'}
              </h2>
              <p className="text-xl text-gray-700">
                {language === 'ru' 
                  ? '300 слов + 15 грамматических тем' 
                  : '300 сөз + 15 грамматика тақырыптары'}
              </p>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Грамматика */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              onClick={() => setMode('grammar-topics')}
              className="p-8 bg-gradient-to-br from-orange-50 to-orange-100 border-4 border-orange-300 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-all h-full"
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">✍️</div>
                <h3 className="text-3xl text-orange-900">
                  {language === 'ru' ? 'Грамматика' : 'Грамматика'}
                </h3>
                <p className="text-xl text-gray-700">
                  {language === 'ru' 
                    ? 'Понятные правила с примерами' 
                    : 'Мысалдармен түсінікті ережелер'}
                </p>
                <Badge className="bg-orange-500 text-white text-lg px-4 py-2">
                  15 {language === 'ru' ? 'тем' : 'тақырып'}
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
                <h3 className="text-3xl text-purple-900">
                  {language === 'ru' ? 'Словарный запас' : 'Сөздік қоры'}
                </h3>
                <p className="text-xl text-gray-700">
                  {language === 'ru' 
                    ? 'Учи новые слова по темам' 
                    : 'Тақырыптар бойынша жаңа сөздерді үйрен'}
                </p>
                <Badge className="bg-purple-500 text-white text-lg px-4 py-2">
                  300 {language === 'ru' ? 'слов' : 'сөз'}
                </Badge>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Список тем грамматики
  if (mode === 'grammar-topics') {
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
          </div>

          <div className="text-center space-y-4 mb-8">
            <div className="text-6xl">✍️</div>
            <h2 className="text-3xl text-orange-900">
              {language === 'ru' ? 'Темы грамматики' : 'Грамматика тақырыптары'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BEGINNER_GRAMMAR_TOPICS.map((topic, idx) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  onClick={() => {
                    setSelectedGrammarTopic(topic);
                    setMode('grammar-lesson');
                  }}
                  className="p-6 bg-gradient-to-br from-white to-orange-50 border-4 border-orange-200 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all h-full"
                >
                  <div className="text-center space-y-3">
                    <div className="text-4xl">📖</div>
                    <h3 className="text-xl text-orange-900 font-bold">
                      {topic.title[language]}
                    </h3>
                    <p className="text-sm text-gray-700">
                      {topic.description[language]}
                    </p>
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

            <div className="text-center space-y-3">
              <div className="text-6xl">📖</div>
              <h2 className="text-3xl text-orange-900">{topic.title[language]}</h2>
              <p className="text-xl text-gray-700">{topic.description[language]}</p>
            </div>

            <Card className="p-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-4 border-yellow-300 rounded-2xl">
              <p className="text-lg text-gray-800 leading-relaxed">{topic.content.introduction[language]}</p>
            </Card>

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

            <div className="space-y-3">
              <h3 className="text-2xl text-orange-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                {language === 'ru' ? 'Примеры' : 'Мысалдар'}
              </h3>
              
              {/* Positive Examples */}
              {topic.content.examples.some(e => e.type === 'positive') && (
                <div className="space-y-2">
                  <h4 className="text-xl text-green-800 font-bold flex items-center gap-2">
                    ✅ {language === 'ru' ? 'Утвердительные предложения' : 'Болымды сөйлемдер'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {topic.content.examples.filter(e => e.type === 'positive').map((example, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.03 }}
                        className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-xl border-2 border-green-300 shadow-sm cursor-pointer"
                        onClick={() => speak(example.english)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-lg font-bold text-green-900 mb-1">{example.english}</div>
                            <div className="text-md text-gray-700">{example[language]}</div>
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
              )}

              {/* Negative Examples */}
              {topic.content.examples.some(e => e.type === 'negative') && (
                <div className="space-y-2">
                  <h4 className="text-xl text-red-800 font-bold flex items-center gap-2">
                    ❌ {language === 'ru' ? 'Отрицательные предложения' : 'Болымсыз сөйлемдер'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {topic.content.examples.filter(e => e.type === 'negative').map((example, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.03 }}
                        className="bg-gradient-to-r from-red-100 to-pink-100 p-4 rounded-xl border-2 border-red-300 shadow-sm cursor-pointer"
                        onClick={() => speak(example.english)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-lg font-bold text-red-900 mb-1">{example.english}</div>
                            <div className="text-md text-gray-700">{example[language]}</div>
                          </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              speak(example.english);
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 ml-2"
                            size="sm"
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Question Examples */}
              {topic.content.examples.some(e => e.type === 'question') && (
                <div className="space-y-2">
                  <h4 className="text-xl text-blue-800 font-bold flex items-center gap-2">
                    ❓ {language === 'ru' ? 'Вопросительные предложения' : 'Сұраулы сөйлемдер'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {topic.content.examples.filter(e => e.type === 'question').map((example, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.03 }}
                        className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-xl border-2 border-blue-300 shadow-sm cursor-pointer"
                        onClick={() => speak(example.english)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-lg font-bold text-blue-900 mb-1">{example.english}</div>
                            <div className="text-md text-gray-700">{example[language]}</div>
                          </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              speak(example.english);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 ml-2"
                            size="sm"
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
                <div className="text-7xl">{percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}</div>
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

              <div className="space-y-4">
                {topic.testQuestions.map((q, idx) => {
                  const userAnswer = testAnswers[idx];
                  const isCorrect = userAnswer === q.correctAnswer;

                  return (
                    <Card 
                      key={idx}
                      className={`p-4 border-4 rounded-2xl ${
                        isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
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
                            <p className="text-lg font-semibold text-gray-900 mb-2">{q.question[language]}</p>
                            <p className="text-md text-gray-700">
                              {language === 'ru' ? 'Ваш ответ:' : 'Сіздің жауабыңыз:'} <strong>{q.options[userAnswer!]}</strong>
                            </p>
                            {!isCorrect && (
                              <p className="text-md text-gray-700">
                                {language === 'ru' ? 'Правильный ответ:' : 'Дұрыс жауап:'} <strong>{q.options[q.correctAnswer]}</strong>
                              </p>
                            )}
                            <p className="text-sm text-gray-600 mt-2 italic">{q.explanation[language]}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

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
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-purple-900">
                <span>{language === 'ru' ? 'Вопрос' : 'Сұрақ'} {currentTestQuestion + 1} / {topic.testQuestions.length}</span>
                <span>{Math.round(((currentTestQuestion + 1) / topic.testQuestions.length) * 100)}%</span>
              </div>
              <Progress value={((currentTestQuestion + 1) / topic.testQuestions.length) * 100} className="h-3" />
            </div>

            <div className="text-center space-y-4">
              <div className="text-5xl">❓</div>
              <h3 className="text-2xl text-purple-900">{currentQ.question[language]}</h3>
            </div>

            <div className="space-y-3">
              {currentQ.options.map((option, idx) => (
                <motion.div key={idx} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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

            <div className="text-center">
              <Button
                onClick={() => setMode('grammar-lesson')}
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
  if (mode === 'vocabulary-topics') {
    const categories = getCategories();

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
          </div>

          <div className="text-center space-y-4 mb-8">
            <div className="text-6xl">📚</div>
            <h2 className="text-3xl text-purple-900">
              {language === 'ru' ? 'Категории слов' : 'Сөз категориялары'}
            </h2>
            <p className="text-lg text-gray-700">
              {language === 'ru' ? 'Всего 300 слов' : 'Барлығы 300 сөз'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, idx) => {
              const wordCount = getWordsByCategory(category).length;
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    onClick={() => {
                      setSelectedVocabCategory(category);
                      setCurrentWordIndex(0);
                      setMode('vocabulary-learn');
                    }}
                    className="p-6 bg-gradient-to-br from-white to-purple-50 border-4 border-purple-200 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all h-full"
                  >
                    <div className="text-center space-y-3">
                      <div className="text-4xl">📖</div>
                      <h3 className="text-xl text-purple-900 font-bold">{category}</h3>
                      <Badge className="bg-purple-500 text-white">
                        {wordCount} {language === 'ru' ? 'слов' : 'сөз'}
                      </Badge>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  // Изучение слов
  if (mode === 'vocabulary-learn' && selectedVocabCategory) {
    const words = getWordsByCategory(selectedVocabCategory);
    const currentWord = words[currentWordIndex];

    if (!currentWord) {
      return null;
    }

    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-100 border-4 border-purple-300 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                onClick={() => {
                  setSelectedVocabCategory(null);
                  setCurrentWordIndex(0);
                  setIsCardFlipped(false);
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

            <div className="text-center space-y-2">
              <p className="text-lg text-purple-900">
                {language === 'ru' ? 'Слово' : 'Сөз'} {currentWordIndex + 1} / {words.length}
              </p>
              <Progress value={((currentWordIndex + 1) / words.length) * 100} className="h-3" />
              <p className="text-sm text-purple-700 italic">
                {language === 'ru' ? 'Нажми на карточку, чтобы увидеть перевод' : 'Аударманы көру үшін карточканы басыңыз'}
              </p>
            </div>

            {/* Flip Card */}
            <div className="perspective-1000 h-[500px]">
              <motion.div
                className="relative w-full h-full cursor-pointer"
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front of Card - English + Description */}
                <div
                  className="absolute w-full h-full backface-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden"
                  }}
                >
                  <Card className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-300 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                      <div className="text-7xl mb-6">🔤</div>
                      <div className="text-7xl font-bold text-gray-900 mb-8">
                        {currentWord.english.toUpperCase()}
                      </div>
                      <Card className="p-6 bg-white/80 border-2 border-orange-300 rounded-2xl mb-6 max-w-md">
                        <p className="text-2xl text-gray-800 leading-relaxed">
                          {language === 'ru' ? currentWord.descriptionRu : currentWord.descriptionKz}
                        </p>
                      </Card>
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            speak(currentWord.english);
                          }}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl px-6 py-4 text-lg shadow-lg"
                        >
                          <Volume2 className="w-6 h-6 mr-2" />
                          {language === 'ru' ? 'Послушать' : 'Тыңдау'}
                        </Button>
                      </div>
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          y: [0, -10, 0]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="mt-8"
                      >
                        <Card className="p-6 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 border-4 border-white rounded-3xl shadow-2xl">
                          <p className="text-2xl font-bold text-white flex items-center justify-center gap-3">
                            <span className="text-4xl">👆</span>
                            {language === 'ru' ? 'Нажми, чтобы увидеть перевод' : 'Аударманы көру үшін басыңыз'}
                            <span className="text-4xl">👆</span>
                          </p>
                        </Card>
                      </motion.div>
                    </div>
                  </Card>
                </div>

                {/* Back of Card - Translation */}
                <div
                  className="absolute w-full h-full backface-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }}
                >
                  <Card className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 border-4 border-green-300 rounded-3xl shadow-2xl">
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                      <div className="text-9xl mb-8">✨</div>
                      <div className="text-8xl font-bold text-green-900 mb-12">
                        {language === 'ru' ? currentWord.russian : currentWord.kazakh}
                      </div>
                      <div className="flex gap-4">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            speak(currentWord.english);
                          }}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl px-6 py-4 text-lg shadow-lg"
                        >
                          <Volume2 className="w-6 h-6 mr-2" />
                          {language === 'ru' ? 'Послушать' : 'Тыңдау'}
                        </Button>
                      </div>
                      <p className="text-lg text-green-700 animate-pulse mt-8">
                        {language === 'ru' ? '👆 Нажми, чтобы вернуться' : '👆 Қайту үшін басыңыз'}
                      </p>
                    </div>
                  </Card>
                </div>
              </motion.div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  if (currentWordIndex > 0) {
                    setCurrentWordIndex(currentWordIndex - 1);
                    setIsCardFlipped(false);
                  }
                }}
                disabled={currentWordIndex === 0}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl disabled:opacity-50 text-lg shadow-lg"
              >
                {language === 'ru' ? '← Предыдущее' : '← Алдыңғы'}
              </Button>
              <Button
                onClick={() => {
                  if (currentWordIndex < words.length - 1) {
                    setCurrentWordIndex(currentWordIndex + 1);
                    setIsCardFlipped(false);
                  } else {
                    toast.success(language === 'ru' ? 'Вы изучили все слова в этой категории! 🎉' : 'Сіз осы санаттағы барлық сөздерді үйрендіңіз! 🎉');
                  }
                }}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl text-lg shadow-lg"
              >
                {currentWordIndex < words.length - 1 
                  ? (language === 'ru' ? 'Следующее →' : 'Келесі →')
                  : (language === 'ru' ? 'Завершить ✓' : 'Аяқтау ✓')}
              </Button>
            </div>

            {/* Hint */}
            <div className="text-center">
              <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl inline-block">
                <p className="text-sm text-blue-900">
                  💡 {language === 'ru' 
                    ? 'Совет: Произноси слово вслух вместе с озвучкой!' 
                    : 'Кеңес: Сөзді дыбыстаумен бірге дауыстап айт!'}
                </p>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}