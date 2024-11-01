import Image from 'next/image'
import Link from 'next/link'
import { DebitCard } from '@/components'
import { RightSidebarProps } from '@/types'

const RightSidebar = ({ user, transactions, banks }: RightSidebarProps) => {
  return (
    <aside className="no-scrollbar hidden h-screen max-h-screen flex-col border-l border-dark-400 xl:flex w-[355px] xl:overflow-y-scroll">
      {/* Profile */}
      <section className="flex flex-col pb-8">
        <div className="h-32 w-full profile-gradient bg-cover bg-no-repeat" />
        <div className="flex max-xl:justify-center px-6 relative">
          <div className="flex items-center justify-center absolute -top-8 size-24 rounded-full bg-dark-500 border-8 border-dark-600 p-2 shadow-lg shadow-dark-400">
            <span className="text-5xl font-bold text-accent-mint">
              {user.firstName[0]}
            </span>
          </div>

          <div className="flex flex-col pt-24">
            <h1 className="text-2xl font-semibold text-light-primary">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-base font-normal text-light-muted">
              {user.email}
            </p>
          </div>
        </div>
      </section>

      {/* Banks */}
      <section className="flex flex-col justify-between gap-8 px-6 py-8">
        <div className="flex w-full justify-between">
          <h2 className="text-18 font-semibold text-light-primary">My Banks</h2>
          <Link href="/" className="flex gap-2">
            <Image
              src="/assets/icons/plus.svg"
              alt="add"
              width={20}
              height={20}
            />
            <h2 className="text-sm font-semibold text-light-muted">Add Bank</h2>
          </Link>
        </div>

        {banks?.length > 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-5 relative">
            <div className="relative z-10">
              <DebitCard
                key={banks[0].$id}
                account={banks[0]}
                userName={`${user.firstName} ${user.lastName}`}
                showBalance="false"
              />
            </div>
            {banks[1] && (
              <div className="absolute top-8 right-0 w-[90%] z-0">
                <DebitCard
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={`${user.firstName} ${user.lastName}`}
                  showBalance="false"
                />
              </div>
            )}
          </div>
        )}
      </section>
    </aside>
  )
}

export default RightSidebar
