import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { User, addPoints } from '../utils/storage';
import { Language, getTranslation } from '../utils/translations';
import { BookOpen, Volume2, TrendingUp, ArrowLeft, Grid3x3, Table2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ReadingTrainerProps {
  user: User;
  language: Language;
}

type Mode = 'menu' | 'diagnosis' | 'learning' | 'syllables-table' | 'words-table';

// Порядок обучения буквам (от простых к сложным)
const LETTERS_ORDER = [
  'А', 'У', 'О', 'М', 'С', 'Х', 'Р', 'Ш', 'Л', 'Н', 
  'К', 'Т', 'И', 'П', 'З', 'Й', 'Г', 'В', 'Д', 'Б', 
  'Ж', 'Е', 'Ь', 'Я', 'Ю', 'Ё', 'Ч', 'Э', 'Ц', 'Ф', 
  'Щ', 'Ъ', 'Ы'
];

// Гласные и согласные
const VOWELS = ['А', 'У', 'О', 'И', 'Е', 'Ё', 'Я', 'Ю', 'Э', 'Ы'];
const CONSONANTS = ['М', 'С', 'Х', 'Р', 'Ш', 'Л', 'Н', 'К', 'Т', 'П', 'З', 'Й', 'Г', 'В', 'Д', 'Б', 'Ж', 'Ч', 'Ц', 'Ф', 'Щ'];

// Простые слова для таблиц
const SIMPLE_WORDS = [
  'МАК', 'СОН', 'СОК', 'ДОМ', 'КОТ', 'НОС', 'РОТ', 'ЛЕС', 'МИР', 'ДАР',
  'МАМА', 'ПАПА', 'КАША', 'ВАЗА', 'РОЗА', 'КОСА', 'ЛИСА', 'ЛУНА', 'РУКА', 'НОГА',
  'МАМА', 'ПАПА', 'БАБА', 'КАША', 'МАША', 'САША', 'ДАША', 'ПАША', 'НАША', 'ВАША',
  'КОРОВА', 'СОБАКА', 'КОШКА', 'МАШИНА', 'МАЛИНА', 'ВОРОНА', 'БЕРЕЗА', 'ГОЛОВА'
];

export function ReadingTrainer({ user, language }: ReadingTrainerProps) {
  const t = (key: keyof typeof import('../utils/translations').translations.ru) => 
    getTranslation(language, key);

  const [mode, setMode] = useState<Mode>('menu');
  const [knownLetters, setKnownLetters] = useState<Set<string>>(new Set());
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [diagnosisIndex, setDiagnosisIndex] = useState(0);
  const [learningStage, setLearningStage] = useState<'letter' | 'syllables'>('letter');
  const [currentSyllables, setCurrentSyllables] = useState<string[]>([]);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [practiceTime, setPracticeTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [readSyllables, setReadSyllables] = useState<Set<number>>(new Set());
  const [syllablesTimer, setSyllablesTimer] = useState(0);
  const [syllablesTimerInterval, setSyllablesTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  // Загрузка прогресса из localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`reading_progress_${user.id}`);
    if (saved) {
      const data = JSON.parse(saved);
      setKnownLetters(new Set(data.knownLetters || []));
    }
  }, [user.id]);

  // Сохранение прогресса
  const saveProgress = (letters: Set<string>) => {
    localStorage.setItem(`reading_progress_${user.id}`, JSON.stringify({
      knownLetters: Array.from(letters)
    }));
  };

  // Генерация слогов из изученных букв
  const generateSyllables = (letters: string[]) => {
    const syllables: string[] = [];
    const vowels = letters.filter(l => VOWELS.includes(l));
    const consonants = letters.filter(l => CONSONANTS.includes(l));

    // Согласная + гласная (основные слоги)
    consonants.forEach(c => {
      vowels.forEach(v => {
        syllables.push(c + v);
      });
    });

    // Гласная + согласная
    vowels.forEach(v => {
      consonants.forEach(c => {
        syllables.push(v + c);
      });
    });

    return syllables;
  };

  // Старт диагностики
  const startDiagnosis = () => {
    setMode('diagnosis');
    setDiagnosisIndex(0);
  };

  // Обработка ответа в диагностике
  const handleDiagnosisAnswer = (knows: boolean) => {
    const currentLetter = LETTERS_ORDER[diagnosisIndex];
    const newKnownLetters = new Set(knownLetters);
    
    if (knows) {
      newKnownLetters.add(currentLetter);
    } else {
      newKnownLetters.delete(currentLetter);
    }
    
    setKnownLetters(newKnownLetters);
    saveProgress(newKnownLetters);

    if (diagnosisIndex < LETTERS_ORDER.length - 1) {
      setDiagnosisIndex(diagnosisIndex + 1);
    } else {
      toast.success(language === 'ru' ? '✅ Диагностика завершена!' : language === 'kz' ? '✅ Диагностика аяқталды!' : '✅ Diagnosis complete!');
      setMode('menu');
    }
  };

  // Старт обучения
  const startLearning = () => {
    const firstUnknown = LETTERS_ORDER.findIndex(letter => !knownLetters.has(letter));
    if (firstUnknown === -1) {
      toast.success(language === 'ru' ? '🎉 Вы изучили все буквы!' : language === 'kz' ? '🎉 Сіз барлық әріптерді үйрендіңіз!' : '🎉 You learned all letters!');
      return;
    }
    
    setCurrentLetterIndex(firstUnknown);
    setLearningStage('letter');
    setMode('learning');
  };

  // Переход к слогам
  const moveToSyllables = () => {
    const currentLetter = LETTERS_ORDER[currentLetterIndex];
    const newKnownLetters = new Set(knownLetters);
    newKnownLetters.add(currentLetter);
    setKnownLetters(newKnownLetters);
    saveProgress(newKnownLetters);

    const learnedLetters = Array.from(newKnownLetters);
    const syllables = generateSyllables(learnedLetters);
    setCurrentSyllables(syllables);
    setReadSyllables(new Set());
    setSyllablesTimer(0);
    setLearningStage('syllables');
    
    // Запуск таймера
    const interval = setInterval(() => {
      setSyllablesTimer(prev => prev + 1);
    }, 1000);
    setSyllablesTimerInterval(interval);
  };

  // Обработчик клика на слог
  const handleSyllableClick = (idx: number) => {
    const newReadSyllables = new Set(readSyllables);
    newReadSyllables.add(idx);
    setReadSyllables(newReadSyllables);
    
    // Проверка завершения
    const totalSyllables = Math.min(currentSyllables.length, 32);
    if (newReadSyllables.size === totalSyllables) {
      if (syllablesTimerInterval) {
        clearInterval(syllablesTimerInterval);
      }
      setShowCompletionDialog(true);
    }
  };

  // Завершить урок
  const completeLesson = () => {
    const earnedPoints = 10;
    addPoints(user.id, earnedPoints, 'Reading lesson completed');
    toast.success(language === 'ru' ? `🎉 Урок завершен! +${earnedPoints} очков` : language === 'kz' ? `🎉 Сабақ аяқталды! +${earnedPoints} ұпай` : `🎉 Lesson complete! +${earnedPoints} points`);
    setMode('menu');
  };

  // Старт таблицы слогов
  const startSyllablesTable = () => {
    if (knownLetters.size < 2) {
      toast.error(language === 'ru' ? 'Изучите хотя бы 2 буквы!' : language === 'kz' ? 'Кемінде 2 әріпті үйреніңіз!' : 'Learn at least 2 letters!');
      return;
    }
    setMode('syllables-table');
    setPracticeTime(0);
    const interval = setInterval(() => {
      setPracticeTime(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  // Старт таблицы слов
  const startWordsTable = () => {
    if (knownLetters.size < 4) {
      toast.error(language === 'ru' ? 'Изучите хотя бы 4 буквы!' : language === 'kz' ? 'Кемінде 4 әріпті үйреніңіз!' : 'Learn at least 4 letters!');
      return;
    }
    setMode('words-table');
    setPracticeTime(0);
    const interval = setInterval(() => {
      setPracticeTime(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  // Завершить практику
  const completePractice = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    const minutes = Math.floor(practiceTime / 60);
    const earnedPoints = Math.max(5, Math.min(30, minutes * 5));
    addPoints(user.id, earnedPoints, `Reading practice: ${minutes} min`);
    toast.success(language === 'ru' ? `🎉 Отличная работа! +${earnedPoints} очков` : language === 'kz' ? `🎉 Керемет жұмыс! +${earnedPoints} ұпай` : `🎉 Great work! +${earnedPoints} points`);
    setMode('menu');
    setPracticeTime(0);
  };

  // Озвучивание текста
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Специальная обработка для правильного произношени звуков
      let textToSpeak = text.toLowerCase();
      
      // Словарь фонетических замен для одиночных букв
      const phoneticMap: { [key: string]: string } = {
        // Согласные
        'м': 'ммм',
        'н': 'ннн',
        'с': 'ссс',
        'з': 'ззз',
        'в': 'ввв',
        'ф': 'ффф',
        'л': 'ллл',
        'р': 'ррр',
        'к': 'ккк',
        'г': 'ггг',
        'х': 'ххх',
        'т': 'ттт',
        'д': 'дддд',
        'п': 'пппп',
        'б': 'бббб',
        'ш': 'шшш',
        'ж': 'жжж',
        'ч': 'ччч',
        'щ': 'щщщ',
        'ц': 'ццц',
        'й': 'ййй',
        // Гласные
        'а': 'ааа',
        'о': 'ооо',
        'у': 'ууу',
        'и': 'иии',
        'е': 'ееее',
        'ё': 'ёёё',
        'я': 'яяя',
        'ю': 'ююю',
        'э': 'эээ',
        'ы': 'ыыы',
      };
      
      // Если это одиночная буква, используем фонетическую замену
      if (textToSpeak.length === 1 && phoneticMap[textToSpeak]) {
        textToSpeak = phoneticMap[textToSpeak];
      }
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Загружаем голоса
      const voices = speechSynthesis.getVoices();
      
      // Ищем мужской русский голос
      const russianVoice = 
        // 1. Мужской Google русский голос
        voices.find(voice => 
          voice.lang.startsWith('ru') && 
          !voice.localService &&
          (voice.name.toLowerCase().includes('male') && !voice.name.toLowerCase().includes('female') ||
           voice.name.includes('Yuri') ||
           voice.name.includes('Dmitry'))
        ) ||
        // 2. Любой Google русский голос
        voices.find(voice => 
          voice.lang.startsWith('ru') && 
          voice.name.includes('Google')
        ) ||
        // 3. Любой онлайн русский голос
        voices.find(voice => 
          voice.lang.startsWith('ru') && 
          !voice.localService
        ) ||
        // 4. Локальный мужской русский голос
        voices.find(voice => 
          voice.lang.startsWith('ru') &&
          (voice.name.toLowerCase().includes('male') && !voice.name.toLowerCase().includes('female'))
        ) ||
        // 5. Любой русский голос
        voices.find(voice => voice.lang.startsWith('ru')) ||
        // 6. Первый доступный голос
        voices[0];
      
      if (russianVoice) {
        utterance.voice = russianVoice;
      }
      
      utterance.lang = 'ru-RU';
      utterance.rate = 0.8; // Чуть быстрее для более естественного звучания
      utterance.pitch = 0.9; // Ниже для мужского голоса
      utterance.volume = 1.0;
      
      speechSynthesis.speak(utterance);
    }
  };
  
  // Загрузить голоса при монтировании компонента
  useEffect(() => {
    // Для некоторых браузеров голоса загружаются асинхронно
    if ('speechSynthesis' in window) {
      speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        speechSynthesis.getVoices();
      };
    }
  }, []);

  // Возврат в меню
  const returnToMenu = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    if (syllablesTimerInterval) {
      clearInterval(syllablesTimerInterval);
    }
    setMode('menu');
  };

  // Фильтрация доступных слов
  const getAvailableWords = (knownLetters: Set<string>): string[] => {
    return SIMPLE_WORDS.filter(word => {
      return word.split('').every(letter => knownLetters.has(letter));
    });
  };

  const learnedCount = knownLetters.size;
  const totalLetters = LETTERS_ORDER.length;
  const progress = (learnedCount / totalLetters) * 100;
  const availableWordsCount = getAvailableWords(knownLetters).length;

  // Меню
  if (mode === 'menu') {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 border-4 border-purple-300 rounded-3xl shadow-2xl">
            <div className="text-center space-y-4">
              <div className="text-6xl">📚</div>
              <h2 className="text-4xl text-purple-900">
                {language === 'ru' ? 'Обучение Чтению' : language === 'kz' ? 'Оқуды үйрену' : 'Learning to Read'}
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                {language === 'ru' 
                  ? 'Персональный план обучения: диагностика, изучение букв, таблицы слогов и слов!' 
                  : language === 'kz'
                  ? 'Жеке оқыту жоспары: диагностикалау, әріптерді үйрену, буындар мен сөздер кестелері!'
                  : 'Personal learning plan: diagnosis, learning letters, syllable and word tables!'}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Прогресс */}
        <Card className="p-6 bg-gradient-to-br from-white to-purple-50 border-4 border-purple-200 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <h3 className="text-2xl text-purple-900">
              {language === 'ru' ? 'Ваш прогресс' : language === 'kz' ? 'Сіздің прогресс' : 'Your Progress'}
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-700">
                {language === 'ru' ? 'Изучено букв:' : language === 'kz' ? 'Үйренген әріптер:' : 'Letters learned:'}
              </span>
              <span className="text-2xl font-bold text-purple-900">{learnedCount}/{totalLetters}</span>
            </div>
            <Progress value={progress} className="h-4" />
            <p className="text-sm text-gray-600 text-center">
              {progress.toFixed(0)}% {language === 'ru' ? 'завершено' : language === 'kz' ? 'аяқталды' : 'complete'}
            </p>
          </div>

          {/* Показать изученные буквы */}
          {learnedCount > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl border-2 border-green-300">
              <p className="text-sm text-green-800 mb-2">
                {language === 'ru' ? '✅ Изученные буквы:' : language === 'kz' ? '✅ Үйренген әріптер:' : '✅ Learned letters:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from(knownLetters).map(letter => (
                  <div key={letter} className="text-2xl bg-white px-3 py-1 rounded-xl border-2 border-green-400 shadow-sm">
                    {letter}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Кнопки действий */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Диагностика */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              onClick={startDiagnosis}
              className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-300 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-all"
            >
              <div className="text-center space-y-3">
                <div className="text-5xl">🔍</div>
                <h3 className="text-xl text-blue-900">
                  {language === 'ru' ? 'Диагностика' : language === 'kz' ? 'Дигностика' : 'Diagnosis'}
                </h3>
                <p className="text-sm text-gray-700">
                  {language === 'ru' ? 'Проверка знаний' : language === 'kz' ? 'Білімді тексеру' : 'Check knowledge'}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Обучение */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              onClick={startLearning}
              className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-4 border-purple-300 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-all"
            >
              <div className="text-center space-y-3">
                <div className="text-5xl">📖</div>
                <h3 className="text-xl text-purple-900">
                  {language === 'ru' ? 'Обучение' : language === 'kz' ? 'Оқыту' : 'Learning'}
                </h3>
                <p className="text-sm text-gray-700">
                  {language === 'ru' ? 'Учите буквы' : language === 'kz' ? 'Әріптерді үйрену' : 'Learn letters'}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Таблица слогов */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              onClick={startSyllablesTable}
              className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-4 border-orange-300 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-all"
            >
              <div className="text-center space-y-3">
                <div className="text-5xl">🎯</div>
                <h3 className="text-xl text-orange-900">
                  {language === 'ru' ? 'Таблица слогов' : language === 'kz' ? 'Буындар кестесі' : 'Syllables table'}
                </h3>
                <p className="text-sm text-gray-700">
                  {language === 'ru' ? 'Читайте слоги' : language === 'kz' ? 'Буындарды оқу' : 'Read syllables'}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Таблица слов */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              onClick={startWordsTable}
              className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-300 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-all"
            >
              <div className="text-center space-y-3">
                <div className="text-5xl">📚</div>
                <h3 className="text-xl text-green-900">
                  {language === 'ru' ? 'Таблица слов' : language === 'kz' ? 'Сөздер кестесі' : 'Words table'}
                </h3>
                <p className="text-sm text-gray-700">
                  {language === 'ru' ? 'Читайте слова' : language === 'kz' ? 'Сөздерді оқу' : 'Read words'}
                </p>
                {availableWordsCount > 0 && (
                  <p className="text-xs text-green-700">
                    {availableWordsCount} {language === 'ru' ? 'слов' : language === 'kz' ? 'сөз' : 'words'}
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Диагностика
  if (mode === 'diagnosis') {
    const currentLetter = LETTERS_ORDER[diagnosisIndex];
    const progressPercent = ((diagnosisIndex + 1) / LETTERS_ORDER.length) * 100;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 border-4 border-blue-300 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                onClick={() => setShowExitDialog(true)}
                variant="outline"
                className="border-2 border-blue-400 text-blue-700 hover:bg-blue-100 rounded-xl px-4 py-2"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {language === 'ru' ? 'Назад' : language === 'kz' ? 'Артқа' : 'Back'}
              </Button>
              <span className="text-lg text-blue-900">
                {diagnosisIndex + 1}/{LETTERS_ORDER.length}
              </span>
            </div>

            <Progress value={progressPercent} className="h-3" />

            <div className="text-center space-y-6">
              <h3 className="text-2xl text-blue-900">
                {language === 'ru' ? 'Знает ли ребенок эту букву?' : language === 'kz' ? 'Бала бұл әріпті біле ме?' : 'Does the child know this letter?'}
              </h3>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="relative"
              >
                <div className="text-[200px] leading-none font-bold text-purple-900 bg-gradient-to-br from-yellow-100 to-yellow-200 border-8 border-yellow-400 rounded-3xl p-8 shadow-2xl inline-block">
                  {currentLetter}
                </div>
              </motion.div>

              <div className="flex gap-4 justify-center mt-8">
                <Button
                  onClick={() => handleDiagnosisAnswer(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-6 rounded-2xl shadow-xl text-xl"
                >
                  ✅ {language === 'ru' ? 'Знает' : language === 'kz' ? 'Біледі' : 'Knows'}
                </Button>
                <Button
                  onClick={() => handleDiagnosisAnswer(false)}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-12 py-6 rounded-2xl shadow-xl text-xl"
                >
                  ❌ {language === 'ru' ? 'Не знает' : language === 'kz' ? 'Білмейді' : 'Does not know'}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {language === 'ru' ? 'Прервать диагностику?' : language === 'kz' ? 'Диагностиканы үзу?' : 'Stop diagnosis?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {language === 'ru' 
                  ? 'Прогресс диагностики будет сохранен' 
                  : language === 'kz'
                  ? 'Диагностика прогресі сақталады'
                  : 'Diagnosis progress will be saved'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{language === 'ru' ? 'Отмена' : language === 'kz' ? 'Болдырмау' : 'Cancel'}</AlertDialogCancel>
              <AlertDialogAction onClick={returnToMenu}>
                {language === 'ru' ? 'Выйти' : language === 'kz' ? 'Шығу' : 'Exit'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    );
  }

  // Обучение
  if (mode === 'learning') {
    const currentLetter = LETTERS_ORDER[currentLetterIndex];

    if (learningStage === 'letter') {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-100 border-4 border-purple-300 rounded-3xl shadow-2xl">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <Button
                  onClick={returnToMenu}
                  variant="outline"
                  className="border-2 border-purple-400 text-purple-700 hover:bg-purple-100 rounded-xl"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  {language === 'ru' ? 'Назад' : language === 'kz' ? 'Артқа' : 'Back'}
                </Button>
              </div>

              <div className="text-center space-y-6">
                <h2 className="text-3xl text-purple-900">
                  {language === 'ru' ? 'Изучаем букву' : language === 'kz' ? 'Әріпті үйренеміз' : 'Learning letter'}
                </h2>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  className="relative inline-block"
                >
                  <div className="text-[250px] leading-none font-bold text-purple-900 bg-gradient-to-br from-yellow-100 to-orange-200 border-8 border-yellow-400 rounded-3xl p-12 shadow-2xl">
                    {currentLetter}
                  </div>
                </motion.div>

                <p className="text-xl text-purple-700">
                  {language === 'ru' ? 'Изучите эту букву и переходите дальше!' : language === 'kz' ? 'Бұл әріпті үйреніңіз және алға өтіңіз!' : 'Learn this letter and move forward!'}
                </p>

                <Button
                  onClick={moveToSyllables}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-16 py-6 rounded-2xl shadow-xl text-xl mt-8"
                >
                  {language === 'ru' ? 'Дальше →' : language === 'kz' ? 'Алға →' : 'Next →'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      );
    }

    // Этап слогов
    const totalSyllables = Math.min(currentSyllables.length, 32);
    const syllablesProgress = (readSyllables.size / totalSyllables) * 100;
    const minutes = Math.floor(syllablesTimer / 60);
    const seconds = syllablesTimer % 60;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        <Card className="p-8 bg-gradient-to-br from-pink-50 to-purple-100 border-4 border-pink-300 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                onClick={returnToMenu}
                variant="outline"
                className="border-2 border-pink-400 text-pink-700 hover:bg-pink-100 rounded-xl"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {language === 'ru' ? 'Назад' : language === 'kz' ? 'Артқа' : 'Back'}
              </Button>
              <div className="text-xl text-pink-900">
                ⏱️ {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-3xl text-pink-900">
                {language === 'ru' ? 'Слоги с буквой' : language === 'kz' ? 'Әріппен буындар' : 'Syllables with letter'} {currentLetter}
              </h2>
              <p className="text-lg text-pink-700">
                {language === 'ru' ? 'Нажимайте на слоги после прочтения!' : language === 'kz' ? 'Оқығаннан кейін буындарды басыңыз!' : 'Click syllables after reading!'}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-pink-700">{readSyllables.size}/{totalSyllables} слогов прочитано</span>
                  <span className="text-sm text-pink-700">{syllablesProgress.toFixed(0)}%</span>
                </div>
                <Progress value={syllablesProgress} className="h-3" />
              </div>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {currentSyllables.slice(0, 32).map((syllable, idx) => {
                const isRead = readSyllables.has(idx);
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    whileHover={{ scale: isRead ? 1 : 1.05 }}
                    whileTap={{ scale: isRead ? 1 : 0.95 }}
                  >
                    <button
                      onClick={() => !isRead && handleSyllableClick(idx)}
                      disabled={isRead}
                      className={`w-full h-20 text-3xl font-bold rounded-2xl shadow-lg flex items-center justify-center transition-all ${
                        isRead 
                          ? 'bg-gradient-to-br from-green-400 to-green-500 text-white border-4 border-green-600 cursor-default' 
                          : 'bg-gradient-to-br from-white to-pink-100 text-pink-900 border-4 border-pink-300 hover:border-pink-400 cursor-pointer'
                      }`}
                    >
                      {syllable}
                      {isRead && <span className="ml-2">✓</span>}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Диалог завершения */}
        <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {language === 'ru' ? '🎉 Отлично!' : language === 'kz' ? '🎉 Керемет!' : '🎉 Great!'}
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>
                  {language === 'ru' 
                    ? `Вы прочитали все ${totalSyllables} слогов за ${minutes}:${String(seconds).padStart(2, '0')}!` 
                    : language === 'kz'
                    ? `Сіз барлық ${totalSyllables} буынды ${minutes}:${String(seconds).padStart(2, '0')} уақытта оқыдыңыз!`
                    : `You read all ${totalSyllables} syllables in ${minutes}:${String(seconds).padStart(2, '0')}!`}
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={completeLesson}>
                {language === 'ru' ? 'Завершить урок' : language === 'kz' ? 'Сабақты аяқтау' : 'Complete lesson'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    );
  }

  // Таблица слогов
  if (mode === 'syllables-table') {
    const learnedLetters = Array.from(knownLetters);
    const syllables = generateSyllables(learnedLetters);
    const minutes = Math.floor(practiceTime / 60);
    const seconds = practiceTime % 60;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <Card className="p-8 bg-gradient-to-br from-orange-50 to-yellow-100 border-4 border-orange-300 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                onClick={returnToMenu}
                variant="outline"
                className="border-2 border-orange-400 text-orange-700 hover:bg-orange-100 rounded-xl"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {language === 'ru' ? 'Назад' : language === 'kz' ? 'Артқа' : 'Back'}
              </Button>
              <div className="flex items-center gap-4">
                <div className="text-xl text-orange-900">
                  ⏱️ {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
                <Button
                  onClick={completePractice}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl shadow-lg"
                >
                  ✅ {language === 'ru' ? 'Готово' : language === 'kz' ? 'Дайын' : 'Done'}
                </Button>
              </div>
            </div>

            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-3">
                <Grid3x3 className="w-8 h-8 text-orange-600" />
                <h2 className="text-3xl text-orange-900">
                  {language === 'ru' ? 'Таблица слогов для чтения' : language === 'kz' ? 'Оқуға арналған буындар кестесі' : 'Reading syllables table'}
                </h2>
              </div>
              <p className="text-lg text-orange-700">
                {language === 'ru' ? 'Читайте слоги построчно!' : language === 'kz' ? 'Буындарды жол бойынша оқыңыз!' : 'Read syllables line by line!'}
              </p>
            </div>

            <div className="bg-white/80 p-6 rounded-2xl border-4 border-orange-200">
              <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {syllables.map((syllable, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.01 }}
                  >
                    <div className="w-full h-16 text-2xl font-bold bg-gradient-to-br from-orange-100 to-orange-200 text-orange-900 border-3 border-orange-400 rounded-xl shadow-md flex items-center justify-center">
                      {syllable}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Таблица слов
  if (mode === 'words-table') {
    const availableWords = getAvailableWords(knownLetters);
    const minutes = Math.floor(practiceTime / 60);
    const seconds = practiceTime % 60;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-100 border-4 border-green-300 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                onClick={returnToMenu}
                variant="outline"
                className="border-2 border-green-400 text-green-700 hover:bg-green-100 rounded-xl"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {language === 'ru' ? 'Назад' : language === 'kz' ? 'Артқа' : 'Back'}
              </Button>
              <div className="flex items-center gap-4">
                <div className="text-xl text-green-900">
                  ⏱️ {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
                <Button
                  onClick={completePractice}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl shadow-lg"
                >
                  ✅ {language === 'ru' ? 'Готово' : language === 'kz' ? 'Дайын' : 'Done'}
                </Button>
              </div>
            </div>

            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-3">
                <Table2 className="w-8 h-8 text-green-600" />
                <h2 className="text-3xl text-green-900">
                  {language === 'ru' ? 'Таблица слов для чтения' : language === 'kz' ? 'Оқуға арналған сөздер кестесі' : 'Reading words table'}
                </h2>
              </div>
              <p className="text-lg text-green-700">
                {language === 'ru' ? 'Читайте слова построчно!' : language === 'kz' ? 'Сөздерді жол бойынша оқыңыз!' : 'Read words line by line!'}
              </p>
              <p className="text-sm text-green-600">
                {language === 'ru' ? `Доступно ${availableWords.length} слов из изученных букв` : language === 'kz' ? `Үйренген әріптерден ${availableWords.length} сөз қолжетімді` : `${availableWords.length} words available from learned letters`}
              </p>
            </div>

            <div className="bg-white/80 p-6 rounded-2xl border-4 border-green-200">
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
                {availableWords.map((word, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.02 }}
                  >
                    <div className="w-full h-16 text-xl font-bold bg-gradient-to-br from-green-100 to-green-200 text-green-900 border-3 border-green-400 rounded-xl shadow-md flex items-center justify-center">
                      {word}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return null;
}