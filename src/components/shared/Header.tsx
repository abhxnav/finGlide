import { HeaderProps } from '@/types'

const Header = ({ type = 'title', title, subtext, user }: HeaderProps) => {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl lg:text-3xl font-semibold text-light-primary">
        {title}
        {type === 'greeting' && (
          <span className="text-accent-mint">&nbsp;{user}</span>
        )}
      </h1>
      <p className="text-sm lg:text-base font-normal text-light-muted">
        {subtext}
      </p>
    </div>
  )
}

export default Header
