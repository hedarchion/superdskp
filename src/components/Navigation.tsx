import { cn } from '@/lib/utils'
import { BookOpen, LayoutGrid, GraduationCap, BarChart3 } from 'lucide-react'

type ViewType = 'overview' | 'forms' | 'syllabus' | 'performance'

interface NavigationProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

const navItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutGrid size={14} /> },
  { id: 'forms', label: 'Standards', icon: <BookOpen size={14} /> },
  { id: 'syllabus', label: 'Syllabus', icon: <GraduationCap size={14} /> },
  { id: 'performance', label: 'Performance', icon: <BarChart3 size={14} /> },
]

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <nav className="sticky top-4 z-50 mx-4">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-full border border-zinc-200/50 px-2 py-2 shadow-sm">
          {/* Logo */}
          <div className="flex items-center gap-2 pl-3">
            <div className="w-8 h-8 rounded-full accent-lime flex items-center justify-center font-bold text-sm text-zinc-900">
              D
            </div>
            <span className="font-semibold text-sm hidden sm:block">DSKP Explorer</span>
          </div>
          
          {/* Pill Navigation */}
          <div className="flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                  currentView === item.id
                    ? 'bg-zinc-900 text-white shadow-md'
                    : 'hover:bg-zinc-100 text-zinc-600'
                )}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
