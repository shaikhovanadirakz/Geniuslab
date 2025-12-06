import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion } from 'motion/react';
import { Link, Copy, Users, Check, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface TeacherCuratorshipLinkProps {
  teacherId: string;
  teacherName: string;
  language: 'ru' | 'kz' | 'en';
}

export function TeacherCuratorshipLink({ teacherId, teacherName, language }: TeacherCuratorshipLinkProps) {
  const [curatorLink, setCuratorLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  const [students, setStudents] = useState<Array<{ id: string; name: string; email: string }>>([]);

  const translations = {
    ru: {
      title: 'Кураторская ссылка',
      description: 'Создайте уникальную ссылку для ваших учеников',
      generate: 'Сгенерировать ссылку',
      copyLink: 'Скопировать ссылку',
      copied: 'Скопировано!',
      myStudents: 'Мои ученики',
      noStudents: 'У вас пока нет учеников',
      studentCount: 'учеников',
      shareText: 'Поделитесь этой ссылкой с учениками, чтобы они могли присоединиться к вашему кураторству',
      linkGenerated: 'Ссылка создана!',
    },
    kz: {
      title: 'Кураторлық сілтеме',
      description: 'Оқушыларыңыз үшін бірегей сілтеме жасаңыз',
      generate: 'Сілтеме жасау',
      copyLink: 'Сілтемені көшіру',
      copied: 'Көшірілді!',
      myStudents: 'Менің оқушыларым',
      noStudents: 'Әзірге оқушыларыңыз жоқ',
      studentCount: 'оқушы',
      shareText: 'Оқушылармен бұл сілтемені бөлісіңіз, олар сіздің кураторлығыңызға қосыла алады',
      linkGenerated: 'Сілтеме жасалды!',
    },
    en: {
      title: 'Mentorship Link',
      description: 'Create a unique link for your students',
      generate: 'Generate Link',
      copyLink: 'Copy Link',
      copied: 'Copied!',
      myStudents: 'My Students',
      noStudents: 'You don\'t have any students yet',
      studentCount: 'students',
      shareText: 'Share this link with students so they can join your mentorship',
      linkGenerated: 'Link created!',
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadCuratorLink();
    loadStudents();
  }, [teacherId]);

  const loadCuratorLink = () => {
    const teachers = JSON.parse(localStorage.getItem('geniuslab_users') || '[]');
    const teacher = teachers.find((t: any) => t.id === teacherId && t.role === 'teacher');
    if (teacher?.curatorLink) {
      setCuratorLink(teacher.curatorLink);
    }
  };

  const loadStudents = () => {
    const curatorships = JSON.parse(localStorage.getItem('geniuslab_curatorships') || '[]');
    const teacherStudents = curatorships.filter((c: any) => c.teacherId === teacherId);
    
    const users = JSON.parse(localStorage.getItem('geniuslab_users') || '[]');
    const studentList = teacherStudents.map((ts: any) => {
      const student = users.find((u: any) => u.id === ts.studentId);
      return student ? {
        id: student.id,
        name: student.name,
        email: student.email
      } : null;
    }).filter(Boolean);

    setStudents(studentList);
    setStudentCount(studentList.length);
  };

  const generateLink = () => {
    const uniqueCode = `curator-${teacherId}-${Date.now().toString(36)}`;
    const link = `${window.location.origin}/?join=${uniqueCode}`;

    // Save to teacher profile
    const users = JSON.parse(localStorage.getItem('geniuslab_users') || '[]');
    const updatedUsers = users.map((u: any) => {
      if (u.id === teacherId && u.role === 'teacher') {
        return { ...u, curatorLink: link, curatorCode: uniqueCode };
      }
      return u;
    });
    localStorage.setItem('geniuslab_users', JSON.stringify(updatedUsers));

    setCuratorLink(link);
    toast.success(t.linkGenerated);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(curatorLink);
      setCopied(true);
      toast.success(t.copied);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="space-y-6">
      {/* Curator Link Card */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border-4 border-purple-300 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Link className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{t.title}</h3>
            <p className="text-sm text-gray-600">{t.description}</p>
          </div>
        </div>

        {curatorLink ? (
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-xl border-2 border-purple-200">
              <div className="flex items-center gap-2">
                <Input
                  value={curatorLink}
                  readOnly
                  className="flex-1 bg-gray-50"
                />
                <Button
                  onClick={copyToClipboard}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center">{t.shareText}</p>
          </div>
        ) : (
          <Button
            onClick={generateLink}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-6 text-lg"
          >
            <Link className="w-5 h-5 mr-2" />
            {t.generate}
          </Button>
        )}
      </Card>

      {/* Students List */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-4 border-blue-300 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{t.myStudents}</h3>
            <p className="text-sm text-gray-600">{studentCount} {t.studentCount}</p>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <UserPlus className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>{t.noStudents}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white rounded-xl border-2 border-blue-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{student.name}</h4>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
