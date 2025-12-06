import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './components/ui/button';
import { MessageCircle, LogOut, Menu, X, LayoutDashboard, Users, ClipboardList, Gift, Activity, Target, GraduationCap, Globe, Grid3x3, Hash, BookOpen, Brain, Calculator, Waypoints, Sparkles } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { Logo } from './components/Logo';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { TeacherPanel } from './components/TeacherPanel';
import { StudentHomework } from './components/StudentHomework';
import { SchulteTable } from './components/SchulteTable';
import { NumbersTrainer } from './components/NumbersTrainer';
import { SpeedReadingTrainer } from './components/SpeedReadingTrainer';
import { ReadingTrainer } from './components/ReadingTrainer';
import { EnglishTrainer } from './components/EnglishTrainer';
import { MemoryTrainer } from './components/MemoryTrainer';
import { MentalMathTrainer } from './components/MentalMathTrainer';
import { MazeTrainer } from './components/MazeTrainer';
import { MultiplicationTrainer } from './components/MultiplicationTrainer';
import { DiagnosticTrainer } from './components/DiagnosticTrainer';
import { ConcentrationTrainer } from './components/ConcentrationTrainer';
import { RewardsShop } from './components/RewardsShop';
import { MessagingSystem } from './components/MessagingSystem';
import { JoinCuratorship } from './components/JoinCuratorship';
import { User, Language } from './utils/types';
import { getCurrentUser, logout } from './utils/storage';
import { getTranslation } from './utils/translations';
import { MessagingProvider } from './utils/messagingContext';
import './styles/globals.css';

type View = 
  | 'dashboard' 
  | 'admin' 
  | 'teacher' 
  | 'homework' 
  | 'schulte' 
  | 'numbers' 
  | 'reading' 
  | 'memory' 
  | 'mentalMath' 
  | 'maze' 
  | 'multiplication' 
  | 'diagnostic' 
  | 'concentration' 
  | 'rewards' 
  | 'learningToRead'
  | 'english';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('ru');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [messagingInitialUser, setMessagingInitialUser] = useState<{id: string, name: string, role: string} | null>(null);
  const [joinCuratorCode, setJoinCuratorCode] = useState<string | null>(null);

  // Function to open messaging with a specific user
  const openChatWith = (userId: string, userName: string, userRole: string) => {
    setMessagingInitialUser({ id: userId, name: userName, role: userRole });
    setShowMessaging(true);
  };

  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }

    // Check for curator join link in URL
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join');
    if (joinCode && savedUser?.role === 'student') {
      setJoinCuratorCode(joinCode);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setCurrentView('dashboard');
  };

  const t = (key: keyof typeof import('./utils/translations').translations.ru) => 
    getTranslation(language, key);

  if (!user) {
    return <Auth onLogin={setUser} language={language} />;
  }

  const getCabinetItems = () => {
    const items = [
      { id: 'dashboard' as View, icon: LayoutDashboard, label: t('dashboard') },
    ];

    if (user.role === 'student') {
      items.push({ id: 'rewards' as View, icon: Gift, label: t('rewardsShop') });
      items.push({ id: 'homework' as View, icon: ClipboardList, label: t('homework') });
    }

    if (user.role === 'admin') {
      items.push({ id: 'admin' as View, icon: Users, label: t('adminPanel') });
    }

    if (user.role === 'teacher') {
      items.push({ id: 'teacher' as View, icon: Users, label: t('teacherPanel') });
    }

    return items;
  };

  const getTrainerItems = () => {
    return [
      { id: 'diagnostic' as View, icon: Activity, label: t('diagnosticTrainer') },
      { id: 'concentration' as View, icon: Target, label: t('concentrationTrainer') },
      { id: 'learningToRead' as View, icon: GraduationCap, label: t('learningToRead') },
      { id: 'english' as View, icon: Globe, label: t('englishTrainer') },
      { id: 'schulte' as View, icon: Grid3x3, label: t('schulteTable') },
      { id: 'numbers' as View, icon: Hash, label: t('numbersTrainer') },
      { id: 'reading' as View, icon: BookOpen, label: t('readingTrainer') },
      { id: 'memory' as View, icon: Brain, label: t('memoryTrainer') },
      { id: 'mentalMath' as View, icon: Calculator, label: t('mentalMath') },
      { id: 'maze' as View, icon: Waypoints, label: t('mazeTrainer') },
      { id: 'multiplication' as View, icon: Sparkles, label: t('multiplicationTrainer') }
    ];
  };

  const cabinetItems = getCabinetItems();
  const trainerItems = getTrainerItems();

  return (
    <MessagingProvider openChatWith={openChatWith}>
      <div className="min-h-screen bg-gradient-playful relative overflow-hidden">
        {/* Floating gradient blobs */}
        <div className="floating-shape floating-shape-1"></div>
        <div className="floating-shape floating-shape-2"></div>
        <div className="floating-shape floating-shape-3"></div>
        <div className="floating-shape floating-shape-4"></div>
        
        {/* Decorative stars */}
        <div className="fixed top-10 left-10 text-5xl animate-sparkle">⭐</div>
        <div className="fixed top-20 right-20 text-4xl animate-sparkle animation-delay-1000">✨</div>
        <div className="fixed bottom-32 left-1/4 text-5xl animate-bounce-slow">🌟</div>
        <div className="fixed top-1/3 right-10 text-4xl animate-wiggle animation-delay-2000">💫</div>
        <div className="fixed bottom-1/4 right-1/3 text-3xl animate-sparkle animation-delay-3000">⭐</div>
        
        {/* Decorative clouds */}
        <div className="fixed top-16 left-1/3 text-5xl opacity-40 animate-float">☁️</div>
        <div className="fixed top-40 right-1/4 text-6xl opacity-30 animate-float animation-delay-1000">☁️</div>
        <div className="fixed bottom-40 left-20 text-5xl opacity-35 animate-float animation-delay-2000">☁️</div>
        
        {/* Decorative balloons */}
        <div className="fixed top-24 right-1/3 text-4xl animate-bounce-slow">🎈</div>
        <div className="fixed bottom-20 left-1/4 text-4xl animate-bounce-slow animation-delay-2000">🎈</div>
        
        {/* Rainbow and playful elements */}
        <div className="fixed top-1/2 left-10 text-4xl animate-float animation-delay-1000">🌈</div>
        <div className="fixed bottom-1/3 right-20 text-3xl animate-spin-slow">🎯</div>
        <div className="fixed top-2/3 right-1/4 text-3xl animate-bounce-slow animation-delay-3000">🎪</div>
        
        {/* Header */}
        <div className="glass-card border-b-4 border-indigo-300 sticky top-0 z-50 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="animate-pulse-glow rounded-2xl">
                  <Logo size={64} />
                </div>
                <div>
                  <h1 className="text-gradient-playful text-2xl tracking-wide">
                    {t('appName')} ✨
                  </h1>
                  <p className="text-xs text-indigo-600 font-medium">👋 {user.name} ({t(user.role)})</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Messages Button */}
                {(user.role === 'student' || user.role === 'teacher' || user.role === 'admin') && (
                  <Button
                    variant="outline"
                    onClick={() => setShowMessaging(true)}
                    className="border-3 border-pink-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 text-pink-600 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <MessageCircle className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">
                      {language === 'ru' ? 'Сообщения' : language === 'kz' ? 'Хабарламалар' : 'Messages'}
                    </span>
                  </Button>
                )}

                {/* Language Selector */}
                <div className="hidden sm:flex gap-1 bg-gradient-to-r from-blue-100 to-indigo-100 p-1.5 rounded-3xl shadow-lg">
                  {(['ru', 'kz', 'en'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-4 py-2 rounded-2xl transition-all ${
                        language === lang
                          ? 'btn-gradient-blue text-white shadow-xl transform scale-105'
                          : 'hover:bg-white/50 text-indigo-700 font-medium'
                      }`}
                    >
                      {lang === 'ru' ? '🇷🇺' : lang === 'kz' ? '🇰🇿' : '🇬🇧'} {lang.toUpperCase()}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="hidden sm:flex border-3 border-purple-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-purple-600 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('logout')}
                </Button>

                {/* Mobile Menu Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="sm:hidden border-3 border-indigo-300 hover:bg-indigo-50 rounded-2xl shadow-lg"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sm:hidden glass-card border-b-4 border-indigo-300 shadow-2xl"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {/* Language Selector Mobile */}
              <div className="flex gap-1 bg-gradient-to-r from-blue-100 to-indigo-100 p-1.5 rounded-3xl mb-4 shadow-lg">
                {(['ru', 'kz', 'en'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`flex-1 px-3 py-2 rounded-2xl transition-all ${
                      language === lang
                        ? 'btn-gradient-blue text-white shadow-xl'
                        : 'hover:bg-white/50 text-indigo-700 font-medium'
                    }`}
                  >
                    {lang === 'ru' ? '🇷🇺' : lang === 'kz' ? '🇰🇿' : '🇬🇧'} {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Cabinet Items */}
              <div className="space-y-2">
                {cabinetItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                      currentView === item.id
                        ? 'btn-gradient-indigo text-white shadow-xl transform scale-105'
                        : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 text-indigo-700 font-medium'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Trainers Section */}
              <div className="pt-4 space-y-2">
                <div className="px-2 py-2 mb-2">
                  <p className="text-gradient-blue uppercase tracking-wider font-bold text-sm">
                    {language === 'ru' ? '🎮 Тренажеры' : language === 'kz' ? '🎮 Жаттықтырғыштар' : '🎮 Trainers'}
                  </p>
                </div>
                {trainerItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left min-h-[50px] ${
                      currentView === item.id
                        ? 'btn-gradient-blue text-white shadow-xl transform scale-105'
                        : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-blue-700 font-medium'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="leading-tight text-sm">{item.label}</span>
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full border-3 border-purple-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-purple-600 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('logout')}
              </Button>
            </div>
          </motion.div>
        )}

        <div className="flex max-w-7xl mx-auto">
          {/* Sidebar - Desktop */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden sm:block w-72 min-h-[calc(100vh-88px)] p-4"
          >
            <div className="glass-card rounded-3xl p-5 shadow-2xl border-4 border-indigo-200 sticky top-24 card-hover">
              {/* Cabinet Section */}
              <nav className="space-y-2">
                {cabinetItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all ${
                      currentView === item.id
                        ? 'btn-gradient-indigo text-white shadow-xl transform scale-105'
                        : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 text-indigo-700 font-medium'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Divider */}
              <div className="border-t-3 border-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 my-5 opacity-50"></div>

              {/* Trainers Section */}
              <div className="space-y-2">
                <div className="px-2 py-2 mb-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                  <h3 className="text-gradient-blue uppercase tracking-wider font-bold text-xs">
                    {language === 'ru' ? '🎮 Тренажеры' : language === 'kz' ? '🎮 Жаттықтырғыштар' : '🎮 Trainers'}
                  </h3>
                </div>
                <nav className="space-y-2">
                  {trainerItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left min-h-[52px] ${
                        currentView === item.id
                          ? 'btn-gradient-blue text-white shadow-xl transform scale-105'
                          : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-blue-700 font-medium'
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="leading-tight text-sm">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 p-4 sm:p-6"
          >
            <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-blue-200 min-h-[calc(100vh-200px)] relative overflow-hidden">
              {/* Content decorative elements */}
              <div className="absolute top-4 right-4 text-3xl animate-wiggle opacity-50">✨</div>
              <div className="absolute bottom-4 left-4 text-2xl animate-bounce-slow opacity-40">⭐</div>
              
              <div className="relative z-10">
                {currentView === 'dashboard' && <Dashboard user={user} language={language} />}
                {currentView === 'admin' && user.role === 'admin' && <AdminPanel user={user} language={language} />}
                {currentView === 'teacher' && user.role === 'teacher' && <TeacherPanel user={user} language={language} />}
                {currentView === 'homework' && user.role === 'student' && <StudentHomework user={user} language={language} />}
                {currentView === 'schulte' && <SchulteTable user={user} language={language} />}
                {currentView === 'numbers' && <NumbersTrainer user={user} language={language} />}
                {currentView === 'reading' && <SpeedReadingTrainer user={user} language={language} />}
                {currentView === 'learningToRead' && <ReadingTrainer user={user} language={language} />}
                {currentView === 'english' && <EnglishTrainer user={user} language={language} />}
                {currentView === 'memory' && <MemoryTrainer user={user} language={language} />}
                {currentView === 'mentalMath' && <MentalMathTrainer user={user} language={language} />}
                {currentView === 'maze' && <MazeTrainer user={user} language={language} />}
                {currentView === 'multiplication' && <MultiplicationTrainer user={user} language={language} />}
                {currentView === 'diagnostic' && <DiagnosticTrainer user={user} language={language} />}
                {currentView === 'concentration' && <ConcentrationTrainer user={user} language={language} />}
                {currentView === 'rewards' && <RewardsShop user={user} language={language} onPointsUpdate={() => setUser({...user})} />}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Messaging System Modal */}
        {showMessaging && (
          <MessagingSystem
            currentUser={{ id: user.id, name: user.name, role: user.role }}
            language={language}
            onClose={() => {
              setShowMessaging(false);
              setMessagingInitialUser(null);
            }}
            initialChatUserId={messagingInitialUser?.id}
            initialChatUserName={messagingInitialUser?.name}
            initialChatUserRole={messagingInitialUser?.role}
          />
        )}

        {/* Join Curatorship Modal */}
        {joinCuratorCode && user.role === 'student' && (
          <JoinCuratorship
            curatorCode={joinCuratorCode}
            studentId={user.id}
            studentName={user.name}
            language={language}
            onClose={() => {
              setJoinCuratorCode(null);
              // Remove the join parameter from URL
              window.history.replaceState({}, '', window.location.pathname);
            }}
          />
        )}

        <Toaster />
      </div>
    </MessagingProvider>
  );
}