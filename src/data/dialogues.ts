export interface DialogueLine {
  /** A/B hablan; N = narración (lecturas) */
  who: 'A' | 'B' | 'N'
  zh: string
  py: string
  es: string
}

export interface Dialogue {
  id: string
  icon: string
  title: string
  lines: DialogueLine[]
  question: { q: string; options: string[]; answer: number }
}

/** Diálogos cortos con vocabulario del HSK 1 */
export const DIALOGUES: Dialogue[] = [
  {
    id: 'presentarse',
    icon: '👋',
    title: 'Presentarse',
    lines: [
      { who: 'A', zh: '你好！你叫什么名字？', py: 'Nǐ hǎo! Nǐ jiào shénme míngzi?', es: '¡Hola! ¿Cómo te llamas?' },
      { who: 'B', zh: '我叫小月。你呢？', py: 'Wǒ jiào Xiǎo Yuè. Nǐ ne?', es: 'Me llamo Xiao Yue. ¿Y tú?' },
      { who: 'A', zh: '我叫大明。认识你很高兴！', py: 'Wǒ jiào Dà Míng. Rènshi nǐ hěn gāoxìng!', es: 'Me llamo Da Ming. ¡Encantado de conocerte!' },
      { who: 'B', zh: '你是学生吗？', py: 'Nǐ shì xuésheng ma?', es: '¿Eres estudiante?' },
      { who: 'A', zh: '是，我在北京学习汉语。', py: 'Shì, wǒ zài Běijīng xuéxí Hànyǔ.', es: 'Sí, estudio chino en Pekín.' },
    ],
    question: { q: '¿Dónde estudia Da Ming?', options: ['En Pekín', 'En el hospital', 'En casa'], answer: 0 },
  },
  {
    id: 'restaurante',
    icon: '🍜',
    title: 'En el restaurante',
    lines: [
      { who: 'A', zh: '你想吃什么？', py: 'Nǐ xiǎng chī shénme?', es: '¿Qué quieres comer?' },
      { who: 'B', zh: '我想吃米饭和中国菜。', py: 'Wǒ xiǎng chī mǐfàn hé Zhōngguó cài.', es: 'Quiero arroz y comida china.' },
      { who: 'A', zh: '你喝什么？茶吗？', py: 'Nǐ hē shénme? Chá ma?', es: '¿Qué bebes? ¿Té?' },
      { who: 'B', zh: '不，我喝水。谢谢！', py: 'Bù, wǒ hē shuǐ. Xièxie!', es: 'No, bebo agua. ¡Gracias!' },
    ],
    question: { q: '¿Qué bebe B?', options: ['Té', 'Agua', 'Nada'], answer: 1 },
  },
  {
    id: 'tienda',
    icon: '🛍️',
    title: 'En la tienda',
    lines: [
      { who: 'A', zh: '你好！这个杯子多少钱？', py: 'Nǐ hǎo! Zhège bēizi duōshao qián?', es: '¡Hola! ¿Cuánto cuesta este vaso?' },
      { who: 'B', zh: '三十块。', py: 'Sānshí kuài.', es: 'Treinta yuanes.' },
      { who: 'A', zh: '太大了。那个呢？', py: 'Tài dà le. Nàge ne?', es: 'Es demasiado grande. ¿Y aquel?' },
      { who: 'B', zh: '那个二十块。', py: 'Nàge èrshí kuài.', es: 'Aquel, veinte yuanes.' },
      { who: 'A', zh: '好，我买那个。', py: 'Hǎo, wǒ mǎi nàge.', es: 'Vale, compro aquel.' },
    ],
    question: { q: '¿Cuánto paga A?', options: ['30 yuanes', '3 yuanes', '20 yuanes'], answer: 2 },
  },
  {
    id: 'telefono',
    icon: '📞',
    title: 'Por teléfono',
    lines: [
      { who: 'A', zh: '喂，你好！你现在在家吗？', py: 'Wéi, nǐ hǎo! Nǐ xiànzài zài jiā ma?', es: '¿Diga? ¡Hola! ¿Estás en casa ahora?' },
      { who: 'B', zh: '不在，我在医院。', py: 'Bú zài, wǒ zài yīyuàn.', es: 'No, estoy en el hospital.' },
      { who: 'A', zh: '你怎么了？', py: 'Nǐ zěnme le?', es: '¿Qué te pasa?' },
      { who: 'B', zh: '我很好！我妈妈在医院工作。', py: 'Wǒ hěn hǎo! Wǒ māma zài yīyuàn gōngzuò.', es: '¡Estoy bien! Mi mamá trabaja en el hospital.' },
      { who: 'A', zh: '好，明天见！', py: 'Hǎo, míngtiān jiàn!', es: 'Vale, ¡hasta mañana!' },
    ],
    question: { q: '¿Por qué está B en el hospital?', options: ['Está enfermo', 'Su madre trabaja allí', 'Es médico'], answer: 1 },
  },
  {
    id: 'tiempo',
    icon: '🌧️',
    title: 'Hablar del tiempo',
    lines: [
      { who: 'A', zh: '今天天气怎么样？', py: 'Jīntiān tiānqì zěnmeyàng?', es: '¿Qué tiempo hace hoy?' },
      { who: 'B', zh: '很冷，下雨了。', py: 'Hěn lěng, xiàyǔ le.', es: 'Hace mucho frío y está lloviendo.' },
      { who: 'A', zh: '明天呢？', py: 'Míngtiān ne?', es: '¿Y mañana?' },
      { who: 'B', zh: '明天很热。', py: 'Míngtiān hěn rè.', es: 'Mañana hará mucho calor.' },
      { who: 'A', zh: '太好了！明天我们去商店。', py: 'Tài hǎo le! Míngtiān wǒmen qù shāngdiàn.', es: '¡Genial! Mañana vamos a la tienda.' },
    ],
    question: { q: '¿Qué tiempo hace hoy?', options: ['Calor', 'Frío y lluvia', 'Sol'], answer: 1 },
  },
  {
    id: 'taxi',
    icon: '🚕',
    title: 'En taxi',
    lines: [
      { who: 'A', zh: '你好！去火车站吗？', py: 'Nǐ hǎo! Qù huǒchēzhàn ma?', es: '¡Hola! ¿Va a la estación de tren?' },
      { who: 'B', zh: '不，我去北京饭店。', py: 'Bù, wǒ qù Běijīng Fàndiàn.', es: 'No, voy al Hotel Pekín.' },
      { who: 'A', zh: '好。你是中国人吗？', py: 'Hǎo. Nǐ shì Zhōngguó rén ma?', es: 'Vale. ¿Es usted chino?' },
      { who: 'B', zh: '不是，我在中国学习汉语。', py: 'Bú shì, wǒ zài Zhōngguó xuéxí Hànyǔ.', es: 'No, estudio chino en China.' },
      { who: 'A', zh: '你的汉语很好！', py: 'Nǐ de Hànyǔ hěn hǎo!', es: '¡Su chino es muy bueno!' },
      { who: 'B', zh: '谢谢！', py: 'Xièxie!', es: '¡Gracias!' },
    ],
    question: { q: '¿Adónde va B?', options: ['A la estación de tren', 'Al Hotel Pekín', 'A la escuela'], answer: 1 },
  },
  {
    id: 'familia',
    icon: '👨‍👩‍👧',
    title: 'La familia',
    lines: [
      { who: 'A', zh: '你家有几个人？', py: 'Nǐ jiā yǒu jǐ ge rén?', es: '¿Cuántos sois en tu familia?' },
      { who: 'B', zh: '我家有四个人：爸爸、妈妈、我和我女儿。', py: 'Wǒ jiā yǒu sì ge rén: bàba, māma, wǒ hé wǒ nǚ’ér.', es: 'Somos cuatro: papá, mamá, yo y mi hija.' },
      { who: 'A', zh: '你女儿几岁？', py: 'Nǐ nǚ’ér jǐ suì?', es: '¿Cuántos años tiene tu hija?' },
      { who: 'B', zh: '她六岁。她很喜欢猫。', py: 'Tā liù suì. Tā hěn xǐhuan māo.', es: 'Tiene seis años. Le encantan los gatos.' },
    ],
    question: { q: '¿Cuántos años tiene la hija?', options: ['4', '6', '10'], answer: 1 },
  },
  {
    id: 'hora',
    icon: '⏰',
    title: 'Quedar a una hora',
    lines: [
      { who: 'A', zh: '你明天下午做什么？', py: 'Nǐ míngtiān xiàwǔ zuò shénme?', es: '¿Qué haces mañana por la tarde?' },
      { who: 'B', zh: '我没有工作。', py: 'Wǒ méiyǒu gōngzuò.', es: 'No tengo trabajo (estoy libre).' },
      { who: 'A', zh: '我们去看电影，怎么样？', py: 'Wǒmen qù kàn diànyǐng, zěnmeyàng?', es: 'Vamos al cine, ¿qué te parece?' },
      { who: 'B', zh: '好！几点？', py: 'Hǎo! Jǐ diǎn?', es: '¡Vale! ¿A qué hora?' },
      { who: 'A', zh: '下午三点，在电影院前面。', py: 'Xiàwǔ sān diǎn, zài diànyǐngyuàn qiánmian.', es: 'A las tres de la tarde, delante del cine.' },
    ],
    question: { q: '¿A qué hora quedan?', options: ['A las 3 de la tarde', 'A las 10 de la mañana', 'A mediodía'], answer: 0 },
  },
  {
    id: 'clase',
    icon: '🏫',
    title: 'En clase',
    lines: [
      { who: 'A', zh: '老师，这个字怎么写？', py: 'Lǎoshī, zhège zì zěnme xiě?', es: 'Profe, ¿cómo se escribe este carácter?' },
      { who: 'B', zh: '你看，先写上面，再写下面。', py: 'Nǐ kàn, xiān xiě shàngmian, zài xiě xiàmian.', es: 'Mira: primero la parte de arriba, luego la de abajo.' },
      { who: 'A', zh: '谢谢老师！我会写了。', py: 'Xièxie lǎoshī! Wǒ huì xiě le.', es: '¡Gracias, profe! Ya sé escribirlo.' },
      { who: 'B', zh: '很好！你的汉语怎么样了？', py: 'Hěn hǎo! Nǐ de Hànyǔ zěnmeyàng le?', es: '¡Muy bien! ¿Qué tal va tu chino?' },
      { who: 'A', zh: '我能说一点儿，也能看一些字。', py: 'Wǒ néng shuō yìdiǎnr, yě néng kàn yìxiē zì.', es: 'Puedo hablar un poco y leer algunos caracteres.' },
    ],
    question: { q: '¿Qué pregunta el alumno?', options: ['Cómo se pronuncia una palabra', 'Cómo se escribe un carácter', 'Qué hora es'], answer: 1 },
  },
  {
    id: 'lectura-familia',
    icon: '🏠',
    title: 'Lectura: mi familia',
    lines: [
      { who: 'N', zh: '我叫大明，我是中国人。', py: 'Wǒ jiào Dà Míng, wǒ shì Zhōngguó rén.', es: 'Me llamo Da Ming, soy chino.' },
      { who: 'N', zh: '我家在北京。', py: 'Wǒ jiā zài Běijīng.', es: 'Mi casa está en Pekín.' },
      { who: 'N', zh: '我爸爸是医生，他在医院工作。', py: 'Wǒ bàba shì yīshēng, tā zài yīyuàn gōngzuò.', es: 'Mi papá es médico, trabaja en un hospital.' },
      { who: 'N', zh: '我妈妈是老师。', py: 'Wǒ māma shì lǎoshī.', es: 'Mi mamá es profesora.' },
      { who: 'N', zh: '我们家有一个小狗。', py: 'Wǒmen jiā yǒu yí ge xiǎo gǒu.', es: 'En casa tenemos un perrito.' },
      { who: 'N', zh: '我很爱我的家。', py: 'Wǒ hěn ài wǒ de jiā.', es: 'Quiero mucho a mi familia.' },
    ],
    question: { q: '¿Qué hace el padre de Da Ming?', options: ['Es médico', 'Es profesor', 'Es taxista'], answer: 0 },
  },
  {
    id: 'lectura-dia',
    icon: '☀️',
    title: 'Lectura: mi día',
    lines: [
      { who: 'N', zh: '我上午七点吃饭。', py: 'Wǒ shàngwǔ qī diǎn chī fàn.', es: 'Desayuno a las siete de la mañana.' },
      { who: 'N', zh: '八点我坐出租车去学校。', py: 'Bā diǎn wǒ zuò chūzūchē qù xuéxiào.', es: 'A las ocho voy a la escuela en taxi.' },
      { who: 'N', zh: '我在学校学习汉语。', py: 'Wǒ zài xuéxiào xuéxí Hànyǔ.', es: 'En la escuela estudio chino.' },
      { who: 'N', zh: '中午我和同学去饭店吃米饭。', py: 'Zhōngwǔ wǒ hé tóngxué qù fàndiàn chī mǐfàn.', es: 'A mediodía voy con mis compañeros a comer arroz a un restaurante.' },
      { who: 'N', zh: '下午我回家看书。', py: 'Xiàwǔ wǒ huí jiā kàn shū.', es: 'Por la tarde vuelvo a casa a leer.' },
      { who: 'N', zh: '我十一点睡觉。', py: 'Wǒ shíyī diǎn shuìjiào.', es: 'Me acuesto a las once.' },
    ],
    question: { q: '¿Cómo va a la escuela?', options: ['En avión', 'En taxi', 'Andando'], answer: 1 },
  },
  {
    id: 'lectura-lluvia',
    icon: '☔',
    title: 'Lectura: un día de lluvia',
    lines: [
      { who: 'N', zh: '今天是星期六。', py: 'Jīntiān shì xīngqīliù.', es: 'Hoy es sábado.' },
      { who: 'N', zh: '天气不好，很冷，下雨了。', py: 'Tiānqì bù hǎo, hěn lěng, xiàyǔ le.', es: 'Hace mal tiempo: frío y lluvia.' },
      { who: 'N', zh: '我不想去商店。', py: 'Wǒ bù xiǎng qù shāngdiàn.', es: 'No quiero ir a la tienda.' },
      { who: 'N', zh: '我在家喝茶，看电视。', py: 'Wǒ zài jiā hē chá, kàn diànshì.', es: 'En casa tomo té y veo la tele.' },
      { who: 'N', zh: '我的猫在椅子上睡觉。', py: 'Wǒ de māo zài yǐzi shang shuìjiào.', es: 'Mi gato duerme en la silla.' },
      { who: 'N', zh: '明天会很热，我想和朋友去看电影。', py: 'Míngtiān huì hěn rè, wǒ xiǎng hé péngyou qù kàn diànyǐng.', es: 'Mañana hará calor; quiero ir al cine con amigos.' },
    ],
    question: { q: '¿Dónde duerme el gato?', options: ['En la mesa', 'En la tienda', 'En la silla'], answer: 2 },
  },
]
