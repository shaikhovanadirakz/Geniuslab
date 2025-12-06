import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User, getHomeworkByStudent, completeHomework } from '../utils/storage';
import { Language, getTranslation } from '../utils/translations';
import { Calendar, Trophy, BookOpen } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface StudentHomeworkProps {
  user: User;
  language: Language;
}

export function StudentHomework({ user, language }: StudentHomeworkProps) {
  const [homeworks, setHomeworks] = useState(getHomeworkByStudent(user.id));

  const t = (key: keyof typeof import('../utils/translations').translations.ru) => 
    getTranslation(language, key);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !homeworks.find(h => h.dueDate === dueDate)?.completed;
  };

  const handleMarkComplete = (homeworkId: string) => {
    completeHomework(homeworkId);
    setHomeworks(getHomeworkByStudent(user.id));
    toast.success(t('homeworkCompleted'));
  };

  const trainerNames = {
    schulte: `🎯 ${t('schulteTableTrainer')}`,
    numbers: `🔢 ${t('numbersTrainerFull')}`,
    reading: `📚 ${t('readingTrainerFull')}`,
    memory: `🧠 ${t('memoryTrainerFull')}`,
    mentalMath: `🧮 ${t('mentalMath')}`,
    maze: `🌳 ${t('mazeTrainerFull')}`,
    multiplication: `✖️ ${t('multiplicationTrainerFull')}`,
    diagnostic: `🔍 ${t('diagnosticTrainer')}`,
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-4 right-4 text-6xl opacity-30">📝</div>
        <div className="absolute bottom-4 right-20 text-4xl opacity-40">✨</div>
        <div className="absolute top-4 left-4 text-4xl opacity-30">🎯</div>
        <h2 className="text-3xl mb-2 relative z-10">{t('myHomework')} 📚</h2>
        <p className="text-purple-100 relative z-10">{t('completeOnTime')}</p>
      </motion.div>

      {/* Pending Homework */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-300 rounded-3xl shadow-xl">
        <h3 className="mb-4 flex items-center gap-2 text-blue-900">
          <span className="text-2xl">⏰</span>
          {t('pendingHomework')} ({homeworks.filter(h => !h.completed).length})
        </h3>
        <div className="space-y-3">
          {homeworks.filter(h => !h.completed).map((hw) => (
            <motion.div
              key={hw.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-white rounded-2xl shadow-md border-2 border-blue-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {hw.trainerType === 'schulte' && '🎯'}
                    {hw.trainerType === 'numbers' && '🔢'}
                    {hw.trainerType === 'reading' && '📚'}
                    {hw.trainerType === 'memory' && '🧠'}
                    {hw.trainerType === 'mentalMath' && '🧮'}
                    {hw.trainerType === 'maze' && '🌳'}
                    {hw.trainerType === 'multiplication' && '✖️'}
                    {hw.trainerType === 'diagnostic' && '🔍'}
                  </span>
                  <div>
                    <h4 className="font-medium">{trainerNames[hw.trainerType]}</h4>
                    {isOverdue(hw.dueDate) && (
                      <Badge className="mt-1 bg-red-500">{t('overdue')}</Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{t('due')}: {formatDate(hw.dueDate)}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-3 p-3 bg-blue-50 rounded-xl">
                {hw.description}
              </p>

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleMarkComplete(hw.id)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-2xl"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  {t('markAsComplete')}
                </Button>
              </div>
            </motion.div>
          ))}
          {homeworks.filter(h => !h.completed).length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-3">🎉</div>
              <p className="text-gray-600">{t('allHomeworkCompleted')} {t('greatJob')}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Completed Homework */}
      <Card className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 border-4 border-pink-300 rounded-3xl shadow-xl">
        <h3 className="mb-4 flex items-center gap-2 text-pink-900">
          <span className="text-2xl">✅</span>
          {t('completedHomework')} ({homeworks.filter(h => h.completed).length})
        </h3>
        <div className="space-y-2">
          {homeworks.filter(h => h.completed).slice(-5).reverse().map((hw) => (
            <div key={hw.id} className="p-4 bg-white rounded-2xl shadow-sm border-2 border-pink-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {hw.trainerType === 'schulte' && '🎯'}
                    {hw.trainerType === 'numbers' && '🔢'}
                    {hw.trainerType === 'reading' && '📚'}
                    {hw.trainerType === 'memory' && '🧠'}
                    {hw.trainerType === 'mentalMath' && '🧮'}
                    {hw.trainerType === 'maze' && '🌳'}
                    {hw.trainerType === 'multiplication' && '✖️'}
                    {hw.trainerType === 'diagnostic' && '🔍'}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{trainerNames[hw.trainerType]}</p>
                    <p className="text-xs text-gray-600">{hw.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Trophy className="w-3 h-3" />
                    <span>{hw.completedDate && formatDate(hw.completedDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {homeworks.filter(h => h.completed).length === 0 && (
            <p className="text-center text-gray-500 py-8">{t('noCompletedHomework')}</p>
          )}
        </div>
      </Card>
    </div>
  );
}
