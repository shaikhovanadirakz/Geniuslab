import { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MessageCircle, User, X, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  message: string;
  timestamp: number;
  read: boolean;
}

interface Chat {
  userId: string;
  userName: string;
  userRole: string;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
}

interface MessagingSystemProps {
  currentUser: {
    id: string;
    name: string;
    role: 'student' | 'teacher' | 'admin';
  };
  language: 'ru' | 'kz' | 'en';
  onClose: () => void;
  initialChatUserId?: string; // Optional: automatically open chat with this user
  initialChatUserName?: string;
  initialChatUserRole?: string;
}

export function MessagingSystem({ currentUser, language, onClose, initialChatUserId, initialChatUserName, initialChatUserRole }: MessagingSystemProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState<Array<{ id: string; name: string; role: 'student' | 'teacher' | 'admin'; email: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChats();
    loadAvailableUsers();
    
    // If initial user is provided, open chat with them
    if (initialChatUserId && initialChatUserName && initialChatUserRole) {
      startNewChat({
        id: initialChatUserId,
        name: initialChatUserName,
        role: initialChatUserRole as 'student' | 'teacher' | 'admin',
        email: ''
      });
    }
  }, [initialChatUserId, initialChatUserName, initialChatUserRole]);

  const translations = {
    ru: {
      title: 'Сообщения',
      newChat: 'Новый чат',
      search: 'Поиск пользователя...',
      typeMessage: 'Напишите сообщение...',
      send: 'Отправить',
      noChats: 'Нет чатов',
      noMessages: 'Нет сообщений',
      selectChat: 'Выберите чат для начала общения',
      students: 'Ученики',
      teachers: 'Учителя',
      admins: 'Администраторы',
      startChat: 'Начать чат',
      back: 'Назад',
    },
    kz: {
      title: 'Хабарламалар',
      newChat: 'Жаңа чат',
      search: 'Пайдаланушыны іздеу...',
      typeMessage: 'Хабарлама жазыңыз...',
      send: 'Жіберу',
      noChats: 'Чат жоқ',
      noMessages: 'Хабарлама жоқ',
      selectChat: 'Сөйлесу үшін чат таңдаңыз',
      students: 'Оқушылар',
      teachers: 'Мұғалімдер',
      admins: 'Әкімшілер',
      startChat: 'Чат бастау',
      back: 'Артқа',
    },
    en: {
      title: 'Messages',
      newChat: 'New Chat',
      search: 'Search user...',
      typeMessage: 'Type a message...',
      send: 'Send',
      noChats: 'No chats',
      noMessages: 'No messages',
      selectChat: 'Select a chat to start messaging',
      students: 'Students',
      teachers: 'Teachers',
      admins: 'Admins',
      startChat: 'Start Chat',
      back: 'Back',
    }
  };

  const t = translations[language];

  // Load chats and messages from localStorage
  useEffect(() => {
    loadChats();
    loadAvailableUsers();
  }, [currentUser]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.userId);
    }
  }, [selectedChat]);

  const loadChats = () => {
    const allMessages = JSON.parse(localStorage.getItem('geniuslab_messages') || '[]') as Message[];
    const userChats: { [key: string]: Chat } = {};

    allMessages.forEach(msg => {
      const otherUserId = msg.fromUserId === currentUser.id ? msg.toUserId : msg.fromUserId;
      const otherUserName = msg.fromUserId === currentUser.id ? msg.toUserName : msg.fromUserName;
      
      if (!userChats[otherUserId]) {
        userChats[otherUserId] = {
          userId: otherUserId,
          userName: otherUserName,
          userRole: getUserRole(otherUserId),
          lastMessage: msg.message,
          lastMessageTime: msg.timestamp,
          unreadCount: 0
        };
      } else {
        if (msg.timestamp > userChats[otherUserId].lastMessageTime) {
          userChats[otherUserId].lastMessage = msg.message;
          userChats[otherUserId].lastMessageTime = msg.timestamp;
        }
      }

      if (msg.toUserId === currentUser.id && !msg.read) {
        userChats[otherUserId].unreadCount++;
      }
    });

    const chatList = Object.values(userChats).sort((a, b) => b.lastMessageTime - a.lastMessageTime);
    setChats(chatList);
  };

  const loadMessages = (otherUserId: string) => {
    const allMessages = JSON.parse(localStorage.getItem('geniuslab_messages') || '[]') as Message[];
    const chatMessages = allMessages.filter(
      msg => 
        (msg.fromUserId === currentUser.id && msg.toUserId === otherUserId) ||
        (msg.fromUserId === otherUserId && msg.toUserId === currentUser.id)
    ).sort((a, b) => a.timestamp - b.timestamp);

    // Mark messages as read
    const updatedMessages = allMessages.map(msg => {
      if (msg.fromUserId === otherUserId && msg.toUserId === currentUser.id && !msg.read) {
        return { ...msg, read: true };
      }
      return msg;
    });
    localStorage.setItem('geniuslab_messages', JSON.stringify(updatedMessages));

    setMessages(chatMessages);
    loadChats(); // Refresh chats to update unread count
  };

  const loadAvailableUsers = () => {
    const users = JSON.parse(localStorage.getItem('geniuslab_users') || '[]');
    const filteredUsers = users.filter((u: any) => {
      if (u.id === currentUser.id) return false;
      
      // Students can message teachers
      if (currentUser.role === 'student' && u.role === 'teacher') return true;
      // Teachers can message students and admins
      if (currentUser.role === 'teacher' && (u.role === 'student' || u.role === 'admin')) return true;
      // Admins can message teachers
      if (currentUser.role === 'admin' && u.role === 'teacher') return true;
      
      return false;
    });
    setAvailableUsers(filteredUsers);
  };

  const getUserRole = (userId: string): string => {
    const users = JSON.parse(localStorage.getItem('geniuslab_users') || '[]');
    const user = users.find((u: any) => u.id === userId);
    return user?.role || 'student';
  };

  const sendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const messageObj: Message = {
      id: Date.now().toString(),
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      toUserId: selectedChat.userId,
      toUserName: selectedChat.userName,
      message: message,
      timestamp: Date.now(),
      read: false
    };

    const allMessages = JSON.parse(localStorage.getItem('geniuslab_messages') || '[]');
    allMessages.push(messageObj);
    localStorage.setItem('geniuslab_messages', JSON.stringify(allMessages));

    setMessages([...messages, messageObj]);
    setMessage('');
    loadChats();

    toast.success(language === 'ru' ? 'Сообщение отправлено!' : language === 'kz' ? 'Хабарлама жіберілді!' : 'Message sent!');
  };

  const startNewChat = (user: { id: string; name: string; role: 'student' | 'teacher' | 'admin'; email: string }) => {
    const newChat: Chat = {
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      lastMessage: '',
      lastMessageTime: Date.now(),
      unreadCount: 0
    };
    setSelectedChat(newChat);
    setShowNewChat(false);
    setMessages([]);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return date.toLocaleTimeString(language === 'ru' ? 'ru-RU' : 'kk-KZ', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'kk-KZ');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-6xl h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex h-full">
          {/* Chats List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gradient-to-b from-purple-50 to-pink-50">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  {t.title}
                </h2>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <Button
                onClick={() => setShowNewChat(true)}
                className="w-full bg-white text-purple-600 hover:bg-purple-50"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {t.newChat}
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
              {chats.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>{t.noChats}</p>
                  <Button
                    onClick={() => setShowNewChat(true)}
                    className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {t.startChat}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {chats.map(chat => (
                    <motion.div
                      key={chat.userId}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        setSelectedChat(chat);
                        setShowNewChat(false);
                      }}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${
                        selectedChat?.userId === chat.userId
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'bg-white hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            selectedChat?.userId === chat.userId
                              ? 'bg-white/20'
                              : 'bg-gradient-to-r from-purple-400 to-pink-400'
                          }`}>
                            <User className={`w-5 h-5 ${
                              selectedChat?.userId === chat.userId ? 'text-white' : 'text-white'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold">{chat.userName}</h3>
                            <p className={`text-sm ${
                              selectedChat?.userId === chat.userId ? 'text-white/80' : 'text-gray-600'
                            }`}>
                              {chat.userRole === 'teacher' ? (language === 'ru' ? 'Учитель' : 'Мұғалім') : 
                               chat.userRole === 'admin' ? (language === 'ru' ? 'Админ' : 'Әкімші') : 
                               (language === 'ru' ? 'Ученик' : 'Оқушы')}
                            </p>
                          </div>
                        </div>
                        {chat.unreadCount > 0 && (
                          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{chat.unreadCount}</span>
                          </div>
                        )}
                      </div>
                      <p className={`text-sm truncate ${
                        selectedChat?.userId === chat.userId ? 'text-white/90' : 'text-gray-600'
                      }`}>
                        {chat.lastMessage || (language === 'ru' ? 'Начните диалог...' : 'Сөйлесуді бастаңыз...')}
                      </p>
                      {chat.lastMessageTime > 0 && (
                        <p className={`text-xs mt-1 ${
                          selectedChat?.userId === chat.userId ? 'text-white/70' : 'text-gray-400'
                        }`}>
                          {formatTime(chat.lastMessageTime)}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {showNewChat ? (
              <div className="flex-1 flex flex-col p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">{t.newChat}</h3>
                  <Button onClick={() => setShowNewChat(false)} variant="ghost">
                    {t.back}
                  </Button>
                </div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder={t.search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-2 border-purple-200 focus:border-purple-400"
                  />
                </div>
                
                {availableUsers.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">
                        {language === 'ru' ? 'Нет доступных пользователей' : 
                         language === 'kz' ? 'Қолжетімді пайдаланушылар жоқ' : 
                         'No available users'}
                      </p>
                      <p className="text-sm mt-2">
                        {currentUser.role === 'student' ? 
                          (language === 'ru' ? 'Учителя появятся здесь' : 
                           language === 'kz' ? 'Мұғалімдер осында көрінеді' : 
                           'Teachers will appear here') :
                         currentUser.role === 'teacher' ?
                          (language === 'ru' ? 'Ученики и администраторы появятся здесь' : 
                           language === 'kz' ? 'Оқушылар мен әкімшілер осында көрінеді' : 
                           'Students and admins will appear here') :
                          (language === 'ru' ? 'Учителя появятся здесь' : 
                           language === 'kz' ? 'Мұғалімдер осында көрінеді' : 
                           'Teachers will appear here')
                        }
                      </p>
                    </div>
                  </div>
                ) : (
                  <ScrollArea className="flex-1">
                    {/* Group by role */}
                    {(() => {
                      const filteredUsers = availableUsers.filter(user => 
                        user.name.toLowerCase().includes(searchQuery.toLowerCase())
                      );
                      
                      const groupedUsers = {
                        teachers: filteredUsers.filter(u => u.role === 'teacher'),
                        students: filteredUsers.filter(u => u.role === 'student'),
                        admins: filteredUsers.filter(u => u.role === 'admin'),
                      };

                      return (
                        <div className="space-y-6">
                          {groupedUsers.teachers.length > 0 && (
                            <div>
                              <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
                                  <span className="text-white text-sm">👨‍🏫</span>
                                </div>
                                {t.teachers} ({groupedUsers.teachers.length})
                              </h4>
                              <div className="space-y-2">
                                {groupedUsers.teachers.map(user => (
                                  <motion.div
                                    key={user.id}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => startNewChat(user)}
                                    className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl cursor-pointer hover:shadow-lg transition-all border-2 border-blue-200 hover:border-blue-400"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                      </div>
                                      <div>
                                        <h4 className="font-bold text-gray-800">{user.name}</h4>
                                        <p className="text-sm text-gray-600">
                                          {language === 'ru' ? 'Учитель' : language === 'kz' ? 'Мұғалім' : 'Teacher'}
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}

                          {groupedUsers.students.length > 0 && (
                            <div>
                              <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                                  <span className="text-white text-sm">👨‍🎓</span>
                                </div>
                                {t.students} ({groupedUsers.students.length})
                              </h4>
                              <div className="space-y-2">
                                {groupedUsers.students.map(user => (
                                  <motion.div
                                    key={user.id}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => startNewChat(user)}
                                    className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl cursor-pointer hover:shadow-lg transition-all border-2 border-purple-200 hover:border-purple-400"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                      </div>
                                      <div>
                                        <h4 className="font-bold text-gray-800">{user.name}</h4>
                                        <p className="text-sm text-gray-600">
                                          {language === 'ru' ? 'Ученик' : language === 'kz' ? 'Оқушы' : 'Student'}
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}

                          {groupedUsers.admins.length > 0 && (
                            <div>
                              <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center">
                                  <span className="text-white text-sm">👨‍💼</span>
                                </div>
                                {t.admins} ({groupedUsers.admins.length})
                              </h4>
                              <div className="space-y-2">
                                {groupedUsers.admins.map(user => (
                                  <motion.div
                                    key={user.id}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => startNewChat(user)}
                                    className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl cursor-pointer hover:shadow-lg transition-all border-2 border-orange-200 hover:border-orange-400"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                      </div>
                                      <div>
                                        <h4 className="font-bold text-gray-800">{user.name}</h4>
                                        <p className="text-sm text-gray-600">
                                          {language === 'ru' ? 'Администратор' : language === 'kz' ? 'Әкімші' : 'Administrator'}
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}

                          {filteredUsers.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                              <p className="text-lg">
                                {language === 'ru' ? 'Пользователи не найдены' : 
                                 language === 'kz' ? 'Пайдаланушылар табылмады' : 
                                 'No users found'}
                              </p>
                              <p className="text-sm mt-2">
                                {language === 'ru' ? 'Попробуйте изменить запрос' : 
                                 language === 'kz' ? 'Сұрауды өзгертіп көріңіз' : 
                                 'Try changing your search'}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </ScrollArea>
                )}
              </div>
            ) : selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{selectedChat.userName}</h3>
                        <p className="text-sm text-white/80">
                          {selectedChat.userRole === 'teacher' ? (language === 'ru' ? 'Учитель' : 'Мұғалім') : 
                           selectedChat.userRole === 'admin' ? (language === 'ru' ? 'Администратор' : 'Әкімші') : 
                           (language === 'ru' ? 'Ученик' : 'Оқушы')}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedChat(null);
                        setShowNewChat(false);
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-gray-50 to-white">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>{t.noMessages}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map(msg => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.fromUserId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-2xl ${
                              msg.fromUserId === currentUser.id
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : 'bg-white shadow-md text-gray-800'
                            }`}
                          >
                            <p>{msg.message}</p>
                            <p className={`text-xs mt-1 ${
                              msg.fromUserId === currentUser.id ? 'text-white/70' : 'text-gray-400'
                            }`}>
                              {formatTime(msg.timestamp)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-2">
                    <Input
                      placeholder={t.typeMessage}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">{t.selectChat}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}