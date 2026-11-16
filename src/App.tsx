import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './screens/Home'
import Match from './screens/Match'
import Words from './screens/Words'
import CharacterSheet from './screens/CharacterSheet'
import Progress from './screens/Progress'
import Components from './screens/Components'
import Practice from './screens/Practice'
import Listen from './screens/Listen'
import Flashcards from './screens/Flashcards'
import Write from './screens/Write'
import Tones from './screens/Tones'
import Guide from './screens/Guide'
import Settings from './screens/Settings'
import Review from './screens/Review'
import Sentences from './screens/Sentences'
import Dialogues from './screens/Dialogues'
import TabBar from './components/TabBar'

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practicar" element={<Practice />} />
        <Route path="/emparejar" element={<Match />} />
        <Route path="/tarjetas" element={<Flashcards />} />
        <Route path="/escuchar" element={<Listen />} />
        <Route path="/escribir" element={<Write />} />
        <Route path="/tonos" element={<Tones />} />
        <Route path="/repaso" element={<Review />} />
        <Route path="/examen" element={<Review />} />
        <Route path="/frases" element={<Sentences />} />
        <Route path="/dialogos" element={<Dialogues />} />
        <Route path="/dialogos/:id" element={<Dialogues />} />
        <Route path="/aprender" element={<Guide />} />
        <Route path="/aprender/:id" element={<Guide />} />
        <Route path="/palabras" element={<Words />} />
        <Route path="/palabra/:id" element={<CharacterSheet />} />
        <Route path="/componentes" element={<Components />} />
        <Route path="/componentes/:char" element={<Components />} />
        <Route path="/progreso" element={<Progress />} />
        <Route path="/ajustes" element={<Settings />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <TabBar />
    </div>
  )
}
