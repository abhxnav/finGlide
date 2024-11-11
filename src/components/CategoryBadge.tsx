import { cn } from '@/lib/utils'
import { CategoryBadgeProps } from '@/types'

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center truncate w-fit gap-1 rounded-2xl border border-light-muted py-0.5 px-2',
        {
          'border-green-600 bg-green-500/10 text-green-500':
            category === 'Success',
        },
        {
          'border-yellow-600 bg-yellow-500/10 text-yellow-500':
            category === 'Processing',
        }
      )}
    >
      <div
        className={cn(
          'size-2 rounded-full',
          {
            'bg-green-600': category === 'Success',
          },
          {
            'bg-yellow-600': category === 'Processing',
          }
        )}
      />
      <p className={cn('text-xs font-medium')}>{category}</p>
    </div>
  )
}

export default CategoryBadge
