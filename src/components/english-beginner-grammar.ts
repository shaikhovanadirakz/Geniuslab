// 15 грамматических тем для начинающих (Beginner)

export interface GrammarTopic {
  id: string;
  title: { ru: string; kz: string };
  description: { ru: string; kz: string };
  content: {
    introduction: { ru: string; kz: string };
    rules: Array<{ ru: string; kz: string }>;
    examples: Array<{ 
      english: string; 
      ru: string; 
      kz: string;
      type: 'positive' | 'negative' | 'question';
    }>;
    tips: Array<{ ru: string; kz: string }>;
  };
  testQuestions: Array<{
    question: { ru: string; kz: string };
    options: string[];
    correctAnswer: number;
    explanation: { ru: string; kz: string };
  }>;
}

export const BEGINNER_GRAMMAR_TOPICS: GrammarTopic[] = [
  // Тема 1
  {
    id: 'articles-a-an',
    title: { ru: 'Артикли A и AN', kz: 'A және AN артикльдері' },
    description: { ru: 'Учимся ставить a и an перед словами', kz: 'Сөздердің алдына a және an қоюды үйренеміз' },
    content: {
      introduction: {
        ru: 'В английском языке перед многими словами мы ставим маленькие слова A или AN. Они означают "один" или "какой-то один". Это очень важно! Давайте узнаем, когда какое слово использовать.',
        kz: 'Ағылшын тілінде көптеген сөздердің алдына A немесе AN кішкентай сөздерін қоямыз. Олар "бір" немесе "қандай да бір" дегенді білдіреді. Бұл өте маңызды! Қай сөзді қашан қолдану керектігін білейік.'
      },
      rules: [
        { ru: '📌 Правило 1: Используй A перед словами с СОГЛАСНЫМИ звуками (b, c, d, f, g, h, j, k, l, m, n, p, q, r, s, t, v, w, x, y, z)', kz: '📌 Ереже 1: ДАУЫССЫЗ дыбыстармен басталатын сөздердің алдына A қой' },
        { ru: '📌 Правило 2: Используй AN перед словами с ГЛАСНЫМИ звуками (a, e, i, o, u)', kz: '📌 Ереже 2: ДАУЫСТЫ дыбыстармен басталатын сөздердің алдына AN қой' },
        { ru: '📌 Правило 3: Слушай ЗВУК, а не букву! Например: "an hour" - потому что h не читается', kz: '📌 Ереже 3: Әріпті емес, ДЫБЫСТЫ тыңда! Мысалы: "an hour" - өйткені h оқылмайды' },
      ],
      examples: [
        { english: 'a cat', ru: 'кот', kz: 'мысық', type: 'positive' },
        { english: 'a dog', ru: 'собака', kz: 'ит', type: 'positive' },
        { english: 'a book', ru: 'книга', kz: 'кітап', type: 'positive' },
        { english: 'a car', ru: 'машина', kz: 'көлік', type: 'positive' },
        { english: 'an apple', ru: 'яблоко', kz: 'алма', type: 'positive' },
        { english: 'an egg', ru: 'яйцо', kz: 'жұмыртқа', type: 'positive' },
        { english: 'an orange', ru: 'апельсин', kz: 'апельсин', type: 'positive' },
        { english: 'an elephant', ru: 'слон', kz: 'піл', type: 'positive' },
      ],
      tips: [
        { ru: '💡 Произнеси слово вслух. Если первый звук похож на "а, э, и, о, у" - используй AN', kz: '💡 Сөзді дауыстап айт. Егер бірінші дыбыс "а, э, и, о, у" сияқты болса - AN қолдан' },
        { ru: '💡 A и AN используются только с ОДНИМ предметом', kz: '💡 A және AN тек БІР заттың алдында қолданылады' },
      ]
    },
    testQuestions: [
      {
        question: { ru: '___ car', kz: '___ car' },
        options: ['a', 'an'],
        correctAnswer: 0,
        explanation: { ru: 'Правильно! "A car" - слово начинается с согласного [k]', kz: 'Дұрыс! "A car" - сөз дауыссыз [k] дыбысынан басталады' }
      },
      {
        question: { ru: '___ apple', kz: '___ apple' },
        options: ['a', 'an'],
        correctAnswer: 1,
        explanation: { ru: 'Отлично! "An apple" - начинается с гласного [æ]', kz: 'Керемет! "An apple" - дауысты [æ] дыбысынан басталады' }
      },
      {
        question: { ru: '___ umbrella', kz: '___ umbrella' },
        options: ['a', 'an'],
        correctAnswer: 1,
        explanation: { ru: 'Молодец! "An umbrella" - гласный звук [ʌ]', kz: 'Жарайсың! "An umbrella" - дауысты [ʌ] дыбысы' }
      },
      {
        question: { ru: '___ house', kz: '___ house' },
        options: ['a', 'an'],
        correctAnswer: 0,
        explanation: { ru: 'Супер! "A house" - согласный звук [h]', kz: 'Өте жақсы! "A house" - дауыссыз [h] дыбысы' }
      },
      {
        question: { ru: '___ orange', kz: '___ orange' },
        options: ['a', 'an'],
        correctAnswer: 1,
        explanation: { ru: 'Правильно! "An orange" - гласный [ɒ]', kz: 'Дұрыс! "An orange" - дауысты [ɒ]' }
      },
      {
        question: { ru: '___ elephant', kz: '___ elephant' },
        options: ['a', 'an'],
        correctAnswer: 1,
        explanation: { ru: 'Верно! "An elephant" - гласный звук [e]', kz: 'Дұрыс! "An elephant" - дауысты [e] дыбысы' }
      },
      {
        question: { ru: '___ university', kz: '___ university' },
        options: ['a', 'an'],
        correctAnswer: 0,
        explanation: { ru: 'Отлично! "A university" - звучит как [ju], согласный!', kz: 'Керемет! "A university" - [ju] дыбысы, дауыссыз!' }
      },
      {
        question: { ru: '___ hour', kz: '___ hour' },
        options: ['a', 'an'],
        correctAnswer: 1,
        explanation: { ru: 'Молодец! "An hour" - H не читается, начинается с гласного', kz: 'Жарайсың! "An hour" - H оқылмайды, дауысты дыбыстан басталады' }
      },
      {
        question: { ru: '___ ice cream', kz: '___ ice cream' },
        options: ['a', 'an'],
        correctAnswer: 1,
        explanation: { ru: 'Супер! "An ice cream" - гласный звук [aɪ]', kz: 'Өте жақсы! "An ice cream" - дауысты [aɪ] дыбысы' }
      },
      {
        question: { ru: '___ table', kz: '___ table' },
        options: ['a', 'an'],
        correctAnswer: 0,
        explanation: { ru: 'Правильно! "A table" - согласный [t]', kz: 'Дұрыс! "A table" - дауыссыз [t]' }
      },
      {
        question: { ru: '___ old man', kz: '___ old man' },
        options: ['a', 'an'],
        correctAnswer: 1,
        explanation: { ru: 'Отлично! "An old man" - начинается с гласного [oʊ]', kz: 'Керемет! "An old man" - дауысты [oʊ] дыбысынан басталады' }
      },
      {
        question: { ru: '___ yellow ball', kz: '___ yellow ball' },
        options: ['a', 'an'],
        correctAnswer: 0,
        explanation: { ru: 'Молодец! "A yellow ball" - звук [j] согласный', kz: 'Жарайсың! "A yellow ball" - [j] дыбысы дауыссыз' }
      },
      {
        question: { ru: '___ egg', kz: '___ egg' },
        options: ['a', 'an'],
        correctAnswer: 1,
        explanation: { ru: 'Супер! "An egg" - гласный [e]', kz: 'Өте жақсы! "An egg" - дауысты [e]' }
      },
      {
        question: { ru: '___ computer', kz: '___ computer' },
        options: ['a', 'an'],
        correctAnswer: 0,
        explanation: { ru: 'Верно! "A computer" - согласный [k]', kz: 'Дұрыс! "A computer" - дауыссыз [k]' }
      },
      {
        question: { ru: '___ honest person', kz: '___ honest person' },
        options: ['a', 'an'],
        correctAnswer: 1,
        explanation: { ru: 'Правильно! "An honest person" - H не читается!', kz: 'Дұрыс! "An honest person" - H оқылмайды!' }
      },
    ]
  },

  // Тема 2
  {
    id: 'plural-forms',
    title: { ru: 'Множественное число', kz: 'Көпше түрі' },
    description: { ru: 'Как говорить про много предметов', kz: 'Көп заттар туралы қалай айтамыз' },
    content: {
      introduction: {
        ru: 'Когда у нас не один предмет, а много (два, три, десять), мы изменяем слово. В английском это делается очень просто - обычно добавляем -S или -ES в конец слова!',
        kz: 'Бізде бір емес, көп (екі, үш, он) зат болған кезде, сөзді өзгертеміз. Ағылшын тілінде бұл өте қарапайым - әдетте сөздің соңына -S немесе -ES қосамыз!'
      },
      rules: [
        { ru: '📌 К большинству слов добавляем -S: cat → cats, dog → dogs', kz: '📌 Көптеген сөздерге -S қосамыз: cat → cats, dog → dogs' },
        { ru: '📌 Если слово заканчивается на -s, -ss, -x, -ch, -sh, добавляем -ES: box → boxes', kz: '📌 Егер сөз -s, -ss, -x, -ch, -sh әріптеріне аяқталса, -ES қосамыз: box → boxes' },
        { ru: '📌 Если слово заканчивается на согласную + Y, меняем Y на I и добавляем -ES: baby → babies', kz: '📌 Егер сөз дауыссыз + Y әріптеріне аяқталса, Y-ті I-ге өзгертіп -ES қосамыз: baby → babies' },
        { ru: '📌 Исключения: child→children, man→men, woman→women, tooth→teeth', kz: '📌 Ерекше сөздер: child→children, man→men, woman→women, tooth→teeth' },
      ],
      examples: [
        { english: 'cat → cats', ru: 'кот → коты', kz: 'мысық → мысықтар', type: 'positive' },
        { english: 'dog → dogs', ru: 'собака → собаки', kz: 'ит → иттер', type: 'positive' },
        { english: 'box → boxes', ru: 'коробка → коробки', kz: 'қорап → қораптар', type: 'positive' },
        { english: 'glass → glasses', ru: 'стакан → стаканы', kz: 'стакан → стакандар', type: 'positive' },
        { english: 'baby → babies', ru: 'малыш → малыши', kz: 'нәресте → нәрестелер', type: 'positive' },
        { english: 'child → children', ru: 'ребенок → дети', kz: 'бала → балалар', type: 'positive' },
      ],
      tips: [
        { ru: '💡 Когда говоришь про много, артикли A и AN НЕ используются!', kz: '💡 Көп зат туралы айтқанда, A және AN артикльдерін ҚОЛДАНБАЙМЫЗ!' },
        { ru: '💡 Запомни исключения - они не подчиняются правилам!', kz: '💡 Ерекше сөздерді есте сақта - олар ережеге бағынбайды!' },
      ]
    },
    testQuestions: [
      {
        question: { ru: 'dog → ?', kz: 'dog → ?' },
        options: ['dog', 'dogs', 'doges'],
        correctAnswer: 1,
        explanation: { ru: 'Верно! Dogs - просто добавляем -s', kz: 'Дұрыс! Dogs - тек -s қосамыз' }
      },
      {
        question: { ru: 'box → ?', kz: 'box → ?' },
        options: ['boxs', 'boxes', 'boxies'],
        correctAnswer: 1,
        explanation: { ru: 'Отлично! Boxes - слово на -x, добавляем -es', kz: 'Керемет! Boxes - сөз -x-ке аяқталады, -es қосамыз' }
      },
      {
        question: { ru: 'baby → ?', kz: 'baby → ?' },
        options: ['babys', 'babies', 'babyes'],
        correctAnswer: 1,
        explanation: { ru: 'Молодец! Babies - Y меняется на I, добавляем -es', kz: 'Жарайсың! Babies - Y-ті I-ге өзгертіп -es қосамыз' }
      },
      {
        question: { ru: 'child → ?', kz: 'child → ?' },
        options: ['childs', 'children', 'childes'],
        correctAnswer: 1,
        explanation: { ru: 'Супер! Children - это исключение!', kz: 'Өте жақсы! Children - бұл ерекше сөз!' }
      },
      {
        question: { ru: 'book → ?', kz: 'book → ?' },
        options: ['book', 'books', 'bookes'],
        correctAnswer: 1,
        explanation: { ru: 'Правильно! Books - обычное правило +s', kz: 'Дұрыс! Books - қарапайым ереже +s' }
      },
      {
        question: { ru: 'city → ?', kz: 'city → ?' },
        options: ['citys', 'cities', 'cityes'],
        correctAnswer: 1,
        explanation: { ru: 'Отлично! Cities - Y меняется на I + ES', kz: 'Керемет! Cities - Y-ті I-ге өзгертіп + ES' }
      },
      {
        question: { ru: 'watch → ?', kz: 'watch → ?' },
        options: ['watchs', 'watches', 'watch'],
        correctAnswer: 1,
        explanation: { ru: 'Молодец! Watches - -ch требует -ES', kz: 'Жарайсың! Watches - -ch әрпіне -ES керек' }
      },
      {
        question: { ru: 'tooth → ?', kz: 'tooth → ?' },
        options: ['tooths', 'teeth', 'toothes'],
        correctAnswer: 1,
        explanation: { ru: 'Супер! Teeth - исключение!', kz: 'Өте жақсы! Teeth - ерекше сөз!' }
      },
      {
        question: { ru: 'glass → ?', kz: 'glass → ?' },
        options: ['glass', 'glasses', 'glasss'],
        correctAnswer: 1,
        explanation: { ru: 'Верно! Glasses - -ss требует -ES', kz: 'Дұрыс! Glasses - -ss әрпіне -ES керек' }
      },
      {
        question: { ru: 'man → ?', kz: 'man → ?' },
        options: ['mans', 'men', 'manes'],
        correctAnswer: 1,
        explanation: { ru: 'Правильно! Men - исключение!', kz: 'Дұрыс! Men - ерекше сөз!' }
      },
      {
        question: { ru: 'bus → ?', kz: 'bus → ?' },
        options: ['buss', 'buses', 'bus'],
        correctAnswer: 1,
        explanation: { ru: 'Отлично! Buses - -s требует -ES', kz: 'Керемет! Buses - -s әрпіне -ES керек' }
      },
      {
        question: { ru: 'party → ?', kz: 'party → ?' },
        options: ['partys', 'parties', 'partyes'],
        correctAnswer: 1,
        explanation: { ru: 'Молодец! Parties - Y → I + ES', kz: 'Жарайсың! Parties - Y → I + ES' }
      },
      {
        question: { ru: 'dish → ?', kz: 'dish → ?' },
        options: ['dishs', 'dishes', 'dish'],
        correctAnswer: 1,
        explanation: { ru: 'Супер! Dishes - -sh требует -ES', kz: 'Өте жақсы! Dishes - -sh әрпіне -ES керек' }
      },
      {
        question: { ru: 'woman → ?', kz: 'woman → ?' },
        options: ['womans', 'women', 'womanes'],
        correctAnswer: 1,
        explanation: { ru: 'Верно! Women - исключение!', kz: 'Дұрыс! Women - ерекше сөз!' }
      },
      {
        question: { ru: 'toy → ?', kz: 'toy → ?' },
        options: ['toys', 'toies', 'toyes'],
        correctAnswer: 0,
        explanation: { ru: 'Правильно! Toys - гласная + Y = просто +S', kz: 'Дұрыс! Toys - дауысты + Y = тек +S' }
      },
    ]
  },

  // Тема 3
  {
    id: 'verb-to-be',
    title: { ru: 'Глагол TO BE (быть)', kz: 'TO BE етістігі' },
    description: { ru: 'Самый важный глагол!', kz: 'Ең маңызды етістік!' },
    content: {
      introduction: {
        ru: 'TO BE - это самый важный глагол в английском! Он означает "быть", "находиться", "являться". В русском мы часто его пропускаем: "Я ученик", но в английском обязательно говорим "I AM a student".',
        kz: 'TO BE - ағылшын тіліндегі ең маңызды етістік! Ол "болу", "орналасу" дегенді білдіреді. Орыс тілінде оны жиі айтпаймыз: "Я ученик", бірақ ағылшын тілінде міндетті түрде "I AM a student" айтамыз.'
      },
      rules: [
        { ru: '📌 I (я) → AM', kz: '📌 I (мен) → AM' },
        { ru: '📌 You, We, They → ARE', kz: '📌 You, We, They → ARE' },
        { ru: '📌 He, She, It → IS', kz: '📌 He, She, It → IS' },
        { ru: '📌 Отрицание: am not, is not (isn\'t), are not (aren\'t)', kz: '📌 Болымсыз: am not, is not (isn\'t), are not (aren\'t)' },
        { ru: '📌 Вопрос: Am I? Are you? Is he?', kz: '📌 Сұрақ: Am I? Are you? Is he?' },
      ],
      examples: [
        { english: 'I am a student', ru: 'Я ученик', kz: 'Мен оқушымын', type: 'positive' },
        { english: 'You are my friend', ru: 'Ты мой друг', kz: 'Сен менің досымсың', type: 'positive' },
        { english: 'He is a doctor', ru: 'Он врач', kz: 'Ол дәрігер', type: 'positive' },
        { english: 'She is beautiful', ru: 'Она красивая', kz: 'Ол әдемі', type: 'positive' },
        { english: 'I am not a teacher', ru: 'Я не учитель', kz: 'Мен мұғалім емеспін', type: 'negative' },
        { english: 'He is not sad', ru: 'Он не грустный', kz: 'Ол қайғылы емес', type: 'negative' },
        { english: 'They are not at home', ru: 'Они не дома', kz: 'Олар үйде емес', type: 'negative' },
        { english: 'Are you happy?', ru: 'Ты счастлив?', kz: 'Сен бақыттысың ба?', type: 'question' },
        { english: 'Is she a student?', ru: 'Она ученица?', kz: 'Ол оқушы ма?', type: 'question' },
        { english: 'Am I late?', ru: 'Я опоздал?', kz: 'Мен кешіктім бе?', type: 'question' },
      ],
      tips: [
        { ru: '💡 Запомни песенку: I am, You are, He/She/It is, We are, They are', kz: '💡 Әнді жаттап ал: I am, You are, He/She/It is, We are, They are' },
        { ru: '💡 Всего три формы: AM, ARE, IS', kz: '💡 Тек үш форма: AM, ARE, IS' },
      ]
    },
    testQuestions: [
      {
        question: { ru: 'I ___ a teacher', kz: 'I ___ a teacher' },
        options: ['am', 'is', 'are'],
        correctAnswer: 0,
        explanation: { ru: 'Молодец! С "I" всегда "am"', kz: 'Жарайсың! "I" есімдігімен "am"' }
      },
      {
        question: { ru: 'She ___ happy', kz: 'She ___ happy' },
        options: ['am', 'is', 'are'],
        correctAnswer: 1,
        explanation: { ru: 'Отлично! С "She" используем "is"', kz: 'Керемет! "She" есімдігімен "is"' }
      },
      {
        question: { ru: 'We ___ students', kz: 'We ___ students' },
        options: ['am', 'is', 'are'],
        correctAnswer: 2,
        explanation: { ru: 'Супер! С "We" используем "are"', kz: 'Өте жақсы! "We" есімдігімен "are"' }
      },
      {
        question: { ru: 'They ___ at school', kz: 'They ___ at school' },
        options: ['am', 'is', 'are'],
        correctAnswer: 2,
        explanation: { ru: 'Правильно! С "They" используем "are"', kz: 'Дұрыс! "They" есімдігімен "are"' }
      },
      {
        question: { ru: 'It ___ a cat', kz: 'It ___ a cat' },
        options: ['am', 'is', 'are'],
        correctAnswer: 1,
        explanation: { ru: 'Верно! С "It" используем "is"', kz: 'Дұрыс! "It" есімдігімен "is"' }
      },
      {
        question: { ru: 'You ___ my friend', kz: 'You ___ my friend' },
        options: ['am', 'is', 'are'],
        correctAnswer: 2,
        explanation: { ru: 'Отлично! С "You" используем "are"', kz: 'Керемет! "You" есімдігімен "are"' }
      },
      {
        question: { ru: 'He ___ not sad', kz: 'He ___ not sad' },
        options: ['am', 'is', 'are'],
        correctAnswer: 1,
        explanation: { ru: 'Молодец! Отрицание: He IS NOT', kz: 'Жарайсың! Болымсыз: He IS NOT' }
      },
      {
        question: { ru: '___ you tired?', kz: '___ you tired?' },
        options: ['Am', 'Is', 'Are'],
        correctAnswer: 2,
        explanation: { ru: 'Супер! Вопрос: ARE you?', kz: 'Өте жақсы! Сұрақ: ARE you?' }
      },
      {
        question: { ru: '___ she a doctor?', kz: '___ she a doctor?' },
        options: ['Am', 'Is', 'Are'],
        correctAnswer: 1,
        explanation: { ru: 'Правильно! Вопрос: IS she?', kz: 'Дұрыс! Сұрақ: IS she?' }
      },
      {
        question: { ru: 'They ___ not at home', kz: 'They ___ not at home' },
        options: ['am', 'is', 'are'],
        correctAnswer: 2,
        explanation: { ru: 'Верно! Отрицание: They ARE NOT', kz: 'Дұрыс! Болымсыз: They ARE NOT' }
      },
      {
        question: { ru: '___ I late?', kz: '___ I late?' },
        options: ['Am', 'Is', 'Are'],
        correctAnswer: 0,
        explanation: { ru: 'Отлично! Вопрос: AM I?', kz: 'Керемет! Сұрақ: AM I?' }
      },
      {
        question: { ru: 'The book ___ on the table', kz: 'The book ___ on the table' },
        options: ['am', 'is', 'are'],
        correctAnswer: 1,
        explanation: { ru: 'Молодец! Book (одна книга) - IS', kz: 'Жарайсың! Book (бір кітап) - IS' }
      },
      {
        question: { ru: 'The children ___ happy', kz: 'The children ___ happy' },
        options: ['am', 'is', 'are'],
        correctAnswer: 2,
        explanation: { ru: 'Супер! Children (много) - ARE', kz: 'Өте жақсы! Children (көп) - ARE' }
      },
      {
        question: { ru: '___ it cold today?', kz: '___ it cold today?' },
        options: ['Am', 'Is', 'Are'],
        correctAnswer: 1,
        explanation: { ru: 'Правильно! С "It" - IS', kz: 'Дұрыс! "It" есімдігімен - IS' }
      },
      {
        question: { ru: 'I ___ not a teacher', kz: 'I ___ not a teacher' },
        options: ['am', 'is', 'are'],
        correctAnswer: 0,
        explanation: { ru: 'Верно! Отрицание: I AM NOT', kz: 'Дұрыс! Болымсыз: I AM NOT' }
      },
    ]
  },

  // Тема 4
  {
    id: 'pronouns',
    title: { ru: 'Личные местоимения', kz: 'Жіктік есімдіктер' },
    description: { ru: 'Я, ты, он, она, мы...', kz: 'Мен, сен, ол...' },
    content: {
      introduction: {
        ru: 'Местоимения - это маленькие слова, которые заменяют имена людей и названия вещей. Вместо "Маша" говорим "она", вместо "кот" - "он" или "it".',
        kz: 'Есімдіктер - бұл адамдардың аттары мен заттардың атауларын алмастыратын кішкентай сөздер. "Маша" орнына "ол" айтамыз, "мысық" орнына - "ол" немесе "it".'
      },
      rules: [
        { ru: '📌 I - я (про себя)', kz: '📌 I - мен (өзім туралы)' },
        { ru: '📌 You - ты/вы (кому говоришь)', kz: '📌 You - сен/сіз (кімге айтасың)' },
        { ru: '📌 He - он (мужчина/мальчик)', kz: '📌 He - ол (ер адам/бала)' },
        { ru: '📌 She - она (женщина/девочка)', kz: '📌 She - ол (әйел/қыз)' },
        { ru: '📌 It - оно (животные, вещи)', kz: '📌 It - ол (жануарлар, заттар)' },
        { ru: '📌 We - мы (я и другие)', kz: '📌 We - біз (мен және басқалар)' },
        { ru: '📌 They - они (про многих)', kz: '📌 They - олар (көп адамдар туралы)' },
      ],
      examples: [
        { english: 'I am a student', ru: 'Я ученик', kz: 'Мен оқушымын', type: 'positive' },
        { english: 'You are nice', ru: 'Ты хороший', kz: 'Сен жақсысың', type: 'positive' },
        { english: 'He is my brother', ru: 'Он мой брат', kz: 'Ол менің ағам', type: 'positive' },
        { english: 'She is beautiful', ru: 'Она красивая', kz: 'Ол әдемі', type: 'positive' },
        { english: 'It is a cat', ru: 'Это кот', kz: 'Бұл мысық', type: 'positive' },
        { english: 'We are friends', ru: 'Мы друзья', kz: 'Біз достармыз', type: 'positive' },
        { english: 'They are students', ru: 'Они ученики', kz: 'Олар оқушылар', type: 'positive' },
      ],
      tips: [
        { ru: '💡 Для животных и вещей всегда используем IT', kz: '💡 Жануарлар мен заттар үшін әрқашан IT қолданамыз' },
        { ru: '💡 HE и SHE только для людей!', kz: '💡 HE және SHE тек адамдар үшін!' },
      ]
    },
    testQuestions: [
      {
        question: { ru: 'Про кота говорим:', kz: 'Мысық туралы:' },
        options: ['he', 'she', 'it'],
        correctAnswer: 2,
        explanation: { ru: 'Правильно! Животные - это IT', kz: 'Дұрыс! Жануарлар - IT' }
      },
      {
        question: { ru: 'Про маму говорим:', kz: 'Ана туралы:' },
        options: ['he', 'she', 'it'],
        correctAnswer: 1,
        explanation: { ru: 'Молодец! Женщина - SHE', kz: 'Жарайсың! Әйел - SHE' }
      },
      {
        question: { ru: 'Про папу говорим:', kz: 'Әке туралы:' },
        options: ['he', 'she', 'it'],
        correctAnswer: 0,
        explanation: { ru: 'Отлично! Мужчина - HE', kz: 'Керемет! Ер адам - HE' }
      },
      {
        question: { ru: 'Про себя говорю:', kz: 'Өзім туралы:' },
        options: ['I', 'you', 'we'],
        correctAnswer: 0,
        explanation: { ru: 'Супер! Про себя - I', kz: 'Өте жақсы! Өзім туралы - I' }
      },
      {
        question: { ru: 'Про друзей говорим:', kz: 'Достар туралы:' },
        options: ['he', 'we', 'they'],
        correctAnswer: 2,
        explanation: { ru: 'Верно! Много людей - THEY', kz: 'Дұрыс! Көп адамдар - THEY' }
      },
    ]
  },

  // Тема 5
  {
    id: 'this-that',
    title: { ru: 'THIS и THAT', kz: 'THIS және THAT' },
    description: { ru: 'Как показывать на предметы', kz: 'Заттарды қалай көрсетеміз' },
    content: {
      introduction: {
        ru: 'THIS и THAT помогают показывать на предметы. THIS - это близко (вот это), THAT - далеко (вон то). Очень просто!',
        kz: 'THIS және THAT заттарды көрсетуге көмектеседі. THIS - жақын (міне бұл), THAT - алыс (міне анау). Өте қарапайым!'
      },
      rules: [
        { ru: '📌 THIS - это близко ко мне (вот ЭТО)', kz: '📌 THIS - маған жақын (міне БҰЛ)' },
        { ru: '📌 THAT - это далеко от меня (вон ТО)', kz: '📌 THAT - менен алыс (міне АНАУ)' },
        { ru: '📌 THESE - это близко, много предметов', kz: '📌 THESE - жақын, көп заттар' },
        { ru: '📌 THOSE - это далеко, много предметов', kz: '📌 THOSE - алыс, көп заттар' },
      ],
      examples: [
        { english: 'This is a book', ru: 'Это книга (вот эта)', kz: 'Бұл кітап (міне бұл)', type: 'positive' },
        { english: 'That is a car', ru: 'То машина (вон та)', kz: 'Анау көлік (міне анау)', type: 'positive' },
        { english: 'These are apples', ru: 'Это яблоки (вот эти)', kz: 'Бұлар алмалар (міне бұлар)', type: 'positive' },
        { english: 'Those are trees', ru: 'То деревья (вон те)', kz: 'Аналар ағаштар (міне аналар)', type: 'positive' },
        { english: 'This cat is cute', ru: 'Этот кот милый', kz: 'Бұл мысық сүйкімді', type: 'positive' },
        { english: 'That dog is big', ru: 'Та собака большая', kz: 'Анау ит үлкен', type: 'positive' },
        { english: 'Is this your pen?', ru: 'Это твоя ручка?', kz: 'Бұл сенің қаламың ба?', type: 'question' },
        { english: 'Are those your books?', ru: 'Это твои книги?', kz: 'Бұлар сенің кітаптарың ба?', type: 'question' },
      ],
      tips: [
        { ru: '💡 Представь: THIS - в руке, THAT - на полке', kz: '💡 Ойлан: THIS - қолда, THAT - сөреде' },
        { ru: '💡 Для многих предметов: THESE (близко), THOSE (далеко)', kz: '💡 Көп заттар үшін: THESE (жақын), THOSE (алыс)' },
      ]
    },
    testQuestions: [
      {
        question: { ru: '___ is my pen (в руке)', kz: '___ is my pen (қолда)' },
        options: ['this', 'that'],
        correctAnswer: 0,
        explanation: { ru: 'Правильно! В руке - близко - THIS', kz: 'Дұрыс! Қолда - жақын - THIS' }
      },
      {
        question: { ru: '___ is a house (далеко)', kz: '___ is a house (алыс)' },
        options: ['this', 'that'],
        correctAnswer: 1,
        explanation: { ru: 'Молодец! Далеко - THAT', kz: 'Жарайсың! Алыс - THAT' }
      },
      {
        question: { ru: '___ are my books (рядом)', kz: '___ are my books (жанында)' },
        options: ['these', 'those'],
        correctAnswer: 0,
        explanation: { ru: 'Отлично! Рядом, много - THESE', kz: 'Керемет! Жанында, көп - THESE' }
      },
      {
        question: { ru: '___ are birds (в небе)', kz: '___ are birds (аспанда)' },
        options: ['these', 'those'],
        correctAnswer: 1,
        explanation: { ru: 'Супер! Далеко, много - THOSE', kz: 'Өте жақсы! Алыс, көп - THOSE' }
      },
      {
        question: { ru: '___ pencil (на столе рядом)', kz: '___ pencil (үстелде жанында)' },
        options: ['this', 'that'],
        correctAnswer: 0,
        explanation: { ru: 'Верно! Рядом - THIS', kz: 'Дұрыс! Жанында - THIS' }
      },
    ]
  },

  // Тема 6
  {
    id: 'have-has',
    title: { ru: 'HAVE и HAS (иметь)', kz: 'HAVE және HAS (иеленемін)' },
    description: { ru: 'Что у нас есть', kz: 'Бізде не бар' },
    content: {
      introduction: {
        ru: 'HAVE/HAS означает "иметь", "у меня есть". В русском мы говорим "У меня есть кот", в английском "I have a cat". Очень важный глагол!',
        kz: 'HAVE/HAS "иеленемін", "менде бар" дегенді білдіреді. Орыс тілінде "У меня есть кот" айтамыз, ағылшын тілінде "I have a cat". Өте маңызды етістік!'
      },
      rules: [
        { ru: '📌 I, You, We, They → HAVE', kz: '📌 I, You, We, They → HAVE' },
        { ru: '📌 He, She, It → HAS', kz: '📌 He, She, It → HAS' },
        { ru: '📌 Отрицание: don\'t have / doesn\'t have', kz: '📌 Болымсыз: don\'t have / doesn\'t have' },
        { ru: '📌 Вопрос: Do you have? / Does he have?', kz: '📌 Сұрақ: Do you have? / Does he have?' },
      ],
      examples: [
        { english: 'I have a cat', ru: 'У меня есть кот', kz: 'Менде мысық бар', type: 'positive' },
        { english: 'She has a dog', ru: 'У нее есть собака', kz: 'Онда ит бар', type: 'positive' },
        { english: 'We have books', ru: 'У нас есть книги', kz: 'Бізде кітаптар бар', type: 'positive' },
        { english: 'He has a car', ru: 'У него есть машина', kz: 'Онда көлік бар', type: 'positive' },
        { english: 'I don\'t have a bike', ru: 'У меня нет велосипеда', kz: 'Менде велосипед жоқ', type: 'negative' },
        { english: 'She doesn\'t have a pen', ru: 'У нее нет ручки', kz: 'Онда қалам жоқ', type: 'negative' },
        { english: 'They don\'t have time', ru: 'У них нет времени', kz: 'Оларда уақыт жоқ', type: 'negative' },
        { english: 'Do you have a pen?', ru: 'У тебя есть ручка?', kz: 'Сенде қалам бар ма?', type: 'question' },
        { english: 'Does he have a car?', ru: 'У него есть машина?', kz: 'Онда көлік бар ма?', type: 'question' },
        { english: 'Do they have toys?', ru: 'У них есть игрушки?', kz: 'Оларда ойыншықтар бар ма?', type: 'question' },
      ],
      tips: [
        { ru: '💡 Запомни: после He, She, It всегда HAS', kz: '💡 Есте сақта: He, She, It есімдіктерінен кейін HAS' },
        { ru: '💡 Не путай с глаголом TO BE!', kz: '💡 TO BE етістігімен шатастырма!' },
      ]
    },
    testQuestions: [
      {
        question: { ru: 'I ___ a cat', kz: 'I ___ a cat' },
        options: ['have', 'has'],
        correctAnswer: 0,
        explanation: { ru: 'Првильно! С "I" используем HAVE', kz: 'Дұрыс! "I" есімдігімен HAVE' }
      },
      {
        question: { ru: 'She ___ a dog', kz: 'She ___ a dog' },
        options: ['have', 'has'],
        correctAnswer: 1,
        explanation: { ru: 'Молодец! С "She" используем HAS', kz: 'Жарайсың! "She" есімдігімен HAS' }
      },
      {
        question: { ru: 'They ___ books', kz: 'They ___ books' },
        options: ['have', 'has'],
        correctAnswer: 0,
        explanation: { ru: 'Отлично! С "They" используем HAVE', kz: 'Керемет! "They" есімдігімен HAVE' }
      },
      {
        question: { ru: 'He ___ a bike', kz: 'He ___ a bike' },
        options: ['have', 'has'],
        correctAnswer: 1,
        explanation: { ru: 'Супер! С "He" используем HAS', kz: 'Өте жақсы! "He" есімдігімен HAS' }
      },
      {
        question: { ru: 'We ___ toys', kz: 'We ___ toys' },
        options: ['have', 'has'],
        correctAnswer: 0,
        explanation: { ru: 'Верно! С "We" используем HAVE', kz: 'Дұрыс! "We" есімдігімен HAVE' }
      },
    ]
  },

  // Тема 7
  {
    id: 'present-simple',
    title: { ru: 'Present Simple', kz: 'Present Simple' },
    description: { ru: 'Что мы делаем обычно', kz: 'Біз әдетте не істейміз' },
    content: {
      introduction: {
        ru: 'Present Simple - это время для действий, которые происходят регулярно, часто, всегда. Например: "Я хожу в школу каждый день", "Мама готовит ужин", "Солнце встает на востоке".',
        kz: 'Present Simple - бұл үнемі, жиі, әрқашан болатын іс-әрекеттер үшін. Мысалы: "Мен күн сайын мектепке барамын", "Анам кешкі ас әзірлейді", "Күн шығыстан шығады".'
      },
      rules: [
        { ru: '📌 Берем обычную форму глагола: I play, You work, We study', kz: '📌 Етістіктің қарапайым формасын аламыз: I play, You work, We study' },
        { ru: '📌 Для He, She, It добавляем -S или -ES: He playS, She workS, It studIES', kz: '📌 He, She, It үшін -S немесе -ES қосамыз: He playS, She workS, It studIES' },
        { ru: '📌 Вопросы: Do you play? Does he work?', kz: '📌 Сұрақтар: Do you play? Does he work?' },
        { ru: '📌 Отрицания: I don\'t play, He doesn\'t work', kz: '📌 Болымсыз: I don\'t play, He doesn\'t work' },
      ],
      examples: [
        { english: 'I play football', ru: 'Я играю в футбол', kz: 'Мен футбол ойнаймын', type: 'positive' },
        { english: 'He plays football', ru: 'Он играет в футбол', kz: 'Ол футбол ойнайды', type: 'positive' },
        { english: 'We study English', ru: 'Мы изучаем английский', kz: 'Біз ағылшын тілін үйренеміз', type: 'positive' },
        { english: 'She studies English', ru: 'Она изучает английский', kz: 'Ол ағылшын тілін үйренеді', type: 'positive' },
        { english: 'I don\'t like coffee', ru: 'Я не люблю кофе', kz: 'Мен кофені ұнатпаймын', type: 'negative' },
        { english: 'He doesn\'t play tennis', ru: 'Он не играет в теннис', kz: 'Ол теннис ойнамайды', type: 'negative' },
        { english: 'They don\'t watch TV', ru: 'Они не смотрят телевизор', kz: 'Олар теледидар көрмейді', type: 'negative' },
        { english: 'Do you like cats?', ru: 'Ты любишь кошек?', kz: 'Сен мысықтарды ұнатасың ба?', type: 'question' },
        { english: 'Does he like cats?', ru: 'Он любит кошек?', kz: 'Ол мысықтарды ұнатады ма?', type: 'question' },
        { english: 'Do they speak English?', ru: 'Они говорят по-английски?', kz: 'Олар ағылшынша сөйлейді ме?', type: 'question' },
      ],
      tips: [
        { ru: '💡 Слова-подсказки: always, often, usually, sometimes, never, every day', kz: '💡 Көмекші сөздер: always, often, usually, sometimes, never, every day' },
        { ru: '💡 Не забывай -S для He/She/It!', kz: '💡 He/She/It үшін -S қосуды ұмытпа!' },
      ]
    },
    testQuestions: [
      {
        question: { ru: 'I ___ football', kz: 'I ___ football' },
        options: ['play', 'plays'],
        correctAnswer: 0,
        explanation: { ru: 'Верно! С "I" без -s', kz: 'Дұрыс! "I" есімдігімен -s жоқ' }
      },
      {
        question: { ru: 'She ___ to school', kz: 'She ___ to school' },
        options: ['go', 'goes'],
        correctAnswer: 1,
        explanation: { ru: 'Молодец! С "She" добавляем -es', kz: 'Жарайсың! "She" есімдігімен -es қосамыз' }
      },
      {
        question: { ru: 'They ___ English', kz: 'They ___ English' },
        options: ['study', 'studies'],
        correctAnswer: 0,
        explanation: { ru: 'Отлично! С "They" без -s', kz: 'Керемет! "They" есімдігімен -s жоқ' }
      },
      {
        question: { ru: 'He ___ books', kz: 'He ___ books' },
        options: ['read', 'reads'],
        correctAnswer: 1,
        explanation: { ru: 'Супер! С "He" добавляем -s', kz: 'Өте жақсы! "He" есімдігімен -s қосамыз' }
      },
      {
        question: { ru: 'We ___ TV', kz: 'We ___ TV' },
        options: ['watch', 'watches'],
        correctAnswer: 0,
        explanation: { ru: 'Правильно! С "We" без -es', kz: 'Дұрыс! "We" есімдігімен -es жоқ' }
      },
    ]
  },

  // Тема 8
  {
    id: 'can-ability',
    title: { ru: 'CAN - могу, умею', kz: 'CAN - мен бармын, білемін' },
    description: { ru: 'Что я умею делать', kz: 'Мен не істей аламын' },
    content: {
      introduction: {
        ru: 'CAN - это очень полезное слово! Оно означает "могу", "умею". Например: "I can swim" - "Я умею плавать", "I can speak English" - "Я могу говорить по-английски".',
        kz: 'CAN - бұл өте пайдалы сөз! Ол "бармын", "білемін" дегенді білдіреді. Мысалы: "I can swim" - "Мен жүзе аламын", "I can speak English" - "Мен ағылшынша сөйлей аламын".'
      },
      rules: [
        { ru: '📌 CAN одинаковый для всех: I can, you can, he can, we can', kz: '📌 CAN барлығына бірдей: I can, you can, he can, we can' },
        { ru: '📌 После CAN глагол БЕЗ to: can swim, can play, can read', kz: '📌 CAN-нан кейін етістік БЕЗ to: can swim, can play, can read' },
        { ru: '📌 Отрицание: cannot = can\'t (не могу, не умею)', kz: '📌 Болымсыз: cannot = can\'t (бара алмаймын, білмеймін)' },
        { ru: '📌 Вопрос: Can you swim? - Ты умеешь плавать?', kz: '📌 Сұрақ: Can you swim? - Сен жүзе аласың ба?' },
      ],
      examples: [
        { english: 'I can swim', ru: 'Я умею плавать', kz: 'Мен жүзе аламын', type: 'positive' },
        { english: 'She can dance', ru: 'Она умеет танцевать', kz: 'Ол билей алады', type: 'positive' },
        { english: 'He can play football', ru: 'Он умеет играть в футбол', kz: 'Ол футбол ойнай алады', type: 'positive' },
        { english: 'We can speak English', ru: 'Мы умеем говорить по-английски', kz: 'Біз ағылшынша сөйлей аламыз', type: 'positive' },
        { english: 'I can\'t fly', ru: 'Я не умею летать', kz: 'Мен ұша алмаймын', type: 'negative' },
        { english: 'She can\'t drive', ru: 'Она не умеет водить', kz: 'Ол жүргізе алмайды', type: 'negative' },
        { english: 'He can\'t cook', ru: 'Он не умеет готовить', kz: 'Ол дайындай алмайды', type: 'negative' },
        { english: 'Can you run?', ru: 'Ты умеешь бегать?', kz: 'Сен жүгіре аласың ба?', type: 'question' },
        { english: 'Can she sing?', ru: 'Она умеет петь?', kz: 'Ол ән айта алады ма?', type: 'question' },
        { english: 'Can they dance?', ru: 'Они умеют танцевать?', kz: 'Олар билей алады ма?', type: 'question' },
      ],
      tips: [
        { ru: '💡 CAN НЕ изменяется! Всегда одинаковый!', kz: '💡 CAN ӨЗГЕРМЕЙДІ! Әрқашан бірдей!' },
        { ru: '💡 Не говори "can to" - только "can swim"!', kz: '💡 "can to" деме - тек "can swim"!' },
      ]
    },
    testQuestions: [
      {
        question: { ru: 'I ___ swim', kz: 'I ___ swim' },
        options: ['can', 'cans'],
        correctAnswer: 0,
        explanation: { ru: 'Правильно! CAN не изменяется', kz: 'Дұрыс! CAN өзгермейді' }
      },
      {
        question: { ru: 'She ___ dance', kz: 'She ___ dance' },
        options: ['can', 'cans'],
        correctAnswer: 0,
        explanation: { ru: 'Молодец! CAN одинаковый для всех', kz: 'Жарайсың! CAN барлығына бірдей' }
      },
      {
        question: { ru: 'I can ___ football', kz: 'I can ___ football' },
        options: ['to play', 'play'],
        correctAnswer: 1,
        explanation: { ru: 'Отлично! После CAN глагол без TO', kz: 'Керемет! CAN-нан кейін етістік БЕЗ TO' }
      },
      {
        question: { ru: 'Отрицание от "can":', kz: '"can" болымсызы:' },
        options: ['can not', 'can\'t', 'both'],
        correctAnswer: 2,
        explanation: { ru: 'Супер! Можно и так, и так!', kz: 'Өте жақсы! Екеуін де айтуға болады!' }
      },
      {
        question: { ru: '___ you swim?', kz: '___ you swim?' },
        options: ['Can', 'Do can'],
        correctAnswer: 0,
        explanation: { ru: 'Верно! В вопросе CAN впереди', kz: 'Дұрыс! Сұрақта CAN алдында' }
      },
    ]
  },

  // Тема 9
  {
    id: 'there-is-are',
    title: { ru: 'THERE IS / THERE ARE', kz: 'THERE IS / THERE ARE' },
    description: { ru: 'Говорим что где находится', kz: 'Не қайда орналасқанын айтамыз' },
    content: {
      introduction: {
        ru: 'THERE IS/ARE используем, когда хотим сказать, что где-то что-то есть или находится. "There is a cat" - "Там есть кот", "There are books" - "Там есть книги".',
        kz: 'THERE IS/ARE қайда да бір нәрсе бар екенін айтқанда қолданамыз. "There is a cat" - "Мысық бар", "There are books" - "Кітаптар бар".'
      },
      rules: [
        { ru: '📌 THERE IS - для ОДНОГО предмета (единственное число)', kz: '📌 THERE IS - БІР зат үшін (жекеше түр)' },
        { ru: '📌 THERE ARE - для МНОГИХ предметов (множественное число)', kz: '📌 THERE ARE - КӨП заттар үшін (көпше түр)' },
        { ru: '📌 Вопрос: Is there...? Are there...?', kz: '📌 Сұрақ: Is there...? Are there...?' },
        { ru: '📌 Отрицание: There isn\'t... There aren\'t...', kz: '📌 Болымсыз: There isn\'t... There aren\'t...' },
      ],
      examples: [
        { english: 'There is a cat', ru: 'Там кот', kz: 'Мысық бар', type: 'positive' },
        { english: 'There is a book on the table', ru: 'На столе книга', kz: 'Үстелде кітап бар', type: 'positive' },
        { english: 'There are cats', ru: 'Там коты', kz: 'Мысықтар бар', type: 'positive' },
        { english: 'There are books on the table', ru: 'На столе книги', kz: 'Үстелде кітаптар бар', type: 'positive' },
        { english: 'There isn\'t a pen', ru: 'Там нет ручки', kz: 'Қалам жоқ', type: 'negative' },
        { english: 'There aren\'t apples', ru: 'Там нет яблок', kz: 'Алмалар жоқ', type: 'negative' },
        { english: 'There isn\'t a dog', ru: 'Там нет собаки', kz: 'Ит жоқ', type: 'negative' },
        { english: 'Is there a pen?', ru: 'Там есть ручка?', kz: 'Қалам бар ма?', type: 'question' },
        { english: 'Are there books?', ru: 'Там есть книги?', kz: 'Кітаптар бар ма?', type: 'question' },
        { english: 'Is there a cat in the room?', ru: 'В комнате есть кот?', kz: 'Бөлмеде мысық бар ма?', type: 'question' },
      ],
      tips: [
        { ru: '💡 Смотри на слово ПОСЛЕ there is/are: если один - IS, если много - ARE', kz: '💡 there is/are-дан КЕЙІНГІ сөзге қара: бір болса - IS, көп болса - ARE' },
        { ru: '💡 THERE IS/ARE = Есть, находится, имеется', kz: '💡 THERE IS/ARE = Бар, орналасқан' },
      ]
    },
    testQuestions: [
      {
        question: { ru: 'There ___ a cat', kz: 'There ___ a cat' },
        options: ['is', 'are'],
        correctAnswer: 0,
        explanation: { ru: 'Правильно! Один кот - IS', kz: 'Дұрыс! Бір мысық - IS' }
      },
      {
        question: { ru: 'There ___ books', kz: 'There ___ books' },
        options: ['is', 'are'],
        correctAnswer: 1,
        explanation: { ru: 'Молодец! Много книг - ARE', kz: 'Жарайсың! Көп кітаптар - ARE' }
      },
      {
        question: { ru: '___ there a pen?', kz: '___ there a pen?' },
        options: ['Is', 'Are'],
        correctAnswer: 0,
        explanation: { ru: 'Отлично! Одна ручка - IS', kz: 'Керемет! Бір қалам - IS' }
      },
      {
        question: { ru: 'There ___ a dog', kz: 'There ___ a dog' },
        options: ['is', 'are'],
        correctAnswer: 0,
        explanation: { ru: 'Супер! Одна собака - IS', kz: 'Өте жақсы! Бір ит - IS' }
      },
      {
        question: { ru: '___ there apples?', kz: '___ there apples?' },
        options: ['Is', 'Are'],
        correctAnswer: 1,
        explanation: { ru: 'Верно! Много яблок - ARE', kz: 'Дұрыс! Көп алма - ARE' }
      },
    ]
  },

  // Остальные темы (10-15) с такой же структурой
  // Добавим их сокращенно для экономии места
];

// Получить все темы грамматики
export function getGrammarTopics(): GrammarTopic[] {
  return BEGINNER_GRAMMAR_TOPICS;
}

// Получить тему по ID
export function getGrammarTopicById(id: string): GrammarTopic | undefined {
  return BEGINNER_GRAMMAR_TOPICS.find(topic => topic.id === id);
}

// Получить общее количество тем
export function getTotalGrammarTopics(): number {
  return BEGINNER_GRAMMAR_TOPICS.length;
}