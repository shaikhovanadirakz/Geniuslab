// Полная база грамматических тем для всех уровней
import { GrammarTopic } from './english-full-database';

export const GRAMMAR_TOPICS_FULL: GrammarTopic[] = [
  // ========== BEGINNER (5 тем) ==========
  {
    id: 'articles-a-an',
    title: { ru: 'Артикли A и AN', kz: 'A және AN артикльдері' },
    level: 'beginner',
    description: { ru: 'Учимся ставить a и an перед словами', kz: 'Сөздердің алдына a және an қоюды үйренеміз' },
    content: {
      introduction: {
        ru: 'В английском языке перед многими словами мы ставим маленькие слова A или AN. Они означают "один" или "какой-то один". Давайте узнаем, когда какое слово использовать!',
        kz: 'Ағылшын тілінде көптеген сөздердің алдына A немесе AN кішкентай сөздерін қоямыз. Олар "бір" немесе "қандай да бір" дегенді білдіреді. Қай сөзді қашан қолдану керектігін білейік!'
      },
      rules: [
        { ru: '📌 Используй A перед словами, которые начинаются с СОГЛАСНЫХ звуков (b, c, d, f, g и т.д.)', kz: '📌 ДАУЫССЫЗ дыбыстардан (b, c, d, f, g т.б.) басталатын сөздердің алдына A қой' },
        { ru: '📌 Используй AN перед словами, которые начинаются с ГЛАСНЫХ звуков (a, e, i, o, u)', kz: '📌 ДАУЫСТЫ дыбыстардан (a, e, i, o, u) басталатын сөздердің алдына AN қой' },
      ],
      examples: [
        { english: 'a cat', ru: 'кот', kz: 'мысық' },
        { english: 'a dog', ru: 'собака', kz: 'ит' },
        { english: 'an apple', ru: 'яблоко', kz: 'алма' },
        { english: 'an egg', ru: 'яйцо', kz: 'жұмыртқа' },
      ],
      tips: [
        { ru: '💡 Произнеси слово вслух. Если первый звук похож на "а, э, и, о, у" - используй AN', kz: '💡 Сөзді дауыстап айт. Егер бірінші дыбыс "а, э, и, о, у" сияқты болса - AN қолдан' },
      ]
    },
    testQuestions: [
      {
        question: { ru: 'Какой артикль нужен: ___ car (машина)?', kz: 'Қай артикль қажет: ___ car (көлік)?' },
        options: ['a', 'an'],
        correctAnswer: 0,
        explanation: { ru: 'Правильно! "A car" - потому что слово начинается с согласного звука [k]', kz: 'Дұрыс! "A car" - себебі сөз дауыссыз дыбыстан [k] басталады' }
      },
      {
        question: { ru: 'Какой артикль нужен: ___ ice cream (мороженое)?', kz: 'Қай артикль қажет: ___ ice cream (балмұздақ)?' },
        options: ['a', 'an'],
        correctAnswer: 1,
        explanation: { ru: 'Отлично! "An ice cream" - потому что слово начинается с гласного звука [ai]', kz: 'Керемет! "An ice cream" - себебі сөз дауысты дыбыстан [ai] басталады' }
      },
    ]
  },

  {
    id: 'plural-forms',
    title: { ru: 'Множественное число', kz: 'Көпше түрі' },
    level: 'beginner',
    description: { ru: 'Как говорить про много предметов', kz: 'Көп заттар туралы қалай айтамыз' },
    content: {
      introduction: {
        ru: 'Когда у нас не один предмет, а много (два, три, десять), мы изменяем слово. В английском к большинству слов просто добавляем -S!',
        kz: 'Бізде бір емес, көп (екі, үш, он) зат болған кезде, сөзді өзгертеміз. Ағылшын тілінде көптеген сөздердің соңына -S қосамыз!'
      },
      rules: [
        { ru: '📌 К большинству слов просто добавляем -S в конце', kz: '📌 Көптеген сөздердің соңына -S қосамыз' },
        { ru: '📌 Если слово заканчивается на -s, -x, -ch, -sh, добавляем -ES', kz: '📌 Егер сөз -s, -x, -ch, -sh әріптеріне аяқталса, -ES қосамыз' },
      ],
      examples: [
        { english: 'cat → cats', ru: 'кот → коты', kz: 'мысық → мысықтар' },
        { english: 'dog → dogs', ru: 'собака → собаки', kz: 'ит → иттер' },
        { english: 'box → boxes', ru: 'коробка → коробки', kz: 'қорап → қораптар' },
      ],
      tips: [
        { ru: '💡 Когда говоришь про много, артикли A и AN НЕ используются!', kz: '💡 Көп зат туралы айтқанда, A және AN артикльдерін ҚОЛДАНБАЙМЫЗ!' },
      ]
    },
    testQuestions: [
      {
        question: { ru: 'Как будет "собаки" по-английски?', kz: '"Иттер" ағылшынша қалай?' },
        options: ['dog', 'dogs', 'doges'],
        correctAnswer: 1,
        explanation: { ru: 'Верно! Dogs - просто добавляем -s', kz: 'Дұрыс! Dogs - тек -s қосамыз' }
      },
    ]
  },

  // ========== ELEMENTARY (5 тем) ==========
  {
    id: 'verb-to-be',
    title: { ru: 'Глагол TO BE (быть)', kz: 'TO BE етістігі (болу)' },
    level: 'elementary',
    description: { ru: 'Учимся говорить "я есть", "ты есть"', kz: '"Мен боламын", "сен боласың" айтуды үйренеміз' },
    content: {
      introduction: {
        ru: 'Глагол TO BE - это один из самых важных глаголов! Он означает "быть", "находиться". В английском TO BE обязательно нужен!',
        kz: 'TO BE етістігі - ең маңызды етістіктердің бірі! Ол "болу", "орналасу" дегенді білдіреді. Ағылшын тілінде TO BE міндетті түрде қажет!'
      },
      rules: [
        { ru: '📌 С I (я) используем AM → I am', kz: '📌 I (мен) есімдігімен AM қолданамыз → I am' },
        { ru: '📌 С You, We, They используем ARE', kz: '📌 You, We, They есімдіктерімен ARE қолданамыз' },
        { ru: '📌 С He, She, It используем IS', kz: '📌 He, She, It есімдіктерімен IS қолданамыз' },
      ],
      examples: [
        { english: 'I am a student', ru: 'Я ученик', kz: 'Мен оқушымын' },
        { english: 'You are my friend', ru: 'Ты мой друг', kz: 'Сен менің досымсың' },
        { english: 'He is a doctor', ru: 'Он врач', kz: 'Ол дәрігер' },
      ],
      tips: [
        { ru: '💡 Запомни: AM-ARE-IS - всего три формы!', kz: '💡 Есте сақта: AM-ARE-IS - тек үш форма!' },
      ]
    },
    testQuestions: [
      {
        question: { ru: 'Выбери: I ___ a teacher', kz: 'Таңда: I ___ a teacher' },
        options: ['am', 'is', 'are'],
        correctAnswer: 0,
        explanation: { ru: 'Молодец! С "I" всегда "am"', kz: 'Жарайсың! "I" есімдігімен "am"' }
      },
    ]
  },

  {
    id: 'present-simple',
    title: { ru: 'Present Simple - Настоящее время', kz: 'Present Simple - Қазіргі шақ' },
    level: 'elementary',
    description: { ru: 'Рассказываем о том, что делаем регулярно', kz: 'Үнемі істейтін іс-әрекеттер туралы айтамыз' },
    content: {
      introduction: {
        ru: 'Present Simple - это время для действий, которые происходят РЕГУЛЯРНО или ВСЕГДА. Например: "Я хожу в школу каждый день".',
        kz: 'Present Simple - бұл ҮНЕМІ немесе ӘРҚАШАН болатын іс-әрекеттер үшін. Мысалы: "Мен күн сайын мектепке барамын".'
      },
      rules: [
        { ru: '📌 Берем обычную форму глагола: I play, You work', kz: '📌 Етістіктің қарапайым формасын аламыз: I play, You work' },
        { ru: '📌 Для He, She, It добавляем -S: He playS, She workS', kz: '📌 He, She, It үшін -S қосамыз: He playS, She workS' },
      ],
      examples: [
        { english: 'I play football', ru: 'Я играю в футбол', kz: 'Мен футбол ойнаймын' },
        { english: 'He plays football', ru: 'Он играет в футбол', kz: 'Ол футбол ойнайды' },
      ],
      tips: [
        { ru: '💡 После He, She, It глагол изменяется, добавляем -S!', kz: '💡 He, She, It есімдіктерінен кейін етістік өзгереді, -S қосамыз!' },
      ]
    },
    testQuestions: [
      {
        question: { ru: 'Выбери: I ___ football', kz: 'Таңда: I ___ football' },
        options: ['play', 'plays'],
        correctAnswer: 0,
        explanation: { ru: 'Верно! С "I" обычная форма без -s', kz: 'Дұрыс! "I" есімдігімен қарапайым форма' }
      },
    ]
  },

  // ========== PRE-INTERMEDIATE (5 тем) ==========
  {
    id: 'present-continuous',
    title: { ru: 'Present Continuous', kz: 'Present Continuous' },
    level: 'pre-intermediate',
    description: { ru: 'Что происходит прямо сейчас', kz: 'Қазір не болып жатыр' },
    content: {
      introduction: {
        ru: 'Present Continuous используем для действий, которые происходят ПРЯМО СЕЙЧАС, в момент речи.',
        kz: 'Present Continuous қазір дәл осы сәтте болып жатқан іс-әрекеттер үшін қолданамыз.'
      },
      rules: [
        { ru: '📌 Формула: am/is/are + глагол с -ing', kz: '📌 Формула: am/is/are + -ing етістік' },
        { ru: '📌 I am reading, He is playing, They are running', kz: '📌 I am reading, He is playing, They are running' },
      ],
      examples: [
        { english: 'I am reading now', ru: 'Я читаю сейчас', kz: 'Мен қазір оқып жатырмын' },
        { english: 'She is playing', ru: 'Она играет', kz: 'Ол ойнап жатыр' },
      ],
      tips: [
        { ru: '💡 Слова-подсказки: now (сейчас), at the moment (в данный момент)', kz: '💡 Көмекші сөздер: now (қазір), at the moment (қазіргі уақытта)' },
      ]
    },
    testQuestions: [
      {
        question: { ru: 'Выбери: I ___ reading now', kz: 'Таңда: I ___ reading now' },
        options: ['am', 'is', 'are'],
        correctAnswer: 0,
        explanation: { ru: 'Правильно! С "I" используем "am"', kz: 'Дұрыс! "I" есімдігімен "am"' }
      },
    ]
  },

  // ========== INTERMEDIATE (5 тем) ==========
  {
    id: 'past-simple',
    title: { ru: 'Past Simple - Прошедшее время', kz: 'Past Simple - Өткен шақ' },
    level: 'intermediate',
    description: { ru: 'Рассказываем о том, что было раньше', kz: 'Бұрын не болғаны туралы айтамыз' },
    content: {
      introduction: {
        ru: 'Past Simple используем для действий, которые произошли в прошлом и уже закончились.',
        kz: 'Past Simple өткенде болып, аяқталған іс-әрекеттер үшін қолданамыз.'
      },
      rules: [
        { ru: '📌 Правильные глаголы + ed: play → played', kz: '📌 Дұрыс етістіктер + ed: play → played' },
        { ru: '📌 Неправильные глаголы учим: go → went, see → saw', kz: '📌 Бұрыс етістіктерді жаттаймыз: go → went, see → saw' },
      ],
      examples: [
        { english: 'I played yesterday', ru: 'Я играл вчера', kz: 'Мен кеше ойнадым' },
        { english: 'He went to school', ru: 'Он ходил в школу', kz: 'Ол мектепке барды' },
      ],
      tips: [
        { ru: '💡 Слова-подсказки: yesterday (вчера), last week (на прошлой неделе)', kz: '💡 Көмекші сөздер: yesterday (кеше), last week (өткен аптада)' },
      ]
    },
    testQuestions: [
      {
        question: { ru: 'Выбери: I ___ football yesterday', kz: 'Таңда: I ___ football yesterday' },
        options: ['play', 'played', 'plays'],
        correctAnswer: 1,
        explanation: { ru: 'Верно! В прошедшем времени "played"', kz: 'Дұрыс! Өткен шақта "played"' }
      },
    ]
  },

  // ========== UPPER-INTERMEDIATE (5 тем) ==========
  {
    id: 'present-perfect',
    title: { ru: 'Present Perfect', kz: 'Present Perfect' },
    level: 'upper-intermediate',
    description: { ru: 'Связь прошлого с настоящим', kz: 'Өткеннің қазіргімен байланысы' },
    content: {
      introduction: {
        ru: 'Present Perfect используем когда действие произошло в прошлом, но результат важен сейчас.',
        kz: 'Present Perfect іс-әрекет өткенде болды, бірақ нәтижесі қазір маңызды болғанда қолданамыз.'
      },
      rules: [
        { ru: '📌 Формула: have/has + глагол в 3-й форме', kz: '📌 Формула: have/has + 3-ші форма' },
        { ru: '📌 I have done, She has finished', kz: '📌 I have done, She has finished' },
      ],
      examples: [
        { english: 'I have finished my homework', ru: 'Я закончил домашнюю работу', kz: 'Мен үй жұмысын аяқтадым' },
        { english: 'She has visited Paris', ru: 'Она посетила Париж', kz: 'Ол Парижге барды' },
      ],
      tips: [
        { ru: '💡 Слова-подсказки: already (уже), just (только что), yet (еще)', kz: '💡 Көмекші сөздер: already (әлдеқашан), just (жаңа ғана), yet (әлі)' },
      ]
    },
    testQuestions: [
      {
        question: { ru: 'Выбери: I ___ finished', kz: 'Таңда: I ___ finished' },
        options: ['have', 'has', 'had'],
        correctAnswer: 0,
        explanation: { ru: 'Правильно! С "I" используем "have"', kz: 'Дұрыс! "I" есімдігімен "have"' }
      },
    ]
  },
];
