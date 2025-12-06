import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { UserPlus, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface JoinCuratorshipProps {
  curatorCode: string;
  studentId: string;
  studentName: string;
  language: 'ru' | 'kz' | 'en';
  onClose: () => void;
}

export function JoinCuratorship({ curatorCode, studentId, studentName, language, onClose }: JoinCuratorshipProps) {
  const [teacherInfo, setTeacherInfo] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  const translations = {
    ru: {
      title: 'Присоединиться к учителю',
      teacherLabel: 'Учитель:',
      alreadyJoined: 'Вы уже присоединились к этому учителю',
      join: 'Присоединиться',
      cancel: 'Отмена',
      success: 'Вы успешно присоединились к учителю!',
      error: 'Учитель не найден',
      joinDescription: 'Вы хотите присоединиться к кураторству этого учителя?',
    },
    kz: {
      title: 'Мұға��імге қосылу',
      teacherLabel: 'Мұғалім:',
      alreadyJoined: 'Сіз бұл мұғалімге қосылдыңыз',
      join: 'Қосылу',
      cancel: 'Болдырмау',
      success: 'Сіз мұғалімге сәтті қосылдыңыз!',
      error: 'Мұғалім табылмады',
      joinDescription: 'Осы мұғалімнің кураторлығына қосылғыңыз келе ме?',
    },
    en: {
      title: 'Join Teacher',
      teacherLabel: 'Teacher:',
      alreadyJoined: 'You have already joined this teacher',
      join: 'Join',
      cancel: 'Cancel',
      success: 'You have successfully joined the teacher!',
      error: 'Teacher not found',
      joinDescription: 'Do you want to join this teacher\'s mentorship?',
    }
  };

  const t = translations[language];

  useEffect(() => {
    findTeacher();
  }, [curatorCode]);

  const findTeacher = () => {
    const users = JSON.parse(localStorage.getItem('geniuslab_users') || '[]');
    const teacher = users.find((u: any) => u.curatorCode === curatorCode && u.role === 'teacher');

    if (teacher) {
      setTeacherInfo({ id: teacher.id, name: teacher.name });

      // Check if already joined
      const curatorships = JSON.parse(localStorage.getItem('geniuslab_curatorships') || '[]');
      const exists = curatorships.some((c: any) => 
        c.teacherId === teacher.id && c.studentId === studentId
      );
      setAlreadyJoined(exists);
    } else {
      toast.error(t.error);
      setTimeout(() => onClose(), 2000);
    }

    setLoading(false);
  };

  const joinTeacher = () => {
    if (!teacherInfo) return;

    const curatorships = JSON.parse(localStorage.getItem('geniuslab_curatorships') || '[]');
    curatorships.push({
      id: Date.now().toString(),
      teacherId: teacherInfo.id,
      studentId: studentId,
      joinedAt: Date.now()
    });
    localStorage.setItem('geniuslab_curatorships', JSON.stringify(curatorships));

    toast.success(t.success);
    setTimeout(() => {
      onClose();
      window.location.reload();
    }, 1500);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="p-8 bg-white rounded-3xl shadow-2xl">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto" />
        </Card>
      </div>
    );
  }

  if (!teacherInfo) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <Card className="p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border-4 border-purple-300 rounded-3xl shadow-2xl max-w-md">
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.title}</h2>
          </div>

          <div className="space-y-4 mb-6">
            <Card className="p-4 bg-white border-2 border-purple-200 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">{t.teacherLabel}</p>
              <p className="text-xl font-bold text-gray-800">{teacherInfo.name}</p>
            </Card>

            {!alreadyJoined && (
              <p className="text-center text-gray-600">{t.joinDescription}</p>
            )}

            {alreadyJoined && (
              <Card className="p-4 bg-green-100 border-2 border-green-300 rounded-xl">
                <div className="flex items-center gap-2 justify-center text-green-800">
                  <Check className="w-5 h-5" />
                  <p className="font-bold">{t.alreadyJoined}</p>
                </div>
              </Card>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-2 border-gray-300 hover:bg-gray-100"
            >
              <X className="w-5 h-5 mr-2" />
              {t.cancel}
            </Button>
            {!alreadyJoined && (
              <Button
                onClick={joinTeacher}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                {t.join}
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
