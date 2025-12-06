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
  Languages as LanguagesIcon
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { WORDS_WITH_SENTENCES, WordData } from './english-words-data';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { EnglishWordCard } from './EnglishWordCard';

interface EnglishTrainerProps {
  user: User;
  language: Language;
}

type Mode = 'menu' | 'level-select' | 'topic-select' | 'vocabulary' | 'grammar' | 'conversation';
type Level = 'beginner' | 'elementary' | 'pre-intermediate' | 'intermediate' | 'upper-intermediate';

interface Word {
  english: string;
  russian: string;
  kazakh: string;
  category: string;
  level: Level;
  image?: string;
  sentence?: { en: string; ru: string; kz: string };
}

interface GrammarLesson {
  title: { ru: string; kz: string; en: string };
  explanation: { ru: string; kz: string; en: string };
  examples: string[];
  level: Level;
}

interface ConversationPhrase {
  english: string;
  russian: string;
  kazakh: string;
  situation: string;
  level: Level;
}

// База данных слов по темам и уровням
const VOCABULARY_DATABASE: Word[] = [
  // BEGINNER - Животные
  { english: 'cat', russian: 'кот', kazakh: 'мысық', category: 'Animals', level: 'beginner' },
  { english: 'dog', russian: 'собака', kazakh: 'ит', category: 'Animals', level: 'beginner' },
  { english: 'bird', russian: 'птица', kazakh: 'құс', category: 'Animals', level: 'beginner' },
  { english: 'fish', russian: 'рыба', kazakh: 'балық', category: 'Animals', level: 'beginner' },
  { english: 'rabbit', russian: 'кролик', kazakh: 'қоян', category: 'Animals', level: 'beginner' },
  { english: 'horse', russian: 'лошадь', kazakh: 'жылқы', category: 'Animals', level: 'beginner' },
  { english: 'cow', russian: 'корова', kazakh: 'сиыр', category: 'Animals', level: 'beginner' },
  { english: 'pig', russian: 'свинья', kazakh: 'шошқа', category: 'Animals', level: 'beginner' },

  // BEGINNER - Цвета
  { english: 'red', russian: 'красный', kazakh: 'қызыл', category: 'Colors', level: 'beginner' },
  { english: 'blue', russian: 'синий', kazakh: 'көк', category: 'Colors', level: 'beginner' },
  { english: 'green', russian: 'зеленый', kazakh: 'жасыл', category: 'Colors', level: 'beginner' },
  { english: 'yellow', russian: 'желтый', kazakh: 'сары', category: 'Colors', level: 'beginner' },
  { english: 'black', russian: 'черный', kazakh: 'қара', category: 'Colors', level: 'beginner' },
  { english: 'white', russian: 'белый', kazakh: 'ақ', category: 'Colors', level: 'beginner' },
  { english: 'orange', russian: 'оранжевый', kazakh: 'сарғыш', category: 'Colors', level: 'beginner' },
  { english: 'purple', russian: 'фиолетовый', kazakh: 'күлгін', category: 'Colors', level: 'beginner' },

  // BEGINNER - Числа
  { english: 'one', russian: 'один', kazakh: 'бір', category: 'Numbers', level: 'beginner' },
  { english: 'two', russian: 'два', kazakh: 'екі', category: 'Numbers', level: 'beginner' },
  { english: 'three', russian: 'три', kazakh: 'үш', category: 'Numbers', level: 'beginner' },
  { english: 'four', russian: 'четыре', kazakh: 'төрт', category: 'Numbers', level: 'beginner' },
  { english: 'five', russian: 'пять', kazakh: 'бес', category: 'Numbers', level: 'beginner' },
  { english: 'six', russian: 'шесть', kazakh: 'алты', category: 'Numbers', level: 'beginner' },
  { english: 'seven', russian: 'семь', kazakh: 'жеті', category: 'Numbers', level: 'beginner' },
  { english: 'eight', russian: 'восемь', kazakh: 'сегіз', category: 'Numbers', level: 'beginner' },
  { english: 'nine', russian: 'девять', kazakh: 'тоғыз', category: 'Numbers', level: 'beginner' },
  { english: 'ten', russian: 'десять', kazakh: 'он', category: 'Numbers', level: 'beginner' },

  // BEGINNER - Семья
  { english: 'mother', russian: 'мама', kazakh: 'ана', category: 'Family', level: 'beginner' },
  { english: 'father', russian: 'папа', kazakh: 'әке', category: 'Family', level: 'beginner' },
  { english: 'sister', russian: 'сестра', kazakh: 'әпке/қарындас', category: 'Family', level: 'beginner' },
  { english: 'brother', russian: 'брат', kazakh: 'аға/іні', category: 'Family', level: 'beginner' },
  { english: 'baby', russian: 'малыш', kazakh: 'нәресте', category: 'Family', level: 'beginner' },
  { english: 'grandma', russian: 'бабушка', kazakh: 'әже', category: 'Family', level: 'beginner' },
  { english: 'grandpa', russian: 'дедушка', kazakh: 'ата', category: 'Family', level: 'beginner' },

  // ELEMENTARY - Еда
  { english: 'apple', russian: 'яблоко', kazakh: 'алма', category: 'Food', level: 'elementary' },
  { english: 'banana', russian: 'банан', kazakh: 'банан', category: 'Food', level: 'elementary' },
  { english: 'bread', russian: 'хлеб', kazakh: 'нан', category: 'Food', level: 'elementary' },
  { english: 'milk', russian: 'молоко', kazakh: 'сүт', category: 'Food', level: 'elementary' },
  { english: 'water', russian: 'вода', kazakh: 'су', category: 'Food', level: 'elementary' },
  { english: 'juice', russian: 'сок', kazakh: 'шырын', category: 'Food', level: 'elementary' },
  { english: 'cheese', russian: 'сыр', kazakh: 'ірімшік', category: 'Food', level: 'elementary' },
  { english: 'egg', russian: 'яйцо', kazakh: 'жұмыртқа', category: 'Food', level: 'elementary' },
  { english: 'pizza', russian: 'пицца', kazakh: 'пицца', category: 'Food', level: 'elementary' },
  { english: 'cake', russian: 'торт', kazakh: 'торт', category: 'Food', level: 'elementary' },

  // ELEMENTARY - Школа
  { english: 'book', russian: 'книга', kazakh: 'кітап', category: 'School', level: 'elementary' },
  { english: 'pen', russian: 'ручка', kazakh: 'қалам', category: 'School', level: 'elementary' },
  { english: 'pencil', russian: 'карандаш', kazakh: 'қарындаш', category: 'School', level: 'elementary' },
  { english: 'desk', russian: 'парта', kazakh: 'парта', category: 'School', level: 'elementary' },
  { english: 'teacher', russian: 'учитель', kazakh: 'мұғалім', category: 'School', level: 'elementary' },
  { english: 'student', russian: 'ученик', kazakh: 'оқушы', category: 'School', level: 'elementary' },
  { english: 'classroom', russian: 'класс', kazakh: 'сынып', category: 'School', level: 'elementary' },
  { english: 'homework', russian: 'домашняя работа', kazakh: 'үй жұмысы', category: 'School', level: 'elementary' },

  // ELEMENTARY - Дом
  { english: 'house', russian: 'дом', kazakh: 'үй', category: 'Home', level: 'elementary' },
  { english: 'room', russian: 'комната', kazakh: 'бөлме', category: 'Home', level: 'elementary' },
  { english: 'door', russian: 'дверь', kazakh: 'есік', category: 'Home', level: 'elementary' },
  { english: 'window', russian: 'окно', kazakh: 'терезе', category: 'Home', level: 'elementary' },
  { english: 'bed', russian: 'кровать', kazakh: 'төсек', category: 'Home', level: 'elementary' },
  { english: 'table', russian: 'стол', kazakh: 'үстел', category: 'Home', level: 'elementary' },
  { english: 'chair', russian: 'стул', kazakh: 'орындық', category: 'Home', level: 'elementary' },
  { english: 'kitchen', russian: 'кухня', kazakh: 'ас үй', category: 'Home', level: 'elementary' },

  // PRE-INTERMEDIATE - Природа
  { english: 'tree', russian: 'дерево', kazakh: 'ағаш', category: 'Nature', level: 'pre-intermediate' },
  { english: 'flower', russian: 'цветок', kazakh: 'гүл', category: 'Nature', level: 'pre-intermediate' },
  { english: 'sun', russian: 'солнце', kazakh: 'күн', category: 'Nature', level: 'pre-intermediate' },
  { english: 'moon', russian: 'луна', kazakh: 'ай', category: 'Nature', level: 'pre-intermediate' },
  { english: 'star', russian: 'звезда', kazakh: 'жұлдыз', category: 'Nature', level: 'pre-intermediate' },
  { english: 'rain', russian: 'дождь', kazakh: 'жаңбыр', category: 'Nature', level: 'pre-intermediate' },
  { english: 'snow', russian: 'снег', kazakh: 'қар', category: 'Nature', level: 'pre-intermediate' },
  { english: 'wind', russian: 'ветер', kazakh: 'жел', category: 'Nature', level: 'pre-intermediate' },

  // PRE-INTERMEDIATE - Действия
  { english: 'run', russian: 'бегать', kazakh: 'жүгіру', category: 'Actions', level: 'pre-intermediate' },
  { english: 'jump', russian: 'прыгать', kazakh: 'секіру', category: 'Actions', level: 'pre-intermediate' },
  { english: 'swim', russian: 'плавать', kazakh: 'жүзу', category: 'Actions', level: 'pre-intermediate' },
  { english: 'read', russian: 'читать', kazakh: 'оқу', category: 'Actions', level: 'pre-intermediate' },
  { english: 'write', russian: 'писать', kazakh: 'жазу', category: 'Actions', level: 'pre-intermediate' },
  { english: 'draw', russian: 'рисовать', kazakh: 'сурет салу', category: 'Actions', level: 'pre-intermediate' },
  { english: 'sing', russian: 'петь', kazakh: 'ән айту', category: 'Actions', level: 'pre-intermediate' },
  { english: 'dance', russian: 'танцевать', kazakh: 'би билеу', category: 'Actions', level: 'pre-intermediate' },

  // INTERMEDIATE - Природа
  { english: 'tree', russian: 'дерево', kazakh: 'ағаш', category: 'Nature', level: 'intermediate' },
  { english: 'flower', russian: 'цветок', kazakh: 'гүл', category: 'Nature', level: 'intermediate' },
  { english: 'sun', russian: 'солнце', kazakh: 'күн', category: 'Nature', level: 'intermediate' },
  { english: 'moon', russian: 'луна', kazakh: 'ай', category: 'Nature', level: 'intermediate' },
  { english: 'star', russian: 'звезда', kazakh: 'жұлдыз', category: 'Nature', level: 'intermediate' },
  { english: 'rain', russian: 'дождь', kazakh: 'жаңбыр', category: 'Nature', level: 'intermediate' },
  { english: 'snow', russian: 'снег', kazakh: 'қар', category: 'Nature', level: 'intermediate' },
  { english: 'wind', russian: 'ветер', kazakh: 'жел', category: 'Nature', level: 'intermediate' },

  // INTERMEDIATE - Действия
  { english: 'run', russian: 'бегать', kazakh: 'жүгіру', category: 'Actions', level: 'intermediate' },
  { english: 'jump', russian: 'прыгать', kazakh: 'секіру', category: 'Actions', level: 'intermediate' },
  { english: 'swim', russian: 'плавать', kazakh: 'жүзу', category: 'Actions', level: 'intermediate' },
  { english: 'read', russian: 'читать', kazakh: 'оқу', category: 'Actions', level: 'intermediate' },
  { english: 'write', russian: 'писать', kazakh: 'жазу', category: 'Actions', level: 'intermediate' },
  { english: 'draw', russian: 'рисовать', kazakh: 'сурет салу', category: 'Actions', level: 'intermediate' },
  { english: 'sing', russian: 'петь', kazakh: 'ән айту', category: 'Actions', level: 'intermediate' },
  { english: 'dance', russian: 'танцевать', kazakh: 'би билеу', category: 'Actions', level: 'intermediate' },
];

// База грамматических уроков
const GRAMMAR_LESSONS: GrammarLesson[] = [
  {
    title: { 
      ru: 'Артикли A / AN', 
      kz: 'A / AN артикльдері', 
      en: 'Articles A / AN' 
    },
    explanation: { 
      ru: 'A используется перед словами, начинающимися с согласной (a cat), AN - перед гласной (an apple)', 
      kz: 'A дауыссыз дыбыстан басталатын сөздердің алдында (a cat), AN дауысты дыбыстан басталатын сөздердің алдында (an apple)', 
      en: 'A is used before words starting with a consonant (a cat), AN before a vowel (an apple)' 
    },
    examples: ['a dog', 'a book', 'an apple', 'an egg', 'a cat', 'an orange'],
    level: 'beginner'
  },
  {
    title: { 
      ru: 'Множественное число', 
      kz: 'Көпше түрі', 
      en: 'Plural Forms' 
    },
    explanation: { 
      ru: 'Для образования множественного числа добавляем -s или -es: cat → cats, box → boxes', 
      kz: 'Көпше түрін жасау үшін -s немесе -es қосамыз: cat → cats, box → boxes', 
      en: 'To form plural, add -s or -es: cat → cats, box → boxes' 
    },
    examples: ['cats', 'dogs', 'books', 'boxes', 'dishes', 'apples'],
    level: 'beginner'
  },
  {
    title: { 
      ru: 'Глагол TO BE (Present)', 
      kz: 'TO BE етістігі (қазіргі шақ)', 
      en: 'Verb TO BE (Present)' 
    },
    explanation: { 
      ru: 'I am, You are, He/She/It is, We are, They are', 
      kz: 'I am, You are, He/She/It is, We are, They are', 
      en: 'I am, You are, He/She/It is, We are, They are' 
    },
    examples: ['I am happy', 'You are smart', 'She is beautiful', 'We are friends', 'They are students'],
    level: 'elementary'
  },
  {
    title: { 
      ru: 'Present Simple', 
      kz: 'Present Simple шағы', 
      en: 'Present Simple Tense' 
    },
    explanation: { 
      ru: 'Для He/She/It добавляем -s: I play, He plays. Вопросы: Do you...? Does he...?', 
      kz: 'He/She/It үшін -s қосамыз: I play, He plays. Сұрақтар: Do you...? Does he...?', 
      en: 'For He/She/It add -s: I play, He plays. Questions: Do you...? Does he...?' 
    },
    examples: ['I play', 'He plays', 'She reads', 'Do you like?', 'Does he know?'],
    level: 'elementary'
  },
  {
    title: { 
      ru: 'Present Continuous', 
      kz: 'Present Continuous шағы', 
      en: 'Present Continuous Tense' 
    },
    explanation: { 
      ru: 'am/is/are + глагол с -ing для действий сейчас: I am reading now', 
      kz: 'am/is/are + -ing етістік қазір болып жатқан іс-әрекет үшін: I am reading now', 
      en: 'am/is/are + verb with -ing for actions happening now: I am reading now' 
    },
    examples: ['I am reading', 'She is playing', 'They are running', 'We are studying', 'He is swimming'],
    level: 'intermediate'
  },
  {
    title: { 
      ru: 'Past Simple', 
      kz: 'Past Simple шағы', 
      en: 'Past Simple Tense' 
    },
    explanation: { 
      ru: 'Правильные глаголы + ed (played), неправильные учим (went, saw). Вопросы: Did you...?', 
      kz: 'Дұрыс етістіктер + ed (played), бұрыс етістіктерді жаттаймыз (went, saw). Сұрақтар: Did you...?', 
      en: 'Regular verbs + ed (played), irregular verbs memorize (went, saw). Questions: Did you...?' 
    },
    examples: ['I played', 'He went', 'She saw', 'Did you go?', 'We studied'],
    level: 'intermediate'
  }
];

// База разговорных фраз
const CONVERSATION_PHRASES: ConversationPhrase[] = [
  // BEGINNER - Приветствия
  { english: 'Hello!', russian: 'Привет!', kazakh: 'Сәлем!', situation: 'Greetings', level: 'beginner' },
  { english: 'Good morning!', russian: 'Доброе утро!', kazakh: 'Қайырлы таң!', situation: 'Greetings', level: 'beginner' },
  { english: 'Good night!', russian: 'Спокойной ночи!', kazakh: 'Қайырлы түн!', situation: 'Greetings', level: 'beginner' },
  { english: 'Goodbye!', russian: 'До свидания!', kazakh: 'Сау болыңыз!', situation: 'Greetings', level: 'beginner' },
  { english: 'How are you?', russian: 'Как дела?', kazakh: 'Қалыңыз қалай?', situation: 'Greetings', level: 'beginner' },
  { english: 'I am fine!', russian: 'У меня все хорошо!', kazakh: 'Жақсыын!', situation: 'Greetings', level: 'beginner' },
  
  // BEGINNER - Вежливость
  { english: 'Thank you!', russian: 'Спасибо!', kazakh: 'Рахмет!', situation: 'Politeness', level: 'beginner' },
  { english: 'Please', russian: 'Пожалуйста', kazakh: 'Өтінемін', situation: 'Politeness', level: 'beginner' },
  { english: "You're welcome!", russian: 'Пожалуйста (в ответ)!', kazakh: 'Қош келдіңіз!', situation: 'Politeness', level: 'beginner' },
  { english: 'Sorry!', russian: 'Извините!', kazakh: 'Кешіріңіз!', situation: 'Politeness', level: 'beginner' },
  { english: 'Excuse me', russian: 'Простите', kazakh: 'Кешіріңіз', situation: 'Politeness', level: 'beginner' },

  // ELEMENTARY - Знакомство
  { english: "What's your name?", russian: 'Как тебя зовут?', kazakh: 'Сенің атың кім?', situation: 'Introduction', level: 'elementary' },
  { english: 'My name is...', russian: 'Меня зовут...', kazakh: 'Менің атым...', situation: 'Introduction', level: 'elementary' },
  { english: 'Nice to meet you!', russian: 'Приятно познакомиться!', kazakh: 'Танысқаныма қуаныштымын!', situation: 'Introduction', level: 'elementary' },
  { english: 'How old are you?', russian: 'Сколько тебе лет?', kazakh: 'ен неше жастасың?', situation: 'Introduction', level: 'elementary' },
  { english: 'I am 10 years old', russian: 'Мне 10 лет', kazakh: 'Мен 10 жастамын', situation: 'Introduction', level: 'elementary' },

  // ELEMENTARY - В школе
  { english: 'Can I go to the bathroom?', russian: 'Можно выйти?', kazakh: 'Шығуға болады ма?', situation: 'School', level: 'elementary' },
  { english: 'I have a question', russian: 'У меня вопрос', kazakh: 'Менде сұрақ бар', situation: 'School', level: 'elementary' },
  { english: 'I don\'t understand', russian: 'Я не понимаю', kazakh: 'Мен түсінбедім', situation: 'School', level: 'elementary' },
  { english: 'Can you repeat?', russian: 'Можете повторить?', kazakh: 'Қайталап айта аласыз ба?', situation: 'School', level: 'elementary' },
  { english: 'What does it mean?', russian: 'Что это значит?', kazakh: 'Бұл не дегенді білдіреді?', situation: 'School', level: 'elementary' },

  // INTERMEDIATE - Повседневное общение
  { english: 'What time is it?', russian: 'Который час?', kazakh: 'Сағат неше?', situation: 'Daily', level: 'intermediate' },
  { english: 'I like this!', russian: 'Мне это нравится!', kazakh: 'Маған бұл ұнайды!', situation: 'Daily', level: 'intermediate' },
  { english: 'I don\'t like that', russian: 'Мне это не нравится', kazakh: 'Маған бұл ұнамайды', situation: 'Daily', level: 'intermediate' },
  { english: 'Can you help me?', russian: 'Можешь мне помочь?', kazakh: 'Маған көмектесе аласың ба?', situation: 'Daily', level: 'intermediate' },
  { english: 'Where is...?', russian: 'Где находится...?', kazakh: 'Қайда орналасқан...?', situation: 'Daily', level: 'intermediate' },
  { english: 'How much is it?', russian: 'Сколько это стоит?', kazakh: 'Бұл қанша тұрады?', situation: 'Daily', level: 'intermediate' },
];

export function EnglishTrainer({ user, language }: EnglishTrainerProps) {
  const t = (key: keyof typeof import('../utils/translations').translations.ru) => 
    getTranslation(language, key);

  const [mode, setMode] = useState<Mode>('menu');
  const [selectedLevel, setSelectedLevel] = useState<Level>('beginner');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [currentWords, setCurrentWords] = useState<Word[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Word | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [learnedWords, setLearnedWords] = useState<Set<string>>(new Set());

  // Загрузка прогресса
  useEffect(() => {
    const saved = localStorage.getItem(`english_progress_${user.id}`);
    if (saved) {
      const data = JSON.parse(saved);
      setLearnedWords(new Set(data.learnedWords || []));
    }
  }, [user.id]);

  // Сохранение прогресса
  const saveProgress = (words: Set<string>) => {
    localStorage.setItem(`english_progress_${user.id}`, JSON.stringify({
      learnedWords: Array.from(words)
    }));
  };

  // Озвучивание текста на английском
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Получить темы для уровня
  const getTopicsForLevel = (level: Level) => {
    const topics = new Set<string>();
    VOCABULARY_DATABASE.filter(w => w.level === level).forEach(w => topics.add(w.category));
    return Array.from(topics);
  };

  // Старт изучения лексики
  const startVocabulary = (topic: string) => {
    const words = VOCABULARY_DATABASE.filter(w => w.level === selectedLevel && w.category === topic);
    setCurrentWords(words);
    setCurrentCardIndex(0);
    setFlipped(false);
    setSelectedTopic(topic);
    setMode('vocabulary');
  };

  // Переключение карточки
  const flipCard = () => {
    setFlipped(!flipped);
    if (!flipped) {
      speak(currentWords[currentCardIndex].english);
    }
  };

  // Следующая карточка
  const nextCard = () => {
    if (currentCardIndex < currentWords.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setFlipped(false);
    } else {
      toast.success(language === 'ru' ? '🎉 Тема изучена!' : language === 'kz' ? '🎉 Тақырып үйренілді!' : '🎉 Topic completed!');
      setMode('topic-select');
    }
  };

  // Предыдущая карточка
  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setFlipped(false);
    }
  };

  // Отметить слово как изученное
  const markAsLearned = () => {
    const word = currentWords[currentCardIndex];
    const newLearnedWords = new Set(learnedWords);
    newLearnedWords.add(word.english);
    setLearnedWords(newLearnedWords);
    saveProgress(newLearnedWords);
    toast.success('✅ ' + (language === 'ru' ? 'Слово выучено!' : language === 'kz' ? 'Сөз үйренілді!' : 'Word learned!'));
    nextCard();
  };

  const returnToMenu = () => {
    setMode('menu');
  };

  // Меню
  if (mode === 'menu') {
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
                {language === 'ru' ? 'Английский язык' : language === 'kz' ? 'Ағылшын тілі' : 'English Language'}
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                {language === 'ru' 
                  ? 'Увлекательное изучение английского: слова по темам, простая грамматика и разговорные фразы!' 
                  : language === 'kz'
                  ? 'Ағылшын тілін қызықты үйрену: тақырыптар бойынша сөздер, қарапайым грамматика және сөйлеу тіркестері!'
                  : 'Fun English learning: vocabulary by topics, simple grammar and conversation phrases!'}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Прогресс */}
        <Card className="p-6 bg-gradient-to-br from-white to-blue-50 border-4 border-blue-200 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <h3 className="text-2xl text-blue-900">
              {language === 'ru' ? 'Ваш прогресс' : language === 'kz' ? 'Сіздің прогресс' : 'Your Progress'}
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-700">
                {language === 'ru' ? 'Изучено слов:' : language === 'kz' ? 'Үйренген сөздер:' : 'Words learned:'}
              </span>
              <span className="text-2xl font-bold text-blue-900">{learnedWords.size}/{VOCABULARY_DATABASE.length}</span>
            </div>
            <Progress value={(learnedWords.size / VOCABULARY_DATABASE.length) * 100} className="h-4" />
          </div>
        </Card>

        {/* Выбор режима */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Лексика */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              onClick={() => setMode('level-select')}
              className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-4 border-purple-300 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-all"
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">📚</div>
                <h3 className="text-2xl text-purple-900">
                  {language === 'ru' ? 'Словарный запас' : language === 'kz' ? 'Сөздік қоры' : 'Vocabulary'}
                </h3>
                <p className="text-gray-700">
                  {language === 'ru' 
                    ? 'Учите новые слова по темам с карточками' 
                    : language === 'kz'
                    ? 'Карточкалармен тақырыптар бойынша жаңа сөздерді үйреніңіз'
                    : 'Learn new words by topics with flashcards'}
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-4 rounded-2xl shadow-lg w-full">
                  <BookOpen className="w-5 h-5 mr-2" />
                  {language === 'ru' ? 'Учить слова' : language === 'kz' ? 'Сөздерді үйрену' : 'Learn Words'}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Грамматика */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              onClick={() => setMode('grammar')}
              className="p-8 bg-gradient-to-br from-orange-50 to-orange-100 border-4 border-orange-300 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-all"
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">✍️</div>
                <h3 className="text-2xl text-orange-900">
                  {language === 'ru' ? 'Грамматика' : language === 'kz' ? 'Грамматика' : 'Grammar'}
                </h3>
                <p className="text-gray-700">
                  {language === 'ru' 
                    ? 'Простые правила грамматики с примерами' 
                    : language === 'kz'
                    ? 'Мысалдармен қарапайым грамматика ережелері'
                    : 'Simple grammar rules with examples'}
                </p>
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-4 rounded-2xl shadow-lg w-full">
                  <Book className="w-5 h-5 mr-2" />
                  {language === 'ru' ? 'Изучать' : language === 'kz' ? 'Үйрену' : 'Study'}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Разговорные фразы */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              onClick={() => setMode('conversation')}
              className="p-8 bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-300 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-all"
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">💬</div>
                <h3 className="text-2xl text-green-900">
                  {language === 'ru' ? 'Разговорный' : language === 'kz' ? 'Сөйлеу' : 'Conversation'}
                </h3>
                <p className="text-gray-700">
                  {language === 'ru' 
                    ? 'Полезные фразы для общения' 
                    : language === 'kz'
                    ? 'Қарым-қатынас үшін пайдал тіркестер'
                    : 'Useful phrases for communication'}
                </p>
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-2xl shadow-lg w-full">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {language === 'ru' ? 'Практика' : language === 'kz' ? 'Жаттығу' : 'Practice'}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Выбор уровня
  if (mode === 'level-select') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-100 border-4 border-purple-300 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                onClick={returnToMenu}
                variant="outline"
                className="border-2 border-purple-400 text-purple-700 hover:bg-purple-100 rounded-xl px-4 py-2"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {language === 'ru' ? 'Назад' : language === 'kz' ? 'Артқа' : 'Back'}
              </Button>
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-3xl text-purple-900">
                {language === 'ru' ? 'Выберите уровень' : language === 'kz' ? 'Деңгейді таңдаңыз' : 'Choose Level'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Beginner */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card 
                  onClick={() => {
                    setSelectedLevel('beginner');
                    setMode('topic-select');
                  }}
                  className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-300 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all"
                >
                  <div className="text-center space-y-3">
                    <div className="text-5xl">🌱</div>
                    <h3 className="text-2xl text-green-900">Beginner</h3>
                    <p className="text-gray-700">
                      {language === 'ru' ? 'Начальный уровень' : language === 'kz' ? 'Бастапқы деңгей' : 'Basic Level'}
                    </p>
                    <Badge className="bg-green-500 text-white">
                      {getTopicsForLevel('beginner').length} {language === 'ru' ? 'тем' : language === 'kz' ? 'тақырып' : 'topics'}
                    </Badge>
                  </div>
                </Card>
              </motion.div>

              {/* Elementary */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card 
                  onClick={() => {
                    setSelectedLevel('elementary');
                    setMode('topic-select');
                  }}
                  className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-300 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all"
                >
                  <div className="text-center space-y-3">
                    <div className="text-5xl">🌿</div>
                    <h3 className="text-2xl text-blue-900">Elementary</h3>
                    <p className="text-gray-700">
                      {language === 'ru' ? 'Базовый уровень' : language === 'kz' ? 'Негізгі деңгей' : 'Elementary Level'}
                    </p>
                    <Badge className="bg-blue-500 text-white">
                      {getTopicsForLevel('elementary').length} {language === 'ru' ? 'тем' : language === 'kz' ? 'тақырып' : 'topics'}
                    </Badge>
                  </div>
                </Card>
              </motion.div>

              {/* Pre-Intermediate */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card 
                  onClick={() => {
                    setSelectedLevel('pre-intermediate');
                    setMode('topic-select');
                  }}
                  className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-4 border-purple-300 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all"
                >
                  <div className="text-center space-y-3">
                    <div className="text-5xl">🌳</div>
                    <h3 className="text-2xl text-purple-900">Pre-Intermediate</h3>
                    <p className="text-gray-700">
                      {language === 'ru' ? 'Предварительный уровень' : language === 'kz' ? 'Алдыңғы орта деңгей' : 'Pre-Intermediate Level'}
                    </p>
                    <Badge className="bg-purple-500 text-white">
                      {getTopicsForLevel('pre-intermediate').length} {language === 'ru' ? 'тем' : language === 'kz' ? 'тақырып' : 'topics'}
                    </Badge>
                  </div>
                </Card>
              </motion.div>

              {/* Intermediate */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card 
                  onClick={() => {
                    setSelectedLevel('intermediate');
                    setMode('topic-select');
                  }}
                  className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-4 border-purple-300 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all"
                >
                  <div className="text-center space-y-3">
                    <div className="text-5xl">🌳</div>
                    <h3 className="text-2xl text-purple-900">Intermediate</h3>
                    <p className="text-gray-700">
                      {language === 'ru' ? 'Средний уровень' : language === 'kz' ? 'Орта деңгей' : 'Intermediate Level'}
                    </p>
                    <Badge className="bg-purple-500 text-white">
                      {getTopicsForLevel('intermediate').length} {language === 'ru' ? 'тем' : language === 'kz' ? 'тақырып' : 'topics'}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Выбор темы
  if (mode === 'topic-select') {
    const topics = getTopicsForLevel(selectedLevel);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl mx-auto"
      >
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 border-4 border-blue-300 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                onClick={() => setMode('level-select')}
                variant="outline"
                className="border-2 border-blue-400 text-blue-700 hover:bg-blue-100 rounded-xl px-4 py-2"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {language === 'ru' ? 'Назад' : language === 'kz' ? 'Артқа' : 'Back'}
              </Button>
              <Badge className="text-lg px-4 py-2 bg-blue-500 text-white">
                {selectedLevel.toUpperCase()}
              </Badge>
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-3xl text-blue-900">
                {language === 'ru' ? 'Выберите тему' : language === 'kz' ? 'Тақырыпты таңдаңыз' : 'Choose Topic'}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {topics.map((topic) => {
                const wordsInTopic = VOCABULARY_DATABASE.filter(w => w.level === selectedLevel && w.category === topic);
                const learnedInTopic = wordsInTopic.filter(w => learnedWords.has(w.english)).length;
                
                return (
                  <motion.div key={topic} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card 
                      onClick={() => startVocabulary(topic)}
                      className="p-6 bg-gradient-to-br from-white to-purple-50 border-4 border-purple-200 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all"
                    >
                      <div className="text-center space-y-3">
                        <div className="text-4xl">
                          {topic === 'Animals' ? '🐾' : 
                           topic === 'Colors' ? '🎨' : 
                           topic === 'Numbers' ? '🔢' : 
                           topic === 'Family' ? '👨‍👩‍👧‍👦' : 
                           topic === 'Food' ? '🍎' : 
                           topic === 'School' ? '🏫' : 
                           topic === 'Home' ? '🏠' : 
                           topic === 'Nature' ? '🌳' : 
                           topic === 'Actions' ? '🏃' : '📚'}
                        </div>
                        <h3 className="text-xl text-purple-900">{topic}</h3>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{wordsInTopic.length} {language === 'ru' ? 'слов' : language === 'kz' ? 'сөз' : 'words'}</span>
                          <span className="text-green-600">{learnedInTopic} ✓</span>
                        </div>
                        <Progress value={(learnedInTopic / wordsInTopic.length) * 100} className="h-2" />
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Изучение лексики (карточки)
  if (mode === 'vocabulary' && currentWords.length > 0) {
    const currentWord = currentWords[currentCardIndex];
    const translation = language === 'ru' ? currentWord.russian : language === 'kz' ? currentWord.kazakh : currentWord.russian;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-100 border-4 border-purple-300 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button
                onClick={() => setMode('topic-select')}
                variant="outline"
                className="border-2 border-purple-400 text-purple-700 hover:bg-purple-100 rounded-xl px-4 py-2"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {language === 'ru' ? 'Назад' : language === 'kz' ? 'Артқа' : 'Back'}
              </Button>
              <Badge className="text-lg px-4 py-2 bg-purple-500 text-white">
                {selectedTopic}
              </Badge>
            </div>

            <Progress value={((currentCardIndex + 1) / currentWords.length) * 100} className="h-3" />
            
            <div className="text-center text-lg text-purple-900">
              {currentCardIndex + 1} / {currentWords.length}
            </div>

            {/* Карточка */}
            <EnglishWordCard
              word={currentWord.english}
              category={currentWord.category}
              level={selectedLevel}
              language={language}
              flipped={flipped}
              onFlip={flipCard}
              onSpeak={speak}
              onLearnedClick={markAsLearned}
            />

            {/* Навигация */}
            <div className="flex justify-between items-center">
              <Button
                onClick={prevCard}
                disabled={currentCardIndex === 0}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl shadow-lg disabled:opacity-50"
              >
                ← {language === 'ru' ? 'Назад' : language === 'kz' ? 'Артқа' : 'Previous'}
              </Button>
              <Button
                onClick={nextCard}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl shadow-lg"
              >
                {currentCardIndex === currentWords.length - 1 
                  ? (language === 'ru' ? 'Завершить' : language === 'kz' ? 'Аяқтау' : 'Finish')
                  : (language === 'ru' ? 'Далее' : language === 'kz' ? 'Алға' : 'Next')} →
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Грамматика
  if (mode === 'grammar') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-5xl mx-auto"
      >
        <Card className="p-8 bg-gradient-to-br from-orange-50 to-yellow-100 border-4 border-orange-300 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                onClick={returnToMenu}
                variant="outline"
                className="border-2 border-orange-400 text-orange-700 hover:bg-orange-100 rounded-xl px-4 py-2"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {language === 'ru' ? 'Назад' : language === 'kz' ? 'Артқа' : 'Back'}
              </Button>
            </div>

            <div className="text-center space-y-4">
              <div className="text-6xl">✍️</div>
              <h2 className="text-3xl text-orange-900">
                {language === 'ru' ? 'Грамматика' : language === 'kz' ? 'Грамматика' : 'Grammar'}
              </h2>
              <p className="text-xl text-gray-700">
                {language === 'ru' ? 'Простые правила с примерами' : language === 'kz' ? 'Мысалдармен қарапайым ережелер' : 'Simple rules with examples'}
              </p>
            </div>

            <div className="space-y-4">
              {GRAMMAR_LESSONS.map((lesson, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-white to-orange-50 border-4 border-orange-200 rounded-2xl shadow-lg">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl text-orange-900">
                          {lesson.title[language]}
                        </h3>
                        <Badge className="bg-orange-500 text-white">
                          {lesson.level}
                        </Badge>
                      </div>
                      <p className="text-lg text-gray-700">
                        {lesson.explanation[language]}
                      </p>
                      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-xl border-2 border-yellow-300">
                        <p className="text-sm text-gray-600 mb-2">
                          {language === 'ru' ? '📝 Примеры:' : language === 'kz' ? '📝 Мысалдар:' : '📝 Examples:'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {lesson.examples.map((example, i) => (
                            <motion.div
                              key={i}
                              whileHover={{ scale: 1.05 }}
                              className="bg-white px-4 py-2 rounded-xl border-2 border-orange-300 shadow-sm cursor-pointer"
                              onClick={() => speak(example)}
                            >
                              <span className="text-lg font-semibold text-orange-900">{example}</span>
                              <Volume2 className="w-4 h-4 inline ml-2 text-orange-600" />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Разговорные фразы
  if (mode === 'conversation') {
    const groupedPhrases = CONVERSATION_PHRASES.reduce((acc, phrase) => {
      if (!acc[phrase.situation]) {
        acc[phrase.situation] = [];
      }
      acc[phrase.situation].push(phrase);
      return acc;
    }, {} as Record<string, ConversationPhrase[]>);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-5xl mx-auto"
      >
        <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-100 border-4 border-green-300 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                onClick={returnToMenu}
                variant="outline"
                className="border-2 border-green-400 text-green-700 hover:bg-green-100 rounded-xl px-4 py-2"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {language === 'ru' ? 'Назад' : language === 'kz' ? 'Артқа' : 'Back'}
              </Button>
            </div>

            <div className="text-center space-y-4">
              <div className="text-6xl">💬</div>
              <h2 className="text-3xl text-green-900">
                {language === 'ru' ? 'Разговорные фразы' : language === 'kz' ? 'Сөйлеу тіркестері' : 'Conversation Phrases'}
              </h2>
              <p className="text-xl text-gray-700">
                {language === 'ru' ? 'Полезные фразы для общения' : language === 'kz' ? 'Қарым-қатынас үшін пайдалы тіркестер' : 'Useful phrases for communication'}
              </p>
            </div>

            <div className="space-y-6">
              {Object.entries(groupedPhrases).map(([situation, phrases], idx) => (
                <motion.div
                  key={situation}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-white to-green-50 border-4 border-green-200 rounded-2xl shadow-lg">
                    <h3 className="text-2xl text-green-900 mb-4 flex items-center gap-2">
                      {situation === 'Greetings' ? '👋' : 
                       situation === 'Politeness' ? '🙏' : 
                       situation === 'Introduction' ? '🤝' : 
                       situation === 'School' ? '🏫' : 
                       situation === 'Daily' ? '☀️' : '💬'} 
                      {situation}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {phrases.map((phrase, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.02 }}
                          className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-xl border-2 border-green-300 shadow-sm cursor-pointer"
                          onClick={() => speak(phrase.english)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="text-lg font-bold text-green-900 mb-1">
                                {phrase.english}
                              </div>
                              <div className="text-md text-gray-700">
                                {language === 'ru' ? phrase.russian : language === 'kz' ? phrase.kazakh : phrase.russian}
                              </div>
                            </div>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                speak(phrase.english);
                              }}
                              className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 ml-2"
                              size="sm"
                            >
                              <Volume2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <Badge className="mt-2 bg-green-600 text-white text-xs">
                            {phrase.level}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return null;
}