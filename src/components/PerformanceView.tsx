import { useState, useMemo, useCallback, memo } from 'react'
import type { CurriculumData, FormData } from '@/types/curriculum'
import { CopyableText, CopyIcon } from './CopyButton'
import { BarChart3, Target, Headphones, Mic, BookOpen, PenTool } from 'lucide-react'

interface PerformanceViewProps {
  data: CurriculumData
}

type SkillId = 'listening' | 'speaking' | 'reading' | 'writing'

interface SkillDef {
  id: SkillId
  label: string
  icon: React.ReactNode
}

const PERFORMANCE_SKILLS: SkillDef[] = [
  { id: 'listening', label: 'Listening', icon: <Headphones className="w-4 h-4" /> },
  { id: 'speaking', label: 'Speaking', icon: <Mic className="w-4 h-4" /> },
  { id: 'reading', label: 'Reading', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'writing', label: 'Writing', icon: <PenTool className="w-4 h-4" /> },
]

const bgColors = ['bg-pastel-lime', 'bg-pastel-blue', 'bg-pastel-purple', 'bg-pastel-pink', 'bg-pastel-yellow']
const skillColors: Record<SkillId, string> = {
  listening: 'bg-pastel-purple',
  speaking: 'bg-pastel-cyan',
  reading: 'bg-pastel-blue',
  writing: 'bg-pastel-orange',
}

// Memoized form selector button
const FormSelectorButton = memo(function FormSelectorButton({
  form,
  index,
  isSelected,
  onToggle,
}: {
  form: number
  index: number
  isSelected: boolean
  onToggle: (form: number) => void
}) {
  const activeColor = bgColors[index % bgColors.length]
  
  return (
    <button
      onClick={() => onToggle(form)}
      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        isSelected
          ? `${activeColor} text-zinc-900 shadow-sm`
          : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
      }`}
    >
      Form {form}
    </button>
  )
})

// Memoized skill selector button
const SkillSelectorButton = memo(function SkillSelectorButton({
  skill,
  isSelected,
  onToggle,
}: {
  skill: SkillDef
  isSelected: boolean
  onToggle: (id: SkillId) => void
}) {
  return (
    <button
      onClick={() => onToggle(skill.id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        isSelected
          ? 'bg-zinc-900 text-white shadow-sm'
          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
      }`}
    >
      {skill.icon}
      {skill.label}
    </button>
  )
})

// Get color for band
function getBandColor(band: number): string {
  if (band <= 2) return 'bg-red-100 text-red-700 border-red-200'
  if (band === 3) return 'bg-amber-100 text-amber-700 border-amber-200'
  if (band <= 5) return 'bg-blue-100 text-blue-700 border-blue-200'
  return 'bg-green-100 text-green-700 border-green-200'
}

// Format all bands for a skill/form combo for copy
function formatSkillFormCopy(form: FormData, skillId: SkillId): string {
  const standards = form[`performance_standards_${skillId}` as keyof FormData] as { band: number; notes: string; descriptors: string[] }[]
  let text = `Form ${form.form} - ${skillId.charAt(0).toUpperCase() + skillId.slice(1)}\n${'='.repeat(40)}\n\n`
  standards.forEach((band) => {
    text += `Band ${band.band}: ${band.notes}\n`
    band.descriptors.forEach((d, i) => {
      text += `  ${i + 1}. ${d}\n`
    })
    text += '\n'
  })
  return text
}

// Format single band for copy
function formatBandCopy(band: { band: number; notes: string; descriptors: string[] }): string {
  return `Band ${band.band}: ${band.notes}\n${band.descriptors.map((d, i) => `${i + 1}. ${d}`).join('\n')}`
}

// Band Card Component with copy
const BandCard = memo(function BandCard({
  band,
}: {
  band: { band: number; notes: string; descriptors: string[] }
}) {
  const bandCopyText = formatBandCopy(band)

  return (
    <div className="group/band bg-zinc-50 rounded-xl p-3">
      <div className="flex items-start gap-2">
        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0 ${getBandColor(band.band)}`}>
          {band.band}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs text-zinc-600">
              <CopyableText text={band.notes} showIcon={false} />
            </span>
            <CopyIcon text={bandCopyText} size={12} title="Copy band" />
          </div>
          <ul className="space-y-0.5 mt-1.5">
            {band.descriptors.map((descriptor, idx) => (
              <li key={idx} className="text-[10px] text-zinc-500 flex items-start gap-1">
                <span className="text-lime-500 mt-0.5">•</span>
                <span className="line-clamp-2"><CopyableText text={descriptor} showIcon={false} /></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
})

// Form Card Component - Side by Side (horizontal)
const FormCard = memo(function FormCard({
  form,
  skillId,
  formIndex,
}: {
  form: FormData
  skillId: SkillId
  formIndex: number
}) {
  const standards = form[`performance_standards_${skillId}` as keyof FormData] as { band: number; notes: string; descriptors: string[] }[]
  const skillCopyText = formatSkillFormCopy(form, skillId)
  const headerColor = bgColors[formIndex % bgColors.length]

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
          <CopyIcon text={skillCopyText} title="Copy all" />
        </div>
      </div>
      
      <div className="p-4 space-y-3 flex-1">
        {standards.map((band) => (
          <BandCard key={band.band} band={band} />
        ))}
      </div>
    </div>
  )
})

// Skill Section Component - Vertical Stack
const SkillSection = memo(function SkillSection({
  skill,
  forms,
}: {
  skill: SkillDef
  forms: FormData[]
}) {
  const skillColor = skillColors[skill.id]
  
  // Format all content for this skill across all forms
  const allContentCopy = useMemo(() => {
    return forms.map(form => formatSkillFormCopy(form, skill.id)).join('\n' + '='.repeat(50) + '\n\n')
  }, [forms, skill.id])

  const gridClass = useMemo(() => {
    switch (forms.length) {
      case 1: return 'grid-cols-1'
      case 2: return 'grid-cols-1 md:grid-cols-2'
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
    }
  }, [forms.length])

  return (
    <div className="space-y-4">
      {/* Skill Header */}
      <div className={`${skillColor} rounded-[2rem] p-5 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white">
            {skill.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900">{skill.label}</h3>
            <p className="text-xs text-zinc-600">{forms.length} form{forms.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        <CopyIcon text={allContentCopy} title={`Copy all ${skill.label}`} />
      </div>

      {/* Forms Grid - Side by Side */}
      <div className={`grid gap-4 ${gridClass}`}>
        {forms.map((form, formIndex) => (
          <FormCard key={form.form} form={form} skillId={skill.id} formIndex={formIndex} />
        ))}
      </div>
    </div>
  )
})

export default function PerformanceView({ data }: PerformanceViewProps) {
  const [selectedSkills, setSelectedSkills] = useState<SkillId[]>(['listening'])
  const [selectedForms, setSelectedForms] = useState<number[]>([1, 2, 3, 4, 5])

  const toggleForm = useCallback((form: number) => {
    setSelectedForms(prev =>
      prev.includes(form)
        ? prev.filter(f => f !== form)
        : [...prev, form].sort((a, b) => a - b)
    )
  }, [])

  const toggleSkill = useCallback((id: SkillId) => {
    setSelectedSkills(prev => {
      // Prevent unselecting the last skill
      if (prev.includes(id) && prev.length === 1) {
        return prev
      }
      return prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id]
    })
  }, [])

  const filteredForms = useMemo(() => {
    return data.forms.filter(f => selectedForms.includes(f.form))
  }, [data.forms, selectedForms])

  const selectedSkillDefs = useMemo(() => {
    return PERFORMANCE_SKILLS.filter(s => selectedSkills.includes(s.id))
  }, [selectedSkills])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-pastel-pink rounded-[2rem] p-6 card-hover">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Performance Standards</h1>
            <p className="text-sm text-zinc-600">Compare CEFR performance bands across forms and skills</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-[2rem] p-6 border border-zinc-200 card-hover">
          <h2 className="text-sm font-semibold text-zinc-700 mb-4 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Select Forms
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.forms.map((form, index) => (
              <FormSelectorButton
                key={form.form}
                form={form.form}
                index={index}
                isSelected={selectedForms.includes(form.form)}
                onToggle={toggleForm}
              />
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-[2rem] p-6 border border-zinc-200 card-hover">
          <h2 className="text-sm font-semibold text-zinc-700 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Select Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {PERFORMANCE_SKILLS.map(skill => (
              <SkillSelectorButton
                key={skill.id}
                skill={skill}
                isSelected={selectedSkills.includes(skill.id)}
                onToggle={toggleSkill}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Skills Stack - Vertical Layout */}
      <div className="space-y-8">
        {selectedSkillDefs.map(skill => (
          <SkillSection key={skill.id} skill={skill} forms={filteredForms} />
        ))}
      </div>
    </div>
  )
}
