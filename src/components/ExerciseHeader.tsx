import { Link } from 'react-router-dom'

interface Props {
  title: string
  help: string
}

export default function ExerciseHeader({ title, help }: Props) {
  return (
    <header className="ex-header">
      <Link to="/practicar" className="back" aria-label="Volver a ejercicios">
        ←
      </Link>
      <div>
        <h1 className="title-sm">{title}</h1>
        <p className="muted small-left">{help}</p>
      </div>
    </header>
  )
}
