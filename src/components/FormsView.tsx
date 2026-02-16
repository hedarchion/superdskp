import { useState, useMemo, useCallback, memo, useRef, useEffect } from 'react'
import type { CurriculumData } from '@/types/curriculum'
import { CopyableText } from './CopyButton'
import { ChevronDown, ChevronUp, Filter, BookOpen, Copy, Check, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

// Helper to check if a learning standard indicates no standard
function isNoLearningStandard(text: string): boolean {
  return text.toLowerCase().includes('no learning standard')
}

// Component to display "No learning standard" as a dark grey pill
function NoLearningStandardPill({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 bg-zinc-700 text-zinc-100 rounded-full text-[10px] font-medium">
      {text.includes('(will be taught in subsequent years)') 
        ? 'No learning standard (will be taught in subsequent years)' 
        : 'No learning standard'}
    </span>
  )
}

interface FormsViewProps {
  data: CurriculumData
}

type DisplayMode = 'content' | 'content-learning'

// Memoized form selector button with long-press hover to show "Display only"
const FormSelectorButton = memo(function FormSelectorButton({
  form,
  index,
  isSelected,
  onToggle,
  onDisplayOnly,
}: {
  form: number
  index: number
  isSelected: boolean
  onToggle: (form: number) => void
  onDisplayOnly: (form: number) => void
}) {
  const bgColors = ['bg-pastel-lime', 'bg-pastel-blue', 'bg-pastel-purple', 'bg-pastel-pink', 'bg-pastel-yellow']
  const activeColor = bgColors[index % bgColors.length]
  
  const [showOption, setShowOption] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    // Show "Display only" option after 400ms hover
    timeoutRef.current = setTimeout(() => {
      setShowOption(true)
    }, 400)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setShowOption(false)
  }

  const handleDisplayOnlyClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDisplayOnly(form)
    setShowOption(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div 
      className="relative pt-2"
      onMouseLeave={handleMouseLeave}
    >
      {/* Display only option - appears on hover, positioned above with padding for mouse movement */}
      {showOption && (
        <div 
          className="absolute -top-8 left-1/2 -translate-x-1/2 pb-2 z-10"
          onMouseEnter={() => setShowOption(true)}
        >
          <button
            onClick={handleDisplayOnlyClick}
            className="whitespace-nowrap px-3 py-1.5 bg-zinc-900 text-white text-xs font-medium rounded-lg shadow-lg flex items-center gap-1.5 hover:bg-zinc-800 transition-colors"
          >
            <Eye size={12} />
            Display only
          </button>
        </div>
      )}
      
      <button
        onClick={() => onToggle(form)}
        onMouseEnter={handleMouseEnter}
        className={`px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
          isSelected
            ? `${activeColor} text-zinc-900 shadow-sm`
            : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
        }`}
      >
        <span className="block text-xs text-zinc-500 mb-0.5">Form</span>
        <span className="text-lg font-bold">{form}</span>
      </button>
    </div>
  )
})

// Helper function to format standard text for copying
function formatStandardForCopy(standard: { code: string; skill: string; standard: string; focus_areas: { focus: string; learning_standard: string }[] }): string {
  let text = `${standard.code} - ${standard.skill}\n${standard.standard}\n\nFocus Areas:\n`
  standard.focus_areas.forEach((area, idx) => {
    text += `${idx + 1}. ${area.focus}\n   ${area.learning_standard}\n`
  })
  return text
}

// Copy button for nested elements
function CopyNestedButton({ text, className }: { text: string; className?: string }) {
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
        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all',
        'bg-zinc-100 hover:bg-zinc-200 text-zinc-600',
        copied && 'bg-green-100 text-green-700',
        className
      )}
      title="Copy all"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

// Memoized standard item to prevent re-render when other items change
const StandardItem = memo(function StandardItem({
  standard,
  formNum,
  isExpanded,
  onToggle,
  displayMode,
}: {
  standard: { code: string; skill: string; standard: string; focus_areas: { focus: string; learning_standard: string }[] }
  formNum: number
  isExpanded: boolean
  onToggle: (key: string) => void
  displayMode: DisplayMode
}) {
  const key = `${formNum}-${standard.code}`
  const showLearning = displayMode === 'content-learning'
  const copyText = useMemo(() => formatStandardForCopy(standard), [standard])

  // Color-code the vertical border based on skill
  const skillBorderColors: Record<string, string> = {
    'Listening': 'border-sky-400',
    'Speaking': 'border-orange-400',
    'Reading': 'border-purple-400',
    'Writing': 'border-pink-400',
    'Literature in Action': 'border-lime-400',
  }
  const borderColor = skillBorderColors[standard.skill] || 'border-lime-400'

  return (
    <div className="group/standard">
      <div
        onClick={() => onToggle(key)}
        className="w-full px-4 py-3 hover:bg-zinc-50 transition-colors text-left cursor-pointer"
      >
        {/* Header row with code, skill, expand button inline */}
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 bg-zinc-100 rounded-lg text-xs font-mono font-medium text-zinc-700">
            {standard.code}
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-pastel-cyan rounded-lg text-zinc-700 font-medium">
            {standard.skill}
          </span>
          {/* Expand/collapse button - now next to the tags */}
          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ml-1 ${
            isExpanded ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'
          }`}>
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </div>
          {/* Copy button - visible on hover */}
          <span
            className="opacity-0 group-hover/standard:opacity-100 transition-opacity ml-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CopyNestedButton text={copyText} />
          </span>
        </div>
        <p className="text-xs text-zinc-800 leading-relaxed line-clamp-2">
          <CopyableText text={standard.standard} showIcon={false} />
        </p>
      </div>

      {(isExpanded || showLearning) && (
        <div className="px-4 pb-3 bg-zinc-50/50">
          <div className={`space-y-2 pl-3 border-l-2 ${borderColor}`}>
            {standard.focus_areas.map((area, areaIdx) => (
              <div key={areaIdx} className="py-1">
                <p className="font-medium text-xs text-zinc-800 mb-0.5">
                  <CopyableText text={area.focus} />
                </p>
                {isNoLearningStandard(area.learning_standard) ? (
                  <NoLearningStandardPill text={area.learning_standard} />
                ) : (
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    <CopyableText text={area.learning_standard} />
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

// Helper to format all form standards for copy
function formatFormStandardsForCopy(form: { form: number; cefr_level: string; content_standards: { code: string; skill: string; standard: string; focus_areas: { focus: string; learning_standard: string }[] }[] }): string {
  let text = `Form ${form.form} - ${form.cefr_level}\n${'='.repeat(40)}\n\n`
  form.content_standards.forEach((standard, idx) => {
    text += `${idx + 1}. ${standard.code} - ${standard.skill}\n${standard.standard}\n\nFocus Areas:\n`
    standard.focus_areas.forEach((area, areaIdx) => {
      text += `  ${areaIdx + 1}. ${area.focus}\n     ${area.learning_standard}\n`
    })
    text += '\n'
  })
  return text
}

// Helper to format objectives for copy
function formatObjectivesForCopy(form: { form: number; cefr_level: string; objectives: { listening: string[]; speaking: string[]; reading: string[] } }): string {
  let text = `Form ${form.form} - ${form.cefr_level} - Learning Objectives\n${'='.repeat(40)}\n\n`
  if (form.objectives.listening.length > 0) {
    text += `LISTENING:\n${form.objectives.listening.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}\n\n`
  }
  if (form.objectives.speaking.length > 0) {
    text += `SPEAKING:\n${form.objectives.speaking.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}\n\n`
  }
  if (form.objectives.reading.length > 0) {
    text += `READING:\n${form.objectives.reading.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}\n\n`
  }
  return text
}

// Format single skill objectives for copy
function formatSkillObjectivesForCopy(skill: string, objectives: string[]): string {
  return `${skill} Objectives:\n${objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}`
}

// Skill section component - minimal design
const SkillSection = memo(function SkillSection({
  skill,
  objectives,
}: {
  skill: string
  objectives: string[]
}) {
  if (objectives.length === 0) return null

  const copyText = formatSkillObjectivesForCopy(skill, objectives)

  return (
    <div className="border-t border-zinc-100 pt-3 first:border-t-0 first:pt-0 group/skill">
      {/* Skill Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">{skill}</span>
        <div className="opacity-0 group-hover/skill:opacity-100 transition-opacity">
          <CopyNestedButton text={copyText} className="!px-2 !py-0.5 !text-[10px] !bg-zinc-50" />
        </div>
      </div>
      
      {/* Objectives List */}
      <ul className="space-y-1">
        {objectives.map((obj, idx) => {
          // Alternating pastel colors for the vertical border
          const borderColors = ['#c8ff3d', '#38bdf8', '#c084fc', '#f472b6', '#fb923c']
          const color = borderColors[idx % borderColors.length]
          return (
            <li key={idx} className="text-xs text-zinc-600 leading-relaxed pl-3 border-l-2" style={{ borderLeftColor: color }}>
              <CopyableText text={obj} showIcon={false} />
            </li>
          )
        })}
      </ul>
    </div>
  )
})

// Memoized objectives card - minimal design
const ObjectivesCard = memo(function ObjectivesCard({
  form,
}: {
  form: { form: number; cefr_level: string; objectives: { listening: string[]; speaking: string[]; reading: string[] } }
}) {
  const objectivesCopyText = useMemo(() => formatObjectivesForCopy(form), [form])
  const totalObjectives = form.objectives.listening.length + form.objectives.speaking.length + form.objectives.reading.length

  return (
    <div className="bg-white rounded-[2rem] border border-zinc-200 p-5 card-hover group/card">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-700 flex items-center justify-center font-bold text-sm">
            {form.form}
          </span>
          <div>
            <span className="font-semibold text-zinc-900 text-sm block">Form {form.form}</span>
            <span className="text-xs text-zinc-400">{form.cefr_level}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">{totalObjectives} objectives</span>
          <div className="opacity-0 group-hover/card:opacity-100 transition-opacity">
            <CopyNestedButton text={objectivesCopyText} className="!px-2 !py-1 !text-[10px]" />
          </div>
        </div>
      </div>

      {/* Skill Sections */}
      <div className="space-y-3">
        <SkillSection skill="Listening" objectives={form.objectives.listening} />
        <SkillSection skill="Speaking" objectives={form.objectives.speaking} />
        <SkillSection skill="Reading" objectives={form.objectives.reading} />
      </div>
    </div>
  )
})

// Memoized form card
const FormCard = memo(function FormCard({
  form,
  headerColor,
  expandedStandards,
  onToggleStandard,
  displayMode,
}: {
  form: { form: number; cefr_level: string; content_standards: { code: string; skill: string; standard: string; focus_areas: { focus: string; learning_standard: string }[] }[] }
  headerColor: string
  expandedStandards: Set<string>
  onToggleStandard: (key: string) => void
  displayMode: DisplayMode
}) {
  const formCopyText = useMemo(() => formatFormStandardsForCopy(form), [form])

  return (
    <div className="bg-white rounded-[2rem] border border-zinc-200 overflow-hidden card-hover flex flex-col">
      <div className={`${headerColor} px-5 py-4 group/header`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-lg">
              {form.form}
            </span>
            <div>
              <span className="font-semibold text-zinc-900 block">Form {form.form}</span>
              <span className="text-xs text-zinc-600">{form.cefr_level}</span>
            </div>
          </div>
          {/* Copy all button for form */}
          <div className="opacity-0 group-hover/header:opacity-100 transition-opacity">
            <CopyNestedButton text={formCopyText} />
          </div>
        </div>
        <span className="mt-2 inline-block px-3 py-1 bg-white/60 rounded-full text-xs font-medium">
          {form.content_standards.length} standards
        </span>
      </div>

      <div className="divide-y divide-zinc-100 flex-1">
        {form.content_standards.map((standard) => (
          <StandardItem
            key={standard.code}
            standard={standard}
            formNum={form.form}
            isExpanded={expandedStandards.has(`${form.form}-${standard.code}`)}
            onToggle={onToggleStandard}
            displayMode={displayMode}
          />
        ))}
      </div>
    </div>
  )
})

export default function FormsView({ data }: FormsViewProps) {
  const [selectedForms, setSelectedForms] = useState<number[]>([1, 2, 3, 4, 5])
  const [expandedStandards, setExpandedStandards] = useState<Set<string>>(new Set())
  const [displayMode, setDisplayMode] = useState<DisplayMode>('content')
  const [displayOnlyForm, setDisplayOnlyForm] = useState<number | null>(null)

  // Handle form toggle for comparison
  const handleFormClick = useCallback((form: number) => {
    // If we're in display-only mode, switch back to compare mode with this form selected
    if (displayOnlyForm !== null) {
      setDisplayOnlyForm(null)
      setSelectedForms([form])
      return
    }
    
    // Normal toggle behavior
    setSelectedForms(prev => {
      if (prev.includes(form)) {
        // Always allow unselecting
        return prev.filter(f => f !== form)
      }
      // Only allow selecting if under the limit of 5
      if (prev.length >= 5) {
        return prev // Don't add if already at max
      }
      return [...prev, form].sort((a, b) => a - b)
    })
  }, [displayOnlyForm])

  // Handle "Display only" option
  const handleDisplayOnly = useCallback((form: number) => {
    setDisplayOnlyForm(form)
  }, [])



  // Memoized toggle for standards
  const toggleStandard = useCallback((key: string) => {
    setExpandedStandards(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  // Memoized filtered forms
  const filteredForms = useMemo(() => {
    if (displayOnlyForm !== null) {
      // In display-only mode, show only the selected form
      return data.forms.filter(f => f.form === displayOnlyForm)
    }
    // In compare mode, show all selected forms
    return data.forms.filter(f => selectedForms.includes(f.form))
  }, [data.forms, selectedForms, displayOnlyForm])

  // Memoized grid class - show up to 5 columns side by side
  const gridClass = useMemo(() => {
    switch (filteredForms.length) {
      case 1: return 'grid-cols-1'
      case 2: return 'grid-cols-1 sm:grid-cols-2'
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      case 5: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
    }
  }, [filteredForms.length])

  // Memoized objectives grid class
  const objectivesGridClass = useMemo(() => {
    switch (filteredForms.length) {
      case 1: return 'grid-cols-1'
      case 2: return 'grid-cols-1 sm:grid-cols-2'
      case 3: return 'grid-cols-1 sm:grid-cols-3'
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
    }
  }, [filteredForms.length])

  const bgColors = ['bg-pastel-lime', 'bg-pastel-blue', 'bg-pastel-purple', 'bg-pastel-pink', 'bg-pastel-yellow']

  // Check if we're in display-only mode
  const isDisplayOnlyMode = displayOnlyForm !== null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-pastel-lime rounded-[2rem] p-6 card-hover">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">Standards Explorer</h1>
              <p className="text-sm text-zinc-600">
                {isDisplayOnlyMode 
                  ? `Viewing Form ${displayOnlyForm} only (hover and hold any form to focus)` 
                  : 'Compare content standards side by side (hover and hold any form to focus)'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Display Mode Toggle */}
            <div className="flex items-center gap-2 bg-white/70 rounded-full p-1">
              <button
                onClick={() => setDisplayMode('content')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  displayMode === 'content'
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-600 hover:bg-white/50'
                }`}
              >
                Content
              </button>
              <button
                onClick={() => setDisplayMode('content-learning')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  displayMode === 'content-learning'
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-600 hover:bg-white/50'
                }`}
              >
                Content + Learning
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Selector - Bento Style */}
      <div className="bg-white rounded-[2rem] p-6 border border-zinc-200 card-hover">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-zinc-500" />
          <h2 className="font-semibold text-zinc-900">Select Standards to Compare</h2>
          <span className="ml-auto text-xs text-zinc-400">
            {!isDisplayOnlyMode && `${selectedForms.length} of 5 selected`}
            {isDisplayOnlyMode && `Displaying Form ${displayOnlyForm} only`}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.forms.map((form, index) => (
            <FormSelectorButton
              key={form.form}
              form={form.form}
              index={index}
              isSelected={isDisplayOnlyMode 
                ? displayOnlyForm === form.form 
                : selectedForms.includes(form.form)}
              onToggle={handleFormClick}
              onDisplayOnly={handleDisplayOnly}
            />
          ))}
        </div>
      </div>

      {/* Content Standards Display */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm">
              {filteredForms.length}
            </span>
            {isDisplayOnlyMode 
              ? `Form ${displayOnlyForm} Standards`
              : 'Content Standards Comparison'}
          </h2>
        </div>

        <div className={`grid gap-4 ${gridClass}`}>
          {filteredForms.map((form, formIndex) => (
            <FormCard
              key={form.form}
              form={form}
              headerColor={isDisplayOnlyMode ? bgColors[(form.form - 1) % bgColors.length] : bgColors[formIndex % bgColors.length]}
              expandedStandards={expandedStandards}
              onToggleStandard={toggleStandard}
              displayMode={displayMode}
            />
          ))}
        </div>
      </div>

      {/* Objectives Comparison - Side by Side */}
      {filteredForms.length > 0 && (
        <div className="bg-white rounded-[2rem] p-6 border border-zinc-200 card-hover">
          <h2 className="text-lg font-semibold mb-5 text-zinc-900">
            {isDisplayOnlyMode ? 'Learning Objectives' : 'Learning Objectives by Form'}
          </h2>
          <div className={`grid gap-4 ${objectivesGridClass}`}>
            {filteredForms.map((form) => (
              <ObjectivesCard key={form.form} form={form} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
