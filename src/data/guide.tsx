import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import SpeakerButton from '../components/SpeakerButton'
import StrokeAnimation from '../components/StrokeAnimation'

/** Ejemplo con audio: carácter, pinyin y explicación */
function Ex({ h, p, m }: { h: string; p: string; m: string }) {
  return (
    <li className="ex-row">
      <span className="hanzi ex-hanzi">{h}</span>
      <span className="ex-text">
        <strong>{p}</strong>
        <small className="muted">{m}</small>
      </span>
      <SpeakerButton text={h} />
    </li>
  )
}

function Sound({ s, d, children }: { s: string; d: string; children: ReactNode }) {
  return (
    <div className="sound">
      <div className="sound-head">
        <span className="sound-letter">{s}</span>
        <span>{d}</span>
      </div>
      <ul className="ex-list">{children}</ul>
    </div>
  )
}

function ToneCurve({ tone }: { tone: 1 | 2 | 3 | 4 }) {
  const paths = { 1: 'M5 8 L55 8', 2: 'M5 30 L55 6', 3: 'M5 18 Q22 40 38 34 T55 8', 4: 'M5 6 L55 36' }
  return (
    <svg viewBox="0 0 60 42" className="tone-curve" aria-hidden>
      <path d={paths[tone]} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

export interface Lesson {
  id: string
  icon: string
  title: string
  summary: string
  body: () => ReactNode
}

export const LESSONS: Lesson[] = [
  {
    id: 'empieza',
    icon: '🚀',
    title: 'Empieza aquí',
    summary: 'Qué vas a aprender y cómo usar la app',
    body: () => (
      <>
        <p>
          El <strong>HSK</strong> es el examen oficial de chino mandarín. El nivel 1 tiene <strong>150 palabras</strong>{' '}
          básicas: saludos, números, familia, comida… Con ellas ya puedes presentarte y entender frases sencillas.
        </p>
        <p>Cada palabra tiene tres partes:</p>
        <ul className="bullets">
          <li>
            <strong>Hanzi</strong> (汉字): el carácter chino, que representa una idea, no un sonido.
          </li>
          <li>
            <strong>Pinyin</strong>: cómo se pronuncia, escrito con nuestro alfabeto.
          </li>
          <li>
            <strong>Tono</strong>: la «melodía» de cada sílaba. Cambia el significado: mā (mamá) no es mǎ (caballo).
          </li>
        </ul>
        <h3>Rutina recomendada (10–15 minutos al día)</h3>
        <ol className="bullets">
          <li>Lee las lecciones de esta guía, sobre todo Pinyin y Tonos. Vuelve a ellas cuando quieras.</li>
          <li>
            Haz rondas de <Link to="/emparejar">Emparejar</Link> en modo Emoji: cada palabra nueva se presenta antes de
            practicarla.
          </li>
          <li>
            Repasa con <Link to="/tarjetas">Tarjetas</Link> y <Link to="/escuchar">Escuchar</Link>.
          </li>
          <li>
            Cuando conozcas unas cuantas, prueba a <Link to="/escribir">Escribir</Link>.
          </li>
          <li>Vuelve cada día: lo pendiente de repaso sale primero y la racha 🔥 te ayuda a mantener el hábito.</li>
        </ol>
        <p className="tip">
          💡 Toca cualquier carácter para abrir su ficha: verás sus piezas, una historia para recordarlo y cómo se escribe.
        </p>
      </>
    ),
  },
  {
    id: 'pinyin',
    icon: '🔤',
    title: 'Pinyin: cómo se pronuncia',
    summary: 'Los sonidos que no existen en español',
    body: () => (
      <>
        <p>
          El pinyin usa letras latinas, pero <strong>no todas suenan como en español</strong>. Estos son los sonidos que
          más cuestan. Pulsa 🔊 para escucharlos.
        </p>
        <h3>Consonantes</h3>
        <Sound s="b · d · g" d="Casi como en español, pero más secas.">
          <Ex h="八" p="bā" m="ocho" />
          <Ex h="大" p="dà" m="grande" />
          <Ex h="个" p="gè" m="clasificador" />
        </Sound>
        <Sound s="p · t · k" d="Igual, pero con un soplo de aire fuerte (pon la mano delante de la boca).">
          <Ex h="朋友" p="péng you" m="amigo" />
          <Ex h="太" p="tài" m="demasiado" />
          <Ex h="看" p="kàn" m="mirar" />
        </Sound>
        <Sound s="h" d="Como una «j» española suave.">
          <Ex h="好" p="hǎo" m="bien" />
          <Ex h="喝" p="hē" m="beber" />
        </Sound>
        <Sound s="j · q · x" d="Con la lengua pegada a los dientes de abajo y sonriendo. j ≈ «ch» suave; q ≈ «ch» con soplo; x ≈ entre «s» y «sh».">
          <Ex h="九" p="jiǔ" m="nueve" />
          <Ex h="七" p="qī" m="siete" />
          <Ex h="谢谢" p="xiè xie" m="gracias" />
        </Sound>
        <Sound s="zh · ch · sh · r" d="Con la punta de la lengua doblada hacia atrás. zh ≈ «ch» sin soplo; ch con soplo; sh ≈ «sh» inglesa; r ≈ entre «r» inglesa y «y».">
          <Ex h="中国" p="Zhōng guó" m="China" />
          <Ex h="吃" p="chī" m="comer" />
          <Ex h="是" p="shì" m="ser" />
          <Ex h="人" p="rén" m="persona" />
        </Sound>
        <Sound s="z · c · s" d="z ≈ «ds»; c ≈ «ts» con soplo; s como en español.">
          <Ex h="在" p="zài" m="estar en" />
          <Ex h="菜" p="cài" m="plato, verdura" />
          <Ex h="三" p="sān" m="tres" />
        </Sound>
        <h3>Vocales</h3>
        <Sound s="e" d="No es nuestra «e»: es un sonido entre «e» y «o», con los labios relajados.">
          <Ex h="喝" p="hē" m="beber" />
          <Ex h="饿" p="è" m="hambre (extra)" />
        </Sound>
        <Sound s="ü" d="Di «i» poniendo los labios como para la «u» (como la «u» francesa).">
          <Ex h="女儿" p="nǚ ér" m="hija" />
          <Ex h="去" p="qù" m="ir (tras j, q, x la ü se escribe u)" />
        </Sound>
        <Sound s="-i tras z c s zh ch sh r" d="No suena «i»: es un zumbido que prolonga la consonante.">
          <Ex h="四" p="sì" m="cuatro" />
          <Ex h="是" p="shì" m="ser" />
          <Ex h="字" p="zì" m="carácter" />
        </Sound>
        <Sound s="ian · ui · iu" d="ian ≈ «ien»; ui ≈ «uei»; iu ≈ «iou».">
          <Ex h="现在" p="xiàn zài" m="ahora" />
          <Ex h="水" p="shuǐ" m="agua" />
          <Ex h="六" p="liù" m="seis" />
        </Sound>
        <Sound s="-n · -ng" d="-n termina con la lengua arriba; -ng suena nasal, al fondo, como en «tengo».">
          <Ex h="三" p="sān" m="tres" />
          <Ex h="商店" p="shāng diàn" m="tienda" />
        </Sound>
      </>
    ),
  },
  {
    id: 'tonos',
    icon: '🎵',
    title: 'Los 4 tonos',
    summary: 'La melodía que cambia el significado',
    body: () => (
      <>
        <p>
          En chino cada sílaba tiene un <strong>tono</strong>. La misma sílaba «ma» con distintos tonos son palabras
          diferentes. La tilde del pinyin te dice qué tono es.
        </p>
        <div className="tone-table">
          {(
            [
              [1, 'mā', '妈', 'mamá', 'Alto y plano, como cantando una nota larga.'],
              [2, 'má', '麻', 'cáñamo', 'Sube, como cuando preguntas «¿qué?».'],
              [3, 'mǎ', '马', 'caballo', 'Baja y vuelve a subir. Al hablar rápido a menudo solo baja.'],
              [4, 'mà', '骂', 'regañar', 'Cae fuerte y seco, como una orden: «¡ya!».'],
            ] as const
          ).map(([t, p, h, m, d]) => (
            <div key={t} className="tone-row">
              <ToneCurve tone={t} />
              <div className="tone-info">
                <strong>
                  {t}.º tono · {p} <span className="hanzi">{h}</span> «{m}»
                </strong>
                <small className="muted">{d}</small>
              </div>
              <SpeakerButton text={h} />
            </div>
          ))}
          <div className="tone-row">
            <span className="tone-curve neutral">·</span>
            <div className="tone-info">
              <strong>
                Tono neutro · ma <span className="hanzi">吗</span> «¿…?»
              </strong>
              <small className="muted">Corto y suave, sin tilde. Suele aparecer en partículas y sílabas repetidas (bà ba).</small>
            </div>
            <SpeakerButton text="吗" />
          </div>
        </div>
        <p className="tip">
          🎯 Practica con el ejercicio <Link to="/tonos">Tonos</Link>. Al principio a todo el mundo le cuesta: es
          normal.
        </p>
      </>
    ),
  },
  {
    id: 'cambios',
    icon: '🔀',
    title: 'Cambios de tono',
    summary: 'Tres reglas que oirás en todas partes',
    body: () => (
      <>
        <p>Al hablar, algunos tonos cambian según la sílaba que va detrás. Con estas tres reglas cubres casi todo:</p>
        <h3>1. Dos terceros tonos seguidos</h3>
        <p>El primero se pronuncia como segundo tono.</p>
        <ul className="ex-list">
          <Ex h="你好" p="nǐ hǎo → ní hǎo" m="hola" />
          <Ex h="很好" p="hěn hǎo → hén hǎo" m="muy bien" />
        </ul>
        <h3>2. 不 bù antes de cuarto tono</h3>
        <p>Pasa a segundo tono: bú.</p>
        <ul className="ex-list">
          <Ex h="不是" p="bù shì → bú shì" m="no es" />
          <Ex h="不客气" p="bú kè qi" m="de nada" />
        </ul>
        <h3>3. 一 yī</h3>
        <p>Antes de cuarto tono → yí; antes de los demás → yì; contando o al final → yī.</p>
        <ul className="ex-list">
          <Ex h="一个" p="yí gè" m="uno (+ clasificador)" />
          <Ex h="一本书" p="yì běn shū" m="un libro" />
        </ul>
        <p className="tip">📝 En la app el pinyin muestra el tono original de cada palabra (salvo 不客气, que se suele escribir ya cambiado).</p>
      </>
    ),
  },
  {
    id: 'caracteres',
    icon: '🧱',
    title: 'Cómo se forman los caracteres',
    summary: 'Dibujos, combinaciones y pistas de sonido',
    body: () => (
      <>
        <p>Los caracteres no son dibujos al azar: casi todos están hechos de piezas que se repiten.</p>
        <h3>Pictogramas: dibujos simplificados</h3>
        <ul className="ex-list">
          <Ex h="人" p="rén" m="una persona caminando" />
          <Ex h="木" p="mù" m="un árbol con ramas y raíces" />
          <Ex h="日" p="rì" m="el sol" />
          <Ex h="月" p="yuè" m="la luna creciente" />
          <Ex h="口" p="kǒu" m="una boca" />
        </ul>
        <h3>Combinaciones de ideas</h3>
        <ul className="ex-list">
          <Ex h="好" p="hǎo" m="女 mujer + 子 niño = bueno" />
          <Ex h="明" p="míng" m="日 sol + 月 luna = brillante" />
          <Ex h="看" p="kàn" m="手 mano sobre 目 ojo = mirar" />
        </ul>
        <h3>Significado + sonido (¡la mayoría!)</h3>
        <p>Una pieza da la pista del significado y otra la del sonido:</p>
        <ul className="ex-list">
          <Ex h="妈" p="mā" m="女 (mujer) + 马 mǎ (sonido) = mamá" />
          <Ex h="吗" p="ma" m="口 (boca) + 马 mǎ (sonido) = partícula de pregunta" />
        </ul>
        <h3>Piezas que conviene conocer</h3>
        <div className="radical-chips">
          {[
            ['亻', 'persona'], ['口', 'boca'], ['氵', 'agua'], ['讠', 'palabra'], ['女', 'mujer'], ['木', 'árbol'],
            ['扌', 'mano'], ['艹', 'hierba'], ['宀', 'tejado'], ['饣', 'comida'], ['钅', 'metal'], ['日', 'sol'],
            ['月', 'luna / cuerpo'], ['心', 'corazón'], ['犭', 'animal'], ['阝', 'ciudad / colina'],
          ].map(([c, m]) => (
            <Link key={c} to={`/componentes/${encodeURIComponent(c)}`} className="chip">
              <span className="hanzi">{c}</span> <small>{m}</small>
            </Link>
          ))}
        </div>
        <p className="tip">
          🔍 En <Link to="/componentes">Componentes</Link> verás todas las piezas y en qué palabras aparecen.
        </p>
      </>
    ),
  },
  {
    id: 'trazos',
    icon: '🖌️',
    title: 'Orden de los trazos',
    summary: 'Seis reglas para escribir bien',
    body: () => (
      <>
        <p>Los caracteres se escriben siempre en el mismo orden. No es un capricho: así salen más bonitos y rápidos.</p>
        {(
          [
            ['1. Horizontal antes que vertical', '十'],
            ['2. De arriba abajo', '三'],
            ['3. De izquierda a derecha', '人'],
            ['4. De fuera adentro, y se cierra al final', '回'],
            ['5. El centro antes que los lados', '小'],
            ['6. Los puntos pequeños, al final', '我'],
          ] as const
        ).map(([rule, ch]) => (
          <div key={ch} className="stroke-rule card">
            <strong>{rule}</strong>
            <StrokeAnimation char={ch} size={150} />
          </div>
        ))}
        <p className="tip">
          ✍️ Pon en práctica las reglas en <Link to="/escribir">Escribir</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'frases',
    icon: '💬',
    title: 'Primeras frases',
    summary: 'Saludar, presentarte y dar las gracias',
    body: () => (
      <>
        <p>Con las palabras del HSK 1 ya puedes decir todo esto:</p>
        <ul className="ex-list">
          <Ex h="你好！" p="nǐ hǎo" m="¡Hola!" />
          <Ex h="你好吗？" p="nǐ hǎo ma" m="¿Qué tal estás?" />
          <Ex h="我很好，谢谢。" p="wǒ hěn hǎo, xiè xie" m="Estoy muy bien, gracias." />
          <Ex h="你叫什么名字？" p="nǐ jiào shén me míng zi" m="¿Cómo te llamas?" />
          <Ex h="我叫…" p="wǒ jiào…" m="Me llamo…" />
          <Ex h="认识你很高兴。" p="rèn shi nǐ hěn gāo xìng" m="Encantado de conocerte." />
          <Ex h="这是什么？" p="zhè shì shén me" m="¿Qué es esto?" />
          <Ex h="多少钱？" p="duō shao qián" m="¿Cuánto cuesta?" />
          <Ex h="我想喝茶。" p="wǒ xiǎng hē chá" m="Quiero beber té." />
          <Ex h="对不起！" p="duì bu qǐ" m="¡Perdón!" />
          <Ex h="没关系。" p="méi guān xi" m="No pasa nada." />
          <Ex h="再见！" p="zài jiàn" m="¡Adiós!" />
        </ul>
        <p className="tip">
          🧠 Fíjate: para preguntar basta con añadir <span className="hanzi">吗</span> al final. 你好 = hola → 你好吗? =
          ¿qué tal?
        </p>
      </>
    ),
  },
]
