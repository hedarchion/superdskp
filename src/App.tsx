import { useState, lazy, Suspense } from 'react'
import { useCurriculum } from '@/hooks/useCurriculum'
import { Navigation } from '@/components/Navigation'

// Lazy load view components for code splitting
const OverviewView = lazy(() => import('@/components/OverviewView'))
const FormsView = lazy(() => import('@/components/FormsView'))
const SyllabusView = lazy(() => import('@/components/SyllabusView'))
const PerformanceView = lazy(() => import('@/components/PerformanceView'))

type ViewType = 'overview' | 'forms' | 'syllabus' | 'performance'

// Loading fallback component
function ViewSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-pastel-lime rounded-[2rem] p-6 h-24" />
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-[2rem] p-5 h-24 border border-zinc-200" />
        <div className="bg-white rounded-[2rem] p-5 h-24 border border-zinc-200" />
        <div className="bg-white rounded-[2rem] p-5 h-24 border border-zinc-200" />
      </div>
      <div className="bg-white rounded-[2rem] p-6 h-48 border border-zinc-200" />
    </div>
  )
}

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('overview')
  const { data, loading, error } = useCurriculum()

  if (loading) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-zinc-500">Loading curriculum...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-zinc-200">
          <p className="text-sm text-red-500 font-medium">Failed to load curriculum data</p>
          <p className="text-xs text-zinc-400 mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid-bg">
      <div className="pt-6 pb-8">
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="max-w-[1600px] mx-auto px-4 mt-8">
          <Suspense fallback={<ViewSkeleton />}>
            {currentView === 'overview' && <OverviewView data={data} />}
            {currentView === 'forms' && <FormsView data={data} />}
            {currentView === 'syllabus' && <SyllabusView data={data} />}
            {currentView === 'performance' && <PerformanceView data={data} />}
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default App
