import { Link } from 'react-router-dom'
import { useUnitParam } from '../lib/path'

interface Props {
  title: string
  help: string
}

export default function ExerciseHeader({ title, help }: Props) {
  const unit = useUnitParam()
  return (
    <header className="ex-header">
      <Link to={unit ? `/unidad/${unit.index}` : '/practicar'} className="back" aria-label={unit ? 'Volver a la unidad' : 'Volver a ejercicios'}>
        ←
      </Link>
      <div>
        <h1 className="title-sm">{title}</h1>
        <p className="muted small-left">{help}</p>
      </div>
    </header>
  )
}
