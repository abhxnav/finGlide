'use client'

import { Chart as ChartJS, ArcElement, Legend, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
  const data = {
    datasets: [
      {
        lebel: 'Banks',
        data: [1234, 2345, 3456],
        backgroundColor: ['#7FC9AD', '#6AA8BC', '#B596C6'],
      },
    ],
    labels: ['Bank 1', 'Bank 2', 'Bank 3'],
  }

  return (
    <Doughnut
      data={data}
      options={{
        cutout: '60%',
        plugins: { legend: { display: false } },
      }}
    />
  )
}

export default DoughnutChart
