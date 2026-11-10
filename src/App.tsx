import { Route, Routes } from 'react-router-dom'
import Home from './screens/Home'
import Match from './screens/Match'
import Words from './screens/Words'
import CharacterSheet from './screens/CharacterSheet'
import Progress from './screens/Progress'
import Components from './screens/Components'
import TabBar from './components/TabBar'

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/emparejar" element={<Match />} />
        <Route path="/palabras" element={<Words />} />
        <Route path="/palabra/:id" element={<CharacterSheet />} />
        <Route path="/progreso" element={<Progress />} />
        <Route path="/componentes" element={<Components />} />
        <Route path="/componentes/:char" element={<Components />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <TabBar />
    </div>
  )
}
