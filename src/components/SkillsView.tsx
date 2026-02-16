import { useState, useMemo, useCallback, memo } from 'react'
import type { CurriculumData, FormData, ContentStandard } from '@/types/curriculum'
import { CopyableText, CopyIcon } from './CopyButton'
import { Target, Headphones, Mic, BookOpen, PenTool, Sparkles, CheckCircle2 } from 'lucide-react'

interface SkillsViewProps {
  data: CurriculumData
}

type SkillType = 'Listening' | 'Speaking' | 'Reading' | 'Writing' | 'Literature in Action'

interface SkillConfig {
  label: string
  icon: React.ReactNode
  pastelBg: string
  color: string
}

const SKILL_CONFIG: Record<SkillType, SkillConfig> = {
  'Listening': {
    label: 'Listening',
    icon: <Headphones className="w-5 h-5" />,
    pastelBg: 'bg-pastel-cyan',
    color: '#06b6d4'
  },
  'Speaking': {
    label: 'Speaking',
    icon: <Mic className="w-5 h-5" />,
    pastelBg: 'bg-pastel-lime',
    color: '#84cc16'
  },
  'Reading': {
    label: 'Reading',
    icon: <BookOpen className="w-5 h-5" />,
    pastelBg: 'bg-pastel-purple',
    color: '#a855f7'
  },
  'Writing': {
    label: 'Writing',
    icon: <PenTool className="w-5 h-5" />,
    pastelBg: 'bg-pastel-orange',
    color: '#f59e0b'
  },
  'Literature in Action': {
    label: 'Literature',
    icon: <Sparkles className="w-5 h-5" />,
    pastelBg: 'bg-pastel-pink',
    color: '#ec4899'
  }
}

const bgColors = ['bg-pastel-lime', 'bg-pastel-blue', 'bg-pastel-purple', 'bg-pastel-pink', 'bg-pastel-yellow']

// Format standards for copy
function formatStandardsCopy(form: FormData, skill: SkillType, standards: ContentStandard[]): string {
  let text = `Form ${form.form} - ${skill}\n${'='.repeat(40)}\n\n`
  standards.forEach((std) => {
    text += `${std.code}: ${std.standard}\n`
    std.focus_areas.forEach((fa) => {
      text += `  • ${fa.focus}\n`
      text += `    ${fa.learning_standard}\n`
    })
    text += '\n'
  })
  return text
}

// Format focus areas for copy
function formatFocusAreasCopy(standards: ContentStandard[]): string {
  const allFocus = standards.flatMap(s => s.focus_areas)
  return allFocus.map((fa, i) => `${i + 1}. ${fa.focus}`).join('\n')
}

// Format objectives for copy
function formatObjectivesCopy(form: FormData, skill: SkillType, objectives: string[]): string {
  return `Form ${form.form} - ${skill} Objectives\n${'='.repeat(40)}\n\n${objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}`
}

// Check if a skill is valid
function isValidSkill(skill: string): skill is SkillType {
  return ['Listening', 'Speaking', 'Reading', 'Writing', 'Literature in Action'].includes(skill)
}

// Get skill config safely
function getSkillConfig(skill: string): SkillConfig {
  if (isValidSkill(skill)) {
    return SKILL_CONFIG[skill]
  }
  return {
    label: skill,
    icon: <Target className="w-5 h-5" />,
    pastelBg: 'bg-zinc-100',
    color: '#666'
  }
}

// Skill Selector Button
const SkillSelectorButton = memo(function SkillSelectorButton({
  skill,
  count,
  isSelected,
  onToggle,
}: {
  skill: string
  count: number
  isSelected: boolean
  onToggle: (skill: SkillType) => void
}) {
  const config = getSkillConfig(skill)
  
  return (
    <button
      onClick={() => isValidSkill(skill) && onToggle(skill)}
      className={`${config.pastelBg} rounded-2xl px-4 py-3 text-left transition-all duration-200 card-hover flex items-center gap-3 ${
        isSelected ? 'ring-2 ring-zinc-900 ring-offset-2' : ''
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
        isSelected ? 'bg-zinc-900 text-white' : 'bg-white/70 text-zinc-700'
      }`}>
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-zinc-900">{config.label}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{count} standards</p>
      </div>
      {isSelected && (
        <CheckCircle2 className="w-5 h-5 text-zinc-900" />
      )}
    </button>
  )
})

// Focus Area Item with copy
const FocusAreaItem = memo(function FocusAreaItem({
  focus,
  learningStandard
}: {
  focus: string
  learningStandard: string
}) {
  const copyText = `${focus}\n${learningStandard}`
  
  return (
    <div className="group/focus bg-white/50 rounded-lg p-2.5 hover:bg-white/80 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-zinc-800 flex-1">
          <CopyableText text={focus} showIcon={false} />
        </p>
        <CopyIcon text={copyText} size={12} title="Copy focus area" />
      </div>
      <p className="text-[10px] text-zinc-500 mt-1 pl-1 border-l-2 border-zinc-200">
        <CopyableText text={learningStandard} showIcon={false} />
      </p>
    </div>
  )
})

// Standard Card
const StandardCard = memo(function StandardCard({
  standard
}: {
  standard: ContentStandard
}) {
  const standardCopyText = `${standard.code}: ${standard.standard}\n\n${standard.focus_areas.map(fa => `• ${fa.focus}\n  ${fa.learning_standard}`).join('\n\n')}`
  
  return (
    <div className="group bg-zinc-50 rounded-2xl p-3 hover:bg-zinc-100/80 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="px-2 py-0.5 bg-white rounded-lg text-xs font-mono font-medium border border-zinc-200 shrink-0">
          {standard.code}
        </span>
        <CopyIcon text={standardCopyText} size={12} title="Copy standard" />
      </div>
      <p className="text-xs font-medium text-zinc-800 mb-3">
        <CopyableText text={standard.standard} showIcon={false} />
      </p>
      <div className="space-y-2">
        {standard.focus_areas.map((area, idx) => (
          <FocusAreaItem
            key={idx}
            focus={area.focus}
            learningStandard={area.learning_standard}
          />
        ))}
      </div>
    </div>
  )
})

// Form Standards Card - Side by Side
const FormStandardsCard = memo(function FormStandardsCard({
  form,
  skill,
  standards,
  formIndex
}: {
  form: FormData
  skill: SkillType
  standards: ContentStandard[]
  formIndex: number
}) {
  const headerColor = bgColors[formIndex % bgColors.length]
  const allCopyText = formatStandardsCopy(form, skill, standards)
  const config = getSkillConfig(skill)
  
  return (
    <div className="group bg-white rounded-[2rem] border border-zinc-200 overflow-hidden card-hover flex flex-col">
      <div className={`${headerColor} px-5 py-4`}>
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
          <CopyIcon text={allCopyText} title="Copy all standards" />
        </div>
        <span className="mt-2 inline-block px-3 py-1 bg-white/60 rounded-full text-xs font-medium">
          {standards.length} standards
        </span>
      </div>

      <div className="p-4 space-y-3 flex-1">
        {standards.length > 0 ? (
          standards.map(standard => (
            <StandardCard key={standard.code} standard={standard} />
          ))
        ) : (
          <div className="text-center text-zinc-400 text-sm py-8">
            No {config.label} standards
          </div>
        )}
      </div>
    </div>
  )
})

// Focus Areas Summary Card
const FocusAreasSummaryCard = memo(function FocusAreasSummaryCard({
  form,
  standards
}: {
  form: number
  standards: ContentStandard[]
}) {
  const allFocusAreas = standards.flatMap(s => s.focus_areas)
  const uniqueFocuses = [...new Map(allFocusAreas.map(fa => [fa.focus, fa])).values()]
  const copyText = formatFocusAreasCopy(standards)
  
  return (
    <div className="group bg-white/10 rounded-2xl p-4 hover:bg-white/15 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-full accent-lime flex items-center justify-center text-zinc-900 font-bold">
          {form}
        </div>
        <CopyIcon text={copyText} size={12} title="Copy focus areas" />
      </div>
      <p className="text-xs text-zinc-400 mb-2">{allFocusAreas.length} focus areas</p>
      <div className="flex flex-wrap gap-1">
        {uniqueFocuses.slice(0, 6).map((fa, idx) => (
          <span
            key={idx}
            className="px-2 py-1 bg-white/10 rounded-lg text-[10px] line-clamp-1 max-w-full"
            title={fa.focus}
          >
            {fa.focus.length > 40 ? fa.focus.slice(0, 40) + '...' : fa.focus}
          </span>
        ))}
        {uniqueFocuses.length > 6 && (
          <span className="px-2 py-1 bg-white/5 rounded-lg text-[10px] text-zinc-500">
            +{uniqueFocuses.length - 6} more
          </span>
        )}
      </div>
    </div>
  )
})

// Objectives Card
const ObjectivesCard = memo(function ObjectivesCard({
  form,
  skill,
  objectives
}: {
  form: FormData
  skill: SkillType
  objectives: string[]
}) {
  const copyText = formatObjectivesCopy(form, skill, objectives)
  
  return (
    <div className="group bg-white/70 rounded-2xl p-4 hover:bg-white/90 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-bold">
            {form.form}
          </span>
          <span className="text-sm font-medium text-zinc-700">Form {form.form}</span>
        </div>
        <CopyIcon text={copyText} size={12} title="Copy objectives" />
      </div>
      {objectives.length > 0 ? (
        <ul className="space-y-2">
          {objectives.map((obj, idx) => (
            <li key={idx} className="text-xs text-zinc-600 flex items-start gap-1.5">
              <span className="text-lime-500 mt-0.5">•</span>
              <span><CopyableText text={obj} showIcon={false} /></span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-zinc-400 italic">No objectives</p>
      )}
    </div>
  )
})

// Skill Section Component - Vertical Stack
const SkillSection = memo(function SkillSection({
  skill,
  forms,
}: {
  skill: SkillType
  forms: FormData[]
}) {
  const config = getSkillConfig(skill)
  
  const skillData = useMemo(() => {
    return forms.map(form => ({
      form,
      standards: form.content_standards.filter(cs => cs.skill === skill)
    }))
  }, [forms, skill])

  // Format all content for this skill
  const allContentCopy = useMemo(() => {
    return skillData.map(({ form, standards }) => 
      formatStandardsCopy(form, skill, standards)
    ).join('\n' + '='.repeat(50) + '\n\n')
  }, [skillData, skill])

  const gridClass = useMemo(() => {
    switch (forms.length) {
      case 1: return 'grid-cols-1'
      case 2: return 'grid-cols-1 md:grid-cols-2'
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
    }
  }, [forms.length])

  const smallGridClass = useMemo(() => {
    switch (forms.length) {
      case 1: return 'grid-cols-1'
      case 2: return 'grid-cols-1 sm:grid-cols-2'
      case 3: return 'grid-cols-1 sm:grid-cols-3'
      case 4: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
      default: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
    }
  }, [forms.length])

  const getObjectivesKey = (skill: SkillType): string => {
    return skill.toLowerCase().replace(/ /g, '_')
  }

  return (
    <div className="space-y-6">
      {/* Skill Header */}
      <div className={`${config.pastelBg} rounded-[2rem] p-5 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white">
            {config.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900">{config.label}</h3>
            <p className="text-xs text-zinc-600">
              {skillData.reduce((acc, { standards }) => acc + standards.length, 0)} standards across {forms.length} form{forms.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <CopyIcon text={allContentCopy} title={`Copy all ${config.label}`} />
      </div>

      {/* Standards Grid - Side by Side */}
      <div>
        <h4 className="text-sm font-semibold text-zinc-700 mb-3">Standards by Form</h4>
        <div className={`grid gap-4 ${gridClass}`}>
          {skillData.map(({ form, standards }, formIndex) => (
            <FormStandardsCard
              key={form.form}
              form={form}
              skill={skill}
              standards={standards}
              formIndex={formIndex}
            />
          ))}
        </div>
      </div>

      {/* Focus Areas Summary */}
      <div className="bg-zinc-900 rounded-[2rem] p-6 text-white">
        <h4 className="text-sm font-semibold mb-4">Focus Areas Summary</h4>
        <div className={`grid gap-3 ${smallGridClass}`}>
          {skillData.map(({ form, standards }) => (
            <FocusAreasSummaryCard
              key={form.form}
              form={form.form}
              standards={standards}
            />
          ))}
        </div>
      </div>

      {/* Objectives */}
      <div className={`${config.pastelBg} rounded-[2rem] p-6 card-hover`}>
        <h4 className="text-sm font-semibold mb-4">{config.label} Objectives</h4>
        <div className={`grid gap-3 ${smallGridClass}`}>
          {skillData.map(({ form }) => {
            const key = getObjectivesKey(skill) as keyof typeof form.objectives
            const objectives = (form.objectives[key] as string[] | undefined) || []
            return (
              <ObjectivesCard
                key={form.form}
                form={form}
                skill={skill}
                objectives={objectives}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
})

export default function SkillsView({ data }: SkillsViewProps) {
  // Get all available skills from data
  const availableSkills = useMemo(() => {
    const skills = new Set<string>()
    data.forms.forEach(form => {
      form.content_standards.forEach(cs => {
        if (cs.skill) {
          skills.add(cs.skill)
        }
      })
    })
    return Array.from(skills)
  }, [data])

  // Initialize with first valid skill
  const [selectedSkills, setSelectedSkills] = useState<SkillType[]>(() => {
    const firstValid = availableSkills.find(s => isValidSkill(s))
    return firstValid ? [firstValid as SkillType] : []
  })
  
  const [selectedForms, setSelectedForms] = useState<number[]>([1, 2, 3, 4, 5])

  const toggleSkill = useCallback((skill: SkillType) => {
    setSelectedSkills(prev => {
      // Prevent unselecting the last skill
      if (prev.includes(skill) && prev.length === 1) {
        return prev
      }
      return prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    })
  }, [])

  const toggleForm = useCallback((form: number) => {
    setSelectedForms(prev =>
      prev.includes(form)
        ? prev.filter(f => f !== form)
        : [...prev, form].sort((a, b) => a - b)
    )
  }, [])

  const filteredForms = useMemo(() => {
    return data.forms.filter(f => selectedForms.includes(f.form))
  }, [data.forms, selectedForms])

  // Skill counts
  const skillCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    availableSkills.forEach(skill => {
      counts[skill] = data.forms.reduce((acc, form) => 
        acc + form.content_standards.filter(cs => cs.skill === skill).length, 0
      )
    })
    return counts
  }, [availableSkills, data.forms])

  // Filter to only valid skills for display
  const validSelectedSkills = selectedSkills.filter(isValidSkill)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-pastel-blue rounded-[2rem] p-6 card-hover">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Skills Explorer</h1>
            <p className="text-sm text-zinc-600">Compare skills across forms and analyze content standards</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Form Selector */}
        <div className="bg-white rounded-[2rem] p-6 border border-zinc-200 card-hover">
          <h2 className="text-sm font-semibold text-zinc-700 mb-4">Select Forms</h2>
          <div className="flex flex-wrap gap-2">
            {data.forms.map((form, index) => {
              const activeColor = bgColors[index % bgColors.length]
              const isSelected = selectedForms.includes(form.form)
              return (
                <button
                  key={form.form}
                  onClick={() => toggleForm(form.form)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? `${activeColor} text-zinc-900 shadow-sm`
                      : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                  }`}
                >
                  Form {form.form}
                </button>
              )
            })}
          </div>
        </div>
        
        {/* Skill Selector */}
        <div className="bg-white rounded-[2rem] p-6 border border-zinc-200 card-hover">
          <h2 className="text-sm font-semibold text-zinc-700 mb-4">Select Skills</h2>
          {availableSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availableSkills.map(skill => (
                <SkillSelectorButton
                  key={skill}
                  skill={skill}
                  count={skillCounts[skill] || 0}
                  isSelected={selectedSkills.includes(skill as SkillType)}
                  onToggle={toggleSkill}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400">No skills available</p>
          )}
        </div>
      </div>

      {/* Skills Stack - Vertical Layout */}
      {validSelectedSkills.length > 0 ? (
        <div className="space-y-10">
          {validSelectedSkills.map(skill => (
            <SkillSection key={skill} skill={skill} forms={filteredForms} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-zinc-400">
          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a skill to view content standards</p>
        </div>
      )}
    </div>
  )
}
