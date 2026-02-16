import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  text: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function CopyButton({ text, className, size = 'sm' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const sizeClasses = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2'
  }

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-zinc-100',
        sizeClasses[size],
        className
      )}
      title="Copy"
    >
      {copied ? (
        <Check size={iconSizes[size]} className="text-green-600" />
      ) : (
        <Copy size={iconSizes[size]} className="text-zinc-400" />
      )}
    </button>
  )
}

interface CopyableTextProps {
  text: string
  className?: string
  showIcon?: boolean
  multiline?: boolean
}

export function CopyableText({ text, className, showIcon = true, multiline = false }: CopyableTextProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <span
      className={cn(
        'group inline-flex items-start gap-1 cursor-pointer hover:bg-zinc-100 rounded px-1 -mx-1 transition-colors',
        multiline && 'flex-col',
        className
      )}
      onClick={handleCopy}
      title="Click to copy"
    >
      <span className={cn(multiline && 'whitespace-pre-wrap break-words')}>{text}</span>
      {showIcon && (
        <span className="opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 shrink-0">
          {copied ? (
            <Check size={12} className="text-green-600" />
          ) : (
            <Copy size={12} className="text-zinc-400" />
          )}
        </span>
      )}
    </span>
  )
}

interface CopyableBadgeProps {
  text: string
  className?: string
}

export function CopyableBadge({ text, className }: CopyableBadgeProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <span
      className={cn(
        'group inline-flex items-center gap-1 cursor-pointer',
        'px-2 py-0.5 rounded-lg text-xs',
        'bg-white hover:bg-zinc-100 transition-colors border border-zinc-100',
        copied && 'bg-green-50 text-green-700 border-green-200',
        className
      )}
      onClick={handleCopy}
      title="Click to copy"
    >
      {text}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? (
          <Check size={10} className="text-green-600" />
        ) : (
          <Copy size={10} className="text-zinc-400" />
        )}
      </span>
    </span>
  )
}

interface CopyIconProps {
  text: string
  className?: string
  size?: number
  title?: string
}

/** Minimal icon-only copy button - appears on parent hover */
export function CopyIcon({ text, className, size = 14, title = 'Copy' }: CopyIconProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'opacity-0 group-hover:opacity-100 transition-all duration-200',
        'p-1 rounded-md hover:bg-black/5 text-zinc-400 hover:text-zinc-600',
        copied && 'opacity-100 text-green-600 hover:text-green-600 hover:bg-green-50',
        className
      )}
      title={copied ? 'Copied!' : title}
    >
      {copied ? <Check size={size} /> : <Copy size={size} />}
    </button>
  )
}

interface CopyableListProps {
  items: string[]
  className?: string
  itemClassName?: string
}

export function CopyableList({ items, className, itemClassName }: CopyableListProps) {
  const [copiedAll, setCopiedAll] = useState(false)

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(items.join('\n'))
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className={cn('group', className)}>
      <div className="flex items-center gap-2 mb-1">
        <button
          onClick={handleCopyAll}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center gap-1 text-zinc-400 hover:text-zinc-700"
        >
          {copiedAll ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
          Copy all
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, idx) => (
          <CopyableBadge key={idx} text={item} className={itemClassName} />
        ))}
      </div>
    </div>
  )
}
