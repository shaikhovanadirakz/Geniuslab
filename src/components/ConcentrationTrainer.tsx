import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { User, saveConcentrationResult, calculateConcentrationPoints, addPoints } from '../utils/storage';
import { Language, getTranslation } from '../utils/translations';
import { Target, Eye, CheckCircle, XCircle, Clock, Trophy, Play, RefreshCw, Zap, Star, ArrowLeft, Pause } from 'lucide-react';
import { toast } from 'sonner';

interface ConcentrationTrainerProps {
  user: User;
  language: Language;
}

type GameMode = 'findAll' | 'pairs' | 'different' | 'track';
type Difficulty = 'easy' | 'medium' | 'hard';

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'];

const COLORS = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛', '⬜'];

const SHAPES = ['⭐', '🔷', '🔶', '🔸', '🔹', '🔺', '🔻', '💠', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫'];

// Сложные наборы для "Найди отличие" - визуально почти идентичные элементы
const SIMILAR_SETS = [
  // Почти идентичные смайлики (очень тонкие отличия)
  { base: '😀', different: '😃' }, // Открытый рот vs зубы
  { base: '😃', different: '😄' }, // Зубы vs прищуренные глаза
  { base: '😊', different: '😌' }, // Улыбка открытая vs закрытые глаза
  { base: '🙂', different: '🙃' }, // Нормальное vs перевернутое
  { base: '😐', different: '😑' }, // Нейтральное vs с линией рта
  { base: '😶', different: '😐' }, // Без рта vs нейтральное
  { base: '🤔', different: '🤨' }, // Думает vs поднятая бровь
  { base: '😏', different: '😒' }, // Усмешка vs недовольство
  { base: '😬', different: '😁' }, // Стиснутые зубы vs улыбка
  { base: '🥲', different: '🥹' }, // Слеза радости vs умиление
  
  // Практически одинаковые геометрические фигуры
  { base: '⚫', different: '⬛' }, // Черный круг vs квадрат
  { base: '⚪', different: '⬜' }, // Белый круг vs квадрат
  { base: '🔵', different: '🟦' }, // Синий круг vs квадрат
  { base: '🔴', different: '🟥' }, // Красный круг vs квадрат
  { base: '🟡', different: '🟨' }, // Желтый круг vs квадрат
  { base: '🟢', different: '🟩' }, // Зеленый круг vs квадрат
  { base: '🟣', different: '🟪' }, // Фиолетовый круг vs квадрат
  { base: '🟤', different: '🟫' }, // Коричневый круг vs квадрат
  { base: '🟠', different: '🟧' }, // Оранжевый круг vs квадрат
  
  // Минимальные отличия в маленьких символах
  { base: '▪️', different: '◾' }, // Маленький квадрат vs средний квадрат
  { base: '▫️', different: '◽' }, // Маленький белый квадрат vs средний
  { base: '◼️', different: '◾' }, // Средний vs маленький черный квадрат
  { base: '◻️', different: '◽' }, // Средний vs маленький белый квадрат
  
  // Похожие ромбы и точки
  { base: '🔸', different: '🔶' }, // Маленький vs большой оранжевый ромб
  { base: '🔹', different: '🔷' }, // Маленький vs большой синий ромб
  { base: '🔺', different: '🔻' }, // Треугольник вверх vs вниз (красный)
  { base: '◀️', different: '▶️' }, // Треугольник влево vs вправо
  
  // Очень похожие животные (минимальные отличия)
  { base: '🐱', different: '🐈' }, // Морда кошки vs кошка целиком
  { base: '🐶', different: '🐕' }, // Морда собаки vs собака целиком
  { base: '🐻', different: '🧸' }, // Медведь vs плюшевый медведь
  { base: '🐰', different: '🐇' }, // Морда кролика vs кролик целиком
  
  // Похожие звезды и сияния
  { base: '⭐', different: '🌟' }, // Звезда vs сияющая звезда
  { base: '✨', different: '💫' }, // Искры vs головокружение
  { base: '⚡', different: '🗲' }, // Молния разные стили
  
  // Круги разных оттенков (очень близкие цвета)
  { base: '💙', different: '💜' }, // Синее vs фиолетовое сердце
  { base: '💚', different: '💛' }, // Зеленое vs желтое сердце
  { base: '🧡', different: '💛' }, // Оранжевое vs желтое сердце
  { base: '❤️', different: '🧡' }, // Красное vs оранжевое сердце
  
  // Луны и солнца
  { base: '🌕', different: '🌝' }, // Полная луна vs луна с лицом
  { base: '🌑', different: '🌚' }, // Новая луна vs луна с лицом
  { base: '☀️', different: '🌞' }, // Солнце vs солнце с лицом
  
  // Точки и круги разных размеров
  { base: '⚫', different: '●' }, // Черный круг разные размеры
  { base: '⚪', different: '○' }, // Белый круг разные размеры
  { base: '🔘', different: '⚫' }, // Радио кнопка vs круг
];

export function ConcentrationTrainer({ user, language }: ConcentrationTrainerProps) {
  const t = (key: keyof typeof import('../utils/translations').translations.ru) => 
    getTranslation(language, key);

  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isPlaying, setIsPlaying] = useState(false);
  const [grid, setGrid] = useState<string[]>([]);
  const [targets, setTargets] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [firstCard, setFirstCard] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(5);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [movingItems, setMovingItems] = useState<Array<{id: number, x: number, y: number, emoji: string}>>([]);
  const [targetToTrack, setTargetToTrack] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0 && !showResults && !isPaused) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, showResults, isPaused]);

  useEffect(() => {
    let animationFrame: number;
    if (gameMode === 'track' && isPlaying && movingItems.length > 0 && !isPaused) {
      const animate = () => {
        setMovingItems(prev => prev.map(item => ({
          ...item,
          x: item.x + (Math.random() - 0.5) * 12, // Увеличил скорость с 5 до 12
          y: item.y + (Math.random() - 0.5) * 12
        })).map(item => ({
          ...item,
          x: Math.max(8, Math.min(92, item.x)), // Меньше отступ от краев для большей свободы
          y: Math.max(8, Math.min(92, item.y))
        })));
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [gameMode, isPlaying, movingItems.length, isPaused]);

  const getGridSize = () => {
    const sizes = {
      easy: { findAll: 20, pairs: 8, different: 20, track: 8 },
      medium: { findAll: 36, pairs: 12, different: 36, track: 10 },
      hard: { findAll: 64, pairs: 16, different: 64, track: 16 }
    };
    return sizes[difficulty][gameMode!] || 20;
  };

  const getTimeLimit = () => {
    const times = {
      easy: 90,
      medium: 60,
      hard: 45
    };
    return times[difficulty];
  };

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setRound(1);
    setScore(0);
    setCorrect(0);
    setIncorrect(0);
    setShowResults(false);
    startRound(mode);
  };

  const startRound = (mode: GameMode) => {
    setIsPlaying(true);
    setSelected(new Set());
    setMatched(new Set());
    setFirstCard(null);
    setTimeLeft(getTimeLimit());

    if (mode === 'findAll') {
      startFindAllRound();
    } else if (mode === 'pairs') {
      startPairsRound();
    } else if (mode === 'different') {
      startDifferentRound();
    } else if (mode === 'track') {
      startTrackRound();
    }
  };

  const startFindAllRound = () => {
    const gridSize = getGridSize();
    const itemPool = EMOJIS;
    
    // Calculate target count as 40% of grid size
    const targetItemsCount = Math.round(gridSize * 0.4);
    
    // Determine how many unique items to search for
    const numUniqueTargets = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
    
    const targetItems = [];
    for (let i = 0; i < numUniqueTargets; i++) {
      let item = itemPool[Math.floor(Math.random() * itemPool.length)];
      while (targetItems.includes(item)) {
        item = itemPool[Math.floor(Math.random() * itemPool.length)];
      }
      targetItems.push(item);
    }
    setTargets(targetItems);

    const newGrid: string[] = [];
    
    // Distribute the 40% target items evenly among target types
    const itemsPerTarget = Math.floor(targetItemsCount / numUniqueTargets);
    const remainder = targetItemsCount % numUniqueTargets;
    
    targetItems.forEach((target, idx) => {
      const count = itemsPerTarget + (idx < remainder ? 1 : 0);
      for (let i = 0; i < count; i++) {
        newGrid.push(target);
      }
    });

    // Fill the rest (60%) with random non-target items
    while (newGrid.length < gridSize) {
      const randomItem = itemPool[Math.floor(Math.random() * itemPool.length)];
      if (!targetItems.includes(randomItem)) {
        newGrid.push(randomItem);
      }
    }

    // Shuffle the grid
    for (let i = newGrid.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newGrid[i], newGrid[j]] = [newGrid[j], newGrid[i]];
    }

    setGrid(newGrid);
  };

  const startPairsRound = () => {
    const gridSize = getGridSize();
    const pairCount = gridSize / 2;
    const itemPool = EMOJIS;
    
    const selectedItems = [];
    while (selectedItems.length < pairCount) {
      const item = itemPool[Math.floor(Math.random() * itemPool.length)];
      if (!selectedItems.includes(item)) {
        selectedItems.push(item);
      }
    }

    const newGrid: string[] = [];
    selectedItems.forEach(item => {
      newGrid.push(item, item);
    });

    for (let i = newGrid.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newGrid[i], newGrid[j]] = [newGrid[j], newGrid[i]];
    }

    setGrid(newGrid);
    setTargets([]);
  };

  const startDifferentRound = () => {
    const gridSize = getGridSize();
    
    // Choose a random similar set
    const similarSet = SIMILAR_SETS[Math.floor(Math.random() * SIMILAR_SETS.length)];
    const baseItem = similarSet.base;
    const differentItem = similarSet.different;

    // Increase count for larger grids to make it proportionally challenging
    const differentCount = difficulty === 'easy' 
      ? Math.ceil(gridSize * 0.15) // 15% different items for easy
      : difficulty === 'medium' 
      ? Math.ceil(gridSize * 0.10) // 10% different items for medium
      : Math.ceil(gridSize * 0.05); // 5% different items for hard

    const newGrid: string[] = Array(gridSize).fill(baseItem);
    
    // Place different items randomly
    for (let i = 0; i < differentCount; i++) {
      let pos = Math.floor(Math.random() * gridSize);
      while (newGrid[pos] !== baseItem) {
        pos = Math.floor(Math.random() * gridSize);
      }
      newGrid[pos] = differentItem;
    }

    setGrid(newGrid);
    setTargets([differentItem]);
  };

  const startTrackRound = () => {
    const itemCount = getGridSize();
    const items = [];
    const targetId = Math.floor(Math.random() * itemCount);
    
    for (let i = 0; i < itemCount; i++) {
      items.push({
        id: i,
        x: Math.random() * 80 + 5,
        y: Math.random() * 80 + 5,
        emoji: i === targetId ? '⭐' : SHAPES[Math.floor(Math.random() * SHAPES.length)]
      });
    }

    setMovingItems(items);
    setTargetToTrack(targetId);
    setTargets(['⭐']);
  };

  const handleCellClick = (index: number) => {
    if (!isPlaying || showResults) return;

    if (gameMode === 'findAll' || gameMode === 'different') {
      const newSelected = new Set(selected);
      if (newSelected.has(index)) {
        newSelected.delete(index);
      } else {
        newSelected.add(index);
      }
      setSelected(newSelected);
    } else if (gameMode === 'pairs') {
      if (matched.has(index)) return;
      if (selected.has(index)) return;

      if (firstCard === null) {
        setFirstCard(index);
        setSelected(new Set([index]));
      } else {
        if (grid[firstCard] === grid[index]) {
          const newMatched = new Set(matched);
          newMatched.add(firstCard);
          newMatched.add(index);
          setMatched(newMatched);
          setCorrect(prev => prev + 1);
          setScore(prev => prev + 10);
          setFirstCard(null);
          setSelected(new Set());

          if (newMatched.size === grid.length) {
            setTimeout(() => handleRoundComplete(), 500);
          }
        } else {
          setSelected(new Set([firstCard, index]));
          setIncorrect(prev => prev + 1);
          setTimeout(() => {
            setFirstCard(null);
            setSelected(new Set());
          }, 1000);
        }
      }
    }
  };

  const handleTrackClick = (id: number) => {
    if (!isPlaying || showResults) return;

    if (id === targetToTrack) {
      setCorrect(prev => prev + 1);
      setScore(prev => prev + 20);
      handleRoundComplete();
    } else {
      setIncorrect(prev => prev + 1);
      toast.error(t('tryAgain'));
    }
  };

  const handleSubmit = () => {
    if (gameMode === 'findAll' || gameMode === 'different') {
      let correctCount = 0;
      let incorrectCount = 0;

      selected.forEach(index => {
        if (targets.includes(grid[index])) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      });

      const totalTargets = grid.filter(item => targets.includes(item)).length;
      const missedCount = totalTargets - correctCount;

      setCorrect(prev => prev + correctCount);
      setIncorrect(prev => prev + incorrectCount);
      setScore(prev => prev + correctCount * 5 - incorrectCount * 2);

      handleRoundComplete();
    }
  };

  const handleRoundComplete = () => {
    setIsPlaying(false);
    
    if (round < totalRounds) {
      setTimeout(() => {
        setRound(prev => prev + 1);
        startRound(gameMode!);
      }, 1500);
    } else {
      finishGame();
    }
  };

  const handleTimeUp = () => {
    setIsPlaying(false);
    finishGame();
  };

  const finishGame = () => {
    setShowResults(true);
    
    const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;
    
    saveConcentrationResult(user.id, {
      mode: gameMode!,
      difficulty,
      score,
      correct,
      incorrect,
      accuracy,
      rounds: round,
      date: new Date().toISOString()
    });

    // Award points
    const earnedPoints = calculateConcentrationPoints(accuracy, gameMode!, difficulty);
    if (earnedPoints > 0) {
      addPoints(user.id, earnedPoints, `Concentration: ${gameMode} - ${difficulty}`);
      toast.success(`${t('resultsSaved')} +${earnedPoints} ${t('points')}! 🎉`);
    } else {
      toast.success(t('resultsSaved'));
    }
  };

  const resetGame = () => {
    setGameMode(null);
    setIsPlaying(false);
    setShowResults(false);
    setGrid([]);
    setTargets([]);
    setSelected(new Set());
    setMatched(new Set());
    setMovingItems([]);
    setScore(0);
    setCorrect(0);
    setIncorrect(0);
  };

  const getGridClass = () => {
    const size = Math.sqrt(grid.length);
    const roundedSize = Math.round(size);
    
    // Support grids up to 8x8
    if (roundedSize === 4) return 'grid-cols-4';
    if (roundedSize === 5) return 'grid-cols-5';
    if (roundedSize === 6) return 'grid-cols-6';
    if (roundedSize === 7) return 'grid-cols-7';
    if (roundedSize === 8) return 'grid-cols-8';
    
    return 'grid-cols-6'; // default
  };

  if (showResults) {
    const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 border-4 border-blue-300 rounded-3xl shadow-2xl">
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl text-blue-900">{t('congratulations')}</h2>
            <p className="text-xl text-gray-700">{t('excellentWork')}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-6 bg-gradient-to-br from-yellow-100 to-yellow-200 border-3 border-yellow-400 rounded-2xl">
                <Trophy className="w-10 h-10 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm text-yellow-700 mb-1">{t('score')}</p>
                <p className="text-4xl font-semibold text-yellow-900">{score}</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-100 to-green-200 border-3 border-green-400 rounded-2xl">
                <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-green-700 mb-1">{t('correct')}</p>
                <p className="text-4xl font-semibold text-green-900">{correct}</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-red-100 to-red-200 border-3 border-red-400 rounded-2xl">
                <XCircle className="w-10 h-10 text-red-600 mx-auto mb-2" />
                <p className="text-sm text-red-700 mb-1">{t('incorrect')}</p>
                <p className="text-4xl font-semibold text-red-900">{incorrect}</p>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-blue-200 to-indigo-300 border-3 border-blue-400 rounded-2xl mt-4">
              <p className="text-lg text-blue-900 mb-2">{t('accuracy')}</p>
              <div className="flex items-center justify-center gap-2">
                <Target className="w-8 h-8 text-blue-700" />
                <p className="text-5xl font-semibold text-blue-900">{accuracy}%</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center mt-6">
              <Button
                onClick={() => startGame(gameMode!)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-6 rounded-2xl text-lg shadow-xl"
              >
                <Play className="w-6 h-6 mr-2" />
                {t('playAgain')}
              </Button>
              <Button
                onClick={resetGame}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-6 rounded-2xl text-lg shadow-xl"
              >
                <RefreshCw className="w-6 h-6 mr-2" />
                {t('mainMenu')}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (!gameMode) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 border-4 border-blue-300 rounded-3xl shadow-2xl">
            <div className="text-center space-y-4">
              <div className="text-6xl">🎯</div>
              <h2 className="text-3xl text-blue-900">{t('concentrationTrainer')}</h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                {t('concentrationDescription')}
              </p>
            </div>
          </Card>
        </motion.div>

        <Card className="p-6 bg-gradient-to-br from-white to-blue-50 border-4 border-blue-200 rounded-3xl shadow-xl">
          <h3 className="text-2xl text-blue-900 mb-4 flex items-center gap-2">
            <Zap className="w-7 h-7" />
            {t('selectDifficulty')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
              <motion.button
                key={diff}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDifficulty(diff)}
                className={`p-6 rounded-2xl border-3 shadow-lg transition-all ${
                  difficulty === diff
                    ? 'bg-gradient-to-br from-blue-400 to-blue-500 border-blue-600 text-white'
                    : 'bg-white border-blue-300 text-blue-900 hover:border-blue-400'
                }`}
              >
                <div className="text-4xl mb-2">
                  {diff === 'easy' ? '😊' : diff === 'medium' ? '😐' : '😤'}
                </div>
                <p className="font-semibold">{t(diff)}</p>
              </motion.button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              onClick={() => startGame('findAll')}
              className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-4 border-purple-300 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-all"
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">🔍</div>
                <h3 className="text-2xl text-purple-900">{t('findAllMode')}</h3>
                <p className="text-gray-700">{t('findAllDescription')}</p>
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-4 rounded-2xl shadow-lg">
                  <Play className="w-5 h-5 mr-2" />
                  {t('start')}
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              onClick={() => startGame('pairs')}
              className="p-8 bg-gradient-to-br from-pink-50 to-pink-100 border-4 border-pink-300 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-all"
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">🎴</div>
                <h3 className="text-2xl text-pink-900">{t('pairsMode')}</h3>
                <p className="text-gray-700">{t('pairsDescription')}</p>
                <Button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-4 rounded-2xl shadow-lg">
                  <Play className="w-5 h-5 mr-2" />
                  {t('start')}
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              onClick={() => startGame('different')}
              className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-300 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-all"
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">🎨</div>
                <h3 className="text-2xl text-blue-900">{t('differentMode')}</h3>
                <p className="text-gray-700">{t('differentDescription')}</p>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-2xl shadow-lg">
                  <Play className="w-5 h-5 mr-2" />
                  {t('start')}
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              onClick={() => startGame('track')}
              className="p-8 bg-gradient-to-br from-indigo-50 to-indigo-100 border-4 border-indigo-300 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-all"
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">👀</div>
                <h3 className="text-2xl text-indigo-900">{t('trackMode')}</h3>
                <p className="text-gray-700">{t('trackDescription')}</p>
                <Button className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-6 py-4 rounded-2xl shadow-lg">
                  <Play className="w-5 h-5 mr-2" />
                  {t('start')}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (gameMode === 'track') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="p-8 bg-gradient-to-br from-indigo-50 to-indigo-100 border-4 border-indigo-300 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            {/* Header with Back and Pause buttons */}
            <div className="flex items-center justify-between mb-4">
              <Button
                onClick={() => setShowExitDialog(true)}
                variant="outline"
                className="border-2 border-indigo-400 text-indigo-700 hover:bg-indigo-100 rounded-xl px-4 py-2"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {language === 'ru' ? 'Назад' : language === 'kz' ? 'Артқа' : 'Back'}
              </Button>
              <Button
                onClick={() => setIsPaused(!isPaused)}
                variant="outline"
                className={`border-2 rounded-xl px-4 py-2 ${
                  isPaused 
                    ? 'border-green-400 text-green-700 hover:bg-green-100' 
                    : 'border-orange-400 text-orange-700 hover:bg-orange-100'
                }`}
              >
                {isPaused ? (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    {language === 'ru' ? 'Продолжить' : language === 'kz' ? 'Жалғастыру' : 'Resume'}
                  </>
                ) : (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    {language === 'ru' ? 'Пауза' : language === 'kz' ? 'Кідірту' : 'Pause'}
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg text-indigo-900">{t('round')} {round}/{totalRounds}</span>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-xl font-semibold text-indigo-900">{t('score')}: {score}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span className="text-2xl font-semibold text-indigo-900">{timeLeft}s</span>
              </div>
            </div>

            <Progress value={(timeLeft / getTimeLimit()) * 100} className="h-3" />

            <div className="text-center">
              <h3 className="text-2xl text-indigo-900 mb-4">{t('trackTheTarget')}</h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                <p className="text-lg text-gray-700">{t('target')}:</p>
                <div className="text-4xl bg-yellow-200 px-4 py-2 rounded-xl border-3 border-yellow-400">
                  ⭐
                </div>
              </div>
            </div>

            <div className="relative bg-white rounded-2xl border-4 border-indigo-300 h-96 overflow-hidden">
              {isPaused && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 rounded-2xl">
                  <div className="bg-white px-8 py-6 rounded-2xl border-4 border-indigo-400 shadow-2xl">
                    <p className="text-3xl text-indigo-900">⏸️ {language === 'ru' ? 'Пауза' : language === 'kz' ? 'Кідірту' : 'Paused'}</p>
                  </div>
                </div>
              )}
              <AnimatePresence>
                {movingItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleTrackClick(item.id)}
                    className="absolute flex items-center justify-center cursor-pointer hover:scale-110 transition-transform select-none"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      width: '48px',
                      height: '48px',
                      transform: 'translate(-50%, -50%)',
                      zIndex: item.id === targetToTrack ? 20 : 10,
                      pointerEvents: isPaused ? 'none' : 'auto'
                    }}
                    animate={{
                      left: `${item.x}%`,
                      top: `${item.y}%`
                    }}
                    transition={{ duration: 0.2, ease: 'linear' }}
                  >
                    <span className="text-4xl drop-shadow-lg">{item.emoji}</span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 border-4 border-blue-300 rounded-3xl shadow-2xl">
        <div className="space-y-6">
          {/* Header with Back and Pause buttons */}
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => setShowExitDialog(true)}
              variant="outline"
              className="border-2 border-indigo-400 text-indigo-700 hover:bg-indigo-100 rounded-xl px-4 py-2"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {language === 'ru' ? 'Назад' : language === 'kz' ? 'Артқа' : 'Back'}
            </Button>
            <Button
              onClick={() => setIsPaused(!isPaused)}
              variant="outline"
              className={`border-2 rounded-xl px-4 py-2 ${
                isPaused 
                  ? 'border-green-400 text-green-700 hover:bg-green-100' 
                  : 'border-orange-400 text-orange-700 hover:bg-orange-100'
              }`}
            >
              {isPaused ? (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  {language === 'ru' ? 'Продолжить' : language === 'kz' ? 'Жалғастыру' : 'Resume'}
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  {language === 'ru' ? 'Пауза' : language === 'kz' ? 'Кідірту' : 'Pause'}
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg text-blue-900">{t('round')} {round}/{totalRounds}</span>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-xl font-semibold text-blue-900">{t('score')}: {score}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-semibold text-blue-900">{timeLeft}s</span>
            </div>
          </div>

          <Progress value={(timeLeft / getTimeLimit()) * 100} className="h-3" />

          {gameMode !== 'pairs' && targets.length > 0 && (
            <div className="text-center">
              <h3 className="text-2xl text-blue-900 mb-4">
                {gameMode === 'findAll' ? t('findTheseItems') : t('findDifferent')}
              </h3>
              <div className="flex gap-3 justify-center flex-wrap">
                {targets.map((target, idx) => (
                  <div 
                    key={idx}
                    className="text-4xl bg-yellow-200 px-4 py-2 rounded-xl border-3 border-yellow-400"
                  >
                    {target}
                  </div>
                ))}
              </div>
            </div>
          )}

          {gameMode === 'pairs' && (
            <div className="text-center">
              <h3 className="text-2xl text-pink-900 mb-2">{t('findMatchingPairs')}</h3>
              <p className="text-gray-700">{t('clickTwoCards')}</p>
            </div>
          )}

          <div className={`grid ${getGridClass()} gap-2 max-w-3xl mx-auto`}>
            {grid.map((item, index) => {
              const isSelected = selected.has(index);
              const isMatched = matched.has(index);
              const isTarget = targets.includes(item);
              
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCellClick(index)}
                  disabled={isMatched}
                  className={`aspect-square p-2 rounded-xl border-3 shadow-md transition-all ${
                    isMatched
                      ? 'bg-gradient-to-br from-green-300 to-green-400 border-green-600 opacity-50'
                      : isSelected && gameMode === 'pairs'
                      ? 'bg-gradient-to-br from-yellow-200 to-yellow-300 border-yellow-500'
                      : isSelected && isTarget
                      ? 'bg-gradient-to-br from-green-300 to-green-400 border-green-600'
                      : isSelected
                      ? 'bg-gradient-to-br from-red-300 to-red-400 border-red-600'
                      : 'bg-white border-blue-300 hover:border-blue-500'
                  }`}
                >
                  <span className="text-2xl md:text-4xl">{item}</span>
                </motion.button>
              );
            })}
          </div>

          {(gameMode === 'findAll' || gameMode === 'different') && (
            <div className="text-center">
              <Button
                onClick={handleSubmit}
                disabled={selected.size === 0}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-6 rounded-2xl text-lg shadow-xl disabled:opacity-50"
              >
                <CheckCircle className="w-6 h-6 mr-2" />
                {t('submit')}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="bg-white border-4 border-blue-300 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-blue-900">
              {language === 'ru' ? 'Выйти из игры?' : language === 'kz' ? 'Ойыннан шығу?' : 'Exit Game?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-gray-700">
              {language === 'ru' 
                ? 'Ваш прогресс не будет сохранен. Вы уверены, что хотите вернуться в меню?' 
                : language === 'kz'
                ? 'Сіздің прогресс сақталмайды. Мәзірге оралуды қалайсыз ба?'
                : 'Your progress will not be saved. Are you sure you want to return to the menu?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-2 border-gray-300 rounded-xl px-6 py-3">
              {language === 'ru' ? 'Отмена' : language === 'kz' ? 'Болдырмау' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={resetGame}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl px-6 py-3"
            >
              {language === 'ru' ? 'Выйти' : language === 'kz' ? 'Шығу' : 'Exit'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}