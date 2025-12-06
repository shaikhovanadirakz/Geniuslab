export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  teacherId?: string; // For students - which teacher they belong to
  points?: number; // User's accumulated points
}

export interface UserPoints {
  userId: string;
  points: number;
  totalEarned: number;
  totalSpent: number;
}

export interface Reward {
  id: string;
  name: string;
  nameRu: string;
  nameKz: string;
  nameEn: string;
  description: string;
  descriptionRu: string;
  descriptionKz: string;
  descriptionEn: string;
  cost: number;
  icon: string;
  type: 'avatar' | 'badge' | 'theme' | 'power-up' | 'certificate';
}

export interface UserReward {
  id: string;
  userId: string;
  rewardId: string;
  purchasedDate: string;
  activated: boolean;
}

export interface Achievement {
  id: string;
  userId: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
  points: number;
}

// Initialize default admin if no users exist
const initializeDefaultAdmin = () => {
  const users = localStorage.getItem('users');
  if (!users || JSON.parse(users).length === 0) {
    const defaultAdmin: User = {
      id: 'admin-default',
      email: 'admin@school.com',
      name: 'Администратор',
      role: 'admin',
    };
    localStorage.setItem('users', JSON.stringify([defaultAdmin]));
    localStorage.setItem('password_admin@school.com', 'admin123');
  }
};

// Call initialization
initializeDefaultAdmin();

export interface TeacherStudent {
  teacherId: string;
  studentId: string;
}

export interface Homework {
  id: string;
  teacherId: string;
  studentId: string;
  trainerType: 'schulte' | 'numbers' | 'reading' | 'memory' | 'mentalMath' | 'maze' | 'multiplication' | 'diagnostic' | 'concentration';
  settings: any;
  description: string;
  dueDate: string;
  completed: boolean;
  completedDate?: string;
  createdDate: string;
}

export interface SchulteResult {
  id: string;
  userId: string;
  size: number;
  mode: 'speed' | 'understanding';
  time: number;
  date: string;
}

export interface NumbersResult {
  id: string;
  userId: string;
  range: '1-50' | '1-75' | '1-100';
  time: number;
  date: string;
}

export interface ReadingResult {
  id: string;
  userId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  mode: 'words' | 'sentences' | 'paragraphs';
  wpm: number;
  correctAnswers: number;
  totalQuestions: number;
  date: string;
}

export interface MemoryResult {
  id: string;
  userId: string;
  level: number;
  score: number;
  sequenceLength: number;
  displayTime: number;
  date: string;
}

export interface MentalMathResult {
  id: string;
  userId: string;
  digits: number;
  difficulty: 'easy' | 'hard' | 'mixed';
  correctAnswers: number;
  totalProblems: number;
  time: number;
  date: string;
}

export interface MazeResult {
  id: string;
  userId: string;
  difficulty: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  time: number;
  moves: number;
  date: string;
}

export interface MultiplicationResult {
  id: string;
  userId: string;
  mode: 'single' | 'mixed'; // single table or mixed tables
  table?: number; // which table (2-10) for single mode
  correctAnswers: number;
  totalProblems: number;
  time: number;
  date: string;
}

export interface DiagnosticResult {
  id: string;
  userId: string;
  memoryScore: number;
  concentrationScore: number;
  concentrationTime?: number;
  wpm: number;
  comprehensionScore?: number;
  overallScore: number;
  readingTime: number;
  date: string;
}

export interface ConcentrationResult {
  id: string;
  userId: string;
  mode: 'findAll' | 'pairs' | 'different' | 'track';
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  rounds: number;
  date: string;
}

// Authentication
export const saveUser = (user: User) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

export const getAllUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const registerUser = (email: string, password: string, name: string, role: User['role']): User => {
  const users = getAllUsers();
  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    role,
  };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem(`password_${email}`, password);
  return newUser;
};

export const loginUser = (email: string, password: string): User | null => {
  const users = getAllUsers();
  const user = users.find(u => u.email === email);
  const storedPassword = localStorage.getItem(`password_${email}`);
  
  if (user && storedPassword === password) {
    return user;
  }
  return null;
};

// Schulte Results
export const saveSchulteResult = (result: Omit<SchulteResult, 'id' | 'date'>) => {
  const results = getSchulteResults();
  const newResult: SchulteResult = {
    ...result,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  results.push(newResult);
  localStorage.setItem('schulteResults', JSON.stringify(results));
};

export const getSchulteResults = (userId?: string): SchulteResult[] => {
  const results = localStorage.getItem('schulteResults');
  const allResults: SchulteResult[] = results ? JSON.parse(results) : [];
  return userId ? allResults.filter(r => r.userId === userId) : allResults;
};

// Numbers Results
export const saveNumbersResult = (result: Omit<NumbersResult, 'id' | 'date'>) => {
  const results = getNumbersResults();
  const newResult: NumbersResult = {
    ...result,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  results.push(newResult);
  localStorage.setItem('numbersResults', JSON.stringify(results));
};

export const getNumbersResults = (userId?: string): NumbersResult[] => {
  const results = localStorage.getItem('numbersResults');
  const allResults: NumbersResult[] = results ? JSON.parse(results) : [];
  return userId ? allResults.filter(r => r.userId === userId) : allResults;
};

// Reading Results
export const saveReadingResult = (result: Omit<ReadingResult, 'id' | 'date'>) => {
  const results = getReadingResults();
  const newResult: ReadingResult = {
    ...result,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  results.push(newResult);
  localStorage.setItem('readingResults', JSON.stringify(results));
};

export const getReadingResults = (userId?: string): ReadingResult[] => {
  const results = localStorage.getItem('readingResults');
  const allResults: ReadingResult[] = results ? JSON.parse(results) : [];
  return userId ? allResults.filter(r => r.userId === userId) : allResults;
};

// Memory Results
export const saveMemoryResult = (result: Omit<MemoryResult, 'id' | 'date'>) => {
  const results = getMemoryResults();
  const newResult: MemoryResult = {
    ...result,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  results.push(newResult);
  localStorage.setItem('memoryResults', JSON.stringify(results));
};

export const getMemoryResults = (userId?: string): MemoryResult[] => {
  const results = localStorage.getItem('memoryResults');
  const allResults: MemoryResult[] = results ? JSON.parse(results) : [];
  return userId ? allResults.filter(r => r.userId === userId) : allResults;
};

// Mental Math Results
export const saveMentalMathResult = (result: Omit<MentalMathResult, 'id' | 'date'>) => {
  const results = getMentalMathResults();
  const newResult: MentalMathResult = {
    ...result,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  results.push(newResult);
  localStorage.setItem('mentalMathResults', JSON.stringify(results));
};

export const getMentalMathResults = (userId?: string): MentalMathResult[] => {
  const results = localStorage.getItem('mentalMathResults');
  const allResults: MentalMathResult[] = results ? JSON.parse(results) : [];
  return userId ? allResults.filter(r => r.userId === userId) : allResults;
};

// Maze Results
export const saveMazeResult = (result: Omit<MazeResult, 'id' | 'date'>) => {
  const results = getMazeResults();
  const newResult: MazeResult = {
    ...result,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  results.push(newResult);
  localStorage.setItem('mazeResults', JSON.stringify(results));
};

export const getMazeResults = (userId?: string): MazeResult[] => {
  const results = localStorage.getItem('mazeResults');
  const allResults: MazeResult[] = results ? JSON.parse(results) : [];
  return userId ? allResults.filter(r => r.userId === userId) : allResults;
};

// Multiplication Results
export const saveMultiplicationResult = (result: Omit<MultiplicationResult, 'id' | 'date'>) => {
  const results = getMultiplicationResults();
  const newResult: MultiplicationResult = {
    ...result,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  results.push(newResult);
  localStorage.setItem('multiplicationResults', JSON.stringify(results));
};

export const getMultiplicationResults = (userId?: string): MultiplicationResult[] => {
  const results = localStorage.getItem('multiplicationResults');
  const allResults: MultiplicationResult[] = results ? JSON.parse(results) : [];
  return userId ? allResults.filter(r => r.userId === userId) : allResults;
};

// Diagnostic Results
export const saveDiagnosticResult = (result: Omit<DiagnosticResult, 'id' | 'date'>) => {
  const results = getDiagnosticResults();
  const newResult: DiagnosticResult = {
    ...result,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  results.push(newResult);
  localStorage.setItem('diagnosticResults', JSON.stringify(results));
};

export const getDiagnosticResults = (userId?: string): DiagnosticResult[] => {
  const results = localStorage.getItem('diagnosticResults');
  const allResults: DiagnosticResult[] = results ? JSON.parse(results) : [];
  return userId ? allResults.filter(r => r.userId === userId) : allResults;
};

// Concentration Results
export const saveConcentrationResult = (userId: string, result: Omit<ConcentrationResult, 'id' | 'userId' | 'date'>) => {
  const results = getConcentrationResults();
  const newResult: ConcentrationResult = {
    ...result,
    userId,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  results.push(newResult);
  localStorage.setItem('concentrationResults', JSON.stringify(results));
};

export const getConcentrationResults = (userId?: string): ConcentrationResult[] => {
  const results = localStorage.getItem('concentrationResults');
  const allResults: ConcentrationResult[] = results ? JSON.parse(results) : [];
  return userId ? allResults.filter(r => r.userId === userId) : allResults;
};

// Teacher-Student Relations
export const assignStudentToTeacher = (teacherId: string, studentId: string) => {
  const relations = getTeacherStudentRelations();
  const newRelation: TeacherStudent = { teacherId, studentId };
  relations.push(newRelation);
  localStorage.setItem('teacherStudents', JSON.stringify(relations));
  
  // Update student's teacherId
  const users = getAllUsers();
  const student = users.find(u => u.id === studentId);
  if (student) {
    student.teacherId = teacherId;
    localStorage.setItem('users', JSON.stringify(users));
  }
};

export const getTeacherStudentRelations = (): TeacherStudent[] => {
  const relations = localStorage.getItem('teacherStudents');
  return relations ? JSON.parse(relations) : [];
};

export const getStudentsByTeacher = (teacherId: string): User[] => {
  const relations = getTeacherStudentRelations();
  const users = getAllUsers();
  const studentIds = relations.filter(r => r.teacherId === teacherId).map(r => r.studentId);
  return users.filter(u => studentIds.includes(u.id));
};

export const getTeachersByAdmin = (): User[] => {
  const users = getAllUsers();
  return users.filter(u => u.role === 'teacher');
};

export const getAllStudents = (): User[] => {
  const users = getAllUsers();
  return users.filter(u => u.role === 'student');
};

export const updateUser = (userId: string, updates: Partial<User>) => {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    localStorage.setItem('users', JSON.stringify(users));
  }
};

export const deleteUser = (userId: string) => {
  const users = getAllUsers();
  const filtered = users.filter(u => u.id !== userId);
  localStorage.setItem('users', JSON.stringify(filtered));
  
  // Clean up relations
  const relations = getTeacherStudentRelations();
  const filteredRelations = relations.filter(r => r.teacherId !== userId && r.studentId !== userId);
  localStorage.setItem('teacherStudents', JSON.stringify(filteredRelations));
};

// Homework Management
export const createHomework = (homework: Omit<Homework, 'id' | 'createdDate' | 'completed'>) => {
  const homeworks = getAllHomework();
  const newHomework: Homework = {
    ...homework,
    id: Date.now().toString(),
    createdDate: new Date().toISOString(),
    completed: false,
  };
  homeworks.push(newHomework);
  localStorage.setItem('homeworks', JSON.stringify(homeworks));
  return newHomework;
};

export const getAllHomework = (): Homework[] => {
  const homeworks = localStorage.getItem('homeworks');
  return homeworks ? JSON.parse(homeworks) : [];
};

export const getHomeworkByStudent = (studentId: string): Homework[] => {
  const homeworks = getAllHomework();
  return homeworks.filter(h => h.studentId === studentId);
};

export const getHomeworkByTeacher = (teacherId: string): Homework[] => {
  const homeworks = getAllHomework();
  return homeworks.filter(h => h.teacherId === teacherId);
};

export const completeHomework = (homeworkId: string) => {
  const homeworks = getAllHomework();
  const homework = homeworks.find(h => h.id === homeworkId);
  if (homework) {
    homework.completed = true;
    homework.completedDate = new Date().toISOString();
    localStorage.setItem('homeworks', JSON.stringify(homeworks));
  }
};

export const deleteHomework = (homeworkId: string) => {
  const homeworks = getAllHomework();
  const filtered = homeworks.filter(h => h.id !== homeworkId);
  localStorage.setItem('homeworks', JSON.stringify(filtered));
};

// Points System
export const getUserPoints = (userId: string): number => {
  const pointsData = localStorage.getItem('userPoints');
  const allPoints: UserPoints[] = pointsData ? JSON.parse(pointsData) : [];
  const userPointsData = allPoints.find(p => p.userId === userId);
  return userPointsData ? userPointsData.points : 0;
};

export const addPoints = (userId: string, points: number, reason?: string) => {
  const pointsData = localStorage.getItem('userPoints');
  const allPoints: UserPoints[] = pointsData ? JSON.parse(pointsData) : [];
  
  let userPointsData = allPoints.find(p => p.userId === userId);
  
  if (userPointsData) {
    userPointsData.points += points;
    userPointsData.totalEarned += points;
  } else {
    userPointsData = {
      userId,
      points,
      totalEarned: points,
      totalSpent: 0
    };
    allPoints.push(userPointsData);
  }
  
  localStorage.setItem('userPoints', JSON.stringify(allPoints));
  
  // Log transaction
  const transactions = getPointsTransactions(userId);
  transactions.push({
    id: Date.now().toString(),
    userId,
    amount: points,
    type: 'earn',
    reason: reason || 'Exercise completed',
    date: new Date().toISOString()
  });
  localStorage.setItem(`pointsTransactions_${userId}`, JSON.stringify(transactions));
  
  return userPointsData.points;
};

export const spendPoints = (userId: string, points: number, reason?: string): boolean => {
  const currentPoints = getUserPoints(userId);
  
  if (currentPoints < points) {
    return false;
  }
  
  const pointsData = localStorage.getItem('userPoints');
  const allPoints: UserPoints[] = pointsData ? JSON.parse(pointsData) : [];
  const userPointsData = allPoints.find(p => p.userId === userId);
  
  if (userPointsData) {
    userPointsData.points -= points;
    userPointsData.totalSpent += points;
    localStorage.setItem('userPoints', JSON.stringify(allPoints));
    
    // Log transaction
    const transactions = getPointsTransactions(userId);
    transactions.push({
      id: Date.now().toString(),
      userId,
      amount: points,
      type: 'spend',
      reason: reason || 'Reward purchased',
      date: new Date().toISOString()
    });
    localStorage.setItem(`pointsTransactions_${userId}`, JSON.stringify(transactions));
    
    return true;
  }
  
  return false;
};

export const getPointsTransactions = (userId: string) => {
  const transactions = localStorage.getItem(`pointsTransactions_${userId}`);
  return transactions ? JSON.parse(transactions) : [];
};

// Rewards System
export const getAvailableRewards = (): Reward[] => {
  return [
    {
      id: 'avatar-1',
      name: 'Golden Star Avatar',
      nameRu: 'Золотая звезда',
      nameKz: 'Алтын жұлдыз',
      nameEn: 'Golden Star Avatar',
      description: 'Shine bright with a golden star avatar',
      descriptionRu: 'Сияй ярко с золотой звездой',
      descriptionKz: 'Алтын жұлдызбен жарқыра',
      descriptionEn: 'Shine bright with a golden star avatar',
      cost: 100,
      icon: '⭐',
      type: 'avatar'
    },
    {
      id: 'avatar-2',
      name: 'Rainbow Avatar',
      nameRu: 'Радужный аватар',
      nameKz: 'Кемпірқосақ аватары',
      nameEn: 'Rainbow Avatar',
      description: 'Show your colors with a rainbow avatar',
      descriptionRu: 'Покажи свои цвета с радужным аватаром',
      descriptionKz: 'Кемпірқосақ аватарымен түстеріңді көрсет',
      descriptionEn: 'Show your colors with a rainbow avatar',
      cost: 150,
      icon: '🌈',
      type: 'avatar'
    },
    {
      id: 'avatar-3',
      name: 'Rocket Avatar',
      nameRu: 'Ракета',
      nameKz: 'Зымыран',
      nameEn: 'Rocket Avatar',
      description: 'Blast off to success!',
      descriptionRu: 'Взлети к успеху!',
      descriptionKz: 'Жетістікке ұшып кет!',
      descriptionEn: 'Blast off to success!',
      cost: 200,
      icon: '🚀',
      type: 'avatar'
    },
    {
      id: 'badge-master',
      name: 'Master Badge',
      nameRu: 'Значок Мастера',
      nameKz: 'Шебер белгісі',
      nameEn: 'Master Badge',
      description: 'Show everyone you are a master!',
      descriptionRu: 'Покажи всем, что ты мастер!',
      descriptionKz: 'Сен шебер екеніңді бәріне көрсет!',
      descriptionEn: 'Show everyone you are a master!',
      cost: 300,
      icon: '🏆',
      type: 'badge'
    },
    {
      id: 'badge-genius',
      name: 'Genius Badge',
      nameRu: 'Значок Гения',
      nameKz: 'Данышпан белгісі',
      nameEn: 'Genius Badge',
      description: 'For true geniuses only!',
      descriptionRu: 'Только для настоящих гениев!',
      descriptionKz: 'Тек шынайы данышпандарға!',
      descriptionEn: 'For true geniuses only!',
      cost: 500,
      icon: '🧠',
      type: 'badge'
    },
    {
      id: 'theme-dark',
      name: 'Dark Theme',
      nameRu: 'Темная тема',
      nameKz: 'Қараңғы тақырып',
      nameEn: 'Dark Theme',
      description: 'Cool dark theme for your dashboard',
      descriptionRu: 'Крутая темная тема для панели',
      descriptionKz: 'Тақтаңызға арналған қараңғы тақырып',
      descriptionEn: 'Cool dark theme for your dashboard',
      cost: 250,
      icon: '🌙',
      type: 'theme'
    },
    {
      id: 'powerup-hint',
      name: 'Hint Power-Up',
      nameRu: 'Подсказка',
      nameKz: 'Кеңес',
      nameEn: 'Hint Power-Up',
      description: 'Get 3 hints for your next exercise',
      descriptionRu: 'Получи 3 подсказки для следующего упражнения',
      descriptionKz: 'Келесі жаттығуға 3 кеңес ал',
      descriptionEn: 'Get 3 hints for your next exercise',
      cost: 50,
      icon: '💡',
      type: 'power-up'
    },
    {
      id: 'powerup-time',
      name: 'Time Boost',
      nameRu: 'Бонус времени',
      nameKz: 'Уақыт бонусы',
      nameEn: 'Time Boost',
      description: 'Get extra time for timed exercises',
      descriptionRu: 'Получи дополнительное время для упражнений',
      descriptionKz: 'Жаттығуларға қосымша уақыт алыңыз',
      descriptionEn: 'Get extra time for timed exercises',
      cost: 75,
      icon: '⏰',
      type: 'power-up'
    },
    {
      id: 'certificate-bronze',
      name: 'Bronze Certificate',
      nameRu: 'Бронзовый сертификат',
      nameKz: 'Қола сертификат',
      nameEn: 'Bronze Certificate',
      description: 'Bronze certificate of achievement',
      descriptionRu: 'Бронзовый сертификат достижений',
      descriptionKz: 'Жетістіктердің қола сертификаты',
      descriptionEn: 'Bronze certificate of achievement',
      cost: 200,
      icon: '🥉',
      type: 'certificate'
    },
    {
      id: 'certificate-silver',
      name: 'Silver Certificate',
      nameRu: 'Серебряный сертификат',
      nameKz: 'Күміс сертификат',
      nameEn: 'Silver Certificate',
      description: 'Silver certificate of achievement',
      descriptionRu: 'Серебряный сертификат достижений',
      descriptionKz: 'Жетістіктердің күміс сертификаты',
      descriptionEn: 'Silver certificate of achievement',
      cost: 400,
      icon: '🥈',
      type: 'certificate'
    },
    {
      id: 'certificate-gold',
      name: 'Gold Certificate',
      nameRu: 'Золотой сертификат',
      nameKz: 'Алтын сертификат',
      nameEn: 'Gold Certificate',
      description: 'Gold certificate of achievement',
      descriptionRu: 'Золотой сертификат достижений',
      descriptionKz: 'Жетістіктердің алтын сертификаты',
      descriptionEn: 'Gold certificate of achievement',
      cost: 800,
      icon: '🥇',
      type: 'certificate'
    }
  ];
};

export const getUserRewards = (userId: string): UserReward[] => {
  const rewards = localStorage.getItem(`userRewards_${userId}`);
  return rewards ? JSON.parse(rewards) : [];
};

export const purchaseReward = (userId: string, rewardId: string): boolean => {
  const rewards = getAvailableRewards();
  const reward = rewards.find(r => r.id === rewardId);
  
  if (!reward) return false;
  
  const success = spendPoints(userId, reward.cost, `Purchased: ${reward.name}`);
  
  if (success) {
    const userRewards = getUserRewards(userId);
    userRewards.push({
      id: Date.now().toString(),
      userId,
      rewardId,
      purchasedDate: new Date().toISOString(),
      activated: false
    });
    localStorage.setItem(`userRewards_${userId}`, JSON.stringify(userRewards));
    return true;
  }
  
  return false;
};

export const activateReward = (userId: string, rewardId: string) => {
  const userRewards = getUserRewards(userId);
  const reward = userRewards.find(r => r.rewardId === rewardId);
  
  if (reward) {
    reward.activated = true;
    localStorage.setItem(`userRewards_${userId}`, JSON.stringify(userRewards));
  }
};

// Achievements System
export const getUserAchievements = (userId: string): Achievement[] => {
  const achievements = localStorage.getItem(`achievements_${userId}`);
  return achievements ? JSON.parse(achievements) : [];
};

export const addAchievement = (userId: string, achievement: Omit<Achievement, 'id' | 'userId' | 'earnedDate'>) => {
  const achievements = getUserAchievements(userId);
  
  // Check if achievement already exists
  const exists = achievements.find(a => a.type === achievement.type && a.name === achievement.name);
  if (exists) return;
  
  const newAchievement: Achievement = {
    ...achievement,
    id: Date.now().toString(),
    userId,
    earnedDate: new Date().toISOString()
  };
  
  achievements.push(newAchievement);
  localStorage.setItem(`achievements_${userId}`, JSON.stringify(achievements));
  
  // Award points for achievement
  if (achievement.points > 0) {
    addPoints(userId, achievement.points, `Achievement: ${achievement.name}`);
  }
};

// Points calculation helpers
export const calculateSchultePoints = (time: number, size: number): number => {
  let basePoints = 0;
  
  if (size >= 5) {
    if (time < 30000) basePoints = 15;
    else if (time < 60000) basePoints = 8;
    else if (time < 90000) basePoints = 3;
  } else {
    if (time < 20000) basePoints = 10;
    else if (time < 40000) basePoints = 5;
    else if (time < 60000) basePoints = 2;
  }
  
  return basePoints;
};

export const calculateReadingPoints = (wpm: number, comprehension: number): number => {
  let points = 0;
  
  if (comprehension >= 90) points += 15;
  else if (comprehension >= 80) points += 12;
  else if (comprehension >= 70) points += 8;
  else if (comprehension >= 60) points += 4;
  
  if (wpm >= 300) points += 10;
  else if (wpm >= 200) points += 5;
  
  return points;
};

export const calculateMemoryPoints = (correctPercentage: number, level: number): number => {
  let points = 0;
  
  if (correctPercentage >= 90) points = 15;
  else if (correctPercentage >= 80) points = 12;
  else if (correctPercentage >= 70) points = 8;
  else if (correctPercentage >= 60) points = 5;
  
  points += Math.floor(level / 2);
  
  return points;
};

export const calculateMentalMathPoints = (correctPercentage: number, difficulty: string): number => {
  let points = 0;
  
  if (correctPercentage >= 95) points = 20;
  else if (correctPercentage >= 90) points = 15;
  else if (correctPercentage >= 80) points = 10;
  else if (correctPercentage >= 70) points = 6;
  else if (correctPercentage >= 60) points = 3;
  
  if (difficulty === 'hard' || difficulty === 'mixed') points += 5;
  
  return points;
};

export const calculateMazePoints = (difficulty: number, time: number): number => {
  const basePoints = difficulty * 5;
  const timeBonus = time < 60000 ? 10 : time < 120000 ? 5 : 0;
  
  return basePoints + timeBonus;
};

export const calculateMultiplicationPoints = (correctPercentage: number, mode: string): number => {
  let points = 0;
  
  if (correctPercentage >= 95) points = 15;
  else if (correctPercentage >= 90) points = 12;
  else if (correctPercentage >= 80) points = 8;
  else if (correctPercentage >= 70) points = 5;
  
  if (mode === 'mixed') points += 3;
  
  return points;
};

export const calculateDiagnosticPoints = (overallScore: number): number => {
  if (overallScore >= 90) return 50;
  if (overallScore >= 80) return 35;
  if (overallScore >= 70) return 25;
  if (overallScore >= 60) return 15;
  if (overallScore >= 50) return 8;
  return 0;
};

export const calculateConcentrationPoints = (accuracy: number, mode: string, difficulty: string): number => {
  let points = 0;
  
  if (accuracy >= 95) points = 20;
  else if (accuracy >= 90) points = 16;
  else if (accuracy >= 80) points = 12;
  else if (accuracy >= 70) points = 8;
  else if (accuracy >= 60) points = 4;
  
  if (mode === 'track') points += 5;
  if (difficulty === 'hard') points += 5;
  else if (difficulty === 'medium') points += 2;
  
  return points;
};

export const calculateNumbersPoints = (time: number, range: string): number => {
  let points = 0;
  const seconds = time / 1000;
  
  // Base points depend on range
  if (range === '1-100') {
    if (seconds < 30) points = 20;
    else if (seconds < 45) points = 15;
    else if (seconds < 60) points = 10;
    else if (seconds < 90) points = 5;
  } else if (range === '1-50') {
    if (seconds < 20) points = 15;
    else if (seconds < 30) points = 10;
    else if (seconds < 45) points = 6;
    else if (seconds < 60) points = 3;
  } else if (range === '1-30') {
    if (seconds < 15) points = 10;
    else if (seconds < 25) points = 6;
    else if (seconds < 35) points = 3;
  }
  
  return points;
};
