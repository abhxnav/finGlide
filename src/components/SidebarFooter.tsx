import { logout } from '@/actions/user.actions'
import { FooterProps } from '@/types'
import Image from 'next/image'
import { redirect } from 'next/navigation'

const SidebarFooter = ({ user, type = 'desktop' }: FooterProps) => {
  const handleLogout = async () => {
    const loggedOut = await logout()
    if (loggedOut) redirect('/sign-in')
  }

  return (
    <footer className="flex items-center justify-between cursor-pointer gap-2 py-6">
      <div
        className={`flex items-center justify-center size-10 rounded-full bg-dark-800 ${
          type === 'desktop' ? 'max-xl:hidden' : ''
        }`}
      >
        <p className="text-xl font-bold text-accent-mint">
          {user?.firstName[0]}
        </p>
      </div>

      <div
        className={`flex flex-col justify-center flex-1 ${
          type === 'desktop' ? 'max-xl:hidden' : ''
        }`}
      >
        <h1 className="text-sm truncate font-semibold text-light-secondary">
          {user?.firstName} {user?.lastName}
        </h1>
        <h1 className="text-sm truncate font-normal text-light-muted">
          {user?.email}
        </h1>
      </div>

      <div
        className="relative size-5 max-xl:w-full max-xl:flex max-xl:justify-center max-xl:items-center"
        onClick={handleLogout}
      >
        <Image src="/assets/icons/logout.svg" alt="logout" fill />
      </div>
    </footer>
  )
}

export default SidebarFooter
