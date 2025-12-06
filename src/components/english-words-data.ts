// База данных слов с примерами предложений
export interface WordData {
  english: string;
  russian: string;
  kazakh: string;
  category: string;
  level: 'beginner' | 'elementary' | 'intermediate';
  sentence: { en: string; ru: string; kz: string };
  imageQuery: string;
}

export const WORDS_WITH_SENTENCES: WordData[] = [
  // BEGINNER - Животные (Animals)
  {
    english: 'cat',
    russian: 'кот',
    kazakh: 'мысық',
    category: 'Animals',
    level: 'beginner',
    sentence: {
      en: 'The cat says meow!',
      ru: 'Кот говорит мяу!',
      kz: 'Мысық мияу дейді!'
    },
    imageQuery: 'cute cat'
  },
  {
    english: 'dog',
    russian: 'собака',
    kazakh: 'ит',
    category: 'Animals',
    level: 'beginner',
    sentence: {
      en: 'The dog barks loud!',
      ru: 'Собака громко лает!',
      kz: 'Ит қатты үреді!'
    },
    imageQuery: 'happy dog'
  },
  {
    english: 'bird',
    russian: 'птица',
    kazakh: 'құс',
    category: 'Animals',
    level: 'beginner',
    sentence: {
      en: 'The bird flies in the sky.',
      ru: 'Птица летает в небе.',
      kz: 'Құс аспанда ұшады.'
    },
    imageQuery: 'colorful bird flying'
  },
  {
    english: 'fish',
    russian: 'рыба',
    kazakh: 'балық',
    category: 'Animals',
    level: 'beginner',
    sentence: {
      en: 'The fish swims in water.',
      ru: 'Рыба плавает в воде.',
      kz: 'Балық суда жүзеді.'
    },
    imageQuery: 'tropical fish'
  },
  {
    english: 'rabbit',
    russian: 'кролик',
    kazakh: 'қоян',
    category: 'Animals',
    level: 'beginner',
    sentence: {
      en: 'The rabbit hops fast!',
      ru: 'Кролик быстро прыгает!',
      kz: 'Қоян жылдам секіреді!'
    },
    imageQuery: 'cute rabbit'
  },
  {
    english: 'horse',
    russian: 'лошадь',
    kazakh: 'жылқы',
    category: 'Animals',
    level: 'beginner',
    sentence: {
      en: 'The horse runs very fast.',
      ru: 'Лошадь бегает очень быстро.',
      kz: 'Жылқы өте жылдам жүгіреді.'
    },
    imageQuery: 'brown horse running'
  },
  {
    english: 'cow',
    russian: 'корова',
    kazakh: 'сиыр',
    category: 'Animals',
    level: 'beginner',
    sentence: {
      en: 'The cow gives us milk.',
      ru: 'Корова дает нам молоко.',
      kz: 'Сиыр бізге сүт береді.'
    },
    imageQuery: 'cow farm'
  },
  {
    english: 'pig',
    russian: 'свинья',
    kazakh: 'шошқа',
    category: 'Animals',
    level: 'beginner',
    sentence: {
      en: 'The pig loves to play in mud.',
      ru: 'Свинья любит играть в грязи.',
      kz: 'Шошқа балшықта ойнағанды жақсы көреді.'
    },
    imageQuery: 'pink pig'
  },

  // BEGINNER - Цвета (Colors)
  {
    english: 'red',
    russian: 'красный',
    kazakh: 'қызыл',
    category: 'Colors',
    level: 'beginner',
    sentence: {
      en: 'The apple is red.',
      ru: 'Яблоко красное.',
      kz: 'Алма қызыл.'
    },
    imageQuery: 'red apple'
  },
  {
    english: 'blue',
    russian: 'синий',
    kazakh: 'көк',
    category: 'Colors',
    level: 'beginner',
    sentence: {
      en: 'The sky is blue.',
      ru: 'Небо синее.',
      kz: 'Аспан көк.'
    },
    imageQuery: 'blue sky'
  },
  {
    english: 'green',
    russian: 'зеленый',
    kazakh: 'жасыл',
    category: 'Colors',
    level: 'beginner',
    sentence: {
      en: 'The grass is green.',
      ru: 'Трава зеленая.',
      kz: 'Шөп жасыл.'
    },
    imageQuery: 'green grass'
  },
  {
    english: 'yellow',
    russian: 'желтый',
    kazakh: 'сары',
    category: 'Colors',
    level: 'beginner',
    sentence: {
      en: 'The sun is yellow.',
      ru: 'Солнце желтое.',
      kz: 'Күн сары.'
    },
    imageQuery: 'yellow sun'
  },
  {
    english: 'black',
    russian: 'черный',
    kazakh: 'қара',
    category: 'Colors',
    level: 'beginner',
    sentence: {
      en: 'My cat is black.',
      ru: 'Мой кот черный.',
      kz: 'Менің мысығым қара.'
    },
    imageQuery: 'black cat'
  },
  {
    english: 'white',
    russian: 'белый',
    kazakh: 'ақ',
    category: 'Colors',
    level: 'beginner',
    sentence: {
      en: 'Snow is white.',
      ru: 'Снег белый.',
      kz: 'Қар ақ.'
    },
    imageQuery: 'white snow'
  },
  {
    english: 'orange',
    russian: 'оранжевый',
    kazakh: 'сарғыш',
    category: 'Colors',
    level: 'beginner',
    sentence: {
      en: 'The orange is orange!',
      ru: 'Апельсин оранжевый!',
      kz: 'Апельсин сарғыш!'
    },
    imageQuery: 'orange fruit'
  },
  {
    english: 'purple',
    russian: 'фиолетовый',
    kazakh: 'күлгін',
    category: 'Colors',
    level: 'beginner',
    sentence: {
      en: 'I love purple flowers.',
      ru: 'Я люблю фиолетовые цветы.',
      kz: 'Мен күлгін гүлдерді жақсы көремін.'
    },
    imageQuery: 'purple flowers'
  },

  // BEGINNER - Числа (Numbers)
  {
    english: 'one',
    russian: 'один',
    kazakh: 'бір',
    category: 'Numbers',
    level: 'beginner',
    sentence: {
      en: 'I have one apple.',
      ru: 'У меня одно яблоко.',
      kz: 'Менде бір алма бар.'
    },
    imageQuery: 'number one'
  },
  {
    english: 'two',
    russian: 'два',
    kazakh: 'екі',
    category: 'Numbers',
    level: 'beginner',
    sentence: {
      en: 'I see two cats.',
      ru: 'Я вижу двух котов.',
      kz: 'Мен екі мысық көремін.'
    },
    imageQuery: 'number two'
  },
  {
    english: 'three',
    russian: 'три',
    kazakh: 'үш',
    category: 'Numbers',
    level: 'beginner',
    sentence: {
      en: 'There are three birds.',
      ru: 'Там три птицы.',
      kz: 'Үш құс бар.'
    },
    imageQuery: 'number three'
  },
  {
    english: 'four',
    russian: 'четыре',
    kazakh: 'төрт',
    category: 'Numbers',
    level: 'beginner',
    sentence: {
      en: 'A dog has four legs.',
      ru: 'У собаки четыре лапы.',
      kz: 'Иттің төрт аяғы бар.'
    },
    imageQuery: 'number four'
  },
  {
    english: 'five',
    russian: 'пять',
    kazakh: 'бес',
    category: 'Numbers',
    level: 'beginner',
    sentence: {
      en: 'I have five fingers.',
      ru: 'У меня пять пальцев.',
      kz: 'Менде бес саусақ бар.'
    },
    imageQuery: 'number five hand'
  },
  {
    english: 'six',
    russian: 'шесть',
    kazakh: 'алты',
    category: 'Numbers',
    level: 'beginner',
    sentence: {
      en: 'Six stars in the sky.',
      ru: 'Шесть звезд на небе.',
      kz: 'Аспанда алты жұлдыз.'
    },
    imageQuery: 'number six'
  },
  {
    english: 'seven',
    russian: 'семь',
    kazakh: 'жеті',
    category: 'Numbers',
    level: 'beginner',
    sentence: {
      en: 'There are seven days in a week.',
      ru: 'В неделе семь дней.',
      kz: 'Аптада жеті күн бар.'
    },
    imageQuery: 'number seven'
  },
  {
    english: 'eight',
    russian: 'восемь',
    kazakh: 'сегіз',
    category: 'Numbers',
    level: 'beginner',
    sentence: {
      en: 'The spider has eight legs.',
      ru: 'У паука восемь лап.',
      kz: 'Өрмекшінің сегіз аяғы бар.'
    },
    imageQuery: 'number eight'
  },
  {
    english: 'nine',
    russian: 'девять',
    kazakh: 'тоғыз',
    category: 'Numbers',
    level: 'beginner',
    sentence: {
      en: 'Nine balloons fly high.',
      ru: 'Девять шариков летят высоко.',
      kz: 'Тоғыз шар биікте ұшады.'
    },
    imageQuery: 'number nine'
  },
  {
    english: 'ten',
    russian: 'десять',
    kazakh: 'он',
    category: 'Numbers',
    level: 'beginner',
    sentence: {
      en: 'I count to ten!',
      ru: 'Я считаю до десяти!',
      kz: 'Мен онға дейін санаймын!'
    },
    imageQuery: 'number ten'
  },

  // BEGINNER - Семья (Family)
  {
    english: 'mother',
    russian: 'мама',
    kazakh: 'ана',
    category: 'Family',
    level: 'beginner',
    sentence: {
      en: 'My mother loves me.',
      ru: 'Моя мама любит меня.',
      kz: 'Менің анам мені жақсы көреді.'
    },
    imageQuery: 'mother child'
  },
  {
    english: 'father',
    russian: 'папа',
    kazakh: 'әке',
    category: 'Family',
    level: 'beginner',
    sentence: {
      en: 'My father is strong.',
      ru: 'Мой папа сильный.',
      kz: 'Менің әкем күшті.'
    },
    imageQuery: 'father child'
  },
  {
    english: 'sister',
    russian: 'сестра',
    kazakh: 'әпке/қарындас',
    category: 'Family',
    level: 'beginner',
    sentence: {
      en: 'My sister plays with me.',
      ru: 'Моя сестра играет со мной.',
      kz: 'Менің әпкем менімен ойнайды.'
    },
    imageQuery: 'sisters playing'
  },
  {
    english: 'brother',
    russian: 'брат',
    kazakh: 'аға/іні',
    category: 'Family',
    level: 'beginner',
    sentence: {
      en: 'My brother is funny.',
      ru: 'Мой брат веселый.',
      kz: 'Менің ағам күлкілі.'
    },
    imageQuery: 'brothers'
  },
  {
    english: 'baby',
    russian: 'малыш',
    kazakh: 'нәресте',
    category: 'Family',
    level: 'beginner',
    sentence: {
      en: 'The baby is sleeping.',
      ru: 'Малыш спит.',
      kz: 'Нәресте ұйықтап жатыр.'
    },
    imageQuery: 'baby sleeping'
  },
  {
    english: 'grandma',
    russian: 'бабушка',
    kazakh: 'әже',
    category: 'Family',
    level: 'beginner',
    sentence: {
      en: 'Grandma makes cookies.',
      ru: 'Бабушка печет печенье.',
      kz: 'Әже печенье жасайды.'
    },
    imageQuery: 'grandmother cookies'
  },
  {
    english: 'grandpa',
    russian: 'дедушка',
    kazakh: 'ата',
    category: 'Family',
    level: 'beginner',
    sentence: {
      en: 'Grandpa tells stories.',
      ru: 'Дедушка рассказывает истории.',
      kz: 'Ата әңгімелер айтады.'
    },
    imageQuery: 'grandfather reading'
  },

  // ELEMENTARY - Еда (Food)
  {
    english: 'apple',
    russian: 'яблоко',
    kazakh: 'алма',
    category: 'Food',
    level: 'elementary',
    sentence: {
      en: 'An apple a day keeps the doctor away!',
      ru: 'Яблоко в день - и врач не нужен!',
      kz: 'Күніне бір алма денсаулыққа пайдалы!'
    },
    imageQuery: 'red apple'
  },
  {
    english: 'banana',
    russian: 'банан',
    kazakh: 'банан',
    category: 'Food',
    level: 'elementary',
    sentence: {
      en: 'Monkeys love bananas!',
      ru: 'Обезьяны любят бананы!',
      kz: 'Маймылдар банандарды жақсы көреді!'
    },
    imageQuery: 'yellow banana'
  },
  {
    english: 'bread',
    russian: 'хлеб',
    kazakh: 'нан',
    category: 'Food',
    level: 'elementary',
    sentence: {
      en: 'I eat bread for breakfast.',
      ru: 'Я ем хлеб на завтрак.',
      kz: 'Мен таңғы асқа нан жеймін.'
    },
    imageQuery: 'fresh bread'
  },
  {
    english: 'milk',
    russian: 'молоко',
    kazakh: 'сүт',
    category: 'Food',
    level: 'elementary',
    sentence: {
      en: 'Milk is good for you!',
      ru: 'Молоко полезно для тебя!',
      kz: 'Сүт саған пайдалы!'
    },
    imageQuery: 'glass milk'
  },
  {
    english: 'water',
    russian: 'вода',
    kazakh: 'су',
    category: 'Food',
    level: 'elementary',
    sentence: {
      en: 'Drink water every day.',
      ru: 'Пей воду каждый день.',
      kz: 'Күн сайын су іш.'
    },
    imageQuery: 'water glass'
  },
  {
    english: 'juice',
    russian: 'сок',
    kazakh: 'шырын',
    category: 'Food',
    level: 'elementary',
    sentence: {
      en: 'Orange juice is sweet.',
      ru: 'Апельсиновый сок сладкий.',
      kz: 'Апельсин шырыны тәтті.'
    },
    imageQuery: 'orange juice'
  },
  {
    english: 'cheese',
    russian: 'сыр',
    kazakh: 'ірімшік',
    category: 'Food',
    level: 'elementary',
    sentence: {
      en: 'Mice love cheese!',
      ru: 'Мыши любят сыр!',
      kz: 'Тышқандар ірімшікті жақсы көреді!'
    },
    imageQuery: 'cheese slices'
  },
  {
    english: 'egg',
    russian: 'яйцо',
    kazakh: 'жұмыртқа',
    category: 'Food',
    level: 'elementary',
    sentence: {
      en: 'A chicken lays eggs.',
      ru: 'Курица несет яйца.',
      kz: 'Тауық жұмыртқа салады.'
    },
    imageQuery: 'eggs basket'
  },
  {
    english: 'pizza',
    russian: 'пицца',
    kazakh: 'пицца',
    category: 'Food',
    level: 'elementary',
    sentence: {
      en: 'Pizza is my favorite food!',
      ru: 'Пицца - моя любимая еда!',
      kz: 'Пицца менің сүйікті тағамым!'
    },
    imageQuery: 'delicious pizza'
  },
  {
    english: 'cake',
    russian: 'торт',
    kazakh: 'торт',
    category: 'Food',
    level: 'elementary',
    sentence: {
      en: 'Birthday cake is delicious!',
      ru: 'Праздничный торт вкусный!',
      kz: 'Туған күн торты дәмді!'
    },
    imageQuery: 'birthday cake'
  },

  // ELEMENTARY - Школа (School)
  {
    english: 'book',
    russian: 'книга',
    kazakh: 'кітап',
    category: 'School',
    level: 'elementary',
    sentence: {
      en: 'I read a book every day.',
      ru: 'Я читаю книгу каждый день.',
      kz: 'Мен күн сайын кітап оқимын.'
    },
    imageQuery: 'open book'
  },
  {
    english: 'pen',
    russian: 'ручка',
    kazakh: 'қалам',
    category: 'School',
    level: 'elementary',
    sentence: {
      en: 'I write with a pen.',
      ru: 'Я пишу ручкой.',
      kz: 'Мен қаламмен жазамын.'
    },
    imageQuery: 'pen writing'
  },
  {
    english: 'pencil',
    russian: 'карандаш',
    kazakh: 'қарындаш',
    category: 'School',
    level: 'elementary',
    sentence: {
      en: 'I draw with a pencil.',
      ru: 'Я рисую карандашом.',
      kz: 'Мен қарындашпен сызамын.'
    },
    imageQuery: 'pencil drawing'
  },
  {
    english: 'desk',
    russian: 'парта',
    kazakh: 'парта',
    category: 'School',
    level: 'elementary',
    sentence: {
      en: 'My desk is clean.',
      ru: 'Моя парта чистая.',
      kz: 'Менің партам таза.'
    },
    imageQuery: 'school desk'
  },
  {
    english: 'teacher',
    russian: 'учитель',
    kazakh: 'мұғалім',
    category: 'School',
    level: 'elementary',
    sentence: {
      en: 'My teacher is kind.',
      ru: 'Мой учитель добрый.',
      kz: 'Менің мұғалімім мейірімді.'
    },
    imageQuery: 'teacher classroom'
  },
  {
    english: 'student',
    russian: 'ученик',
    kazakh: 'оқушы',
    category: 'School',
    level: 'elementary',
    sentence: {
      en: 'I am a good student.',
      ru: 'Я хороший ученик.',
      kz: 'Мен жақсы оқушымын.'
    },
    imageQuery: 'student studying'
  },
  {
    english: 'classroom',
    russian: 'класс',
    kazakh: 'сынып',
    category: 'School',
    level: 'elementary',
    sentence: {
      en: 'Our classroom is bright.',
      ru: 'Наш класс светлый.',
      kz: 'Біздің сынып жарық.'
    },
    imageQuery: 'bright classroom'
  },
  {
    english: 'homework',
    russian: 'домашняя работа',
    kazakh: 'үй жұмысы',
    category: 'School',
    level: 'elementary',
    sentence: {
      en: 'I do my homework every day.',
      ru: 'Я делаю домашнюю работу каждый день.',
      kz: 'Мен күн сайын үй жұмысын орындаймын.'
    },
    imageQuery: 'child homework'
  },

  // ELEMENTARY - Дом (Home)
  {
    english: 'house',
    russian: 'дом',
    kazakh: 'үй',
    category: 'Home',
    level: 'elementary',
    sentence: {
      en: 'My house is big.',
      ru: 'Мой дом большой.',
      kz: 'Менің үйім үлкен.'
    },
    imageQuery: 'beautiful house'
  },
  {
    english: 'room',
    russian: 'комната',
    kazakh: 'бөлме',
    category: 'Home',
    level: 'elementary',
    sentence: {
      en: 'My room is cozy.',
      ru: 'Моя комната уютная.',
      kz: 'Менің бөлмем жайлы.'
    },
    imageQuery: 'cozy room'
  },
  {
    english: 'door',
    russian: 'дверь',
    kazakh: 'есік',
    category: 'Home',
    level: 'elementary',
    sentence: {
      en: 'Please close the door.',
      ru: 'Пожалуйста, закрой дверь.',
      kz: 'Есікті жап.'
    },
    imageQuery: 'wooden door'
  },
  {
    english: 'window',
    russian: 'окно',
    kazakh: 'терезе',
    category: 'Home',
    level: 'elementary',
    sentence: {
      en: 'I look through the window.',
      ru: 'Я смотрю в окно.',
      kz: 'Мен терезе арқылы қараймын.'
    },
    imageQuery: 'window view'
  },
  {
    english: 'bed',
    russian: 'кровать',
    kazakh: 'төсек',
    category: 'Home',
    level: 'elementary',
    sentence: {
      en: 'I sleep in my bed.',
      ru: 'Я сплю в своей кровати.',
      kz: 'Мен өз төсегімде ұйықтаймын.'
    },
    imageQuery: 'comfortable bed'
  },
  {
    english: 'table',
    russian: 'стол',
    kazakh: 'үстел',
    category: 'Home',
    level: 'elementary',
    sentence: {
      en: 'We eat at the table.',
      ru: 'Мы едим за столом.',
      kz: 'Біз үстелде тамақтанамыз.'
    },
    imageQuery: 'dining table'
  },
  {
    english: 'chair',
    russian: 'стул',
    kazakh: 'орындық',
    category: 'Home',
    level: 'elementary',
    sentence: {
      en: 'Sit on the chair.',
      ru: 'Сядь на стул.',
      kz: 'Орындыққа отыр.'
    },
    imageQuery: 'wooden chair'
  },
  {
    english: 'kitchen',
    russian: 'кухня',
    kazakh: 'ас үй',
    category: 'Home',
    level: 'elementary',
    sentence: {
      en: 'Mom cooks in the kitchen.',
      ru: 'Мама готовит на кухне.',
      kz: 'Ана ас үйде тамақ дайындайды.'
    },
    imageQuery: 'modern kitchen'
  },

  // INTERMEDIATE - Природа (Nature)
  {
    english: 'tree',
    russian: 'дерево',
    kazakh: 'ағаш',
    category: 'Nature',
    level: 'intermediate',
    sentence: {
      en: 'The tree is tall and green.',
      ru: 'Дерево высокое и зеленое.',
      kz: 'Ағаш биік және жасыл.'
    },
    imageQuery: 'tall tree'
  },
  {
    english: 'flower',
    russian: 'цветок',
    kazakh: 'гүл',
    category: 'Nature',
    level: 'intermediate',
    sentence: {
      en: 'The flower smells beautiful.',
      ru: 'Цветок красиво пахнет.',
      kz: 'Гүл әдемі иіс шығарады.'
    },
    imageQuery: 'beautiful flower'
  },
  {
    english: 'sun',
    russian: 'солнце',
    kazakh: 'күн',
    category: 'Nature',
    level: 'intermediate',
    sentence: {
      en: 'The sun shines bright.',
      ru: 'Солнце ярко светит.',
      kz: 'Күн жарқын жанады.'
    },
    imageQuery: 'bright sun'
  },
  {
    english: 'moon',
    russian: 'луна',
    kazakh: 'ай',
    category: 'Nature',
    level: 'intermediate',
    sentence: {
      en: 'The moon comes out at night.',
      ru: 'Луна появляется ночью.',
      kz: 'Ай түнде шығады.'
    },
    imageQuery: 'full moon'
  },
  {
    english: 'star',
    russian: 'звезда',
    kazakh: 'жұлдыз',
    category: 'Nature',
    level: 'intermediate',
    sentence: {
      en: 'Stars twinkle in the sky.',
      ru: 'Звезды мерцают в небе.',
      kz: 'Жұлдыздар аспанда жылтырайды.'
    },
    imageQuery: 'stars night sky'
  },
  {
    english: 'rain',
    russian: 'дождь',
    kazakh: 'жаңбыр',
    category: 'Nature',
    level: 'intermediate',
    sentence: {
      en: 'The rain makes plants grow.',
      ru: 'Дождь помогает растениям расти.',
      kz: 'Жаңбыр өсімдіктердің өсуіне көмектеседі.'
    },
    imageQuery: 'rain drops'
  },
  {
    english: 'snow',
    russian: 'снег',
    kazakh: 'қар',
    category: 'Nature',
    level: 'intermediate',
    sentence: {
      en: 'Snow is white and cold.',
      ru: 'Снег белый и холодный.',
      kz: 'Қар ақ және суық.'
    },
    imageQuery: 'snow falling'
  },
  {
    english: 'wind',
    russian: 'ветер',
    kazakh: 'жел',
    category: 'Nature',
    level: 'intermediate',
    sentence: {
      en: 'The wind blows the leaves.',
      ru: 'Ветер дует на листья.',
      kz: 'Жел жапырақтарды үрлейді.'
    },
    imageQuery: 'wind leaves'
  },

  // INTERMEDIATE - Действия (Actions)
  {
    english: 'run',
    russian: 'бегать',
    kazakh: 'жүгіру',
    category: 'Actions',
    level: 'intermediate',
    sentence: {
      en: 'I run fast in the park.',
      ru: 'Я быстро бегаю в парке.',
      kz: 'Мен саябақта жылдам жүгіремін.'
    },
    imageQuery: 'child running'
  },
  {
    english: 'jump',
    russian: 'прыгать',
    kazakh: 'секіру',
    category: 'Actions',
    level: 'intermediate',
    sentence: {
      en: 'I can jump very high!',
      ru: 'Я могу прыгать очень высоко!',
      kz: 'Мен өте биікке секіре аламын!'
    },
    imageQuery: 'child jumping'
  },
  {
    english: 'swim',
    russian: 'плавать',
    kazakh: 'жүзу',
    category: 'Actions',
    level: 'intermediate',
    sentence: {
      en: 'I love to swim in summer.',
      ru: 'Я люблю плавать летом.',
      kz: 'Мен жазда жүзуді жақсы көремін.'
    },
    imageQuery: 'child swimming'
  },
  {
    english: 'read',
    russian: 'читать',
    kazakh: 'оқу',
    category: 'Actions',
    level: 'intermediate',
    sentence: {
      en: 'I read books before bed.',
      ru: 'Я читаю книги перед сном.',
      kz: 'Мен ұйықтамас бұрын кітап оқимын.'
    },
    imageQuery: 'child reading book'
  },
  {
    english: 'write',
    russian: 'писать',
    kazakh: 'жазу',
    category: 'Actions',
    level: 'intermediate',
    sentence: {
      en: 'I write stories at school.',
      ru: 'Я пишу истории в школе.',
      kz: 'Мен мектепте әңгімелер жазамын.'
    },
    imageQuery: 'child writing'
  },
  {
    english: 'draw',
    russian: 'рисовать',
    kazakh: 'сурет салу',
    category: 'Actions',
    level: 'intermediate',
    sentence: {
      en: 'I draw beautiful pictures.',
      ru: 'Я рисую красивые картины.',
      kz: 'Мен әдемі суреттер саламын.'
    },
    imageQuery: 'child drawing'
  },
  {
    english: 'sing',
    russian: 'петь',
    kazakh: 'ән айту',
    category: 'Actions',
    level: 'intermediate',
    sentence: {
      en: 'I sing happy songs.',
      ru: 'Я пою веселые песни.',
      kz: 'Мен көңілді әндер айтамын.'
    },
    imageQuery: 'child singing'
  },
  {
    english: 'dance',
    russian: 'танцевать',
    kazakh: 'би билеу',
    category: 'Actions',
    level: 'intermediate',
    sentence: {
      en: 'I dance when I\'m happy!',
      ru: 'Я танцую, когда я счастлив!',
      kz: 'Мен бақытты болған кезде би билеймін!'
    },
    imageQuery: 'child dancing'
  }
];
