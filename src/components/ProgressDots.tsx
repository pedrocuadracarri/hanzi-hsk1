interface Props {
  total: number
  current: number
  /** Resultado de cada pregunta ya respondida: true acierto, false fallo */
  results?: (boolean | undefined)[]
}

export default function ProgressDots({ total, current, results = [] }: Props) {
  return (
    <div className="progress-dots" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={current + 1}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={i === current ? 'now' : i < current ? (results[i] === false ? 'miss' : 'done') : ''}
        />
      ))}
    </div>
  )
}
