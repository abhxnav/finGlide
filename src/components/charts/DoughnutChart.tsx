'use client'

import { Chart as ChartJS, ArcElement, Legend, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { DoughnutChartProps } from '@/types'

ChartJS.register(ArcElement, Tooltip, Legend)

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
  const accountNames = accounts?.map((account) => account.name)
  const accountBalances = accounts?.map((account) => account.currentBalance)

  const data = {
    datasets: [
      {
        lebel: 'Banks',
        data: accountBalances,
        backgroundColor: ['#7FC9AD', '#6AA8BC', '#B596C6'],
      },
    ],
    labels: accountNames,
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
