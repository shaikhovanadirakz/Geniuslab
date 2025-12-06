import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { saveNumbersResult, User, calculateNumbersPoints, addPoints } from '../utils/storage';
import { Language, getTranslation } from '../utils/translations';
import { Play, Pause, RotateCcw, Trophy, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface NumbersTrainerProps {
  user: User;
  language: Language;
}

type Range = '1-50' | '1-75' | '1-100';

interface NumberData {
  value: number;
  clicked: boolean;
  color: string;
  rotation: number;
  width: number;
  height: number;
  x: number;
  y: number;
  fontFamily: string;
  fontWeight: string;
  shape: 'circle' | 'square' | 'rectangle-h' | 'rectangle-v';
}

export function NumbersTrainer({ user, language }: NumbersTrainerProps) {
  const [range, setRange] = useState<Range>('1-50');
  const [numbers, setNumbers] = useState<NumberData[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const t = (key: keyof typeof import('../utils/translations').translations.ru) => 
    getTranslation(language, key);

  const colors = [
    'from-red-500 to-orange-500',
    'from-orange-500 to-yellow-500',
    'from-green-500 to-emerald-500',
    'from-blue-500 to-cyan-500',
    'from-indigo-500 to-purple-500',
    'from-purple-500 to-violet-500',
    'from-teal-500 to-green-500',
    'from-violet-500 to-purple-500',
  ];

  const fontFamilies = [
    'Arial, sans-serif',
    'Georgia, serif',
    'Courier New, monospace',
    'Verdana, sans-serif',
    'Times New Roman, serif',
    'Comic Sans MS, cursive',
    'Impact, fantasy',
    'Trebuchet MS, sans-serif',
    'Palatino, serif',
    'Garamond, serif',
    'Tahoma, sans-serif',
    'Lucida Console, monospace',
    'Helvetica, sans-serif',
    'Book Antiqua, serif',
  ];

  const fontWeights = ['400', '500', '600', '700', '800', '900'];

  useEffect(() => {
    resetGame();
  }, [range]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !completed) {
      interval = setInterval(() => {
        setTime((t) => t + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isActive, completed]);

  const getMaxNumber = (r: Range) => {
    switch (r) {
      case '1-50': return 50;
      case '1-75': return 75;
      case '1-100': return 100;
    }
  };

  // Проверка пересечения двух прямоугольников
  const checkCollision = (
    x1: number, y1: number, w1: number, h1: number,
    x2: number, y2: number, w2: number, h2: number
  ) => {
    // Добавляем отступ между элементами (padding)
    const padding = 15;
    return !(
      x1 + w1 / 2 + padding < x2 - w2 / 2 ||
      x1 - w1 / 2 - padding > x2 + w2 / 2 ||
      y1 + h1 / 2 + padding < y2 - h2 / 2 ||
      y1 - h1 / 2 - padding > y2 + h2 / 2
    );
  };

  const resetGame = () => {
    const max = getMaxNumber(range);
    const numbersArray: NumberData[] = [];
    
    // Размеры игрового поля в пикселях (с учетом padding контейнера)
    const fieldWidth = 950;  // Уменьшил с учетом padding
    const fieldHeight = 700; // Уменьшил с учетом padding
    
    const shapes: Array<'circle' | 'square' | 'rectangle-h' | 'rectangle-v'> = [
      'circle', 'square', 'rectangle-h', 'rectangle-v'
    ];
    
    for (let i = 0; i < max; i++) {
      let placed = false;
      let attempts = 0;
      let x = 0, y = 0, width = 0, height = 0;
      let shape: 'circle' | 'square' | 'rectangle-h' | 'rectangle-v' = 'circle';
      
      while (!placed && attempts < 500) {
        // Выбираем случайную форму
        shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        // РАЗНЫЕ размеры (уменьшил максимальные размеры)
        const randomValue = Math.random();
        let baseSize: number;
        
        if (randomValue < 0.3) {
          baseSize = 30 + Math.random() * 15; // Маленькие 30-45px
        } else if (randomValue < 0.6) {
          baseSize = 45 + Math.random() * 25; // Средние 45-70px
        } else if (randomValue < 0.85) {
          baseSize = 70 + Math.random() * 30; // Большие 70-100px
        } else {
          baseSize = 100 + Math.random() * 30; // ОГРОМНЫЕ 100-130px
        }
        
        // Разные пропорции в зависимости от формы
        if (shape === 'circle' || shape === 'square') {
          width = baseSize;
          height = baseSize;
        } else if (shape === 'rectangle-h') {
          width = baseSize * 1.4;
          height = baseSize * 0.7;
        } else {
          width = baseSize * 0.7;
          height = baseSize * 1.4;
        }
        
        // Рассчитываем ПРАВИЛЬНЫЕ границы в пикселях
        // Позиция указывает на ЦЕНТР элемента через translate(-50%, -50%)
        const margin = 40; // Увеличенный отступ от края поля
        const minXPx = width / 2 + margin;
        const maxXPx = fieldWidth - width / 2 - margin;
        const minYPx = height / 2 + margin;
        const maxYPx = fieldHeight - height / 2 - margin;
        
        // Проверяем, что элемент может поместиться
        if (minXPx >= maxXPx || minYPx >= maxYPx) {
          // Элемент слишком большой, пропускаем
          attempts++;
          continue;
        }
        
        // Генерируем случайную позицию в пикселях
        const xPx = minXPx + Math.random() * (maxXPx - minXPx);
        const yPx = minYPx + Math.random() * (maxYPx - minYPx);
        
        // Проверяем пересечение со всеми уже размещенными числами
        let hasCollision = false;
        for (const num of numbersArray) {
          const numXPx = (num.x / 100) * fieldWidth;
          const numYPx = (num.y / 100) * fieldHeight;
          
          if (checkCollision(xPx, yPx, width, height, numXPx, numYPx, num.width, num.height)) {
            hasCollision = true;
            break;
          }
        }
        
        if (!hasCollision) {
          // Конвертируем позицию из пикселей в проценты
          x = (xPx / fieldWidth) * 100;
          y = (yPx / fieldHeight) * 100;
          placed = true;
        }
        
        attempts++;
      }
      
      if (placed) {
        numbersArray.push({
          value: i + 1,
          clicked: false,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 30 - 15, // -15 до +15 градусов
          width,
          height,
          x,
          y,
          fontFamily: fontFamilies[Math.floor(Math.random() * fontFamilies.length)],
          fontWeight: fontWeights[Math.floor(Math.random() * fontWeights.length)],
          shape,
        });
      }
    }
    
    setNumbers(numbersArray);
    setCurrentNumber(1);
    setTime(0);
    setIsActive(false);
    setCompleted(false);
  };

  const handleNumberClick = (num: number) => {
    if (!isActive) {
      setIsActive(true);
    }

    if (num === currentNumber) {
      setNumbers(prev => prev.map(n => 
        n.value === num ? { ...n, clicked: true } : n
      ));
      
      const nextNumber = currentNumber + 1;
      const max = getMaxNumber(range);
      
      if (nextNumber > max) {
        setCompleted(true);
        setIsActive(false);
        saveNumbersResult({
          userId: user.id,
          range,
          time,
        });
        
        // Award points
        const earnedPoints = calculateNumbersPoints(time, range);
        if (earnedPoints > 0) {
          addPoints(user.id, earnedPoints, `Numbers: ${range} in ${time}ms`);
          toast.success(`${t('greatJob')} +${earnedPoints} ${t('points')}! 🎉`, {
            duration: 3000,
          });
        }
      } else {
        setCurrentNumber(nextNumber);
      }
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>{t('range')}</Label>
          <Select value={range} onValueChange={(v) => setRange(v as Range)}>
            <SelectTrigger className="border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-50">1-50</SelectItem>
              <SelectItem value="1-75">1-75</SelectItem>
              <SelectItem value="1-100">1-100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('time')}</Label>
          <div className="h-10 flex items-center justify-center bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg border-2 border-blue-200">
            <span className="text-2xl tabular-nums">{formatTime(time)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            {showHint ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {t('hint')}
          </Label>
          <div className="flex items-center space-x-2 h-10 px-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg border-2 border-purple-200">
            <Switch
              checked={showHint}
              onCheckedChange={setShowHint}
              className="data-[state=checked]:bg-purple-600"
            />
            <span className="text-sm">{showHint ? t('showHint') : t('hideHint')}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => setIsActive(!isActive)}
          disabled={completed}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        >
          {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isActive ? t('stop') : t('start')}
        </Button>
        <Button
          onClick={resetGame}
          variant="outline"
          className="border-2"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {t('reset')}
        </Button>
      </div>

      {showHint && isActive && !completed && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-2 border-yellow-300 text-center"
        >
          <p className="text-yellow-900">
            {t('findNumber')}: <span className="text-3xl ml-2">{currentNumber}</span>
          </p>
        </motion.div>
      )}

      {completed && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-2 border-yellow-300"
        >
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <div>
              <h3 className="text-yellow-800">{t('congratulations')}</h3>
              <p className="text-yellow-700">{t('time')}: {formatTime(time)}</p>
            </div>
          </div>
        </motion.div>
      )}

      <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 min-h-[800px]">
        <div className="relative w-full h-[750px] overflow-hidden">
          {numbers.map((num) => {
            // Размер шрифта пропорционален размеру элемента
            const avgSize = (num.width + num.height) / 2;
            const fontSize = Math.max(avgSize * 0.4, 12);
            
            // Определяем класс формы
            let shapeClass = '';
            if (num.shape === 'circle') {
              shapeClass = 'rounded-full';
            } else if (num.shape === 'square') {
              shapeClass = 'rounded-2xl';
            } else {
              shapeClass = 'rounded-xl';
            }
            
            return (
              <motion.button
                key={num.value}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: num.clicked ? 0.2 : 1, 
                  scale: num.clicked ? 0.8 : 1 
                }}
                whileHover={{ scale: num.clicked ? 0.8 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => !num.clicked && handleNumberClick(num.value)}
                className={`
                  absolute shadow-lg flex items-center justify-center
                  text-white transition-all border-2 border-white/40
                  ${shapeClass}
                  ${num.value === currentNumber && !num.clicked && showHint ? 'ring-4 ring-yellow-400 animate-pulse z-20' : 'z-0'}
                  ${num.clicked ? 'cursor-not-allowed opacity-20' : 'cursor-pointer hover:shadow-2xl hover:z-10'}
                  bg-gradient-to-br ${num.color}
                `}
                style={{
                  left: `${num.x}%`,
                  top: `${num.y}%`,
                  width: `${num.width}px`,
                  height: `${num.height}px`,
                  transform: `translate(-50%, -50%) rotate(${num.rotation}deg)`,
                  fontSize: `${fontSize}px`,
                  fontFamily: num.fontFamily,
                  fontWeight: num.fontWeight,
                  lineHeight: '1',
                }}
              >
                {num.value}
              </motion.button>
            );
          })}
        </div>
      </Card>

      <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
        <p className="text-blue-800 text-sm">
          <strong>{t('range')}:</strong> Нажимайте числа от 1 до {getMaxNumber(range)} по порядку. 
          Числа разных размеров (от маленьких 30px до огромных 130px!), форм (круглые, квадратные, прямоугольные), шрифтов, цветов и поворотов!
        </p>
      </div>
    </div>
  );
}
