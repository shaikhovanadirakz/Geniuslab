import { useState, useEffect, useCallback } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Play, RotateCcw, Clock, Trophy, TrendingUp, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { saveMazeResult, User, calculateMazePoints, addPoints } from '../utils/storage';
import { Language, getTranslation } from '../utils/translations';
import { toast } from 'sonner@2.0.3';

interface MazeTrainerProps {
  user: User;
  language: Language;
}

type Difficulty = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

interface Cell {
  x: number;
  y: number;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
  visited: boolean;
}

export function MazeTrainer({ user, language }: MazeTrainerProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>(1);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won'>('idle');
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [exitPos, setExitPos] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);
  const [moves, setMoves] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const t = (key: keyof typeof import('../utils/translations').translations.ru) => 
    getTranslation(language, key);

  const getMazeSize = (diff: Difficulty) => {
    // Уровень 1: 6x6, Уровень 10: 20x20
    // Линейная прогрессия от 6 до 20
    return Math.round(6 + (diff - 1) * 1.56);
  };

  const generateMaze = useCallback((size: number): Cell[][] => {
    // Initialize grid
    const grid: Cell[][] = [];
    for (let y = 0; y < size; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < size; x++) {
        row.push({
          x,
          y,
          walls: { top: true, right: true, bottom: true, left: true },
          visited: false,
        });
      }
      grid.push(row);
    }

    // Recursive backtracking maze generation
    const stack: Cell[] = [];
    const startCell = grid[0][0];
    startCell.visited = true;
    stack.push(startCell);

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors: Cell[] = [];

      // Find unvisited neighbors
      const directions = [
        { dx: 0, dy: -1, wall: 'top', opposite: 'bottom' },
        { dx: 1, dy: 0, wall: 'right', opposite: 'left' },
        { dx: 0, dy: 1, wall: 'bottom', opposite: 'top' },
        { dx: -1, dy: 0, wall: 'left', opposite: 'right' },
      ];

      for (const dir of directions) {
        const nx = current.x + dir.dx;
        const ny = current.y + dir.dy;
        if (nx >= 0 && nx < size && ny >= 0 && ny < size && !grid[ny][nx].visited) {
          neighbors.push(grid[ny][nx]);
        }
      }

      if (neighbors.length > 0) {
        // Choose random neighbor
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        
        // Remove walls between current and next
        const dx = next.x - current.x;
        const dy = next.y - current.y;
        
        if (dx === 1) {
          current.walls.right = false;
          next.walls.left = false;
        } else if (dx === -1) {
          current.walls.left = false;
          next.walls.right = false;
        } else if (dy === 1) {
          current.walls.bottom = false;
          next.walls.top = false;
        } else if (dy === -1) {
          current.walls.top = false;
          next.walls.bottom = false;
        }

        next.visited = true;
        stack.push(next);
      } else {
        stack.pop();
      }
    }

    return grid;
  }, []);

  const startGame = () => {
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
      // Countdown finished - start the actual game
      const timer = setTimeout(() => {
        setCountdown(null);
        const size = getMazeSize(difficulty);
        const newMaze = generateMaze(size);
        setMaze(newMaze);
        setPlayerPos({ x: 0, y: 0 });
        setExitPos({ x: size - 1, y: size - 1 });
        setTime(0);
        setMoves(0);
        setGameState('playing');

        // Start timer
        const id = setInterval(() => {
          setTime(prev => prev + 1);
        }, 1000);
        setIntervalId(id);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [countdown, difficulty, generateMaze]);

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const resetGame = () => {
    stopTimer();
    setGameState('idle');
    setMaze([]);
    setPlayerPos({ x: 0, y: 0 });
    setTime(0);
    setMoves(0);
    setCountdown(null);
  };

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameState !== 'playing') return;

    setPlayerPos(prev => {
      const current = maze[prev.y][prev.x];
      let newX = prev.x;
      let newY = prev.y;

      switch (direction) {
        case 'up':
          if (!current.walls.top) newY--;
          break;
        case 'down':
          if (!current.walls.bottom) newY++;
          break;
        case 'left':
          if (!current.walls.left) newX--;
          break;
        case 'right':
          if (!current.walls.right) newX++;
          break;
      }

      if (newX !== prev.x || newY !== prev.y) {
        setMoves(m => m + 1);
        return { x: newX, y: newY };
      }
      return prev;
    });
  }, [gameState, maze]);

  // Check for win
  useEffect(() => {
    if (gameState === 'playing' && playerPos.x === exitPos.x && playerPos.y === exitPos.y) {
      stopTimer();
      setGameState('won');
      saveMazeResult({
        userId: user.id,
        difficulty,
        time,
        moves,
      });
      
      // Award points
      const earnedPoints = calculateMazePoints(difficulty, time);
      if (earnedPoints > 0) {
        addPoints(user.id, earnedPoints, `Maze: Level ${difficulty}, Time ${Math.floor(time/1000)}s`);
        toast.success(`${t('mazeCompleted')}! +${earnedPoints} ${t('points')}! 🎉`, {
          duration: 3000,
        });
      }
    }
  }, [playerPos, exitPos, gameState, user.id, difficulty, time, moves]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          movePlayer('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePlayer('down');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          movePlayer('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePlayer('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, movePlayer]);

  // Touch/Swipe controls
  useEffect(() => {
    if (gameState !== 'playing') return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartX || !touchStartY) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      // Minimum swipe distance
      if (Math.abs(diffX) < 30 && Math.abs(diffY) < 30) return;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
          movePlayer('left');
        } else {
          movePlayer('right');
        }
      } else {
        // Vertical swipe
        if (diffY > 0) {
          movePlayer('up');
        } else {
          movePlayer('down');
        }
      }

      touchStartX = 0;
      touchStartY = 0;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameState, movePlayer]);

  useEffect(() => {
    return () => stopTimer();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCellSize = () => {
    const size = getMazeSize(difficulty);
    // Адаптивный размер клетки в зависимости от размера лабиринта
    if (size <= 6) return 50;   // Уровень 1
    if (size <= 8) return 40;   // Уровень 2
    if (size <= 10) return 35;  // Уровни 3-4
    if (size <= 12) return 30;  // Уровень 5
    if (size <= 15) return 25;  // Уровни 6-7
    if (size <= 18) return 22;  // Уровни 8-9
    return 20;                  // Уровень 10
  };

  return (
    <div className="space-y-6">
      {/* Settings Panel */}
      <Card className="p-6 bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 border-3 border-green-300 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <div className="text-3xl">🌳</div>
          <h2 className="text-green-900">{t('mazeTrainer')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-green-800">{t('difficulty')} - {t('level')} {difficulty}</Label>
            <Select
              value={difficulty.toString()}
              onValueChange={(v) => setDifficulty(parseInt(v) as Difficulty)}
              disabled={gameState !== 'idle'}
            >
              <SelectTrigger className="border-2 border-green-300 rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-2xl border-3 border-green-300">
                <SelectItem value="1">🟢 {t('level')} 1 (6×6) - {t('easy')}</SelectItem>
                <SelectItem value="2">🟢 {t('level')} 2 (8×8)</SelectItem>
                <SelectItem value="3">🟡 {t('level')} 3 (9×9)</SelectItem>
                <SelectItem value="4">🟡 {t('level')} 4 (11×11)</SelectItem>
                <SelectItem value="5">🟡 {t('level')} 5 (12×12) - {t('medium')}</SelectItem>
                <SelectItem value="6">🟠 {t('level')} 6 (14×14)</SelectItem>
                <SelectItem value="7">🟠 {t('level')} 7 (15×15)</SelectItem>
                <SelectItem value="8">🔴 {t('level')} 8 (17×17)</SelectItem>
                <SelectItem value="9">🔴 {t('level')} 9 (18×18)</SelectItem>
                <SelectItem value="10">🔴 {t('level')} 10 (20×20) - {t('hard')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            {gameState === 'idle' && (
              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 px-8 rounded-2xl shadow-lg w-full"
              >
                <Play className="w-5 h-5 mr-2" />
                {t('start')}
              </Button>
            )}
            {gameState !== 'idle' && (
              <Button
                onClick={resetGame}
                variant="outline"
                className="border-2 border-green-300 hover:bg-green-50 rounded-2xl w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {t('reset')}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      {gameState !== 'idle' && (
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200">
            <div className="text-center">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-700 mb-1">{t('time')}</p>
              <p className="text-2xl text-blue-900">{formatTime(time)}</p>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-orange-100 to-yellow-100 border-2 border-orange-200">
            <div className="text-center">
              <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-orange-700 mb-1">{t('moves')}</p>
              <p className="text-2xl text-orange-900">{moves}</p>
            </div>
          </Card>
        </div>
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
              className="text-9xl sm:text-[12rem] font-bold bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent drop-shadow-2xl"
            >
              {countdown === 0 ? '🌳' : countdown}
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      {gameState === 'idle' && countdown === null && (
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl">
          <h3 className="mb-3 text-purple-900">{t('howToPlay')}</h3>
          <div className="space-y-2 text-gray-700">
            <p>🎯 {t('findExit')}</p>
            <p>⌨️ {language === 'ru' ? 'Используйте стрелки клавиатуры' : language === 'kz' ? 'Пернетақтадағы көрсеткілерді пайдаланыңыз' : 'Use keyboard arrow keys'}</p>
            <p>🎮 {language === 'ru' ? 'Или нажимайте кнопки управления' : language === 'kz' ? 'Немесе басқару түймелерін басыңыз' : 'Or use control buttons'}</p>
            <p>👆 {language === 'ru' ? 'На мобильных - делайте свайпы' : language === 'kz' ? 'Мобильді құрылғыларда - серпілістерді жасаңыз' : 'On mobile - use swipe gestures'}</p>
            <p>🏁 {language === 'ru' ? 'Выход находится в правом нижнем углу' : language === 'kz' ? 'Шығу оң төменгі бұрышта орналасқан' : 'Exit is at the bottom-right corner'}</p>
          </div>
        </Card>
      )}

      {/* Win Message */}
      {gameState === 'won' && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-6 bg-gradient-to-r from-yellow-100 to-green-200 rounded-3xl border-4 border-green-300 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <span className="text-6xl">🎉</span>
            <div>
              <h3 className="text-green-800">{t('youWin')}</h3>
              <p className="text-green-700">{t('time')}: {formatTime(time)}</p>
              <p className="text-green-700">{t('moves')}: {moves}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Maze Display */}
      {gameState !== 'idle' && maze.length > 0 && (
        <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-[1fr_auto] lg:gap-4">
          <Card className="p-4 sm:p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-4 border-green-300 rounded-3xl shadow-xl overflow-auto">
            <div className="flex justify-center">
              <div
                className="relative bg-white rounded-lg shadow-inner p-2"
                style={{
                  width: 'fit-content',
                }}
              >
                {maze.map((row, y) => (
                  <div key={y} className="flex">
                    {row.map((cell, x) => {
                      const cellSize = getCellSize();
                      const isPlayer = playerPos.x === x && playerPos.y === y;
                      const isExit = exitPos.x === x && exitPos.y === y;

                      return (
                        <div
                          key={`${x}-${y}`}
                          className="relative bg-green-50"
                          style={{
                            width: `${cellSize}px`,
                            height: `${cellSize}px`,
                            borderTop: cell.walls.top ? '2px solid #059669' : 'none',
                            borderRight: cell.walls.right ? '2px solid #059669' : 'none',
                            borderBottom: cell.walls.bottom ? '2px solid #059669' : 'none',
                            borderLeft: cell.walls.left ? '2px solid #059669' : 'none',
                          }}
                        >
                          {isPlayer && (
                            <motion.div
                              layoutId="player"
                              className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                              🏃
                            </motion.div>
                          )}
                          {isExit && (
                            <div className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl">
                              🏁
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Control Buttons */}
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-4 border-blue-300 rounded-3xl shadow-xl lg:w-[280px]">
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <h3 className="text-blue-900 text-center">
                {language === 'ru' ? '🎮 Управление' : language === 'kz' ? '🎮 Басқару' : '🎮 Controls'}
              </h3>
              
              {/* Up Button */}
              <Button
                onClick={() => movePlayer('up')}
                disabled={gameState !== 'playing'}
                className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <ArrowUp className="w-6 h-6 sm:w-8 sm:h-8" />
              </Button>
              
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Left Button */}
                <Button
                  onClick={() => movePlayer('left')}
                  disabled={gameState !== 'playing'}
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  <ArrowLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                </Button>
                
                <div className="flex flex-col gap-2 sm:gap-3">
                  {/* Down Button */}
                  <Button
                    onClick={() => movePlayer('down')}
                    disabled={gameState !== 'playing'}
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
                  >
                    <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8" />
                  </Button>
                  
                  {/* Center indicator */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl border-2 border-green-300 text-2xl sm:text-3xl">
                    🏃
                  </div>
                </div>
                
                {/* Right Button */}
                <Button
                  onClick={() => movePlayer('right')}
                  disabled={gameState !== 'playing'}
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8" />
                </Button>
              </div>
              
              <div className="text-center text-xs sm:text-sm text-gray-600 mt-2 max-w-[220px] space-y-1">
                <p>⌨️ {language === 'ru' ? 'Клавиши' : language === 'kz' ? 'Пернелер' : 'Keys'}</p>
                <p>👆 {language === 'ru' ? 'Свайпы' : language === 'kz' ? 'Серпілістер' : 'Swipes'}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}