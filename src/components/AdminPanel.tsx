import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  User, 
  registerUser, 
  getAllStudents, 
  getTeachersByAdmin, 
  assignStudentToTeacher,
  deleteUser,
  getAllUsers,
  getStudentsByTeacher,
  getSchulteResults,
  getNumbersResults,
  getReadingResults,
  getMemoryResults,
  getMentalMathResults,
  getMazeResults,
  getMultiplicationResults,
  getDiagnosticResults
} from '../utils/storage';
import { Language, getTranslation } from '../utils/translations';
import { UserPlus, Users, Trash2, UserCheck, ChevronDown, ChevronRight, Calendar, Clock, Trophy, Target, Grid3x3, Zap, Book, Gauge, Eye, Timer, Calculator, Waypoints, Brain, Activity, MessageCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useMessaging } from '../utils/messagingContext';

interface AdminPanelProps {
  user: User;
  language: Language;
}

export function AdminPanel({ user, language }: AdminPanelProps) {
  const [teachers, setTeachers] = useState(getTeachersByAdmin());
  const [students, setStudents] = useState(getAllStudents());
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [expandedTeachers, setExpandedTeachers] = useState<Set<string>>(new Set());
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  
  const { openChatWith } = useMessaging();

  const t = (key: keyof typeof import('../utils/translations').translations.ru) => 
    getTranslation(language, key);

  const refreshData = () => {
    setTeachers(getTeachersByAdmin());
    setStudents(getAllStudents());
  };

  const handleAddTeacher = () => {
    if (!teacherName || !teacherEmail || !teacherPassword) {
      toast.error(t('pleaseFillAllFields'));
      return;
    }

    const existingUsers = getAllUsers();
    if (existingUsers.find(u => u.email === teacherEmail)) {
      toast.error(t('emailAlreadyExists'));
      return;
    }

    registerUser(teacherEmail, teacherPassword, teacherName, 'teacher');
    toast.success(t('teacherAddedSuccessfully'));
    setTeacherName('');
    setTeacherEmail('');
    setTeacherPassword('');
    setIsAddingTeacher(false);
    refreshData();
  };

  const handleAddStudent = () => {
    if (!studentName || !studentEmail || !studentPassword || !selectedTeacherId) {
      toast.error(t('pleaseFillAllFields'));
      return;
    }

    const existingUsers = getAllUsers();
    if (existingUsers.find(u => u.email === studentEmail)) {
      toast.error(t('emailAlreadyExists'));
      return;
    }

    const newStudent = registerUser(studentEmail, studentPassword, studentName, 'student');
    assignStudentToTeacher(selectedTeacherId, newStudent.id);
    toast.success(t('studentAddedAndAssigned'));
    setStudentName('');
    setStudentEmail('');
    setStudentPassword('');
    setSelectedTeacherId('');
    setIsAddingStudent(false);
    refreshData();
  };

  const handleDeleteUser = (userId: string, role: string) => {
    if (confirm(t('areYouSureDelete'))) {
      deleteUser(userId);
      toast.success(t('deletedSuccessfully'));
      refreshData();
    }
  };

  const toggleTeacher = (teacherId: string) => {
    const newExpanded = new Set(expandedTeachers);
    if (newExpanded.has(teacherId)) {
      newExpanded.delete(teacherId);
    } else {
      newExpanded.add(teacherId);
    }
    setExpandedTeachers(newExpanded);
  };

  const getStudentStats = (studentId: string) => {
    const schulte = getSchulteResults(studentId);
    const numbers = getNumbersResults(studentId);
    const reading = getReadingResults(studentId);
    const memory = getMemoryResults(studentId);
    const mentalMath = getMentalMathResults(studentId);
    const maze = getMazeResults(studentId);
    const multiplication = getMultiplicationResults(studentId);

    return {
      total: schulte.length + numbers.length + reading.length + memory.length + mentalMath.length + maze.length + multiplication.length,
      schulte: schulte.length,
      numbers: numbers.length,
      reading: reading.length,
      memory: memory.length,
      mentalMath: mentalMath.length,
      maze: maze.length,
      multiplication: multiplication.length,
    };
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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-4 right-4 text-6xl opacity-30">👑</div>
        <div className="absolute bottom-4 right-20 text-4xl opacity-40">✨</div>
        <div className="absolute top-4 left-4 text-4xl opacity-30">⚙️</div>
        <h2 className="text-3xl mb-2 relative z-10">{t('adminPanel')} 🛠️</h2>
        <p className="text-purple-100 relative z-10">{t('manageTeachersStudents')}</p>
      </motion.div>

      {/* Teachers with Students */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-300 rounded-3xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="flex items-center gap-2 text-blue-900">
            <span className="text-2xl">👨‍🏫</span>
            {t('teachers')} ({teachers.length})
          </h3>
          <div className="flex gap-2">
            <Dialog open={isAddingStudent} onOpenChange={setIsAddingStudent}>
              <DialogTrigger asChild>
                <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-2xl">
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t('addStudent')}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white rounded-3xl border-4 border-pink-300">
                <DialogHeader>
                  <DialogTitle>{t('addNewStudent')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('assignToTeacher')}</Label>
                    <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                      <SelectTrigger className="border-2 border-pink-300 rounded-2xl">
                        <SelectValue placeholder={t('selectTeacher')} />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('name')}</Label>
                    <Input
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="border-2 border-pink-300 rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('email')}</Label>
                    <Input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="border-2 border-pink-300 rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('password')}</Label>
                    <Input
                      type="password"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      className="border-2 border-pink-300 rounded-2xl"
                    />
                  </div>
                  <Button onClick={handleAddStudent} className="w-full bg-pink-500 hover:bg-pink-600 rounded-2xl">
                    {t('addStudent')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isAddingTeacher} onOpenChange={setIsAddingTeacher}>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl">
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t('addTeacher')}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white rounded-3xl border-4 border-blue-300">
                <DialogHeader>
                  <DialogTitle>{t('addNewTeacher')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('name')}</Label>
                    <Input
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      className="border-2 border-blue-300 rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('email')}</Label>
                    <Input
                      type="email"
                      value={teacherEmail}
                      onChange={(e) => setTeacherEmail(e.target.value)}
                      className="border-2 border-blue-300 rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('password')}</Label>
                    <Input
                      type="password"
                      value={teacherPassword}
                      onChange={(e) => setTeacherPassword(e.target.value)}
                      className="border-2 border-blue-300 rounded-2xl"
                    />
                  </div>
                  <Button onClick={handleAddTeacher} className="w-full bg-blue-500 hover:bg-blue-600 rounded-2xl">
                    {t('addTeacher')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-3">
          {teachers.map((teacher) => {
            const teacherStudents = getStudentsByTeacher(teacher.id);
            const isExpanded = expandedTeachers.has(teacher.id);
            
            return (
              <div key={teacher.id} className="bg-white rounded-2xl shadow-md border-2 border-blue-200 overflow-hidden">
                {/* Teacher Header */}
                <div className="p-4 flex justify-between items-center">
                  <div 
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                    onClick={() => toggleTeacher(teacher.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-blue-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-blue-600" />
                    )}
                    <div className="text-2xl">👨‍🏫</div>
                    <div>
                      <p className="font-medium">{teacher.name}</p>
                      <p className="text-sm text-gray-600">{teacher.email}</p>
                    </div>
                    <div className="ml-auto mr-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {teacherStudents.length} {t('students')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openChatWith(teacher.id, teacher.name, 'teacher');
                      }}
                      className="border-2 border-pink-300 text-pink-600 hover:bg-pink-50 rounded-2xl"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(teacher.id, 'teacher');
                      }}
                      className="border-2 border-red-300 text-red-600 hover:bg-red-50 rounded-2xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Students List */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t-2 border-blue-200 bg-blue-50"
                    >
                      <div className="p-4 space-y-2">
                        {teacherStudents.map((student) => {
                          const stats = getStudentStats(student.id);
                          return (
                            <motion.div
                              key={student.id}
                              whileHover={{ scale: 1.02 }}
                              className="p-3 bg-white rounded-xl shadow-sm border-2 border-pink-200 cursor-pointer"
                              onClick={() => setSelectedStudent(student)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <div className="text-2xl">👨‍🎓</div>
                                  <div>
                                    <p className="font-medium">{student.name}</p>
                                    <p className="text-xs text-gray-600">{student.email}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xl text-pink-600">{stats.total}</div>
                                  <div className="text-xs text-gray-600">{t('exercises')}</div>
                                </div>
                              </div>
                              <div className="mt-2 grid grid-cols-6 gap-1">
                                <div className="text-center p-1.5 bg-blue-50 rounded-lg">
                                  <div className="text-sm">🎯</div>
                                  <div className="text-xs">{stats.schulte}</div>
                                </div>
                                <div className="text-center p-1.5 bg-pink-50 rounded-lg">
                                  <div className="text-sm">🔢</div>
                                  <div className="text-xs">{stats.numbers}</div>
                                </div>
                                <div className="text-center p-1.5 bg-blue-50 rounded-lg">
                                  <div className="text-sm">📚</div>
                                  <div className="text-xs">{stats.reading}</div>
                                </div>
                                <div className="text-center p-1.5 bg-pink-50 rounded-lg">
                                  <div className="text-sm">🧠</div>
                                  <div className="text-xs">{stats.memory}</div>
                                </div>
                                <div className="text-center p-1.5 bg-blue-50 rounded-lg">
                                  <div className="text-sm">🧮</div>
                                  <div className="text-xs">{stats.mentalMath}</div>
                                </div>
                                <div className="text-center p-1.5 bg-green-50 rounded-lg">
                                  <div className="text-sm">🌳</div>
                                  <div className="text-xs">{stats.maze}</div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                        {teacherStudents.length === 0 && (
                          <p className="text-center text-gray-500 py-4 text-sm">{t('noStudentsYet')}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          {teachers.length === 0 && (
            <p className="text-center text-gray-500 py-8">{t('noTeachersYet')}</p>
          )}
        </div>
      </Card>

      {/* Student Details Dialog */}
      {selectedStudent && (
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="bg-white rounded-3xl border-4 border-pink-300 max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-2xl">👨‍🎓</span>
                {selectedStudent.name} - {t('results')}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                {t('latestResults')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 mt-4">
              {/* Schulte Results */}
              {getSchulteResults(selectedStudent.id).slice(-5).reverse().map((result) => (
                <div key={result.id} className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-sm border-2 border-blue-200">
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
                    <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
                      <Grid3x3 className="w-3 h-3 text-blue-600" />
                      <span className="text-blue-900">{result.size}×{result.size}</span>
                    </span>
                    <span className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                      <Zap className="w-3 h-3 text-purple-600" />
                      <span className="text-purple-900">{result.mode === 'speed' ? t('speed') : t('understanding')}</span>
                    </span>
                  </div>
                </div>
              ))}

              {/* Numbers Results */}
              {getNumbersResults(selectedStudent.id).slice(-5).reverse().map((result) => (
                <div key={result.id} className="p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl shadow-sm border-2 border-pink-200">
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
                    <span className="flex items-center gap-1 bg-pink-50 px-2 py-1 rounded-lg border border-pink-200">
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
                  <div key={result.id} className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border-2 border-blue-200">
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
                      <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
                        <Book className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-900">{result.difficulty}</span>
                      </span>
                      <span className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                        <Eye className="w-3 h-3 text-purple-600" />
                        <span className="text-purple-900">{result.mode}</span>
                      </span>
                      <span className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg border border-green-200">
                        <Gauge className="w-3 h-3 text-green-600" />
                        <span className="text-green-900">{result.wpm} WPM</span>
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Memory Results */}
              {getMemoryResults(selectedStudent.id).slice(-5).reverse().map((result) => (
                <div key={result.id} className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm border-2 border-purple-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🧠</span>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-sm">{t('score')}: {result.score}</span>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(result.date)}
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs text-gray-700 pl-7 flex-wrap">
                    <span className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                      <Target className="w-3 h-3 text-purple-600" />
                      <span className="text-purple-900">{t('level')} {result.level}</span>
                    </span>
                    <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
                      <Brain className="w-3 h-3 text-blue-600" />
                      <span className="text-blue-900">{result.sequenceLength} {language === 'ru' ? 'элементов' : language === 'kz' ? 'элемент' : 'items'}</span>
                    </span>
                    <span className="flex items-center gap-1 bg-pink-50 px-2 py-1 rounded-lg border border-pink-200">
                      <Timer className="w-3 h-3 text-pink-600" />
                      <span className="text-pink-900">{result.displayTime}s</span>
                    </span>
                  </div>
                </div>
              ))}

              {/* Mental Math Results */}
              {getMentalMathResults(selectedStudent.id).slice(-5).reverse().map((result) => {
                const percentage = Math.round((result.correctAnswers / result.totalProblems) * 100);
                return (
                  <div key={result.id} className="p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl shadow-sm border-2 border-cyan-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🧮</span>
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-cyan-600" />
                          <span className="font-semibold text-sm">{result.correctAnswers}/{result.totalProblems} ({percentage}%)</span>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(result.date)}
                      </span>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-700 pl-7 flex-wrap">
                      <span className="flex items-center gap-1 bg-cyan-50 px-2 py-1 rounded-lg border border-cyan-200">
                        <Calculator className="w-3 h-3 text-cyan-600" />
                        <span className="text-cyan-900">{result.digits} {language === 'ru' ? result.digits === 1 ? 'разряд' : 'разряда' : language === 'kz' ? 'разряд' : result.digits === 1 ? 'digit' : 'digits'}</span>
                      </span>
                      <span className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                        <Target className="w-3 h-3 text-purple-600" />
                        <span className="text-purple-900">{result.difficulty === 'easy' ? t('easy') : result.difficulty === 'hard' ? t('hard') : t('mixed')}</span>
                      </span>
                      <span className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg border border-green-200">
                        <Clock className="w-3 h-3 text-green-600" />
                        <span className="text-green-900">{formatTime(result.time)}</span>
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Maze Results */}
              {getMazeResults(selectedStudent.id).slice(-5).reverse().map((result) => (
                <div key={result.id} className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm border-2 border-green-200">
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
                    <span className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg border border-green-200">
                      <Target className="w-3 h-3 text-green-600" />
                      <span className="text-green-900">
                        {result.difficulty <= 2 ? '🟢' : result.difficulty <= 5 ? '🟡' : result.difficulty <= 7 ? '🟠' : '🔴'} 
                        {' '}{t('level')} {result.difficulty}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg border border-orange-200">
                      <Waypoints className="w-3 h-3 text-orange-600" />
                      <span className="text-orange-900">{result.moves} {t('moves')}</span>
                    </span>
                  </div>
                </div>
              ))}

              {/* Multiplication Results */}
              {getMultiplicationResults(selectedStudent.id).slice(-5).reverse().map((result) => (
                <div key={result.id} className="p-3 bg-gradient-to-r from-indigo-50 to-indigo-50 rounded-xl shadow-sm border-2 border-indigo-200">
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
                    <span className="flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200">
                      <Target className="w-3 h-3 text-indigo-600" />
                      <span className="text-indigo-900">{result.correctAnswers}/{result.totalProblems}</span>
                    </span>
                    <span className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                      <Trophy className="w-3 h-3 text-purple-600" />
                      <span className="text-purple-900">{Math.round((result.correctAnswers / result.totalProblems) * 100)}%</span>
                    </span>
                    <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
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
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}