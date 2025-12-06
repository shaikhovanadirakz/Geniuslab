import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { saveSchulteResult, User, calculateSchultePoints, addPoints } from '../utils/storage';
import { Language, getTranslation } from '../utils/translations';
import { Play, Pause, RotateCcw, Trophy, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SchulteTableProps {
  user: User;
  language: Language;
}

export function SchulteTable({ user, language }: SchulteTableProps) {
  const [size, setSize] = useState<number>(3);
  const [mode, setMode] = useState<'speed' | 'understanding'>('speed');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const t = (key: keyof typeof import('../utils/translations').translations.ru) => 
    getTranslation(language, key);

  useEffect(() => {
    resetGame();
  }, [size]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !completed) {
      interval = setInterval(() => {
        setTime((t) => t + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isActive, completed]);

  const resetGame = () => {
    const total = size * size;
    const shuffled = Array.from({ length: total }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    setNumbers(shuffled);
    setCurrentNumber(mode === 'speed' ? 1 : total);
    setTime(0);
    setIsActive(false);
    setCompleted(false);
  };

  const handleNumberClick = (num: number) => {
    if (!isActive) {
      setIsActive(true);
    }

    const isCorrect = mode === 'speed' 
      ? num === currentNumber 
      : num === currentNumber;

    if (isCorrect) {
      const nextNumber = mode === 'speed' ? currentNumber + 1 : currentNumber - 1;
      
      if ((mode === 'speed' && nextNumber > size * size) || (mode === 'understanding' && nextNumber < 1)) {
        setCompleted(true);
        setIsActive(false);
        saveSchulteResult({
          userId: user.id,
          size,
          mode,
          time,
        });
        
        // Award points
        const earnedPoints = calculateSchultePoints(time, size);
        if (earnedPoints > 0) {
          addPoints(user.id, earnedPoints, `Schulte ${size}x${size} - ${time}ms`);
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

  const getColorForNumber = (index: number) => {
    const colors = [
      'from-blue-400 to-blue-500',
      'from-purple-400 to-purple-500',
      'from-blue-500 to-cyan-500',
      'from-indigo-500 to-purple-500',
      'from-cyan-400 to-blue-500',
      'from-teal-400 to-emerald-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>{t('size')}</Label>
          <Select value={size.toString()} onValueChange={(v) => setSize(Number(v))}>
            <SelectTrigger className="border-2 border-blue-300 rounded-2xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 × 3</SelectItem>
              <SelectItem value="4">4 × 4</SelectItem>
              <SelectItem value="5">5 × 5</SelectItem>
              <SelectItem value="6">6 × 6</SelectItem>
              <SelectItem value="7">7 × 7</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('mode')}</Label>
          <Select value={mode} onValueChange={(v) => setMode(v as 'speed' | 'understanding')}>
            <SelectTrigger className="border-2 border-purple-300 rounded-2xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="speed">{t('speed')}</SelectItem>
              <SelectItem value="understanding">{t('understanding')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('time')}</Label>
          <div className="h-10 flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl border-2 border-blue-300">
            <span className="text-2xl tabular-nums">{formatTime(time)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            {showHint ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {t('hint')}
          </Label>
          <div className="flex items-center space-x-2 h-10 px-4 bg-gradient-to-r from-purple-100 to-indigo-200 rounded-2xl border-2 border-purple-300">
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
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-lg"
        >
          {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isActive ? t('stop') : t('start')}
        </Button>
        <Button
          onClick={resetGame}
          variant="outline"
          className="border-2 border-purple-300 hover:bg-purple-50 rounded-2xl"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {t('reset')}
        </Button>
      </div>

      {showHint && isActive && !completed && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-3xl border-4 border-blue-300 text-center shadow-lg"
        >
          <p className="text-blue-900">
            {t('findNumber')}: <span className="text-3xl ml-2">{currentNumber}</span>
          </p>
        </motion.div>
      )}

      {completed && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-6 bg-gradient-to-r from-green-100 to-emerald-200 rounded-3xl border-4 border-green-300 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <span className="text-6xl">🏆</span>
            <div>
              <h3 className="text-green-800">{t('congratulations')}</h3>
              <p className="text-green-700">{t('time')}: {formatTime(time)}</p>
            </div>
          </div>
        </motion.div>
      )}

      <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-4 border-blue-300 rounded-3xl shadow-xl">
        <div
          className="grid gap-3 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            maxWidth: `${size * 80}px`,
          }}
        >
          {numbers.map((num, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNumberClick(num)}
              className={`
                aspect-square rounded-2xl shadow-lg flex items-center justify-center
                text-white text-2xl transition-all
                ${num === currentNumber && showHint ? 'ring-4 ring-blue-400 animate-pulse' : ''}
                bg-gradient-to-br ${getColorForNumber(index)}
                hover:shadow-2xl
              `}
            >
              {num}
            </motion.button>
          ))}
        </div>
      </Card>

      <div className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
        <p className="text-blue-800 text-sm">
          <strong>{mode === 'speed' ? t('speed') : t('understanding')}:</strong>{' '}
          {mode === 'speed' 
            ? `Нажимайте числа от 1 до ${size * size} по порядку`
            : `Нажимайте числа от ${size * size} до 1 в обратном порядке`
          }
        </p>
      </div>
    </div>
  );
}
