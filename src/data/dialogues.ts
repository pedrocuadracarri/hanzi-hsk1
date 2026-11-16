export interface DialogueLine {
  who: 'A' | 'B'
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
]
