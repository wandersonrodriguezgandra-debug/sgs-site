import { cn } from '@/lib/utils'

interface DividerProps {
  className?: string
}

export default function Divider({ className }: DividerProps) {
  return (
    <hr
      className={cn(
        'border-t border-sgs-border my-8 w-full',
        className
      )}
    />
  )
}
