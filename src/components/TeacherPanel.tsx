import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { TeacherCuratorshipLink } from './TeacherCuratorshipLink';
import { 
  User, 
  getStudentsByTeacher,
  getSchulteResults,
  getNumbersResults,
  getReadingResults,
  getMemoryResults,
  getMentalMathResults,
  getMazeResults,
  getMultiplicationResults,
  getDiagnosticResults,
  registerUser,
  assignStudentToTeacher,
  createHomework,
  getHomeworkByTeacher,
  deleteHomework,
  getAllUsers
} from '../utils/storage';
import { Language, getTranslation } from '../utils/translations';
import { UserPlus, TrendingUp, Calendar, Clock, Trophy, BookOpen, Brain, Target, Grid3x3, Zap, Book, Gauge, Eye, Timer, Calculator, Waypoints, Activity } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TeacherPanelProps {
  user: User;
  language: Language;
}

export function TeacherPanel({ user, language }: TeacherPanelProps) {
  const [students, setStudents] = useState(getStudentsByTeacher(user.id));
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isAddingHomework, setIsAddingHomework] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [homeworks, setHomeworks] = useState(getHomeworkByTeacher(user.id));
  
  // Homework form
  const [hwStudentId, setHwStudentId] = useState('');
  const [hwTrainerType, setHwTrainerType] = useState<'schulte' | 'numbers' | 'reading' | 'memory'>('schulte');
  const [hwDescription, setHwDescription] = useState('');
  const [hwDueDate, setHwDueDate] = useState('');

  const t = (key: keyof typeof import('../utils/translations').translations.ru) => 
    getTranslation(language, key);

  const refreshData = () => {
    setStudents(getStudentsByTeacher(user.id));
    setHomeworks(getHomeworkByTeacher(user.id));
  };

  const handleAddStudent = () => {
    if (!studentName || !studentEmail || !studentPassword) {
      toast.error(t('pleaseFillAllFields'));
      return;
    }

    const existingUsers = getAllUsers();
    if (existingUsers.find(u => u.email === studentEmail)) {
      toast.error(t('emailAlreadyExists'));
      return;
    }

    const newStudent = registerUser(studentEmail, studentPassword, studentName, 'student');
    assignStudentToTeacher(user.id, newStudent.id);
    toast.success(t('studentAddedSuccessfully'));
    setStudentName('');
    setStudentEmail('');
    setStudentPassword('');
    setIsAddingStudent(false);
    refreshData();
  };

  const handleCreateHomework = () => {
    if (!hwStudentId || !hwDescription || !hwDueDate) {
      toast.error(t('pleaseFillAllFields'));
      return;
    }

    createHomework({
      teacherId: user.id,
      studentId: hwStudentId,
      trainerType: hwTrainerType,
      settings: {},
      description: hwDescription,
      dueDate: hwDueDate,
    });

    toast.success(t('homeworkAssignedSuccessfully'));
    setHwStudentId('');
    setHwDescription('');
    setHwDueDate('');
    setIsAddingHomework(false);
    refreshData();
  };

  const viewStudentProgress = (student: User) => {
    setSelectedStudent(student);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStudentStats = (studentId: string) => {
    const schulte = getSchulteResults(studentId);
    const numbers = getNumbersResults(studentId);
    const reading = getReadingResults(studentId);
    const memory = getMemoryResults(studentId);
    const mentalMath = getMentalMathResults(studentId);
    const maze = getMazeResults(studentId);

    return {
      total: schulte.length + numbers.length + reading.length + memory.length + mentalMath.length + maze.length,
      schulte: schulte.length,
      numbers: numbers.length,
      reading: reading.length,
      memory: memory.length,
      mentalMath: mentalMath.length,
      maze: maze.length,
    };
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-4 right-4 text-6xl opacity-30">👨‍🏫</div>
        <div className="absolute top-4 left-4 text-4xl opacity-30">📊</div>
        <div className="absolute bottom-4 right-20 text-4xl opacity-40">✨</div>
        <h2 className="text-3xl mb-2 relative z-10">{t('teacherPanel')} 📚</h2>
        <p className="text-purple-100 relative z-10">{t('manageStudentsProgress')}</p>
      </motion.div>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="bg-blue-100 p-1 rounded-2xl">
          <TabsTrigger value="students" className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            👨‍🎓 {t('students')}
          </TabsTrigger>
          <TabsTrigger value="homework" className="rounded-xl data-[state=active]:bg-pink-500 data-[state=active]:text-white">
            📝 {t('homework')}
          </TabsTrigger>
          <TabsTrigger value="curator" className="rounded-xl data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            🔗 {language === 'ru' ? 'Кураторство' : language === 'kz' ? 'Кураторлық' : 'Mentorship'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-6">
          {/* Students List */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-300 rounded-3xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="flex items-center gap-2 text-blue-900">
                <span className="text-2xl">👨‍🎓</span>
                {t('myStudents')} ({students.length})
              </h3>
              <Dialog open={isAddingStudent} onOpenChange={setIsAddingStudent}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl">
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t('addStudent')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white rounded-3xl border-4 border-blue-300">
                  <DialogHeader>
                    <DialogTitle>{t('addNewStudent')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t('name')}</Label>
                      <Input
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="border-2 border-blue-300 rounded-2xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('email')}</Label>
                      <Input
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        className="border-2 border-blue-300 rounded-2xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('password')}</Label>
                      <Input
                        type="password"
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        className="border-2 border-blue-300 rounded-2xl"
                      />
                    </div>
                    <Button onClick={handleAddStudent} className="w-full bg-blue-500 hover:bg-blue-600 rounded-2xl">
                      {t('addStudent')}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {students.map((student) => {
                const stats = getStudentStats(student.id);
                return (
                  <motion.div
                    key={student.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-white rounded-2xl shadow-md border-2 border-blue-200 cursor-pointer"
                    onClick={() => viewStudentProgress(student)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">👨‍🎓</div>
                        <div>
                          <p className="font-medium text-lg">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl text-blue-600">{stats.total}</div>
                        <div className="text-xs text-gray-600">{t('exercises')}</div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-6 gap-2">
                      <div className="text-center p-2 bg-blue-50 rounded-xl">
                        <div className="text-lg">🎯</div>
                        <div className="text-sm">{stats.schulte}</div>
                      </div>
                      <div className="text-center p-2 bg-pink-50 rounded-xl">
                        <div className="text-lg">🔢</div>
                        <div className="text-sm">{stats.numbers}</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded-xl">
                        <div className="text-lg">📚</div>
                        <div className="text-sm">{stats.reading}</div>
                      </div>
                      <div className="text-center p-2 bg-pink-50 rounded-xl">
                        <div className="text-lg">🧠</div>
                        <div className="text-sm">{stats.memory}</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded-xl">
                        <div className="text-lg">🧮</div>
                        <div className="text-sm">{stats.mentalMath}</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-xl">
                        <div className="text-lg">🌳</div>
                        <div className="text-sm">{stats.maze}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {students.length === 0 && (
                <p className="text-center text-gray-500 py-8">{t('noStudentsYet')}. {t('addFirstStudent')}</p>
              )}
            </div>
          </Card>

          {/* Student Progress Details */}
          {selectedStudent && (
            <Card className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 border-4 border-pink-300 rounded-3xl shadow-xl">
              <h3 className="mb-4 flex items-center gap-2 text-pink-900">
                <TrendingUp className="w-5 h-5" />
                {t('progress')}: {selectedStudent.name}
              </h3>

              <div className="space-y-4">
                {/* Schulte Results */}
                {getSchulteResults(selectedStudent.id).slice(-5).reverse().map((result) => (
                  <div key={result.id} className="p-4 bg-white rounded-2xl shadow-sm border-2 border-blue-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🎯</span>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-sm">{formatTime(result.time)}</span>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(result.date)}
                      </span>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-700 pl-7 flex-wrap">
                      <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                        <Grid3x3 className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-900">{result.size}×{result.size}</span>
                      </span>
                      <span className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg">
                        <Zap className="w-3 h-3 text-purple-600" />
                        <span className="text-purple-900">{result.mode === 'speed' ? t('speed') : t('understanding')}</span>
                      </span>
                    </div>
                  </div>
                ))}

                {/* Numbers Results */}
                {getNumbersResults(selectedStudent.id).slice(-5).reverse().map((result) => (
                  <div key={result.id} className="p-4 bg-white rounded-2xl shadow-sm border-2 border-pink-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🔢</span>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-pink-600" />
                          <span className="font-semibold text-sm">{formatTime(result.time)}</span>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(result.date)}
                      </span>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-700 pl-7 flex-wrap">
                      <span className="flex items-center gap-1 bg-pink-50 px-2 py-1 rounded-lg">
                        <Target className="w-3 h-3 text-pink-600" />
                        <span className="text-pink-900">{t('range')}: {result.range}</span>
                      </span>
                    </div>
                  </div>
                ))}

                {/* Reading Results */}
                {getReadingResults(selectedStudent.id).slice(-5).reverse().map((result) => {
                  const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
                  return (
                    <div key={result.id} className="p-4 bg-white rounded-2xl shadow-sm border-2 border-blue-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">📚</span>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-sm">{result.correctAnswers}/{result.totalQuestions} ({percentage}%)</span>
                          </div>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {formatDate(result.date)}
                        </span>
                      </div>
                      <div className="flex gap-2 text-xs text-gray-700 pl-7 flex-wrap">
                        <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                          <Book className="w-3 h-3 text-blue-600" />
                          <span className="text-blue-900">{result.difficulty}</span>
                        </span>
                        <span className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg">
                          <Eye className="w-3 h-3 text-purple-600" />
                          <span className="text-purple-900">{result.mode}</span>
                        </span>
                        <span className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                          <Gauge className="w-3 h-3 text-green-600" />
                          <span className="text-green-900">{result.wpm} WPM</span>
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Memory Results */}
                {getMemoryResults(selectedStudent.id).slice(-5).reverse().map((result) => (
                  <div key={result.id} className="p-4 bg-white rounded-2xl shadow-sm border-2 border-pink-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🧠</span>
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-pink-600" />
                          <span className="font-semibold text-sm">{t('score')}: {result.score}</span>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(result.date)}
                      </span>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-700 pl-7 flex-wrap">
                      <span className="flex items-center gap-1 bg-pink-50 px-2 py-1 rounded-lg">
                        <Target className="w-3 h-3 text-pink-600" />
                        <span className="text-pink-900">{t('level')} {result.level}</span>
                      </span>
                      <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                        <Brain className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-900">{result.sequenceLength} {language === 'ru' ? 'элементов' : language === 'kz' ? 'элемент' : 'items'}</span>
                      </span>
                      <span className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg">
                        <Timer className="w-3 h-3 text-purple-600" />
                        <span className="text-purple-900">{result.displayTime}s</span>
                      </span>
                    </div>
                  </div>
                ))}

                {/* Mental Math Results */}
                {getMentalMathResults(selectedStudent.id).slice(-5).reverse().map((result) => {
                  const percentage = Math.round((result.correctAnswers / result.totalProblems) * 100);
                  return (
                    <div key={result.id} className="p-4 bg-white rounded-2xl shadow-sm border-2 border-blue-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🧮</span>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-sm">{result.correctAnswers}/{result.totalProblems} ({percentage}%)</span>
                          </div>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {formatDate(result.date)}
                        </span>
                      </div>
                      <div className="flex gap-2 text-xs text-gray-700 pl-7 flex-wrap">
                        <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                          <Calculator className="w-3 h-3 text-blue-600" />
                          <span className="text-blue-900">{result.digits} {language === 'ru' ? result.digits === 1 ? 'разряд' : 'разряда' : language === 'kz' ? 'разряд' : result.digits === 1 ? 'digit' : 'digits'}</span>
                        </span>
                        <span className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg">
                          <Target className="w-3 h-3 text-purple-600" />
                          <span className="text-purple-900">{result.difficulty === 'easy' ? t('easy') : result.difficulty === 'hard' ? t('hard') : t('mixed')}</span>
                        </span>
                        <span className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                          <Clock className="w-3 h-3 text-green-600" />
                          <span className="text-green-900">{formatTime(result.time)}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Maze Results */}
                {getMazeResults(selectedStudent.id).slice(-5).reverse().map((result) => (
                  <div key={result.id} className="p-4 bg-white rounded-2xl shadow-sm border-2 border-green-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🌳</span>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-sm">{Math.floor(result.time / 60)}:{(result.time % 60).toString().padStart(2, '0')}</span>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(result.date)}
                      </span>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-700 pl-7 flex-wrap">
                      <span className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                        <Target className="w-3 h-3 text-green-600" />
                        <span className="text-green-900">
                          {result.difficulty <= 2 ? '🟢' : result.difficulty <= 5 ? '🟡' : result.difficulty <= 7 ? '🟠' : '🔴'} 
                          {' '}{t('level')} {result.difficulty}
                        </span>
                      </span>
                      <span className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                        <Waypoints className="w-3 h-3 text-orange-600" />
                        <span className="text-orange-900">{result.moves} {t('moves')}</span>
                      </span>
                    </div>
                  </div>
                ))}

                {/* Multiplication Results */}
                {getMultiplicationResults(selectedStudent.id).slice(-5).reverse().map((result) => (
                  <div key={result.id} className="p-4 bg-white rounded-2xl shadow-sm border-2 border-indigo-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">✖️</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {result.mode === 'single' ? `${t('table')} ${result.table}` : t('mixedTables')}
                          </span>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(result.date)}
                      </span>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-700 pl-7 flex-wrap">
                      <span className="flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg">
                        <Target className="w-3 h-3 text-indigo-600" />
                        <span className="text-indigo-900">{result.correctAnswers}/{result.totalProblems}</span>
                      </span>
                      <span className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg">
                        <Trophy className="w-3 h-3 text-purple-600" />
                        <span className="text-purple-900">{Math.round((result.correctAnswers / result.totalProblems) * 100)}%</span>
                      </span>
                      <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                        <Clock className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-900">{result.time}s</span>
                      </span>
                    </div>
                  </div>
                ))}

                {getSchulteResults(selectedStudent.id).length === 0 && 
                 getNumbersResults(selectedStudent.id).length === 0 && 
                 getReadingResults(selectedStudent.id).length === 0 &&
                 getMemoryResults(selectedStudent.id).length === 0 && 
                 getMentalMathResults(selectedStudent.id).length === 0 && 
                 getMazeResults(selectedStudent.id).length === 0 && 
                 getMultiplicationResults(selectedStudent.id).length === 0 && (
                  <p className="text-center text-gray-500 py-4">{t('noResultsYet')}</p>
                )}
              </div>

              <Button 
                onClick={() => setSelectedStudent(null)} 
                className="mt-4 w-full bg-pink-500 hover:bg-pink-600 rounded-2xl"
              >
                {t('close')}
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="homework" className="space-y-6">
          {/* Create Homework */}
          <Card className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 border-4 border-pink-300 rounded-3xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="flex items-center gap-2 text-pink-900">
                <span className="text-2xl">📝</span>
                {t('homeworkAssignments')}
              </h3>
              <Dialog open={isAddingHomework} onOpenChange={setIsAddingHomework}>
                <DialogTrigger asChild>
                  <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-2xl">
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t('assignHomework')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white rounded-3xl border-4 border-pink-300">
                  <DialogHeader>
                    <DialogTitle>{t('assignNewHomework')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t('student')}</Label>
                      <Select value={hwStudentId} onValueChange={setHwStudentId}>
                        <SelectTrigger className="border-2 border-pink-300 rounded-2xl">
                          <SelectValue placeholder={t('selectStudent')} />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('trainerType')}</Label>
                      <Select value={hwTrainerType} onValueChange={(v: any) => setHwTrainerType(v)}>
                        <SelectTrigger className="border-2 border-pink-300 rounded-2xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="schulte">🎯 {t('schulteTable')}</SelectItem>
                          <SelectItem value="numbers">🔢 {t('numbersTrainer')}</SelectItem>
                          <SelectItem value="reading">📚 {t('readingTrainer')}</SelectItem>
                          <SelectItem value="memory">🧠 {t('memoryTrainer')}</SelectItem>
                          <SelectItem value="mentalMath">🧮 {t('mentalMath')}</SelectItem>
                          <SelectItem value="maze">🌳 {t('mazeTrainer')}</SelectItem>
                          <SelectItem value="multiplication">✖️ {t('multiplicationTrainer')}</SelectItem>
                          <SelectItem value="diagnostic">🔍 {t('diagnosticTrainer')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('description')}</Label>
                      <Textarea
                        value={hwDescription}
                        onChange={(e) => setHwDescription(e.target.value)}
                        className="border-2 border-pink-300 rounded-2xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('dueDate')}</Label>
                      <Input
                        type="date"
                        value={hwDueDate}
                        onChange={(e) => setHwDueDate(e.target.value)}
                        className="border-2 border-pink-300 rounded-2xl"
                      />
                    </div>
                    <Button onClick={handleCreateHomework} className="w-full bg-pink-500 hover:bg-pink-600 rounded-2xl">
                      {t('assignHomework')}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              {homeworks.map((hw) => {
                const student = students.find(s => s.id === hw.studentId);
                return (
                  <div key={hw.id} className="p-4 bg-white rounded-2xl shadow-md border-2 border-pink-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">
                            {hw.trainerType === 'schulte' && '🎯'}
                            {hw.trainerType === 'numbers' && '🔢'}
                            {hw.trainerType === 'reading' && '📚'}
                            {hw.trainerType === 'memory' && '🧠'}
                          </span>
                          <span className="font-medium">{student?.name}</span>
                          {hw.completed && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✓ Completed</span>}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{hw.description}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Due: {formatDate(hw.dueDate)}
                          </span>
                          {hw.completed && hw.completedDate && (
                            <span className="flex items-center gap-1 text-green-600">
                              <Trophy className="w-3 h-3" />
                              Completed: {formatDate(hw.completedDate)}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm(t('deleteHomework'))) {
                            deleteHomework(hw.id);
                            refreshData();
                            toast.success(t('homeworkDeleted'));
                          }
                        }}
                        className="border-2 border-red-300 text-red-600 hover:bg-red-50 rounded-2xl"
                      >
                        {t('delete')}
                      </Button>
                    </div>
                  </div>
                );
              })}
              {homeworks.length === 0 && (
                <p className="text-center text-gray-500 py-8">No homework assigned yet</p>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="curator" className="space-y-6">
          {/* Curatorship Link */}
          <TeacherCuratorshipLink
            teacherId={user.id}
            teacherName={user.name}
            language={language}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}