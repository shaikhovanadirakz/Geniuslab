import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { saveReadingResult, User, calculateReadingPoints, addPoints } from '../utils/storage';
import { Language, getTranslation } from '../utils/translations';
import { BookOpen, Play, Pause, RotateCcw, Settings, TrendingUp, Eye, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SpeedReadingTrainerProps {
  user: User;
  language: Language;
}

interface TextData {
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

type DisplayMode = 'words' | 'sentences' | 'paragraph';
type TextDifficulty = 'easy' | 'medium' | 'hard';

const TEXTS: Record<Language, TextData[]> = {
  ru: [
    // Easy texts
    {
      difficulty: 'easy',
      text: 'Котёнок сидел на окне. Он смотрел на птиц в саду. Птицы весело прыгали по траве. Котёнок мяукал и махал лапкой. Ему хотелось поиграть с птичками. Но окно было закрыто. Мама сказала, что котёнку нельзя на улицу. Он ещё маленький. Котёнок лёг на подоконник и задремал. Ему снились птицы и зелёная трава.',
      questions: [
        {
          question: 'Где сидел котёнок?',
          options: ['На столе', 'На окне', 'На полу', 'На диване'],
          correctAnswer: 1
        },
        {
          question: 'На кого смотрел котёнок?',
          options: ['На собак', 'На кошек', 'На птиц', 'На мышей'],
          correctAnswer: 2
        }
      ]
    },
    {
      difficulty: 'easy',
      text: 'Маша любит рисовать. У неё много цветных карандашей. Сегодня она рисует радугу. Красный, оранжевый, жёлтый цвета. Маша старается аккуратно раскрашивать. Мама хвалит её рисунок. Маша очень рада. Она хочет подарить рисунок бабушке. Бабушка будет счастлива. Маша любит делать приятное близким.',
      questions: [
        {
          question: 'Что любит делать Маша?',
          options: ['Петь', 'Рисовать', 'Танцевать', 'Читать'],
          correctAnswer: 1
        },
        {
          question: 'Кому Маша хочет подарить рисунок?',
          options: ['Маме', 'Папе', 'Бабушке', 'Учителю'],
          correctAnswer: 2
        }
      ]
    },
    // Medium texts
    {
      difficulty: 'medium',
      text: 'Солнце медленно опускалось за горизонт, окрашивая небо в удивительные оттенки розового и оранжевого. Птицы возвращались в свои гнезда, заканчивая дневной полет. Воздух становился прохладнее, и легкий ветерок приносил запах свежескошенной травы. Это было идеальное время для вечерней прогулки по парку. Люди выходили из своих домов, чтобы насладиться последними лучами заходящего солнца. Дети играли на площадках, а их родители сидели на скамейках, обсуждая события дня.',
      questions: [
        {
          question: 'В какое время суток происходит действие?',
          options: ['Утро', 'День', 'Вечер', 'Ночь'],
          correctAnswer: 2
        },
        {
          question: 'Что делали дети в парке?',
          options: ['Читали книги', 'Играли на площадках', 'Кормили птиц', 'Спали'],
          correctAnswer: 1
        }
      ]
    },
    {
      difficulty: 'medium',
      text: 'Библиотека всегда была особенным местом для Марии. Здесь она проводила часы, погружаясь в удивительные миры литературы. Высокие полки с книгами тянулись к потолку, создавая лабиринт знаний. Запах старых страниц смешивался с ароматом свежего кофе из читального зала. Мария любила сидеть у окна, где солнечный свет падал на страницы, делая чтение особенно приятным. Каждая книга открывала перед ней новую вселенную, полную приключений и открытий.',
      questions: [
        {
          question: 'Где любила сидеть Мария?',
          options: ['В углу', 'У окна', 'У входа', 'В центре зала'],
          correctAnswer: 1
        },
        {
          question: 'Какой запах был в библиотеке?',
          options: ['Только кофе', 'Только старых страниц', 'Старых страниц и кофе', 'Цветов'],
          correctAnswer: 2
        }
      ]
    },
    // Hard texts
    {
      difficulty: 'hard',
      text: 'Феномен синестезии представляет собой уникальное неврологическое состояние, при котором стимуляция одного сенсорного канала автоматически вызывает восприятие в другом. Наиболее распространённая форма – графемно-цветовая синестезия, когда буквы и цифры ассоциируются с определёнными цветами. Учёные предполагают, что это явление возникает из-за повышенной связности между различными областями коры головного мозга. Исследования показывают, что синестеты демонстрируют улучшенные способности в творческом мышлении и запоминании информации.',
      questions: [
        {
          question: 'Что такое синестезия?',
          options: ['Болезнь', 'Неврологическое состояние', 'Творческий метод', 'Психологическое расстройство'],
          correctAnswer: 1
        },
        {
          question: 'Какая форма синестезии наиболее распространена?',
          options: ['Звуково-вкусовая', 'Графемно-цветовая', 'Тактильно-звуковая', 'Обонятельно-визуальная'],
          correctAnswer: 1
        }
      ]
    },
    {
      difficulty: 'hard',
      text: 'Квантовая запутанность является одним из наиболее загадочных явлений современной физики. Когда две частицы находятся в запутанном состоянии, измерение свойств одной частицы мгновенно влияет на состояние другой, независимо от расстояния между ними. Эйнштейн называл это "жутким дальнодействием" и долго не мог принять данную концепцию. Однако многочисленные эксперименты подтвердили реальность этого феномена, что открывает перспективы для квантовых компьютеров и сверхзащищённых систем связи.',
      questions: [
        {
          question: 'Как Эйнштейн называл квантовую запутанность?',
          options: ['Невозможным явлением', 'Жутким дальнодействием', 'Квантовой магией', 'Парадоксом'],
          correctAnswer: 1
        },
        {
          question: 'Для чего может использоваться квантовая запутанность?',
          options: ['Только для теории', 'Для квантовых компьютеров и связи', 'Для космических путешествий', 'Для медицины'],
          correctAnswer: 1
        }
      ]
    }
  ],
  kz: [
    // Easy
    {
      difficulty: 'easy',
      text: 'Мысық терезеде отырды. Ол бақшадағы құстарды көрді. Құстар шөпте қуана секірді. Мысық мияулап, лапымен бұлғады. Ол құстармен ойнағысы келді. Бірақ терезе жабық болды. Анасы мысыққа сыртқа шығуға болмайды деді. Ол әлі кішкентай. Мысық терезенің алдында жатып қалды. Оған құстар мен жасыл шөп түс көрінді.',
      questions: [
        {
          question: 'Мысық қайда отырды?',
          options: ['Үстелде', 'Терезеде', 'Еденде', 'Диванда'],
          correctAnswer: 1
        },
        {
          question: 'Мысық кімге қарады?',
          options: ['Иттерге', 'Мысықтарға', 'Құстарға', 'Тышқандарға'],
          correctAnswer: 2
        }
      ]
    },
    // Medium
    {
      difficulty: 'medium',
      text: 'Күн баяу көкжиекке батып, аспанды қызғылт және сарғыш түстердің керемет реңктерімен бояды. Құстар күндізгі ұшуларын аяқтап, ұяларына қайтты. Ауа салқындай бастады, жел жаңа шалынған шөптің иісін әкелді. Бұл саябақта кешкі серуенге шығу үшін тамаша уақыт болды. Адамдар батып бара жатқан күннің соңғы сәулелерінен ләззат алу үшін үйлерінен шықты.',
      questions: [
        {
          question: 'Әрекет қай уақытта болады?',
          options: ['Таң', 'Күн', 'Кеш', 'Түн'],
          correctAnswer: 2
        },
        {
          question: 'Жел қандай иіс әкелді?',
          options: ['Гүлдердің', 'Жаңа шалынған шөптің', 'Теңіздің', 'Орманның'],
          correctAnswer: 1
        }
      ]
    },
    // Hard
    {
      difficulty: 'hard',
      text: 'Синестезия феномені бір сенсорлық арнаның ынталандырылуы екіншісінде автоматты түрде қабылдауды тудыратын бірегей неврологиялық жағдай болып табылады. Ең кең таралған формасы – графемалық-түсті синестезия, онда әріптер мен сандар белгілі бір түстермен байланыстырылады. Ғалымдар бұл құбылыс ми қыртысының әртүрлі аймақтары арасындағы жоғары байланыстылықтың арқасында пайда болады деп болжайды.',
      questions: [
        {
          question: 'Синестезия дегеніміз не?',
          options: ['Ауру', 'Неврологиялық жағдай', 'Шығармашылық әдіс', 'Психологиялық бұзылыс'],
          correctAnswer: 1
        },
        {
          question: 'Қандай синестезия формасы ең кең таралған?',
          options: ['Дыбыстық-дәмдік', 'Графемалық-түсті', 'Тактильді-дыбыстық', 'Иіс сезу-визуалды'],
          correctAnswer: 1
        }
      ]
    }
  ],
  en: [
    // Easy
    {
      difficulty: 'easy',
      text: 'A kitten sat on the window. He looked at the birds in the garden. The birds happily jumped on the grass. The kitten meowed and waved his paw. He wanted to play with the birds. But the window was closed. Mom said the kitten cannot go outside. He is still small. The kitten lay down on the windowsill and dozed off. He dreamed of birds and green grass.',
      questions: [
        {
          question: 'Where was the kitten sitting?',
          options: ['On the table', 'On the window', 'On the floor', 'On the sofa'],
          correctAnswer: 1
        },
        {
          question: 'What was the kitten looking at?',
          options: ['Dogs', 'Cats', 'Birds', 'Mice'],
          correctAnswer: 2
        }
      ]
    },
    // Medium
    {
      difficulty: 'medium',
      text: 'The sun slowly descended below the horizon, painting the sky in amazing shades of pink and orange. Birds returned to their nests, finishing their daily flight. The air became cooler, and a light breeze brought the smell of freshly cut grass. It was the perfect time for an evening walk in the park. People came out of their homes to enjoy the last rays of the setting sun.',
      questions: [
        {
          question: 'What time of day is the action taking place?',
          options: ['Morning', 'Afternoon', 'Evening', 'Night'],
          correctAnswer: 2
        },
        {
          question: 'What smell did the breeze bring?',
          options: ['Flowers', 'Freshly cut grass', 'Sea', 'Forest'],
          correctAnswer: 1
        }
      ]
    },
    // Hard
    {
      difficulty: 'hard',
      text: 'The phenomenon of synesthesia represents a unique neurological condition in which stimulation of one sensory channel automatically triggers perception in another. The most common form is grapheme-color synesthesia, where letters and numbers are associated with specific colors. Scientists suggest that this phenomenon arises due to increased connectivity between different areas of the cerebral cortex. Studies show that synesthetes demonstrate enhanced abilities in creative thinking and information retention.',
      questions: [
        {
          question: 'What is synesthesia?',
          options: ['A disease', 'A neurological condition', 'A creative method', 'A psychological disorder'],
          correctAnswer: 1
        },
        {
          question: 'What is the most common form of synesthesia?',
          options: ['Sound-taste', 'Grapheme-color', 'Tactile-sound', 'Olfactory-visual'],
          correctAnswer: 1
        }
      ]
    }
  ]
};

export function SpeedReadingTrainer({ user, language }: SpeedReadingTrainerProps) {
  const t = (key: keyof typeof import('../utils/translations').translations.ru) => 
    getTranslation(language, key);

  const [wpm, setWpm] = useState(200);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('words');
  const [difficulty, setDifficulty] = useState<TextDifficulty>('medium');
  const [isReading, setIsReading] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [currentSentence, setCurrentSentence] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [wordsRead, setWordsRead] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Фильтрация текстов по сложности
  const availableTexts = TEXTS[language].filter(t => t.difficulty === difficulty);
  const currentText = availableTexts[currentTextIndex % availableTexts.length];
  const words = currentText.text.split(' ');
  const sentences = currentText.text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const msPerWord = (60 / wpm) * 1000;

  useEffect(() => {
    if (displayMode === 'words' && isReading && wordIndex < words.length) {
      setCurrentWord(words[wordIndex]);
      intervalRef.current = setTimeout(() => {
        setWordIndex(wordIndex + 1);
        setWordsRead(wordIndex + 1);
      }, msPerWord);
    } else if (displayMode === 'sentences' && isReading && sentenceIndex < sentences.length) {
      setCurrentSentence(sentences[sentenceIndex].trim());
      const sentenceWords = sentences[sentenceIndex].trim().split(' ').length;
      const sentenceTime = sentenceWords * msPerWord;
      intervalRef.current = setTimeout(() => {
        setSentenceIndex(sentenceIndex + 1);
        setWordsRead(wordsRead + sentenceWords);
      }, sentenceTime);
    } else if (isReading && (wordIndex >= words.length || sentenceIndex >= sentences.length)) {
      setIsReading(false);
      setShowQuestions(true);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isReading, wordIndex, sentenceIndex, words, sentences, msPerWord, displayMode, wordsRead]);

  const startReading = () => {
    setShowSettings(false);
    setIsReading(true);
    setWordIndex(0);
    setSentenceIndex(0);
    setWordsRead(0);
    setStartTime(Date.now());
  };

  const pauseReading = () => {
    setIsReading(false);
  };

  const resetReading = () => {
    setIsReading(false);
    setWordIndex(0);
    setSentenceIndex(0);
    setCurrentWord('');
    setCurrentSentence('');
    setShowSettings(true);
    setShowQuestions(false);
    setAnswers([]);
    setScore(0);
    setWordsRead(0);
  };

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const submitAnswers = () => {
    let correctCount = 0;
    currentText.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        correctCount++;
      }
    });

    const comprehensionScore = (correctCount / currentText.questions.length) * 100;
    const finalScore = Math.round(comprehensionScore);
    setScore(finalScore);

    // Сохранение результата
    saveReadingResult({
      userId: user.id,
      wpm,
      wordsRead: words.length,
      comprehension: comprehensionScore,
      timestamp: new Date().toISOString()
    });

    // Начисление баллов
    const earnedPoints = calculateReadingPoints(wpm, comprehensionScore);
    if (earnedPoints > 0) {
      addPoints(user.id, earnedPoints, `Speed Reading: ${wpm} WPM, ${Math.round(comprehensionScore)}% comprehension`);
      toast.success(`${t('completed')}! +${earnedPoints} ${t('points')}`);
    }
  };

  const nextText = () => {
    const nextIndex = (currentTextIndex + 1) % availableTexts.length;
    setCurrentTextIndex(nextIndex);
    resetReading();
  };

  if (showQuestions) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-purple-300 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl mb-2 flex items-center justify-center gap-3">
              <BookOpen className="w-8 h-8 text-purple-600" />
              {t('comprehensionCheck')}
            </h2>
            <p className="text-purple-600">
              {t('wordsRead')}: {wordsRead} | {t('speed')}: {wpm} {t('wpm')}
            </p>
          </div>

          {!score ? (
            <div className="space-y-6">
              {currentText.questions.map((question, qIndex) => (
                <Card key={qIndex} className="p-6 bg-white border-2 border-purple-200 rounded-2xl">
                  <h3 className="mb-4">{question.question}</h3>
                  <RadioGroup
                    value={answers[qIndex]?.toString()}
                    onValueChange={(value) => handleAnswer(qIndex, parseInt(value))}
                  >
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                        <Label htmlFor={`q${qIndex}-o${oIndex}`} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </Card>
              ))}

              <div className="flex gap-4">
                <Button
                  onClick={submitAnswers}
                  disabled={answers.length !== currentText.questions.length}
                  className="flex-1 btn-gradient-purple text-white py-6 rounded-2xl shadow-xl text-lg"
                >
                  {t('checkAnswers')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">
                {score >= 80 ? '🌟' : score >= 60 ? '👍' : '💪'}
              </div>
              <h3 className="text-2xl mb-4">{t('comprehension')}: {score}%</h3>
              <div className="flex gap-4">
                <Button
                  onClick={nextText}
                  className="flex-1 btn-gradient-blue text-white py-6 rounded-2xl shadow-xl text-lg"
                >
                  {t('nextText')}
                </Button>
                <Button
                  onClick={resetReading}
                  variant="outline"
                  className="flex-1 border-3 border-purple-300 py-6 rounded-2xl text-lg"
                >
                  {t('backToSettings')}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    );
  }

  if (showSettings) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-4 border-blue-300 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl mb-2 flex items-center justify-center gap-3">
              <Settings className="w-8 h-8 text-blue-600" />
              {t('settings')}
            </h2>
            <p className="text-blue-600">{t('readingTrainer')}</p>
          </div>

          <div className="space-y-8">
            {/* Выбор сложности текста */}
            <div>
              <Label className="text-lg mb-4 block flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t('textDifficulty')}
              </Label>
              <RadioGroup value={difficulty} onValueChange={(value) => setDifficulty(value as TextDifficulty)}>
                <div className="grid grid-cols-3 gap-4">
                  <Card className={`p-4 cursor-pointer transition-all ${difficulty === 'easy' ? 'border-4 border-green-400 bg-green-50' : 'border-2 border-gray-200'}`}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="easy" id="easy" />
                      <Label htmlFor="easy" className="cursor-pointer">
                        {t('easyLevel')} 🌱
                      </Label>
                    </div>
                  </Card>
                  <Card className={`p-4 cursor-pointer transition-all ${difficulty === 'medium' ? 'border-4 border-blue-400 bg-blue-50' : 'border-2 border-gray-200'}`}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium" className="cursor-pointer">
                        {t('mediumLevel')} ⭐
                      </Label>
                    </div>
                  </Card>
                  <Card className={`p-4 cursor-pointer transition-all ${difficulty === 'hard' ? 'border-4 border-purple-400 bg-purple-50' : 'border-2 border-gray-200'}`}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hard" id="hard" />
                      <Label htmlFor="hard" className="cursor-pointer">
                        {t('hardLevel')} 🔥
                      </Label>
                    </div>
                  </Card>
                </div>
              </RadioGroup>
            </div>

            {/* Выбор режима отображения */}
            <div>
              <Label className="text-lg mb-4 block flex items-center gap-2">
                <Eye className="w-5 h-5" />
                {t('displayMode')}
              </Label>
              <RadioGroup value={displayMode} onValueChange={(value) => setDisplayMode(value as DisplayMode)}>
                <div className="grid grid-cols-3 gap-4">
                  <Card className={`p-4 cursor-pointer transition-all ${displayMode === 'words' ? 'border-4 border-blue-400 bg-blue-50' : 'border-2 border-gray-200'}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="words" id="words" />
                      <Label htmlFor="words" className="cursor-pointer">
                        {t('byWords')}
                      </Label>
                    </div>
                    <p className="text-xs text-gray-600">💬 {t('wordsWillAppear')}</p>
                  </Card>
                  <Card className={`p-4 cursor-pointer transition-all ${displayMode === 'sentences' ? 'border-4 border-indigo-400 bg-indigo-50' : 'border-2 border-gray-200'}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="sentences" id="sentences" />
                      <Label htmlFor="sentences" className="cursor-pointer">
                        {t('bySentences')}
                      </Label>
                    </div>
                    <p className="text-xs text-gray-600">📝 {t('sentencesWillAppear')}</p>
                  </Card>
                  <Card className={`p-4 cursor-pointer transition-all ${displayMode === 'paragraph' ? 'border-4 border-purple-400 bg-purple-50' : 'border-2 border-gray-200'}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="paragraph" id="paragraph" />
                      <Label htmlFor="paragraph" className="cursor-pointer">
                        {t('byParagraph')}
                      </Label>
                    </div>
                    <p className="text-xs text-gray-600">📄 {t('paragraphWillAppear')}</p>
                  </Card>
                </div>
              </RadioGroup>
            </div>

            {/* Скорость чтения (только для режимов слов и предложений) */}
            {displayMode !== 'paragraph' && (
              <div>
                <Label className="text-lg mb-4 block flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t('readingSpeed')}: {wpm} {t('wpm')}
                </Label>
                <Slider
                  value={[wpm]}
                  onValueChange={(value) => setWpm(value[0])}
                  min={100}
                  max={1000}
                  step={50}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-blue-600">
                  <span>100 {t('wpm')}</span>
                  <span>1000 {t('wpm')}</span>
                </div>
              </div>
            )}

            <Card className="p-6 bg-white border-2 border-blue-200 rounded-2xl">
              <h3 className="mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                {t('howItWorks')}
              </h3>
              <ul className="space-y-2 text-blue-700">
                <li>• {displayMode === 'words' && t('wordsWillAppear')}</li>
                <li>• {displayMode === 'sentences' && t('sentencesWillAppear')}</li>
                <li>• {displayMode === 'paragraph' && t('paragraphWillAppear')}</li>
                <li>• {t('tryToReadAndUnderstand')}</li>
                <li>• {t('afterReadingAnswerQuestions')}</li>
                <li>• {t('speedAndComprehension')}</li>
              </ul>
            </Card>

            <Button
              onClick={startReading}
              className="w-full btn-gradient-blue text-white py-6 rounded-2xl shadow-xl text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              {t('start')}
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Режим отображения абзацем
  if (displayMode === 'paragraph') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-purple-300 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <p className="text-purple-600 mb-2">{t('textDifficulty')}: {
              difficulty === 'easy' ? t('easyLevel') : 
              difficulty === 'medium' ? t('mediumLevel') : 
              t('hardLevel')
            }</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border-2 border-purple-200 mb-8">
            <p className="text-lg leading-relaxed">
              {currentText.text}
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => {
                setWordsRead(words.length);
                setShowQuestions(true);
              }}
              className="flex-1 btn-gradient-purple text-white py-6 rounded-2xl shadow-xl text-lg"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              {t('continue')}
            </Button>
            <Button
              onClick={resetReading}
              variant="outline"
              className="flex-1 border-3 border-purple-300 py-6 rounded-2xl text-lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              {t('reset')}
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Режим отображения по словам или предложениям
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-4 border-indigo-300 rounded-3xl shadow-2xl min-h-[500px] flex flex-col">
        <div className="text-center mb-8">
          <p className="text-indigo-600 mb-2">{t('speed')}: {wpm} {t('wpm')}</p>
          <p className="text-sm text-indigo-500">
            {t('progress')}: {displayMode === 'words' ? `${wordIndex} / ${words.length}` : `${sentenceIndex} / ${sentences.length}`}
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <motion.div
            key={displayMode === 'words' ? wordIndex : sentenceIndex}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.1 }}
            className={`text-center px-8 py-12 bg-white rounded-3xl shadow-2xl border-4 border-indigo-200 ${
              displayMode === 'words' ? 'text-5xl md:text-7xl' : 'text-2xl md:text-3xl max-w-3xl'
            }`}
          >
            {displayMode === 'words' ? currentWord : currentSentence}
          </motion.div>
        </div>

        <div className="flex gap-4 mt-8">
          {isReading ? (
            <Button
              onClick={pauseReading}
              className="flex-1 btn-gradient-orange text-white py-6 rounded-2xl shadow-xl text-lg"
            >
              <Pause className="w-5 h-5 mr-2" />
              {t('pause')}
            </Button>
          ) : (
            <Button
              onClick={() => setIsReading(true)}
              className="flex-1 btn-gradient-green text-white py-6 rounded-2xl shadow-xl text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              {(wordIndex === 0 && sentenceIndex === 0) ? t('start') : t('continue')}
            </Button>
          )}
          <Button
            onClick={resetReading}
            variant="outline"
            className="flex-1 border-3 border-indigo-300 py-6 rounded-2xl text-lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {t('reset')}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
