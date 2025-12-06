import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { User, saveDiagnosticResult, calculateDiagnosticPoints, addPoints } from '../utils/storage';
import { Language, getTranslation } from '../utils/translations';
import { Brain, Eye, BookOpen, Trophy, Clock, Target, CheckCircle, XCircle, Play, AlertCircle, Baby, Users } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface DiagnosticTrainerProps {
  user: User;
  language: Language;
}

type Stage = 'intro' | 'ageSelection' | 'memoryShow' | 'memoryTest' | 'memoryRoundResult' | 'concentrationShow' | 'concentrationTest' | 'concentrationRoundResult' | 'readingIntro' | 'readingCountdown' | 'reading' | 'readingQuestions' | 'results';
type AgeGroup = '4-7' | '8+';

// Large pool of words for memory tests (8+)
const MEMORY_WORD_POOL_RU = [
  'яблоко', 'солнце', 'книга', 'машина', 'дерево', 'облако', 'кошка', 'стол', 
  'звезда', 'мяч', 'дом', 'птица', 'море', 'лес', 'рыба', 'окно', 'сад', 'небо',
  'цветок', 'река', 'гора', 'трава', 'камень', 'луна', 'город', 'мост', 'парк', 
  'школа', 'друг', 'игра', 'зима', 'лето', 'весна', 'осень', 'утро', 'вечер',
  'ночь', 'день', 'дождь', 'снег', 'ветер', 'туман', 'радуга', 'молния', 'гром',
  'ручей', 'озеро', 'поле', 'холм', 'долина', 'пещера', 'остров', 'берег', 'волна',
  'песок', 'глина', 'земля', 'почва', 'корень', 'ствол', 'ветка', 'лист', 'плод'
];

const MEMORY_WORD_POOL_YOUNG_RU = [
  'мяч', 'дом', 'кот', 'сок', 'мама', 'рука', 'нос', 'дуб', 'луч', 'сад', 'кит', 
  'лук', 'лес', 'дым', 'сон', 'рот', 'мед', 'жук', 'лев', 'сыр', 'волк', 'лиса', 
  'заяц', 'еж', 'медведь', 'слон', 'зебра', 'жираф', 'тигр', 'панда', 'коза', 
  'овца', 'корова', 'конь', 'утка', 'гусь', 'курица', 'петух', 'свинья', 'пес',
  'рыба', 'змея', 'лягушка', 'бабочка', 'пчела', 'муха', 'комар', 'паук', 'червь', 'улитка'
];

const MEMORY_WORD_POOL_KK = [
  'алма', 'күн', 'кітап', 'машина', 'ағаш', 'бұлт', 'мысық', 'үстел', 'жұлдыз', 
  'доп', 'үй', 'құс', 'теңіз', 'орман', 'балық', 'терезе', 'бақ', 'аспан', 'гүл', 
  'өзен', 'тау', 'шөп', 'тас', 'ай', 'қала', 'көпір', 'саябақ', 'мектеп', 'дос', 
  'ойын', 'қыс', 'жаз', 'көктем', 'күз', 'таң', 'кеш', 'түн', 'күн', 'жаңбыр', 
  'қар', 'жел', 'тұман', 'кемпірқосақ', 'найзағай', 'күн көзі', 'бұлақ', 'көл', 
  'дала', 'төбе', 'алқап', 'үңгір', 'арал', 'жағалау', 'толқын', 'құм', 'балшық',
  'жер', 'топырақ', 'тамыр', 'діңгек', 'бұтақ', 'жапырақ', 'жеміс'
];

const MEMORY_WORD_POOL_YOUNG_KK = [
  'доп', 'үй', 'мысық', 'су', 'ана', 'қол', 'мұрын', 'ағаш', 'сәуле', 'бақ', 'кит', 
  'пияз', 'орман', 'түтін', 'ұйқы', 'ауыз', 'бал', 'қоңыз', 'арыстан', 'ірімшік',
  'қасқыр', 'түлкі', 'қоян', 'кірпі', 'аю', 'піл', 'зебра', 'керік', 'жолбарыс', 
  'панда', 'ешкі', 'қой', 'сиыр', 'жылқы', 'үйрек', 'қаз', 'тауық', 'әтеш', 
  'шошқа', 'ит', 'балық', 'жылан', 'бақа', 'көбелек', 'ара', 'шыбын', 'маса', 
  'өрмекші', 'құрт', 'ұлу'
];

const MEMORY_WORD_POOL_EN = [
  'apple', 'sun', 'book', 'car', 'tree', 'cloud', 'cat', 'table', 'star', 'ball', 
  'house', 'bird', 'sea', 'forest', 'fish', 'window', 'garden', 'sky', 'flower', 
  'river', 'mountain', 'grass', 'stone', 'moon', 'city', 'bridge', 'park', 'school', 
  'friend', 'game', 'winter', 'summer', 'spring', 'autumn', 'morning', 'evening', 
  'night', 'day', 'rain', 'snow', 'wind', 'fog', 'rainbow', 'lightning', 'thunder',
  'stream', 'lake', 'field', 'hill', 'valley', 'cave', 'island', 'shore', 'wave',
  'sand', 'clay', 'earth', 'soil', 'root', 'trunk', 'branch', 'leaf', 'fruit'
];

const MEMORY_WORD_POOL_YOUNG_EN = [
  'ball', 'home', 'cat', 'milk', 'mom', 'hand', 'nose', 'tree', 'sun', 'park', 
  'fish', 'toy', 'wood', 'rain', 'bed', 'face', 'bee', 'bug', 'lion', 'cake',
  'wolf', 'fox', 'rabbit', 'hedgehog', 'bear', 'elephant', 'zebra', 'giraffe', 
  'tiger', 'panda', 'goat', 'sheep', 'cow', 'horse', 'duck', 'goose', 'chicken', 
  'rooster', 'pig', 'dog', 'fish', 'snake', 'frog', 'butterfly', 'bee', 'fly', 
  'mosquito', 'spider', 'worm', 'snail'
];

// Large pool of distractor words that are different from memory words
const MEMORY_DISTRACTORS_RU = [
  'вода', 'песок', 'ветер', 'огонь', 'земля', 'воздух', 'металл', 'пластик',
  'бумага', 'ткань', 'стекло', 'железо', 'золото', 'серебро', 'медь', 'бронза',
  'хлеб', 'молоко', 'масло', 'сахар', 'соль', 'перец', 'мука', 'крупа',
  'чашка', 'тарелка', 'ложка', 'вилка', 'нож', 'кастрюля', 'сковорода', 'чайник',
  'диван', 'кресло', 'шкаф', 'кровать', 'полка', 'зеркало', 'картина', 'лампа',
  'телефон', 'компьютер', 'планшет', 'телевизор', 'радио', 'часы', 'будильник', 'календарь',
  'рубашка', 'брюки', 'платье', 'юбка', 'пальто', 'куртка', 'шапка', 'шарф',
  'туфли', 'ботинки', 'сапоги', 'кроссовки', 'тапочки', 'перчатки', 'носки', 'пояс'
];

const MEMORY_DISTRACTORS_YOUNG_RU = [
  'хлеб', 'вода', 'чай', 'суп', 'каша', 'торт', 'снег', 'лед', 'дождь', 'туча',
  'гриб', 'трава', 'цвет', 'небо', 'река', 'поле', 'роса', 'иней', 'град', 'ветер',
  'стул', 'диван', 'шкаф', 'окно', 'дверь', 'пол', 'стена', 'потолок', 'крыша', 'труба',
  'мыло', 'полотенце', 'щетка', 'гребешок', 'зубы', 'волосы', 'уши', 'глаза', 'губы', 'щеки',
  'шапка', 'шарф', 'варежки', 'сапоги', 'куртка', 'штаны', 'рубашка', 'платье', 'юбка', 'носки'
];

const MEMORY_DISTRACTORS_KK = [
  'су', 'құм', 'жел', 'от', 'жер', 'ауа', 'металл', 'пластик', 'темір', 'болат',
  'қағаз', 'мата', 'шыны', 'алтын', 'күміс', 'мыс', 'қола', 'мырыш',
  'нан', 'сүт', 'май', 'қант', 'тұз', 'бұрыш', 'ұн', 'жарма',
  'кесе', 'тәрелке', 'қасық', 'шанышқы', 'пышақ', 'қазан', 'табақ', 'шәйнек',
  'диван', 'орындық', 'шкаф', 'төсек', 'сөре', 'айна', 'сурет', 'шам',
  'телефон', 'компьютер', 'планшет', 'теледидар', 'радио', 'сағат', 'оятқыш', 'күнтізбе',
  'көйлек', 'шалбар', 'көйлек', 'белдемше', 'пальто', 'күртка', 'бас киім', 'шарф',
  'туфли', 'етік', 'етік', 'кроссовка', 'тәпішке', 'қолғап', 'шұлық', 'белдік'
];

const MEMORY_DISTRACTORS_YOUNG_KK = [
  'нан', 'су', 'шай', 'сорпа', 'ботқа', 'торт', 'қар', 'мұз', 'жаңбыр', 'бұлт',
  'саңырауқұлақ', 'шөп', 'түс', 'аспан', 'өзен', 'дала', 'шық', 'қырау', 'бұршақ', 'жел',
  'орындық', 'диван', 'шкаф', 'терезе', 'есік', 'еден', 'қабырға', 'төбе', 'шатыр', 'түтін',
  'сабын', 'сүлгі', 'щетка', 'тарақ', 'тіс', 'шаш', 'құлақ', 'көз', 'ерін', 'бет',
  'бас киім', 'шарф', 'қолғап', 'етік', 'күртка', 'шалбар', 'көйлек', 'көйлек', 'белдемше', 'шұлық'
];

const MEMORY_DISTRACTORS_EN = [
  'water', 'sand', 'wind', 'fire', 'earth', 'air', 'metal', 'plastic', 'iron', 'steel',
  'paper', 'fabric', 'glass', 'gold', 'silver', 'copper', 'bronze', 'zinc',
  'bread', 'milk', 'butter', 'sugar', 'salt', 'pepper', 'flour', 'cereal',
  'cup', 'plate', 'spoon', 'fork', 'knife', 'pot', 'pan', 'kettle',
  'sofa', 'chair', 'closet', 'bed', 'shelf', 'mirror', 'picture', 'lamp',
  'phone', 'computer', 'tablet', 'television', 'radio', 'clock', 'alarm', 'calendar',
  'shirt', 'pants', 'dress', 'skirt', 'coat', 'jacket', 'hat', 'scarf',
  'shoes', 'boots', 'boots', 'sneakers', 'slippers', 'gloves', 'socks', 'belt'
];

const MEMORY_DISTRACTORS_YOUNG_EN = [
  'bread', 'water', 'tea', 'soup', 'rice', 'pie', 'snow', 'ice', 'rain', 'cloud',
  'plant', 'grass', 'color', 'sky', 'river', 'field', 'dew', 'frost', 'hail', 'wind',
  'chair', 'sofa', 'closet', 'window', 'door', 'floor', 'wall', 'ceiling', 'roof', 'pipe',
  'soap', 'towel', 'brush', 'comb', 'teeth', 'hair', 'ears', 'eyes', 'lips', 'cheeks',
  'hat', 'scarf', 'mittens', 'boots', 'jacket', 'pants', 'shirt', 'dress', 'skirt', 'socks'
];

const CONCENTRATION_ITEMS = ['🌟', '⭐', '✨', '💫', '🌙', '☀️', '🌈', '☁️', '⚡', '🔥', '💎', '🎯', '🎨', '🎭', '🎪', '🎡', '🎢', '🎠', '🎪', '🎨'];

// Reading texts for younger kids (4-7 years)
const READING_TEXTS_YOUNG = {
  ru: [
    {
      title: 'Веселый котенок',
      text: 'Жил-был котенок Пушок. Он был очень игривый и веселый. Пушок любил бегать по двору и ловить бабочек. У него были мягкие лапки и пушистый хвост. Каждое утро котенок просыпался рано. Он умывался своей лапкой и пил молоко из блюдца. Потом Пушок выходил гулять. Во дворе росло большое дерево. Котенок любил лазить по его веткам. Там он сидел и смотрел на птиц. Птички пели красивые песни. Пушок слушал их и мурлыкал. В обед котенок возвращался домой. Его ждала вкусная еда. После обеда Пушок любил спать на мягкой подушке. Ему снились интересные сны про мышек и птичек. Вечером котенок снова выходил играть. Он прыгал за мячиком и бегал с друзьями. У Пушка было много друзей. Все любили веселого котенка.'
    },
    {
      title: 'Добрый щенок',
      text: 'В одном доме жил щенок Дружок. Он был добрым и ласковым. Дружок любил играть с детьми. У щенка были черные ушки и белые лапы. Каждый день Дружок гулял в парке. Он бегал по траве и нюхал цветы. В парке было много деревьев. Дружок любил лежать в их тени. Там было прохладно и приятно. Щенок дружил с другими собаками. Они вместе играли и бегали. Дружок умел приносить палку. Он ловил ее на лету. Хозяин гладил щенка и хвалил его. Дружок махал хвостом от радости. Вечером они шли домой. Дома щенка ждала его миска. Дружок ел и ложился спать. Он засыпал и видел добрые сны.'
    },
    {
      title: 'Маленькая птичка',
      text: 'На дереве жила маленькая птичка. Ее звали Чика. Она была яркая и красивая. У Чики были желтые перышки. Каждое утро птичка пела песни. Ее голос был звонкий и веселый. Чика летала с ветки на ветку. Она искала вкусные зернышки. В саду было много цветов. Птичка любила сидеть на них. Там она отдыхала и чистила перышки. У Чики было гнездо на дереве. Там было тепло и уютно. В гнезде лежали маленькие яички. Скоро из них вылупятся птенцы. Чика будет заботиться о них. Она будет кормить их и учить летать. Птичка была счастлива. Ей нравилось жить на дереве.'
    }
  ],
  kk: [
    {
      title: 'Көңілді мысық',
      text: 'Бір кезде Ақпан деген мысық болды. Ол өте ойыншық және көңілді ед��. Ақпан ауланы жүгіріп көбелектерді ұстауды жақсы көрді. Оның жұмсақ аяқтары мен үлпілдек құйрығы бар еді. Әр таң сайын мысық ерте оянды. Ол аяғымен жуынып табақтан сүт ішті. Содан кейін Ақпан серуендеуге шықты. Аулада үлкен ағаш өсті. Мысық оның бұтақтарына өрмелеуді жақсы көрді. Ол сонда отырып құстарды қарады. Құстар әдемі әндер айтты. Ақпан оларды тыңдап мырқылдады. Түсте мысық үйге оралды. Оны дәмді тамақ күтті. Түстен кейін Ақпан жұмсақ жастыққа ұйықтауды ұнатты. Оған тышқандар мен құстар туралы қызықты түстер көрінді. Кешке мысық қайтадан ойнауға шықты. Ол допқа секіріп достарымен жүгірді. Ақпанның көп досы бар еді. Барлық адамдар көңілді мысықты жақсы көрді.'
    },
    {
      title: 'Мейірімді күшік',
      text: 'Бір үйде Дос деген күшік өмір сүрді. Ол мейірімді және жұмсақ еді. Дос балалармен ойнауды жақсы көрді. Күшіктің қара құлақтары мен ақ аяқтары бар еді. Күн сайын Дос саябақта серуендеді. Ол шөпте жүгірі�� гүлдерді иіскеді. Саябақта көп ағаштар бар еді. Дос олардың көлеңкесінде жатуды ұнатты. Сонда салқын және жайлы болды. Күшік басқа иттермен дос болды. Олар бірге ойнап жүгірді. Дос таяқты әкелуді білді. Ол оны ұшып келе жатқанда ұстады. Иесі күшікті сипап мақтады. Дос қуаныштан құйрығын бұлғады. Кешке олар үйге қайтты. Үйде күшікті оның ыдысы күтті. Дос жеп ұйықтауға жатты. Ол ұйықтап мейірімді түстер көрді.'
    },
    {
      title: 'Кішкентай құс',
      text: 'Ағашта кішкентай құс өмір сүрді. Оны Шіпшік деп атады. Ол жарқын және әдемі еді. Шіпшіктің сары қауырсындары бар еді. Әр таң сайын құс әндер айтты. Оның дауысы шыңғырлы және көңілді еді. Шіпшік бұтақтан бұтаққа ұшты. Ол дәмді дәндерді іздеді. Бақта көп гүлдер бар еді. Құс оларда отыруды жақсы көрді. Сонда ол демалып қауырсындарын ��азалады. Шіпшіктің ағашта ұясы бар еді. Сонда жылы және жайлы еді. Ұяда кішкентай жұмыртқалар жатты. Жақында олардан балапандар шығады. Шіпшік оларға қамқорлық жасайды. Ол оларды тамақтандырып ұшуға үйретеді. Құс бақытты еді. Оған ағашта өмір сүру ұнады.'
    }
  ],
  en: [
    {
      title: 'Happy Kitten',
      text: 'Once upon a time there was a kitten named Fluffy. He was very playful and cheerful. Fluffy loved to run around the yard and catch butterflies. He had soft paws and a fluffy tail. Every morning the kitten woke up early. He washed with his paw and drank milk from a saucer. Then Fluffy went out for a walk. A big tree grew in the yard. The kitten loved to climb its branches. There he sat and watched the birds. The birds sang beautiful songs. Fluffy listened to them and purred. At lunch the kitten returned home. Delicious food was waiting for him. After lunch Fluffy liked to sleep on a soft pillow. He had interesting dreams about mice and birds. In the evening the kitten went out to play again. He jumped after a ball and ran with friends. Fluffy had many friends. Everyone loved the cheerful kitten.'
    },
    {
      title: 'Kind Puppy',
      text: 'In one house lived a puppy named Buddy. He was kind and gentle. Buddy loved to play with children. The puppy had black ears and white paws. Every day Buddy walked in the park. He ran on the grass and smelled flowers. There were many trees in the park. Buddy liked to lie in their shade. It was cool and pleasant there. The puppy made friends with other dogs. They played and ran together. Buddy knew how to fetch a stick. He caught it in the air. The owner petted the puppy and praised him. Buddy wagged his tail with joy. In the evening they went home. At home his bowl was waiting for the puppy. Buddy ate and went to sleep. He fell asleep and had kind dreams.'
    },
    {
      title: 'Little Bird',
      text: 'A little bird lived in a tree. Her name was Tweety. She was bright and beautiful. Tweety had yellow feathers. Every morning the bird sang songs. Her voice was clear and cheerful. Tweety flew from branch to branch. She looked for tasty seeds. There were many flowers in the garden. The bird loved to sit on them. There she rested and cleaned her feathers. Tweety had a nest in the tree. It was warm and cozy there. Small eggs lay in the nest. Soon chicks will hatch from them. Tweety will take care of them. She will feed them and teach them to fly. The bird was happy. She liked living in the tree.'
    }
  ]
};

// Longer reading texts for older kids (8+ years) with questions - ~300 words each chunk
const READING_TEXTS_LONG = {
  ru: {
    title: 'Космическое приключение',
    chunks: [
      'В далеком космосе живут удивительные существа. Они путешествуют между звездами на волшебных кораблях. Каждый день они открывают новые планеты и находят необычных друзей. Космос полон загадок и чудес. Маленькие звездочки светят им дорогу в темноте бесконечного пространства. Планеты вращаются вокруг больших звезд словно в космичес��ом танце. На некоторых планетах есть вода и высокие горы покрытые снегом. Космические путешественники очень любят свою работу исследователей. Они мечтают найти новую жизнь среди далеких звезд и рассказать о ней всем. Каждое открытие приносит радость и новые знания об устройстве вселенной. Иногда они встречают метеориты которые пролетают мимо с огромной скоростью. Астероиды размером с целый город плавно движутся в космическом пространстве. Спутники планет вращаются по своим орбитам не останавливаясь ни на секунду. Кометы с длинными яркими хвостами освещают темноту космоса. Черные дыры притягивают все что находится рядом своей мощной гравитацией. Галактики состоят из миллиардов звезд которые светят разными цветами. Туманности создают красивые узоры в космическом пространстве словно картины художника. Космические станции служат домом для исследователей на многие месяцы. Роботы помогают людям изучать далекие планеты где опасно находиться. Телескопы позволяют увидеть то что находится на расстоянии миллионов световых лет. Ракеты взлетают с Земли унося на борту смелых астронавтов и ученых.',
      'Невесомость в космосе создает необычные условия дл�� жизни и работы. Скафандры защищают людей от холода и отсутствия воздуха в открытом космосе. Солнечные батареи дают энергию для работы всех систем космического корабля. Связь с Землей позволяет передавать важную информацию и получать новые задания. Космонавты проводят эксперименты чтобы узнать как ведут себя разные вещества в невесомости. Они выращивают растения и наблюдают за их рос��ом в условиях космоса. Вода в космосе собирается в круглые шарики которые плавают в воздухе. Еда для космонавтов упаковывается в специальные пакеты чтобы она не разлеталась. Сон в невесомости требует специального спального мешка который крепится к стене. Тренировки помогают космонавтам сохранять мышцы сильными в условиях невесомости. Иллюминаторы позволяют наблюдать за красотой З��мли из космоса. Наша планета выглядит как голубой шар с белыми облаками и зелеными материками. Космические снимки помогают ученым изучать погоду и климат на Земле. Спутники передают сигналы для телевидения интернета и навигации. Международная космическая станция объединяет ученых из разных стран для совместной работы.',
      'Будущее космических исследований обещает много интересного и удивительного. Ученые планируют отправить людей на Марс чтобы изучить красную планету. Новые телескопы смогут увидеть планеты возле далеких звезд где может быть жизнь. Космические корабли станут быстрее и смогут долетать до дальних уголков Солнечной системы. Возможно люди построят базы на Луне и других планетах для постоянного проживания. Добыча полезных ископаемых на астероидах может дать много ресурсов для Земли. Космический ту��изм позволит обычным людям увидеть Землю из космоса своими глазами. Новые двигатели сократят время путешествия к другим планетам в несколько раз. Искусственный интеллект поможет управлять сложными космическими системами и принимать решения. Защита от космической радиации станет лучше благодаря новым материалам. Космические фермы обеспечат астронавтов свежей едой во время долгих полетов. Системы переработки отходов превратят их в полезные ресурсы для космических станций. Каждый день приближает нас к новым открытиям в бесконечном космосе.'
    ],
    questions: [
      {
        question: 'Что освещает путь космическим путешественникам в темноте?',
        options: ['Солнце', 'Маленькие звездочки', 'Луна', 'Фонари'],
        correct: 1
      },
      {
        question: 'Что помогает людям изучать далекие планеты?',
        options: ['Телескопы', 'Роботы', 'Спутники', 'Камеры'],
        correct: 1
      },
      {
        question: 'Как выглядит вода в космосе?',
        options: ['Как лед', 'Как круглые шарики', 'Как пар', 'Как снег'],
        correct: 1
      },
      {
        question: 'Что планируют ученые в будущем?',
        options: ['Построить отель', 'Отправить людей на Марс', 'Создать новую звезду', 'Остановить время'],
        correct: 1
      }
    ]
  },
  kk: {
    title: 'Ғарыштық саяхат',
    chunks: [
      'Алыс ғарышта ерекше тіршілік иелері өмір сүреді. Олар жұлдыздар арасында сиқырлы кемелерде саяхаттайды. Әр күні олар жаңа планеталарды ашады және ерекше достар табады. Ғарыш құпия мен кереметке толы. Кішкентай жұлдыздар оларға шексіз кеңістіктің қараңғылығында жол көрсетеді. Планеталар үлкен жұлдыздардың айналасында ғарышты�� би сияқты айналады. Кейбір планеталарда қармен жабылған биік таулар бар. Ғарыштық саяхатшылар зерттеушілердің жұмысын өте жақсы көреді. Олар алыс жұлдыздар арасында жаңа өмір табуды армандайды. Әрбір жаңалық қуаныш пен ғалам құрылысы туралы жаңа білім әкеледі. Кейде олар үлкен жылдамдықпен ұшып өтетін метеориттермен кездеседі. Бүтін қала өлшемді астероидтар ғарыш кеңістігінде жайл��п қозғалады. Планеталардың серіктері өз орбиталары бойынша бір секундқа да тоқтамай айналады. Ұзын жарқын құйрықты кометалар ғарыш қараңғылығын жарықтандырады. Қара тесіктер өздерінің қуатты гравитациясымен жанындағының бәрін тартады. Галактикалар әртүрлі түстермен жарқырайтын миллиардтаған жұлдыздардан тұрады. Тұмандықтар ғарыш кеңістігінде суретші картиналары сияқты әдемі өрнектер жасайды. Ғарыштық станциялар зерттеушілерге көп айларға үй ��олып қызмет етеді.',
      'Салмақсыздық ғарышта өмір мен жұмыс үшін ерекше жағдайлар жасайды. Скафандрлар адамдарды ашық ғарыштағы суықтан және ауаның жоқтығынан қорғайды. Күн батареялары ғарыш кемесінің барлық жүйелерінің жұмысы үшін энергия береді. Жермен байланыс маңызды ақпаратты беруге және жаңа тапсырмалар алуға мүмкіндік береді. Ғарышкерлер салмақсыздықта әртүрлі заттардың қалай әрекет ететінін білу үшін тәжірибелер жүргізеді. Олар өсімдіктерді өсіріп ғарыш жағдайында олардың өсуін бақылайды. Ғарыштағы су ауада қалықтайтын дөңгелек шарларға жиналады. Ғарышкерлерге арналған тамақ ұшып кетпеу үшін арнайы пакеттерге оралады. Салмақсыздықта ұйықтау қабырғаға бекітілетін арнайы ұйықтау қапшығын талап етеді. Жаттығулар ғарышкерлерге салмақсыздық жағдайында бұлшықеттерді күшті сақтауға көмектеседі. Иллюминаторлар ғарыштан Жердің әсемдігін бақылауға мүмкіндік береді. Біздің планетамыз ақ бұлттар мен жасыл материктері бар көк шар сияқты көрінеді.',
      'Ғарыштық зерттеулердің болашағы көп қызықты және таңғажайып нәрселерді уәде етеді. Ғалымдар қызыл планетаны зерттеу үшін адамдарды Марсқа жіберуді жоспарлап отыр. Жаңа телескоптар өмір болуы мүмкін алыс жұлдыздардың жанындағы планеталарды көре алады. Ғарыш кемелері жылдамырақ болады және Күн жүйесінің алыс бұрыштарына ұша алады. Мүмкін адамдар тұрақты тұру үшін Айда және басқа планеталарда базалар салады. Астероидтарда пайдалы қазбаларды өндіру Жерге көп ресурстар бере алады. Ғарыштық туризм қарапайым адамдарға Жерді ғарыштан өз көздерімен көруге мүмкіндік беред��. Жаңа қозғалтқыштар басқа планеталарға саяхат уақытын бірнеше есе қысқартады. Жасанды интеллект күрделі ғарыштық жүйелерді басқаруға және шешімдер қабылдауға көмектеседі.'
    ],
    questions: [
      {
        question: 'Ғарыштық саяхатшыларға қараңғылықта жол не көрсетеді?',
        options: ['Күн', 'Кішкентай жұлдыздар', 'Ай', 'Шамдар'],
        correct: 1
      },
      {
        question: 'Адамдарға алыс планеталарды зерттеуге не көмектеседі?',
        options: ['Телескоптар', 'Роботтар', 'Серіктер', 'Камералар'],
        correct: 1
      },
      {
        question: 'Ғарышта су қалай көрінеді?',
        options: ['Мұз сияқты', 'Дөңгелек шарлар сияқты', 'Бу сияқты', 'Қар сияқты'],
        correct: 1
      },
      {
        question: 'Ғалымдар болашақта не жоспарлап отыр?',
        options: ['Қонақүй салу', 'Адамдарды Марсқа жіберу', 'Жаңа жұлдыз жасау', 'Уақытты тоқтату'],
        correct: 1
      }
    ]
  },
  en: {
    title: 'Space Adventure',
    chunks: [
      'Amazing creatures live in distant space. They travel between stars on magical ships. Every day they discover new planets and find unusual friends. Space is full of mysteries and wonders. Little stars light their way in the darkness of endless space. Planets revolve around big stars like in a cosmic dance. Some planets have water and high mountains covered with snow. Space travelers really love their work as explorers. They dream of finding new life among distant stars and telling everyone about it. Each discovery brings joy and new knowledge about the structure of the universe. Sometimes they meet meteorites that fly past at enormous speed. Asteroids the size of an entire city smoothly move in cosmic space. Planet satellites rotate in their orbits without stopping for a second. Comets with long bright tails illuminate the darkness of space. Black holes attract everything nearby with their powerful gravity. Galaxies consist of billions of stars that shine in different colors. Nebulae create beautiful patterns in cosmic space like artist paintings. Space stations serve as home for explorers for many months.',
      'Weightlessness in space creates unusual conditions for life and work. Spacesuits protect people from cold and lack of air in open space. Solar panels provide energy for all spacecraft systems to work. Communication with Earth allows transmitting important information and receiving new tasks. Astronauts conduct experiments to learn how different substances behave in weightlessness. They grow plants and observe their growth in space conditions. Water in space collects into round balls that float in the air. Food for astronauts is packaged in special packets so it does not fly away. Sleep in weightlessness requires a special sleeping bag that attaches to the wall. Training helps astronauts keep muscles strong in weightlessness conditions. Windows allow observing the beauty of Earth from space. Our planet looks like a blue ball with white clouds and green continents. Space photos help scientists study weather and climate on Earth.',
      'The future of space exploration promises much that is interesting and amazing. Scientists plan to send people to Mars to study the red planet. New telescopes will be able to see planets near distant stars where there may be life. Spacecraft will become faster and will be able to fly to far corners of the Solar System. Perhaps people will build bases on the Moon and other planets for permanent residence. Mining on asteroids can provide many resources for Earth. Space tourism will allow ordinary people to see Earth from space with their own eyes. New engines will reduce travel time to other planets several times. Artificial intelligence will help manage complex space systems and make decisions. Protection from space radiation will become better thanks to new materials.'
    ],
    questions: [
      {
        question: 'What lights the way for space travelers in the darkness?',
        options: ['The Sun', 'Little stars', 'The Moon', 'Lanterns'],
        correct: 1
      },
      {
        question: 'What helps people study distant planets?',
        options: ['Telescopes', 'Robots', 'Satellites', 'Cameras'],
        correct: 1
      },
      {
        question: 'What does water look like in space?',
        options: ['Like ice', 'Like round balls', 'Like steam', 'Like snow'],
        correct: 1
      },
      {
        question: 'What do scientists plan for the future?',
        options: ['Build a hotel', 'Send people to Mars', 'Create a new star', 'Stop time'],
        correct: 1
      }
    ]
  }
};

export function DiagnosticTrainer({ user, language }: DiagnosticTrainerProps) {
  const [stage, setStage] = useState<Stage>('intro');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('8+');
  
  // Memory test state
  const [memoryRound, setMemoryRound] = useState(0);
  const [currentMemoryWords, setCurrentMemoryWords] = useState<string[]>([]);
  const [memoryShowTime, setMemoryShowTime] = useState(10);
  const [memoryTestWords, setMemoryTestWords] = useState<string[]>([]);
  const [selectedMemoryWords, setSelectedMemoryWords] = useState<Set<string>>(new Set());
  const [memoryScores, setMemoryScores] = useState<number[]>([]);
  const [memoryTestStartTime, setMemoryTestStartTime] = useState(0);
  const [memoryTestTime, setMemoryTestTime] = useState(0);
  const [memoryStats, setMemoryStats] = useState<{correct: number, incorrect: number, missed: number}[]>([]);
  
  // Concentration test state
  const [concentrationRound, setConcentrationRound] = useState(0);
  const [targetItems, setTargetItems] = useState<string[]>([]);
  const [concentrationShowTime, setConcentrationShowTime] = useState(4);
  const [concentrationTestStartTime, setConcentrationTestStartTime] = useState(0);
  const [concentrationTestTime, setConcentrationTestTime] = useState(0);
  const [concentrationGrid, setConcentrationGrid] = useState<string[]>([]);
  const [foundItems, setFoundItems] = useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [concentrationScores, setConcentrationScores] = useState<number[]>([]);
  const [concentrationTimes, setConcentrationTimes] = useState<number[]>([]);
  const [concentrationStats, setConcentrationStats] = useState<{correct: number, incorrect: number, missed: number}[]>([]);
  
  // Reading test state for 8+
  const [questionsAnswers, setQuestionsAnswers] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Reading test state (common for both age groups)
  const [readingRound, setReadingRound] = useState(0);
  const [readingTexts, setReadingTexts] = useState<typeof READING_TEXTS_YOUNG.ru>([]);
  const [readingText, setReadingText] = useState({ title: '', text: '' });
  const [readingTimeLeft, setReadingTimeLeft] = useState(60);
  const [readingActive, setReadingActive] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const [readingResults, setReadingResults] = useState<number[]>([]);
  const [countdownTime, setCountdownTime] = useState(3);
  
  const [finalMemoryScore, setFinalMemoryScore] = useState(0);
  const [finalConcentrationScore, setFinalConcentrationScore] = useState(0);
  const [finalConcentrationTime, setFinalConcentrationTime] = useState(0);
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [roundResultData, setRoundResultData] = useState<{correct: number, incorrect: number, missed: number, total: number, time?: number}>({correct: 0, incorrect: 0, missed: 0, total: 0});

  const t = (key: keyof typeof import('../utils/translations').translations.ru) => 
    getTranslation(language, key);

  // Memory show timer
  useEffect(() => {
    if (stage === 'memoryShow' && memoryShowTime > 0) {
      const timer = setInterval(() => setMemoryShowTime(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (stage === 'memoryShow' && memoryShowTime === 0) {
      startMemoryTest();
    }
  }, [stage, memoryShowTime]);

  // Memory test timer
  useEffect(() => {
    if (stage === 'memoryTest' && memoryTestStartTime > 0) {
      const timer = setInterval(() => {
        setMemoryTestTime(Math.floor((Date.now() - memoryTestStartTime) / 1000));
      }, 100);
      return () => clearInterval(timer);
    }
  }, [stage, memoryTestStartTime]);

  // Concentration show timer
  useEffect(() => {
    if (stage === 'concentrationShow' && concentrationShowTime > 0) {
      const timer = setInterval(() => setConcentrationShowTime(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (stage === 'concentrationShow' && concentrationShowTime === 0) {
      setConcentrationTestStartTime(Date.now());
      setStage('concentrationTest');
    }
  }, [stage, concentrationShowTime]);

  // Concentration test timer
  useEffect(() => {
    if (stage === 'concentrationTest' && concentrationTestStartTime > 0) {
      const timer = setInterval(() => {
        setConcentrationTestTime(Math.floor((Date.now() - concentrationTestStartTime) / 1000));
      }, 100);
      return () => clearInterval(timer);
    }
  }, [stage, concentrationTestStartTime]);

  // Reading countdown for 4-7
  useEffect(() => {
    if (stage === 'readingCountdown' && countdownTime > 0) {
      const timer = setInterval(() => setCountdownTime(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (stage === 'readingCountdown' && countdownTime === 0) {
      startReadingRound();
    }
  }, [stage, countdownTime]);

  // Reading timer (for both age groups)
  useEffect(() => {
    if (stage === 'reading' && readingActive && readingTimeLeft > 0) {
      const timer = setInterval(() => setReadingTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (stage === 'reading' && readingTimeLeft === 0) {
      setReadingActive(false);
      setTimeExpired(true);
      toast.error(t('timeIsUpClickWord'));
    }
  }, [stage, readingActive, readingTimeLeft]);

  const selectAge = (age: AgeGroup) => {
    setAgeGroup(age);
    setStage('ageSelection');
  };

  const startDiagnostic = () => {
    setMemoryRound(0);
    setMemoryScores([]);
    startMemoryRound(0);
  };

  const startMemoryRound = (round: number) => {
    // Select word pool based on age group and language
    const wordPool = ageGroup === '4-7' 
      ? (language === 'ru' ? MEMORY_WORD_POOL_YOUNG_RU : 
         language === 'kz' ? MEMORY_WORD_POOL_YOUNG_KK : MEMORY_WORD_POOL_YOUNG_EN)
      : (language === 'ru' ? MEMORY_WORD_POOL_RU : 
         language === 'kz' ? MEMORY_WORD_POOL_KK : MEMORY_WORD_POOL_EN);
    
    // Randomly select words from the pool
    const wordCount = ageGroup === '4-7' ? 4 : 6;
    const shuffled = [...wordPool].sort(() => Math.random() - 0.5);
    const words = shuffled.slice(0, wordCount);
    
    setCurrentMemoryWords(words);
    setMemoryShowTime(10);
    setStage('memoryShow');
  };

  const startMemoryTest = () => {
    const distractors = ageGroup === '4-7'
      ? (language === 'ru' ? MEMORY_DISTRACTORS_YOUNG_RU :
         language === 'kz' ? MEMORY_DISTRACTORS_YOUNG_KK : MEMORY_DISTRACTORS_YOUNG_EN)
      : (language === 'ru' ? MEMORY_DISTRACTORS_RU :
         language === 'kz' ? MEMORY_DISTRACTORS_KK : MEMORY_DISTRACTORS_EN);
    
    // Filter out any distractors that might match current memory words
    const availableDistractors = distractors.filter(d => 
      !currentMemoryWords.some(w => w.toLowerCase() === d.toLowerCase())
    );
    
    // Create test words: correct words + random distractors
    const distractorCount = ageGroup === '4-7' ? 8 : 14;
    const shuffledDistractors = [...availableDistractors]
      .sort(() => Math.random() - 0.5)
      .slice(0, distractorCount);
    const testWords = [...currentMemoryWords, ...shuffledDistractors]
      .sort(() => Math.random() - 0.5);
    
    setMemoryTestWords(testWords);
    setSelectedMemoryWords(new Set());
    setMemoryTestStartTime(Date.now());
    setMemoryTestTime(0);
    setStage('memoryTest');
  };

  const toggleMemoryWord = (word: string) => {
    const newSelected = new Set(selectedMemoryWords);
    if (newSelected.has(word)) {
      newSelected.delete(word);
    } else {
      newSelected.add(word);
    }
    setSelectedMemoryWords(newSelected);
  };

  const submitMemoryTest = () => {
    const correct = Array.from(selectedMemoryWords).filter(w => 
      currentMemoryWords.map(mw => mw.toLowerCase()).includes(w.toLowerCase())
    ).length;
    const incorrect = selectedMemoryWords.size - correct;
    const missed = currentMemoryWords.length - correct;
    
    // Save detailed stats
    const newStats = [...memoryStats, { correct, incorrect, missed }];
    setMemoryStats(newStats);
    
    // Score: correct answers - incorrect selections
    const score = Math.max(0, Math.round(((correct - incorrect) / currentMemoryWords.length) * 100));
    
    const newScores = [...memoryScores, score];
    setMemoryScores(newScores);
    
    // Show round result
    setRoundResultData({
      correct,
      incorrect,
      missed,
      total: currentMemoryWords.length,
      time: memoryTestTime
    });
    setShowRoundResult(true);
    setStage('memoryRoundResult');
  };

  const continueAfterMemoryResult = () => {
    setShowRoundResult(false);
    if (memoryRound < 4) {
      setMemoryRound(memoryRound + 1);
      startMemoryRound(memoryRound + 1);
    } else {
      // Finish memory tests, start concentration
      const avgScore = Math.round(memoryScores.reduce((a, b) => a + b, 0) / memoryScores.length);
      setFinalMemoryScore(avgScore);
      setConcentrationRound(0);
      setConcentrationScores([]);
      setConcentrationTimes([]);
      setConcentrationStats([]);
      startConcentrationRound(0);
    }
  };

  const startConcentrationRound = (round: number) => {
    // Always 2 items to find
    const itemCount = 2;
    const shuffled = [...CONCENTRATION_ITEMS].sort(() => Math.random() - 0.5);
    const targets = shuffled.slice(0, itemCount);
    
    // Grid size based on age
    const gridSize = ageGroup === '4-7' ? 36 : 100; // 6x6 or 10x10
    const grid: string[] = [];
    
    // Add targets multiple times
    const targetRepeat = ageGroup === '4-7' ? 3 : 5; // fewer for young kids
    targets.forEach(item => {
      const count = targetRepeat + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        grid.push(item);
      }
    });
    
    // Fill rest with random items
    while (grid.length < gridSize) {
      const randomItem = CONCENTRATION_ITEMS[Math.floor(Math.random() * CONCENTRATION_ITEMS.length)];
      grid.push(randomItem);
    }
    
    // Shuffle
    const shuffledGrid = grid.sort(() => Math.random() - 0.5);
    
    setTargetItems(targets);
    setConcentrationGrid(shuffledGrid);
    setFoundItems(new Set());
    setSelectedItems(new Set());
    setConcentrationShowTime(4);
    setConcentrationTestTime(0);
    setStage('concentrationShow');
  };

  const handleConcentrationClick = (item: string, index: number) => {
    // Mark as selected
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
    
    // Track found items (correct selections only)
    if (targetItems.includes(item) && !newSelected.has(index)) {
      const newFound = new Set(foundItems);
      newFound.add(item);
      setFoundItems(newFound);
    } else if (targetItems.includes(item) && newSelected.has(index)) {
      // If unselecting a correct item, remove from found
      const newFound = new Set(foundItems);
      newFound.delete(item);
      setFoundItems(newFound);
    }
  };

  const submitConcentrationTest = () => {
    const timeSpent = concentrationTestTime;
    
    // Calculate statistics
    let correctCount = 0;
    let incorrectCount = 0;
    
    // Count total targets in grid
    const targetCounts: { [key: string]: number } = {};
    concentrationGrid.forEach((item) => {
      if (targetItems.includes(item)) {
        targetCounts[item] = (targetCounts[item] || 0) + 1;
      }
    });
    const totalTargets = Object.values(targetCounts).reduce((a, b) => a + b, 0);
    
    // Count correct and incorrect selections
    selectedItems.forEach(index => {
      const item = concentrationGrid[index];
      if (targetItems.includes(item)) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });
    
    const missedCount = totalTargets - correctCount;
    
    // Save detailed stats
    const newStats = [...concentrationStats, { correct: correctCount, incorrect: incorrectCount, missed: missedCount }];
    setConcentrationStats(newStats);
    
    const score = totalTargets > 0 ? Math.round((correctCount / totalTargets) * 100) : 0;
    
    const newScores = [...concentrationScores, score];
    const newTimes = [...concentrationTimes, timeSpent];
    setConcentrationScores(newScores);
    setConcentrationTimes(newTimes);
    
    // Show round result
    setRoundResultData({
      correct: correctCount,
      incorrect: incorrectCount,
      missed: missedCount,
      total: totalTargets,
      time: timeSpent
    });
    setShowRoundResult(true);
    setStage('concentrationRoundResult');
  };

  const continueAfterConcentrationResult = () => {
    setShowRoundResult(false);
    
    if (concentrationRound < 4) {
      setConcentrationRound(concentrationRound + 1);
      startConcentrationRound(concentrationRound + 1);
    } else {
      // Finish concentration tests, start reading intro
      const avgScore = Math.round(concentrationScores.reduce((a, b) => a + b, 0) / concentrationScores.length);
      const avgTime = Math.round(concentrationTimes.reduce((a, b) => a + b, 0) / concentrationTimes.length);
      setFinalConcentrationScore(avgScore);
      setFinalConcentrationTime(avgTime);
      
      // Prepare reading texts
      if (ageGroup === '4-7') {
        const texts = READING_TEXTS_YOUNG[language];
        setReadingTexts(texts);
      } else {
        // For 8+, combine all chunks into one text
        const longText = READING_TEXTS_LONG[language as keyof typeof READING_TEXTS_LONG];
        const fullText = longText.chunks.join(' ');
        setReadingTexts([{ title: longText.title, text: fullText }]);
      }
      
      setReadingRound(0);
      setReadingResults([]);
      setQuestionsAnswers([]);
      setStage('readingIntro');
    }
  };

  const startReadingTests = () => {
    setCountdownTime(3);
    setStage('readingCountdown');
  };

  const startReadingRound = () => {
    const text = readingTexts[readingRound];
    setReadingText(text);
    const timeLimit = ageGroup === '4-7' ? 90 : 60; // 90s for young, 60s for older
    setReadingTimeLeft(timeLimit);
    setSelectedWordIndex(0);
    setReadingActive(true);
    setTimeExpired(false);
    setStage('reading');
  };

  const handleAnswerQuestion = (answerIndex: number) => {
    const newAnswers = [...questionsAnswers, answerIndex];
    setQuestionsAnswers(newAnswers);
    
    const longText = READING_TEXTS_LONG[language as keyof typeof READING_TEXTS_LONG];
    
    if (currentQuestionIndex < longText.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // All questions answered, calculate results
      const correctAnswers = newAnswers.filter((ans, idx) => ans === longText.questions[idx].correct).length;
      const comprehensionScore = Math.round((correctAnswers / longText.questions.length) * 100);
      
      // Words read from the first reading round (selectedWordIndex)
      const wordsRead = readingResults[0] || 0;
      
      // Save results
      const overallScore = Math.round((finalMemoryScore + finalConcentrationScore) / 2);
      saveDiagnosticResult({
        userId: user.id,
        memoryScore: finalMemoryScore,
        concentrationScore: finalConcentrationScore,
        concentrationTime: finalConcentrationTime,
        wpm: wordsRead, // Store actual words read count
        comprehensionScore,
        overallScore,
        readingTime: 60
      });
      
      // Award points based on diagnostic performance
      const earnedPoints = calculateDiagnosticPoints(overallScore);
      if (earnedPoints > 0) {
        addPoints(user.id, earnedPoints, `Diagnostic: ${overallScore}% overall`);
        toast.success(`${t('diagnosticCompleted')}! +${earnedPoints} ${t('points')}! 🎉`, {
          duration: 3000,
        });
      } else {
        toast.success(t('diagnosticCompleted'));
      }
      
      setStage('results');
    }
  };

  const finishReadingRound = () => {
    setReadingActive(false);
    
    const newResults = [...readingResults, selectedWordIndex + 1]; // +1 because index is 0-based
    setReadingResults(newResults);
    
    if (ageGroup === '4-7') {
      // For young kids - 3 rounds
      if (readingRound < 2) {
        setReadingRound(readingRound + 1);
        setCountdownTime(3);
        setStage('readingCountdown');
      } else {
        // All reading done, calculate results
        const avgWords = Math.round(newResults.reduce((a, b) => a + b, 0) / newResults.length);
        
        // Save results
        const overallScore = Math.round((finalMemoryScore + finalConcentrationScore) / 2);
        saveDiagnosticResult({
          userId: user.id,
          memoryScore: finalMemoryScore,
          concentrationScore: finalConcentrationScore,
          concentrationTime: finalConcentrationTime,
          wpm: avgWords,
          overallScore,
          readingTime: 90
        });
        
        setStage('results');
        toast.success(t('diagnosticCompleted'));
      }
    } else {
      // For 8+ - go to questions after first round
      setCurrentQuestionIndex(0);
      setStage('readingQuestions');
    }
  };

  const reset = () => {
    setStage('intro');
    setMemoryRound(0);
    setMemoryScores([]);
    setConcentrationRound(0);
    setConcentrationScores([]);
    setConcentrationTimes([]);
    setReadingRound(0);
    setReadingResults([]);
    setSelectedWordIndex(0);
    setQuestionsAnswers([]);
    setTimeExpired(false);
  };

  const wordsArray = readingText.text ? readingText.text.split(/\s+/) : [];
  const totalWords = wordsArray.length;
  const avgReadingWords = readingResults.length > 0 
    ? Math.round(readingResults.reduce((a, b) => a + b, 0) / readingResults.length) 
    : 0;
  const gridCols = ageGroup === '4-7' ? 'grid-cols-6' : 'grid-cols-10';

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-4 right-4 text-6xl opacity-30">🧠</div>
        <div className="absolute bottom-4 right-20 text-4xl opacity-40">📊</div>
        <div className="absolute top-4 left-4 text-4xl opacity-30">🎯</div>
        <h2 className="text-3xl mb-2 relative z-10">{t('diagnosticTrainer')} 🔍</h2>
        <p className="text-purple-100 relative z-10">{t('diagnosticDescription')}</p>
      </motion.div>

      {/* Intro Stage */}
      {stage === 'intro' && (
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 border-4 border-indigo-300 rounded-3xl shadow-2xl">
          <div className="text-center space-y-6">
            <div className="text-6xl">🎯</div>
            <h3 className="text-3xl text-indigo-900">{t('selectYourAge')}</h3>
            <p className="text-lg text-gray-700">{t('chooseAgeGroupForTest')}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectAge('4-7')}
                className="p-8 bg-gradient-to-br from-pink-100 to-pink-200 border-4 border-pink-400 rounded-3xl shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="text-6xl mb-4">👶</div>
                <h4 className="text-2xl font-semibold text-pink-900 mb-2">4-7 {t('years')}</h4>
                <p className="text-sm text-gray-700">{t('youngerKids')}</p>
                <ul className="mt-4 text-xs text-gray-600 space-y-1">
                  <li>✓ {t('fewerWords')} (4)</li>
                  <li>✓ {t('moreTime')} (90s)</li>
                  <li>✓ {t('smallerGrid')} (6×6)</li>
                </ul>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectAge('8+')}
                className="p-8 bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-blue-400 rounded-3xl shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="text-6xl mb-4">🎓</div>
                <h4 className="text-2xl font-semibold text-blue-900 mb-2">8+ {t('years')}</h4>
                <p className="text-sm text-gray-700">{t('olderKids')}</p>
                <ul className="mt-4 text-xs text-gray-600 space-y-1">
                  <li>✓ {t('standardDifficulty')}</li>
                  <li>✓ {t('moreWords')} (6)</li>
                  <li>✓ {t('largerGrid')} (10×10)</li>
                </ul>
              </motion.button>
            </div>
          </div>
        </Card>
      )}

      {/* Age Selection Confirmation */}
      {stage === 'ageSelection' && (
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-4 border-purple-300 rounded-3xl shadow-2xl">
          <div className="text-center space-y-6">
            <div className="text-6xl">{ageGroup === '4-7' ? '👶' : '🎓'}</div>
            <h3 className="text-3xl text-purple-900">{t('diagnosticInstructions')}</h3>
            
            <div className="space-y-4 text-left max-w-2xl mx-auto">
              <div className="p-4 bg-white rounded-2xl border-2 border-pink-200">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="w-6 h-6 text-pink-600" />
                  <h4 className="font-semibold text-pink-900">{t('tour')} 1: {t('memoryTest')}</h4>
                </div>
                <p className="text-sm text-gray-700">{t('memoryTestDescription')}</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="w-6 h-6 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">{t('tour')} 2: {t('concentrationTest')}</h4>
                </div>
                <p className="text-sm text-gray-700">{t('concentrationTestDescription')}</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border-2 border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-6 h-6 text-green-600" />
                  <h4 className="font-semibold text-green-900">{t('tour')} 3: {t('readingTest')}</h4>
                </div>
                <p className="text-sm text-gray-700">{t('readingTestDescription')}</p>
              </div>
            </div>

            <Button
              onClick={startDiagnostic}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-6 rounded-2xl text-lg shadow-xl"
            >
              <Play className="w-6 h-6 mr-2" />
              {t('startDiagnostic')}
            </Button>
          </div>
        </Card>
      )}

      {/* Memory Show Stage */}
      {stage === 'memoryShow' && (
        <Card className="p-8 bg-gradient-to-br from-pink-50 to-pink-100 border-4 border-pink-300 rounded-3xl shadow-2xl">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg text-pink-900">{t('round')} {memoryRound + 1}/5</span>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-pink-600" />
                <span className="text-2xl font-semibold text-pink-900">{memoryShowTime}s</span>
              </div>
            </div>

            <div className="text-5xl mb-4">🧠</div>
            <h3 className="text-2xl text-pink-900">{t('memorizeTheseWords')}</h3>
            <Progress value={(memoryShowTime / 10) * 100} className="h-3" />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {currentMemoryWords.map((word, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-gradient-to-br from-white to-pink-50 border-3 border-pink-300 rounded-2xl shadow-lg"
                >
                  <span className="text-xl font-semibold text-pink-900">{word}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Memory Test Stage */}
      {stage === 'memoryTest' && (
        <Card className="p-8 bg-gradient-to-br from-pink-50 to-pink-100 border-4 border-pink-300 rounded-3xl shadow-2xl">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg text-pink-900">{t('round')} {memoryRound + 1}/5</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-pink-600" />
                  <span className="text-lg font-semibold text-pink-900">{memoryTestTime}s</span>
                </div>
                <span className="text-lg text-pink-900">{selectedMemoryWords.size} {t('selected')}</span>
              </div>
            </div>

            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-2xl text-pink-900">{t('selectWordsYouMemorized')}</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {memoryTestWords.map((word, index) => {
                const isSelected = selectedMemoryWords.has(word);
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleMemoryWord(word)}
                    className={`p-4 rounded-2xl border-3 shadow-lg transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-pink-400 to-pink-500 border-pink-600 text-white'
                        : 'bg-white border-pink-300 text-pink-900 hover:border-pink-400'
                    }`}
                  >
                    {word}
                  </motion.button>
                );
              })}
            </div>

            <Button
              onClick={submitMemoryTest}
              disabled={selectedMemoryWords.size === 0}
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-6 rounded-2xl text-lg shadow-xl disabled:opacity-50"
            >
              <CheckCircle className="w-6 h-6 mr-2" />
              {t('submit')}
            </Button>
          </div>
        </Card>
      )}

      {/* Memory Round Result */}
      {stage === 'memoryRoundResult' && (
        <Card className="p-8 bg-gradient-to-br from-pink-50 to-pink-100 border-4 border-pink-300 rounded-3xl shadow-2xl">
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-3xl text-pink-900">{t('round')} {memoryRound + 1} - {t('statsLabel')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-6 bg-gradient-to-br from-green-100 to-green-200 border-3 border-green-400 rounded-2xl">
                <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-green-700 mb-1">{t('correctAnswers')}</p>
                <p className="text-4xl font-semibold text-green-900">{roundResultData.correct}</p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-red-100 to-red-200 border-3 border-red-400 rounded-2xl">
                <XCircle className="w-10 h-10 text-red-600 mx-auto mb-2" />
                <p className="text-sm text-red-700 mb-1">{t('incorrectAnswers')}</p>
                <p className="text-4xl font-semibold text-red-900">{roundResultData.incorrect}</p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-orange-100 to-orange-200 border-3 border-orange-400 rounded-2xl">
                <AlertCircle className="w-10 h-10 text-orange-600 mx-auto mb-2" />
                <p className="text-sm text-orange-700 mb-1">{t('missedAnswers')}</p>
                <p className="text-4xl font-semibold text-orange-900">{roundResultData.missed}</p>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-pink-200 to-pink-300 border-2 border-pink-400 rounded-2xl mt-4">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Clock className="w-6 h-6 text-pink-700" />
                  <span className="text-xl font-semibold text-pink-900">{t('time')}: {roundResultData.time}s</span>
                </div>
                <div className="text-xl font-semibold text-pink-900">
                  {t('totalOf')}: {roundResultData.total}
                </div>
              </div>
            </div>

            <Button
              onClick={continueAfterMemoryResult}
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-6 rounded-2xl text-lg shadow-xl mt-6"
            >
              {memoryRound < 4 ? t('nextRound') : t('next')}
            </Button>
          </div>
        </Card>
      )}

      {/* Concentration Show Stage */}
      {stage === 'concentrationShow' && (
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-300 rounded-3xl shadow-2xl">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg text-blue-900">{t('round')} {concentrationRound + 1}/5</span>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-semibold text-blue-900">{concentrationShowTime}s</span>
              </div>
            </div>

            <div className="text-5xl mb-4">👀</div>
            <h3 className="text-2xl text-blue-900">{t('memorizeTheseItems')}</h3>
            <Progress value={(concentrationShowTime / 4) * 100} className="h-3" />

            <div className="flex justify-center gap-6 mt-6">
              {targetItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="p-8 bg-gradient-to-br from-white to-blue-50 border-4 border-blue-400 rounded-3xl shadow-xl"
                >
                  <span className="text-6xl">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Concentration Test Stage */}
      {stage === 'concentrationTest' && (
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-300 rounded-3xl shadow-2xl">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg text-blue-900">{t('round')} {concentrationRound + 1}/5</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-xl font-semibold text-blue-900">{concentrationTestTime}s</span>
                </div>
                <span className="text-lg text-blue-900">{selectedItems.size} {t('selected')}</span>
              </div>
            </div>

            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl text-blue-900">{t('findAllItems')}</h3>

            <div className={`grid ${gridCols} gap-2 mt-6 max-w-4xl mx-auto`}>
              {concentrationGrid.map((item, index) => {
                const isSelected = selectedItems.has(index);
                const isTarget = targetItems.includes(item);
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleConcentrationClick(item, index)}
                    className={`aspect-square p-2 rounded-xl border-3 shadow-md transition-all ${
                      isSelected && isTarget
                        ? 'bg-gradient-to-br from-green-300 to-green-400 border-green-600'
                        : isSelected
                        ? 'bg-gradient-to-br from-red-300 to-red-400 border-red-600'
                        : 'bg-white border-blue-300 hover:border-blue-500'
                    }`}
                  >
                    <span className="text-2xl md:text-3xl">{item}</span>
                  </motion.button>
                );
              })}
            </div>

            <Button
              onClick={submitConcentrationTest}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-6 rounded-2xl text-lg shadow-xl"
            >
              <CheckCircle className="w-6 h-6 mr-2" />
              {t('next')}
            </Button>
          </div>
        </Card>
      )}

      {/* Concentration Round Result */}
      {stage === 'concentrationRoundResult' && (
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-300 rounded-3xl shadow-2xl">
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-3xl text-blue-900">{t('round')} {concentrationRound + 1} - {t('statsLabel')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-6 bg-gradient-to-br from-green-100 to-green-200 border-3 border-green-400 rounded-2xl">
                <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-green-700 mb-1">{t('correctAnswers')}</p>
                <p className="text-4xl font-semibold text-green-900">{roundResultData.correct}</p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-red-100 to-red-200 border-3 border-red-400 rounded-2xl">
                <XCircle className="w-10 h-10 text-red-600 mx-auto mb-2" />
                <p className="text-sm text-red-700 mb-1">{t('incorrectAnswers')}</p>
                <p className="text-4xl font-semibold text-red-900">{roundResultData.incorrect}</p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-orange-100 to-orange-200 border-3 border-orange-400 rounded-2xl">
                <AlertCircle className="w-10 h-10 text-orange-600 mx-auto mb-2" />
                <p className="text-sm text-orange-700 mb-1">{t('missedAnswers')}</p>
                <p className="text-4xl font-semibold text-orange-900">{roundResultData.missed}</p>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-200 to-blue-300 border-2 border-blue-400 rounded-2xl mt-4">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-700" />
                  <span className="text-xl font-semibold text-blue-900">{t('time')}: {roundResultData.time}s</span>
                </div>
                <div className="text-xl font-semibold text-blue-900">
                  {t('totalOf')}: {roundResultData.total}
                </div>
              </div>
            </div>

            <Button
              onClick={continueAfterConcentrationResult}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-6 rounded-2xl text-lg shadow-xl mt-6"
            >
              {concentrationRound < 4 ? t('nextRound') : t('next')}
            </Button>
          </div>
        </Card>
      )}

      {/* Reading Intro */}
      {stage === 'readingIntro' && (
        <Card className="p-8 bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-300 rounded-3xl shadow-2xl">
          <div className="text-center space-y-6">
            <div className="text-6xl">📖</div>
            <h3 className="text-3xl text-green-900">{t('readingTest')}</h3>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              {ageGroup === '4-7' 
                ? t('readingTestYoungDescription')
                : t('readingTestOlderDescription')}
            </p>

            <Button
              onClick={startReadingTests}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-6 rounded-2xl text-lg shadow-xl"
            >
              <Play className="w-6 h-6 mr-2" />
              {t('startReading')}
            </Button>
          </div>
        </Card>
      )}

      {/* Reading Countdown (for 4-7) */}
      {stage === 'readingCountdown' && (
        <Card className="p-8 bg-gradient-to-br from-yellow-50 to-yellow-100 border-4 border-yellow-300 rounded-3xl shadow-2xl">
          <div className="text-center space-y-6">
            <div className="text-8xl animate-bounce">{countdownTime}</div>
            <h3 className="text-3xl text-yellow-900">{t('getReady')}...</h3>
          </div>
        </Card>
      )}

      {/* Reading Stage */}
      {stage === 'reading' && (
        <Card className={`p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl shadow-2xl transition-all duration-500 ${
          timeExpired ? 'border-8 border-red-500 animate-pulse' : 'border-4 border-green-300'
        }`}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-lg text-green-900">
                {ageGroup === '4-7' ? `${t('text')} ${readingRound + 1}/3` : t('readingTest')}
              </span>
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${timeExpired ? 'text-red-600' : 'text-green-600'}`} />
                <span className={`text-2xl font-semibold ${timeExpired ? 'text-red-900' : 'text-green-900'}`}>
                  {readingTimeLeft}s
                </span>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl text-green-900 mb-4">{readingText.title}</h3>
              <Progress 
                value={(readingTimeLeft / (ageGroup === '4-7' ? 90 : 60)) * 100} 
                className="h-3 mb-4" 
              />
              {timeExpired && (
                <div className="flex items-center justify-center gap-2 text-red-700 bg-red-100 px-4 py-2 rounded-xl border-2 border-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span>{t('timeIsUpClickWord')}</span>
                </div>
              )}
            </div>

            <div className="p-6 bg-white rounded-2xl border-2 border-green-200 max-h-96 overflow-y-auto">
              <p className="text-lg leading-relaxed text-gray-800">
                {wordsArray.map((word, index) => (
                  <span
                    key={index}
                    className={`cursor-pointer hover:bg-yellow-100 transition-colors ${
                      index <= selectedWordIndex ? 'bg-green-200' : ''
                    }`}
                    onClick={() => setSelectedWordIndex(index)}
                  >
                    {word}{' '}
                  </span>
                ))}
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              {ageGroup === '4-7' && !timeExpired && (
                <Button
                  onClick={() => setSelectedWordIndex(Math.min(selectedWordIndex + 1, totalWords - 1))}
                  disabled={!readingActive}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl disabled:opacity-50"
                >
                  {t('nextWord')}
                </Button>
              )}
              <Button
                onClick={finishReadingRound}
                disabled={!timeExpired && selectedWordIndex === 0}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl shadow-xl disabled:opacity-50"
              >
                {t('finish')}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Reading Questions (for 8+) */}
      {stage === 'readingQuestions' && (
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-4 border-purple-300 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-lg text-purple-900">{t('question')} {currentQuestionIndex + 1}/4</span>
              <span className="text-lg text-purple-900">📝 {t('comprehensionTest')}</span>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">❓</div>
              <h3 className="text-2xl text-purple-900 mb-6">
                {READING_TEXTS_LONG[language as keyof typeof READING_TEXTS_LONG].questions[currentQuestionIndex].question}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {READING_TEXTS_LONG[language as keyof typeof READING_TEXTS_LONG].questions[currentQuestionIndex].options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAnswerQuestion(index)}
                  className="p-6 bg-white border-3 border-purple-300 rounded-2xl shadow-lg hover:border-purple-500 transition-all text-left"
                >
                  <span className="text-lg text-purple-900">{option}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Results Stage */}
      {stage === 'results' && (
        <Card className="p-8 bg-gradient-to-br from-yellow-50 to-yellow-100 border-4 border-yellow-300 rounded-3xl shadow-2xl">
          <div className="text-center space-y-6">
            <div className="text-7xl">🏆</div>
            <h3 className="text-4xl text-yellow-900">{t('diagnosticComplete')}!</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="p-6 bg-gradient-to-br from-pink-100 to-pink-200 border-3 border-pink-400 rounded-2xl shadow-xl">
                <Brain className="w-8 h-8 text-pink-600 mx-auto mb-3" />
                <p className="text-sm text-pink-700 mb-2">{t('memory')}</p>
                <p className="text-3xl font-semibold text-pink-900">{finalMemoryScore}%</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-200 border-3 border-blue-400 rounded-2xl shadow-xl">
                <Eye className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <p className="text-sm text-blue-700 mb-2">{t('concentration')}</p>
                <p className="text-3xl font-semibold text-blue-900">{finalConcentrationScore}%</p>
                {finalConcentrationTime > 0 && (
                  <p className="text-sm text-blue-700 mt-2">{finalConcentrationTime}s {t('average')}</p>
                )}
              </div>

              <div className="p-6 bg-gradient-to-br from-green-100 to-green-200 border-3 border-green-400 rounded-2xl shadow-xl">
                <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <p className="text-sm text-green-700 mb-2">{t('readingSpeed')}</p>
                <p className="text-3xl font-semibold text-green-900">
                  {ageGroup === '4-7' ? avgReadingWords : readingResults[0] || 0} {t('wordsRead')}
                </p>
              </div>

              {ageGroup === '8+' && questionsAnswers.length > 0 && (
                <div className="p-6 bg-gradient-to-br from-purple-100 to-purple-200 border-3 border-purple-400 rounded-2xl shadow-xl">
                  <Target className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <p className="text-sm text-purple-700 mb-2">{t('comprehension')}</p>
                  <p className="text-3xl font-semibold text-purple-900">
                    {Math.round((questionsAnswers.filter((ans, idx) => ans === READING_TEXTS_LONG[language as keyof typeof READING_TEXTS_LONG].questions[idx].correct).length / questionsAnswers.length) * 100)}%
                  </p>
                </div>
              )}
            </div>

            <Button
              onClick={reset}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8 py-6 rounded-2xl text-lg shadow-xl mt-6"
            >
              {t('startNewDiagnostic')}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
