import { Header, TotalBalance } from '@/components'

const Home = () => {
  const loggedIn = { firstName: 'Abhinav' }

  return (
    <section className="no-scrollbar flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll">
      <div className="no-scrollbar flex w-full flex-col flex-1 gap-8 px-5 sm:px-8 py-7 lg:py-12 xl:max-h-screen xl:overflow-y-scroll">
        <header className="flex flex-col justify-between gap-8">
          <Header
            type="greeting"
            title="Welcome"
            subtext="Access and manage your account and transactions efficiently."
            user={loggedIn?.firstName || 'Guest'}
          />

          <TotalBalance
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={2647.46}
          />
        </header>
      </div>
    </section>
  )
}

export default Home
