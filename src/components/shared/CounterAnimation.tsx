'use client'

import CountUp from 'react-countup'

const CounterAnimation = ({ amount }: { amount: number }) => {
  return (
    <div className="w-full">
      <CountUp end={amount} prefix="$ " decimals={2} duration={2} />
    </div>
  )
}

export default CounterAnimation
