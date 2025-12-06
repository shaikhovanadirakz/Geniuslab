// Полная база данных для английского тренажера

export type Level = 'beginner' | 'elementary' | 'pre-intermediate' | 'intermediate' | 'upper-intermediate';

export interface Word {
  english: string;
  russian: string;
  kazakh: string;
  category: string;
  level: Level;
}

export interface GrammarTopic {
  id: string;
  title: { ru: string; kz: string };
  level: Level;
  description: { ru: string; kz: string };
  content: {
    introduction: { ru: string; kz: string };
    rules: Array<{ ru: string; kz: string }>;
    examples: Array<{ english: string; ru: string; kz: string }>;
    tips: Array<{ ru: string; kz: string }>;
  };
  testQuestions: Array<{
    question: { ru: string; kz: string };
    options: string[];
    correctAnswer: number;
    explanation: { ru: string; kz: string };
  }>;
}

// VOCABULARY DATABASE - 300 слов для каждого уровня
export const WORDS_BY_LEVEL: Record<Level, Word[]> = {
  'beginner': [
    // Animals - 30 слов
    { english: 'cat', russian: 'кот', kazakh: 'мысық', category: 'Animals', level: 'beginner' },
    { english: 'dog', russian: 'собака', kazakh: 'ит', category: 'Animals', level: 'beginner' },
    { english: 'bird', russian: 'птица', kazakh: 'құс', category: 'Animals', level: 'beginner' },
    { english: 'fish', russian: 'рыба', kazakh: 'балық', category: 'Animals', level: 'beginner' },
    { english: 'rabbit', russian: 'кролик', kazakh: 'қоян', category: 'Animals', level: 'beginner' },
    { english: 'horse', russian: 'лошадь', kazakh: 'жылқы', category: 'Animals', level: 'beginner' },
    { english: 'cow', russian: 'корова', kazakh: 'сиыр', category: 'Animals', level: 'beginner' },
    { english: 'pig', russian: 'свинья', kazakh: 'шошқа', category: 'Animals', level: 'beginner' },
    { english: 'chicken', russian: 'курица', kazakh: 'тауық', category: 'Animals', level: 'beginner' },
    { english: 'duck', russian: 'утка', kazakh: 'үйрек', category: 'Animals', level: 'beginner' },
    { english: 'elephant', russian: 'слон', kazakh: 'піл', category: 'Animals', level: 'beginner' },
    { english: 'lion', russian: 'лев', kazakh: 'арыстан', category: 'Animals', level: 'beginner' },
    { english: 'tiger', russian: 'тигр', kazakh: 'жолбарыс', category: 'Animals', level: 'beginner' },
    { english: 'bear', russian: 'медведь', kazakh: 'аю', category: 'Animals', level: 'beginner' },
    { english: 'wolf', russian: 'волк', kazakh: 'қасқыр', category: 'Animals', level: 'beginner' },
    { english: 'fox', russian: 'лиса', kazakh: 'түлкі', category: 'Animals', level: 'beginner' },
    { english: 'monkey', russian: 'обезьяна', kazakh: 'маймыл', category: 'Animals', level: 'beginner' },
    { english: 'mouse', russian: 'мышь', kazakh: 'тышқан', category: 'Animals', level: 'beginner' },
    { english: 'frog', russian: 'лягушка', kazakh: 'бақа', category: 'Animals', level: 'beginner' },
    { english: 'snake', russian: 'змея', kazakh: 'жылан', category: 'Animals', level: 'beginner' },
    { english: 'butterfly', russian: 'бабочка', kazakh: 'көбелек', category: 'Animals', level: 'beginner' },
    { english: 'bee', russian: 'пчела', kazakh: 'ара', category: 'Animals', level: 'beginner' },
    { english: 'spider', russian: 'паук', kazakh: 'өрмекші', category: 'Animals', level: 'beginner' },
    { english: 'dolphin', russian: 'дельфин', kazakh: 'дельфин', category: 'Animals', level: 'beginner' },
    { english: 'whale', russian: 'кит', kazakh: 'кит', category: 'Animals', level: 'beginner' },
    { english: 'shark', russian: 'акула', kazakh: 'акула', category: 'Animals', level: 'beginner' },
    { english: 'penguin', russian: 'пингвин', kazakh: 'пингвин', category: 'Animals', level: 'beginner' },
    { english: 'parrot', russian: 'попугай', kazakh: 'тотықұс', category: 'Animals', level: 'beginner' },
    { english: 'sheep', russian: 'овца', kazakh: 'қой', category: 'Animals', level: 'beginner' },
    { english: 'goat', russian: 'коза', kazakh: 'ешкі', category: 'Animals', level: 'beginner' },
    
    // Colors - 20 слов
    { english: 'red', russian: 'красный', kazakh: 'қызыл', category: 'Colors', level: 'beginner' },
    { english: 'blue', russian: 'синий', kazakh: 'көк', category: 'Colors', level: 'beginner' },
    { english: 'green', russian: 'зеленый', kazakh: 'жасыл', category: 'Colors', level: 'beginner' },
    { english: 'yellow', russian: 'желтый', kazakh: 'сары', category: 'Colors', level: 'beginner' },
    { english: 'black', russian: 'черный', kazakh: 'қара', category: 'Colors', level: 'beginner' },
    { english: 'white', russian: 'белый', kazakh: 'ақ', category: 'Colors', level: 'beginner' },
    { english: 'orange', russian: 'оранжевый', kazakh: 'сарғыш', category: 'Colors', level: 'beginner' },
    { english: 'purple', russian: 'фиолетовый', kazakh: 'күлгін', category: 'Colors', level: 'beginner' },
    { english: 'pink', russian: 'розовый', kazakh: 'қызғылт', category: 'Colors', level: 'beginner' },
    { english: 'brown', russian: 'коричневый', kazakh: 'қоңыр', category: 'Colors', level: 'beginner' },
    { english: 'gray', russian: 'серый', kazakh: 'сұр', category: 'Colors', level: 'beginner' },
    { english: 'silver', russian: 'серебряный', kazakh: 'күміс', category: 'Colors', level: 'beginner' },
    { english: 'gold', russian: 'золотой', kazakh: 'алтын', category: 'Colors', level: 'beginner' },
    { english: 'light', russian: 'светлый', kazakh: 'ашық', category: 'Colors', level: 'beginner' },
    { english: 'dark', russian: 'темный', kazakh: 'қою', category: 'Colors', level: 'beginner' },
    { english: 'bright', russian: 'яркий', kazakh: 'жарқын', category: 'Colors', level: 'beginner' },
    { english: 'colorful', russian: 'красочный', kazakh: 'түрлі-түсті', category: 'Colors', level: 'beginner' },
    { english: 'transparent', russian: 'прозрачный', kazakh: 'мөлдір', category: 'Colors', level: 'beginner' },
    { english: 'shiny', russian: 'блестящий', kazakh: 'жылтыр', category: 'Colors', level: 'beginner' },
    { english: 'pale', russian: 'бледный', kazakh: 'ашық түсті', category: 'Colors', level: 'beginner' },
    
    // Numbers - 30 слов
    { english: 'zero', russian: 'ноль', kazakh: 'нөл', category: 'Numbers', level: 'beginner' },
    { english: 'one', russian: 'один', kazakh: 'бір', category: 'Numbers', level: 'beginner' },
    { english: 'two', russian: 'два', kazakh: 'екі', category: 'Numbers', level: 'beginner' },
    { english: 'three', russian: 'три', kazakh: 'үш', category: 'Numbers', level: 'beginner' },
    { english: 'four', russian: 'четыре', kazakh: 'төрт', category: 'Numbers', level: 'beginner' },
    { english: 'five', russian: 'пять', kazakh: 'бес', category: 'Numbers', level: 'beginner' },
    { english: 'six', russian: 'шесть', kazakh: 'алты', category: 'Numbers', level: 'beginner' },
    { english: 'seven', russian: 'семь', kazakh: 'жеті', category: 'Numbers', level: 'beginner' },
    { english: 'eight', russian: 'восемь', kazakh: 'сегіз', category: 'Numbers', level: 'beginner' },
    { english: 'nine', russian: 'девять', kazakh: 'тоғыз', category: 'Numbers', level: 'beginner' },
    { english: 'ten', russian: 'десять', kazakh: 'он', category: 'Numbers', level: 'beginner' },
    { english: 'eleven', russian: 'одиннадцать', kazakh: 'он бір', category: 'Numbers', level: 'beginner' },
    { english: 'twelve', russian: 'двенадцать', kazakh: 'он екі', category: 'Numbers', level: 'beginner' },
    { english: 'thirteen', russian: 'тринадцать', kazakh: 'он үш', category: 'Numbers', level: 'beginner' },
    { english: 'fourteen', russian: 'четырнадцать', kazakh: 'он төрт', category: 'Numbers', level: 'beginner' },
    { english: 'fifteen', russian: 'пятнадцать', kazakh: 'он бес', category: 'Numbers', level: 'beginner' },
    { english: 'sixteen', russian: 'шестнадцать', kazakh: 'он алты', category: 'Numbers', level: 'beginner' },
    { english: 'seventeen', russian: 'семнадцать', kazakh: 'он жеті', category: 'Numbers', level: 'beginner' },
    { english: 'eighteen', russian: 'восемнадцать', kazakh: 'он сегіз', category: 'Numbers', level: 'beginner' },
    { english: 'nineteen', russian: 'девятнадцать', kazakh: 'он тоғыз', category: 'Numbers', level: 'beginner' },
    { english: 'twenty', russian: 'двадцать', kazakh: 'жиырма', category: 'Numbers', level: 'beginner' },
    { english: 'thirty', russian: 'тридцать', kazakh: 'отыз', category: 'Numbers', level: 'beginner' },
    { english: 'forty', russian: 'сорок', kazakh: 'қырық', category: 'Numbers', level: 'beginner' },
    { english: 'fifty', russian: 'пятьдесят', kazakh: 'елу', category: 'Numbers', level: 'beginner' },
    { english: 'sixty', russian: 'шестьдесят', kazakh: 'алпыс', category: 'Numbers', level: 'beginner' },
    { english: 'seventy', russian: 'семьдесят', kazakh: 'жетпіс', category: 'Numbers', level: 'beginner' },
    { english: 'eighty', russian: 'восемьдесят', kazakh: 'сексен', category: 'Numbers', level: 'beginner' },
    { english: 'ninety', russian: 'девяносто', kazakh: 'тоқсан', category: 'Numbers', level: 'beginner' },
    { english: 'hundred', russian: 'сто', kazakh: 'жүз', category: 'Numbers', level: 'beginner' },
    { english: 'thousand', russian: 'тысяча', kazakh: 'мың', category: 'Numbers', level: 'beginner' },

    // Family - 20 слов
    { english: 'mother', russian: 'мама', kazakh: 'ана', category: 'Family', level: 'beginner' },
    { english: 'father', russian: 'папа', kazakh: 'әке', category: 'Family', level: 'beginner' },
    { english: 'sister', russian: 'сестра', kazakh: 'қарындас', category: 'Family', level: 'beginner' },
    { english: 'brother', russian: 'брат', kazakh: 'аға', category: 'Family', level: 'beginner' },
    { english: 'baby', russian: 'малыш', kazakh: 'нәресте', category: 'Family', level: 'beginner' },
    { english: 'grandma', russian: 'бабушка', kazakh: 'әже', category: 'Family', level: 'beginner' },
    { english: 'grandpa', russian: 'дедушка', kazakh: 'ата', category: 'Family', level: 'beginner' },
    { english: 'parents', russian: 'родители', kazakh: 'ата-ана', category: 'Family', level: 'beginner' },
    { english: 'child', russian: 'ребенок', kazakh: 'бала', category: 'Family', level: 'beginner' },
    { english: 'son', russian: 'сын', kazakh: 'ұл', category: 'Family', level: 'beginner' },
    { english: 'daughter', russian: 'дочь', kazakh: 'қыз', category: 'Family', level: 'beginner' },
    { english: 'aunt', russian: 'тетя', kazakh: 'тәте', category: 'Family', level: 'beginner' },
    { english: 'uncle', russian: 'дядя', kazakh: 'ағай', category: 'Family', level: 'beginner' },
    { english: 'cousin', russian: 'двоюродный брат', kazakh: 'нағашы', category: 'Family', level: 'beginner' },
    { english: 'husband', russian: 'муж', kazakh: 'күйеу', category: 'Family', level: 'beginner' },
    { english: 'wife', russian: 'жена', kazakh: 'әйел', category: 'Family', level: 'beginner' },
    { english: 'family', russian: 'семья', kazakh: 'отбасы', category: 'Family', level: 'beginner' },
    { english: 'twins', russian: 'близнецы', kazakh: 'егіздер', category: 'Family', level: 'beginner' },
    { english: 'nephew', russian: 'племянник', kazakh: 'жиен', category: 'Family', level: 'beginner' },
    { english: 'niece', russian: 'племянница', kazakh: 'жиен қыз', category: 'Family', level: 'beginner' },

    // Body - 30 слов
    { english: 'head', russian: 'голова', kazakh: 'бас', category: 'Body', level: 'beginner' },
    { english: 'hair', russian: 'волосы', kazakh: 'шаш', category: 'Body', level: 'beginner' },
    { english: 'face', russian: 'лицо', kazakh: 'бет', category: 'Body', level: 'beginner' },
    { english: 'eye', russian: 'глаз', kazakh: 'көз', category: 'Body', level: 'beginner' },
    { english: 'ear', russian: 'ухо', kazakh: 'құлақ', category: 'Body', level: 'beginner' },
    { english: 'nose', russian: 'нос', kazakh: 'мұрын', category: 'Body', level: 'beginner' },
    { english: 'mouth', russian: 'рот', kazakh: 'ауыз', category: 'Body', level: 'beginner' },
    { english: 'tooth', russian: 'зуб', kazakh: 'тіс', category: 'Body', level: 'beginner' },
    { english: 'tongue', russian: 'язык', kazakh: 'тіл', category: 'Body', level: 'beginner' },
    { english: 'neck', russian: 'шея', kazakh: 'мойын', category: 'Body', level: 'beginner' },
    { english: 'shoulder', russian: 'плечо', kazakh: 'иық', category: 'Body', level: 'beginner' },
    { english: 'arm', russian: 'рука', kazakh: 'қол', category: 'Body', level: 'beginner' },
    { english: 'hand', russian: 'кисть руки', kazakh: 'алақан', category: 'Body', level: 'beginner' },
    { english: 'finger', russian: 'палец', kazakh: 'саусақ', category: 'Body', level: 'beginner' },
    { english: 'thumb', russian: 'большой палец', kazakh: 'бас бармақ', category: 'Body', level: 'beginner' },
    { english: 'chest', russian: 'грудь', kazakh: 'кеуде', category: 'Body', level: 'beginner' },
    { english: 'back', russian: 'спина', kazakh: 'арқа', category: 'Body', level: 'beginner' },
    { english: 'stomach', russian: 'живот', kazakh: 'қарын', category: 'Body', level: 'beginner' },
    { english: 'leg', russian: 'нога', kazakh: 'аяқ', category: 'Body', level: 'beginner' },
    { english: 'knee', russian: 'колено', kazakh: 'тізе', category: 'Body', level: 'beginner' },
    { english: 'foot', russian: 'ступня', kazakh: 'табан', category: 'Body', level: 'beginner' },
    { english: 'toe', russian: 'палец ноги', kazakh: 'аяқ саусағы', category: 'Body', level: 'beginner' },
    { english: 'heart', russian: 'сердце', kazakh: 'жүрек', category: 'Body', level: 'beginner' },
    { english: 'brain', russian: 'мозг', kazakh: 'ми', category: 'Body', level: 'beginner' },
    { english: 'skin', russian: 'кожа', kazakh: 'тері', category: 'Body', level: 'beginner' },
    { english: 'bone', russian: 'кость', kazakh: 'сүйек', category: 'Body', level: 'beginner' },
    { english: 'blood', russian: 'кровь', kazakh: 'қан', category: 'Body', level: 'beginner' },
    { english: 'elbow', russian: 'локоть', kazakh: 'шынтақ', category: 'Body', level: 'beginner' },
    { english: 'wrist', russian: 'запястье', kazakh: 'білек', category: 'Body', level: 'beginner' },
    { english: 'ankle', russian: 'лодыжка', kazakh: 'өкше', category: 'Body', level: 'beginner' },

    // Clothes - 30 слов
    { english: 'shirt', russian: 'рубашка', kazakh: 'жейде', category: 'Clothes', level: 'beginner' },
    { english: 'pants', russian: 'брюки', kazakh: 'шалбар', category: 'Clothes', level: 'beginner' },
    { english: 'dress', russian: 'платье', kazakh: 'көйлек', category: 'Clothes', level: 'beginner' },
    { english: 'skirt', russian: 'юбка', kazakh: 'белдем��е', category: 'Clothes', level: 'beginner' },
    { english: 'shoes', russian: 'туфли', kazakh: 'аяқ киім', category: 'Clothes', level: 'beginner' },
    { english: 'socks', russian: 'носки', kazakh: 'шұлық', category: 'Clothes', level: 'beginner' },
    { english: 'hat', russian: 'шляпа', kazakh: 'қалпақ', category: 'Clothes', level: 'beginner' },
    { english: 'cap', russian: 'кепка', kazakh: 'бөрік', category: 'Clothes', level: 'beginner' },
    { english: 'coat', russian: 'пальто', kazakh: 'пальто', category: 'Clothes', level: 'beginner' },
    { english: 'jacket', russian: 'куртка', kazakh: 'күрте', category: 'Clothes', level: 'beginner' },
    { english: 'sweater', russian: 'свитер', kazakh: 'жемпір', category: 'Clothes', level: 'beginner' },
    { english: 't-shirt', russian: 'футболка', kazakh: 'футболка', category: 'Clothes', level: 'beginner' },
    { english: 'jeans', russian: 'джинсы', kazakh: 'джинсы', category: 'Clothes', level: 'beginner' },
    { english: 'shorts', russian: 'шорты', kazakh: 'шорты', category: 'Clothes', level: 'beginner' },
    { english: 'gloves', russian: 'перчатки', kazakh: 'қолғап', category: 'Clothes', level: 'beginner' },
    { english: 'scarf', russian: 'шарф', kazakh: 'шарф', category: 'Clothes', level: 'beginner' },
    { english: 'boots', russian: 'сапоги', kazakh: 'етік', category: 'Clothes', level: 'beginner' },
    { english: 'sandals', russian: 'сандалии', kazakh: 'сандалия', category: 'Clothes', level: 'beginner' },
    { english: 'slippers', russian: 'тапочки', kazakh: 'тәпішке', category: 'Clothes', level: 'beginner' },
    { english: 'belt', russian: 'ремень', kazakh: 'белбеу', category: 'Clothes', level: 'beginner' },
    { english: 'tie', russian: 'галстук', kazakh: 'галстук', category: 'Clothes', level: 'beginner' },
    { english: 'suit', russian: 'костюм', kazakh: 'костюм', category: 'Clothes', level: 'beginner' },
    { english: 'uniform', russian: 'форма', kazakh: 'форма', category: 'Clothes', level: 'beginner' },
    { english: 'underwear', russian: 'нижнее белье', kazakh: 'іш киім', category: 'Clothes', level: 'beginner' },
    { english: 'pajamas', russian: 'пижама', kazakh: 'жатын киім', category: 'Clothes', level: 'beginner' },
    { english: 'raincoat', russian: 'дождевик', kazakh: 'жаңбыр киім', category: 'Clothes', level: 'beginner' },
    { english: 'umbrella', russian: 'зонт', kazakh: 'қолшатыр', category: 'Clothes', level: 'beginner' },
    { english: 'glasses', russian: 'очки', kazakh: 'көзілдірік', category: 'Clothes', level: 'beginner' },
    { english: 'watch', russian: 'часы', kazakh: 'сағат', category: 'Clothes', level: 'beginner' },
    { english: 'jewelry', russian: 'украшения', kazakh: 'зергерлік бұйым', category: 'Clothes', level: 'beginner' },

    // Fruits - 25 слов
    { english: 'apple', russian: 'яблоко', kazakh: 'алма', category: 'Fruits', level: 'beginner' },
    { english: 'banana', russian: 'банан', kazakh: 'банан', category: 'Fruits', level: 'beginner' },
    { english: 'orange', russian: 'апельсин', kazakh: 'апельсин', category: 'Fruits', level: 'beginner' },
    { english: 'grape', russian: 'виноград', kazakh: 'жүзім', category: 'Fruits', level: 'beginner' },
    { english: 'strawberry', russian: 'клубника', kazakh: 'құлпынай', category: 'Fruits', level: 'beginner' },
    { english: 'watermelon', russian: 'арбуз', kazakh: 'қарбыз', category: 'Fruits', level: 'beginner' },
    { english: 'melon', russian: 'дыня', kazakh: 'қауын', category: 'Fruits', level: 'beginner' },
    { english: 'pear', russian: 'груша', kazakh: 'алмұрт', category: 'Fruits', level: 'beginner' },
    { english: 'peach', russian: 'персик', kazakh: 'шабдалы', category: 'Fruits', level: 'beginner' },
    { english: 'plum', russian: 'слива', kazakh: '��лхоры', category: 'Fruits', level: 'beginner' },
    { english: 'cherry', russian: 'вишня', kazakh: 'шие', category: 'Fruits', level: 'beginner' },
    { english: 'lemon', russian: 'лимон', kazakh: 'лимон', category: 'Fruits', level: 'beginner' },
    { english: 'lime', russian: 'лайм', kazakh: 'лайм', category: 'Fruits', level: 'beginner' },
    { english: 'kiwi', russian: 'киви', kazakh: 'киви', category: 'Fruits', level: 'beginner' },
    { english: 'mango', russian: 'манго', kazakh: 'манго', category: 'Fruits', level: 'beginner' },
    { english: 'pineapple', russian: 'ананас', kazakh: 'ананас', category: 'Fruits', level: 'beginner' },
    { english: 'coconut', russian: 'кокос', kazakh: 'кокос', category: 'Fruits', level: 'beginner' },
    { english: 'apricot', russian: 'абрикос', kazakh: 'өрік', category: 'Fruits', level: 'beginner' },
    { english: 'raspberry', russian: 'малина', kazakh: 'таңқурай', category: 'Fruits', level: 'beginner' },
    { english: 'blueberry', russian: 'черника', kazakh: 'қара жидек', category: 'Fruits', level: 'beginner' },
    { english: 'blackberry', russian: 'ежевика', kazakh: 'қара өрік', category: 'Fruits', level: 'beginner' },
    { english: 'pomegranate', russian: 'гранат', kazakh: 'анар', category: 'Fruits', level: 'beginner' },
    { english: 'avocado', russian: 'авокадо', kazakh: 'авокадо', category: 'Fruits', level: 'beginner' },
    { english: 'papaya', russian: 'папайя', kazakh: 'папайя', category: 'Fruits', level: 'beginner' },
    { english: 'fig', russian: 'инжир', kazakh: 'інжір', category: 'Fruits', level: 'beginner' },

    // Vegetables - 25 слов
    { english: 'carrot', russian: 'морковь', kazakh: 'сәбіз', category: 'Vegetables', level: 'beginner' },
    { english: 'potato', russian: 'картофель', kazakh: 'картоп', category: 'Vegetables', level: 'beginner' },
    { english: 'tomato', russian: 'помидор', kazakh: 'қызанақ', category: 'Vegetables', level: 'beginner' },
    { english: 'cucumber', russian: 'огурец', kazakh: 'қияр', category: 'Vegetables', level: 'beginner' },
    { english: 'onion', russian: 'лук', kazakh: 'пияз', category: 'Vegetables', level: 'beginner' },
    { english: 'garlic', russian: 'чеснок', kazakh: 'сарымсақ', category: 'Vegetables', level: 'beginner' },
    { english: 'pepper', russian: 'перец', kazakh: 'бұрыш', category: 'Vegetables', level: 'beginner' },
    { english: 'cabbage', russian: 'капуста', kazakh: 'қырыққабат', category: 'Vegetables', level: 'beginner' },
    { english: 'lettuce', russian: 'салат', kazakh: 'сал��т', category: 'Vegetables', level: 'beginner' },
    { english: 'broccoli', russian: 'брокколи', kazakh: 'брокколи', category: 'Vegetables', level: 'beginner' },
    { english: 'cauliflower', russian: 'цветная капуста', kazakh: 'гүлді қырыққабат', category: 'Vegetables', level: 'beginner' },
    { english: 'pumpkin', russian: 'тыква', kazakh: 'асқабақ', category: 'Vegetables', level: 'beginner' },
    { english: 'eggplant', russian: 'баклажан', kazakh: 'бадамжан', category: 'Vegetables', level: 'beginner' },
    { english: 'zucchini', russian: 'кабачок', kazakh: 'кәді', category: 'Vegetables', level: 'beginner' },
    { english: 'corn', russian: 'кукуруза', kazakh: 'жүгері', category: 'Vegetables', level: 'beginner' },
    { english: 'peas', russian: 'горох', kazakh: 'бұршақ', category: 'Vegetables', level: 'beginner' },
    { english: 'beans', russian: 'фасоль', kazakh: 'бұршақ', category: 'Vegetables', level: 'beginner' },
    { english: 'spinach', russian: 'шпинат', kazakh: 'шпинат', category: 'Vegetables', level: 'beginner' },
    { english: 'celery', russian: 'сельдерей', kazakh: 'селдерей', category: 'Vegetables', level: 'beginner' },
    { english: 'beetroot', russian: 'свекла', kazakh: 'қызылша', category: 'Vegetables', level: 'beginner' },
    { english: 'radish', russian: 'редис', kazakh: 'редис', category: 'Vegetables', level: 'beginner' },
    { english: 'turnip', russian: 'репа', kazakh: 'шалғам', category: 'Vegetables', level: 'beginner' },
    { english: 'mushroom', russian: 'гриб', kazakh: 'саңырауқұлақ', category: 'Vegetables', level: 'beginner' },
    { english: 'asparagus', russian: 'спаржа', kazakh: 'спаржа', category: 'Vegetables', level: 'beginner' },
    { english: 'artichoke', russian: 'артишок', kazakh: 'артишок', category: 'Vegetables', level: 'beginner' },

    // Toys - 20 слов
    { english: 'ball', russian: 'мяч', kazakh: 'до', category: 'Toys', level: 'beginner' },
    { english: 'doll', russian: 'кукла', kazakh: 'қуыршақ', category: 'Toys', level: 'beginner' },
    { english: 'toy', russian: 'игрушка', kazakh: 'ойыншық', category: 'Toys', level: 'beginner' },
    { english: 'car', russian: 'машинка', kazakh: 'машина', category: 'Toys', level: 'beginner' },
    { english: 'train', russian: 'поезд', kazakh: 'пойыз', category: 'Toys', level: 'beginner' },
    { english: 'plane', russian: 'самолет', kazakh: 'ұшақ', category: 'Toys', level: 'beginner' },
    { english: 'robot', russian: 'робот', kazakh: 'робот', category: 'Toys', level: 'beginner' },
    { english: 'puzzle', russian: 'пазл', kazakh: 'пазл', category: 'Toys', level: 'beginner' },
    { english: 'blocks', russian: 'кубики', kazakh: 'кубиктер', category: 'Toys', level: 'beginner' },
    { english: 'teddy bear', russian: 'плюшевый мишка', kazakh: 'аю ойыншық', category: 'Toys', level: 'beginner' },
    { english: 'kite', russian: 'воздушный змей', kazakh: 'елбезек', category: 'Toys', level: 'beginner' },
    { english: 'balloon', russian: 'воздушный шар', kazakh: 'доп', category: 'Toys', level: 'beginner' },
    { english: 'bicycle', russian: 'велосипед', kazakh: 'велосипед', category: 'Toys', level: 'beginner' },
    { english: 'scooter', russian: 'самокат', kazakh: 'самокат', category: 'Toys', level: 'beginner' },
    { english: 'swing', russian: 'качели', kazakh: 'тербел', category: 'Toys', level: 'beginner' },
    { english: 'slide', russian: 'горка', kazakh: 'сырғанақ', category: 'Toys', level: 'beginner' },
    { english: 'sandbox', russian: 'песочница', kazakh: 'құм орны', category: 'Toys', level: 'beginner' },
    { english: 'jump rope', russian: 'скакалка', kazakh: 'секіртпе', category: 'Toys', level: 'beginner' },
    { english: 'marbles', russian: 'шарики', kazakh: 'шариктер', category: 'Toys', level: 'beginner' },
    { english: 'yo-yo', russian: 'йо-йо', kazakh: 'йо-йо', category: 'Toys', level: 'beginner' },

    // Transport - 20 слов
    { english: 'car', russian: 'машина', kazakh: 'көлік', category: 'Transport', level: 'beginner' },
    { english: 'bus', russian: 'автобус', kazakh: 'автобус', category: 'Transport', level: 'beginner' },
    { english: 'train', russian: 'поезд', kazakh: 'пойыз', category: 'Transport', level: 'beginner' },
    { english: 'plane', russian: 'самолет', kazakh: 'ұшақ', category: 'Transport', level: 'beginner' },
    { english: 'ship', russian: 'корабль', kazakh: 'кеме', category: 'Transport', level: 'beginner' },
    { english: 'boat', russian: 'лодка', kazakh: 'қайық', category: 'Transport', level: 'beginner' },
    { english: 'bicycle', russian: 'велосипед', kazakh: 'велосипед', category: 'Transport', level: 'beginner' },
    { english: 'motorcycle', russian: 'мотоцикл', kazakh: 'мотоцикл', category: 'Transport', level: 'beginner' },
    { english: 'truck', russian: 'грузовик', kazakh: 'жүк көлік', category: 'Transport', level: 'beginner' },
    { english: 'taxi', russian: 'такси', kazakh: 'такси', category: 'Transport', level: 'beginner' },
    { english: 'helicopter', russian: 'вертолет', kazakh: 'тікұшақ', category: 'Transport', level: 'beginner' },
    { english: 'subway', russian: 'метро', kazakh: 'метро', category: 'Transport', level: 'beginner' },
    { english: 'tram', russian: 'трамвай', kazakh: 'трамвай', category: 'Transport', level: 'beginner' },
    { english: 'trolleybus', russian: 'троллейбус', kazakh: 'троллейбус', category: 'Transport', level: 'beginner' },
    { english: 'ambulance', russian: 'скорая помощь', kazakh: 'жедел жәрдем', category: 'Transport', level: 'beginner' },
    { english: 'fire truck', russian: 'пожарная машина', kazakh: 'өрт сөндіру', category: 'Transport', level: 'beginner' },
    { english: 'police car', russian: 'полицейская машина', kazakh: 'полиция көлігі', category: 'Transport', level: 'beginner' },
    { english: 'van', russian: 'фургон', kazakh: 'фургон', category: 'Transport', level: 'beginner' },
    { english: 'scooter', russian: 'самокат', kazakh: 'самокат', category: 'Transport', level: 'beginner' },
    { english: 'rocket', russian: 'ракета', kazakh: 'зымыран', category: 'Transport', level: 'beginner' },
  ],
  
  'elementary': [
    // Здесь будет 300 слов для Elementary
    // Для демонстрации добавлю первые несколько
    { english: 'bread', russian: 'хлеб', kazakh: 'нан', category: 'Food', level: 'elementary' },
    { english: 'milk', russian: 'молоко', kazakh: 'сүт', category: 'Food', level: 'elementary' },
    { english: 'water', russian: 'вода', kazakh: 'су', category: 'Food', level: 'elementary' },
    // ... добавим остальные позже
  ],
  
  'pre-intermediate': [
    { english: 'adventure', russian: 'приключение', kazakh: 'шытырман оқиға', category: 'Abstract', level: 'pre-intermediate' },
  ],
  'intermediate': [
    { english: 'achievement', russian: 'достижение', kazakh: 'жетістік', category: 'Abstract', level: 'intermediate' },
  ],
  'upper-intermediate': [
    { english: 'ambitious', russian: 'амбициозный', kazakh: 'асқақ мақсатты', category: 'Adjectives', level: 'upper-intermediate' },
  ]
};

// Получить список всех категорий для уровня
export function getCategoriesForLevel(level: Level): string[] {
  const words = WORDS_BY_LEVEL[level] || [];
  const categories = new Set(words.map(w => w.category));
  return Array.from(categories);
}

// Получить слова по категории и уровню
export function getWordsByCategory(level: Level, category: string): Word[] {
  const words = WORDS_BY_LEVEL[level] || [];
  return words.filter(w => w.category === category);
}