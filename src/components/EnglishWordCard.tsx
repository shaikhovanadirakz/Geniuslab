import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Volume2, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { WordData, WORDS_WITH_SENTENCES } from './english-words-data';
import { Language } from '../utils/translations';

interface EnglishWordCardProps {
  word: string;
  category: string;
  level: 'beginner' | 'elementary' | 'intermediate';
  language: Language;
  flipped: boolean;
  onFlip: () => void;
  onSpeak: (text: string) => void;
  onLearnedClick: () => void;
}

export function EnglishWordCard({ 
  word, 
  category, 
  level, 
  language, 
  flipped, 
  onFlip, 
  onSpeak,
  onLearnedClick 
}: EnglishWordCardProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Найти данные слова в базе
  const wordData = WORDS_WITH_SENTENCES.find(
    w => w.english.toLowerCase() === word.toLowerCase() && 
         w.category === category && 
         w.level === level
  );

  const translation = wordData 
    ? (language === 'ru' ? wordData.russian : language === 'kz' ? wordData.kazakh : wordData.russian)
    : word;

  const sentence = wordData?.sentence
    ? (language === 'ru' ? wordData.sentence.ru : language === 'kz' ? wordData.sentence.kz : wordData.sentence.en)
    : '';

  // Загрузить изображение
  useEffect(() => {
    if (wordData?.imageQuery) {
      // Используем Unsplash Source API для прямого получения URL
      const unsplashUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(wordData.imageQuery)}`;
      setImageUrl(unsplashUrl);
      setLoading(false);
    }
  }, [wordData?.imageQuery]);

  return (
    <motion.div
      className="relative h-[500px] cursor-pointer"
      onClick={onFlip}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
        className="absolute w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Передняя сторона - Слово на английском + картинка */}
        <div 
          className="absolute w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Card className="h-full bg-gradient-to-br from-blue-100 to-blue-200 border-8 border-blue-400 rounded-3xl shadow-2xl overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Картинка */}
              {imageUrl && wordData && (
                <div className="h-60 w-full overflow-hidden rounded-t-2xl bg-white/50">
                  <ImageWithFallback
                    src={imageUrl}
                    alt={wordData.english}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Контент */}
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="text-7xl mb-4">
                  {category === 'Animals' ? '🐾' : 
                   category === 'Colors' ? '🎨' : 
                   category === 'Numbers' ? '🔢' : 
                   category === 'Family' ? '👨‍👩‍👧‍👦' : 
                   category === 'Food' ? '🍎' : 
                   category === 'School' ? '🏫' : 
                   category === 'Home' ? '🏠' : 
                   category === 'Nature' ? '🌳' : 
                   category === 'Actions' ? '🏃' : '📚'}
                </div>
                <div className="text-5xl font-bold text-blue-900 mb-3">
                  {word.toUpperCase()}
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSpeak(word);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-xl"
                >
                  <Volume2 className="w-6 h-6" />
                </Button>
                <p className="text-gray-600 mt-3 text-lg text-center">
                  {language === 'ru' ? 'Нажмите для перевода' : language === 'kz' ? 'Аударма үшін басыңыз' : 'Click for translation'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Задняя сторона - Перевод + предложение */}
        <div 
          className="absolute w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <Card className="h-full bg-gradient-to-br from-green-100 to-green-200 border-8 border-green-400 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8">
            <div className="text-5xl font-bold text-green-900 mb-3">
              {translation.toUpperCase()}
            </div>
            <div className="text-3xl text-green-700 mb-6">
              {word}
            </div>
            
            {/* Пример предложения */}
            {sentence && (
              <div className="bg-white/70 rounded-2xl p-4 border-4 border-green-300 mb-6 max-w-lg">
                <p className="text-center text-lg text-gray-800">
                  💬 {sentence}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak(wordData?.sentence?.en || word);
                }}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-xl"
              >
                <Volume2 className="w-7 h-7" />
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onLearnedClick();
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-2xl px-8 py-4 shadow-xl"
              >
                <CheckCircle className="w-6 h-6 mr-2" />
                {language === 'ru' ? 'Выучил!' : language === 'kz' ? 'Үйрендім!' : 'Learned!'}
              </Button>
            </div>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
