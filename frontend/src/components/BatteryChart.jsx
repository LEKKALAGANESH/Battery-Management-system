import { useEffect, useRef } from 'react'

export default function BatteryChart({ data, field }) {
  const ref = useRef()

  useEffect(() => {
    if (!ref.current) return
    const ctx = ref.current.getContext('2d')
    if (!ctx) return
    if (ref.current._chart) {
      ref.current._chart.destroy()
    }
    const labels = data.map(d => new Date(d.time).toLocaleString())
    const values = data.map(d => d[field])
    const chart = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{ label: field, data: values, fill: false, tension: 0.3 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: true } },
        scales: { x: { display: true }, y: { display: true } }
      }
    })
    ref.current._chart = chart
    return () => chart.destroy()
  }, [data, field])

  return <div className="h-96"><canvas ref={ref} /></div>
}
