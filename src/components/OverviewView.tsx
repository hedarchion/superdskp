import { useMemo, memo } from 'react'
import type { CurriculumData, SkillType } from '@/types/curriculum'
import { CopyableText } from './CopyButton'
import {
  BookOpen,
  GraduationCap,
  Target,
  TrendingUp,
  Layers,
  Lightbulb,
  FileText,
  MessageCircle,
  Headphones,
  PenTool,
  BookMarked,
  Sparkles,
} from 'lucide-react'

interface OverviewViewProps {
  data: CurriculumData
}

const skillIcons: Record<string, React.ReactNode> = {
  Listening: <Headphones className="w-4 h-4" />,
  Speaking: <MessageCircle className="w-4 h-4" />,
  Reading: <BookMarked className="w-4 h-4" />,
  Writing: <PenTool className="w-4 h-4" />,
  'Literature in Action': <Sparkles className="w-4 h-4" />,
  'Literature_in_action': <Sparkles className="w-4 h-4" />,
}

const bgColors = ['bg-pastel-lime', 'bg-pastel-blue', 'bg-pastel-purple', 'bg-pastel-pink', 'bg-pastel-yellow']
const barColors = ['bg-bar-lime', 'bg-bar-blue', 'bg-bar-purple', 'bg-bar-pink', 'bg-bar-yellow']

// Memoized CEFR step data
const CEFR_STEPS = [
  { form: 1, level: 'A1', name: 'Beginner' },
  { form: 2, level: 'A2', name: 'Elementary' },
  { form: 3, level: 'B1', name: 'Inter.' },
  { form: 4, level: 'B1+', name: 'Upper' },
  { form: 5, level: 'B2', name: 'Indep.' },
] as const

// Memoized CEFR Card component
const CefrCard = memo(function CefrCard({
  step,
  standardsCount,
  bgColor
}: {
  step: typeof CEFR_STEPS[number]
  standardsCount: number
  bgColor: string
}) {
  return (
    <div className={`${bgColor} rounded-2xl p-4 text-center`}>
      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
        <span className="text-lg font-bold text-zinc-900 leading-none">{step.level}</span>
        <span className="text-[8px] text-zinc-500 uppercase leading-none mt-0.5">{step.name}</span>
      </div>
      <p className="font-semibold text-sm text-zinc-900">Form {step.form}</p>
      <p className="text-xs text-zinc-600 mt-1">{standardsCount} standards</p>
    </div>
  )
})

// Memoized Form Card component
const FormCard = memo(function FormCard({
  form,
  index
}: {
  form: CurriculumData['forms'][number]
  index: number
}) {
  const totalObjs = useMemo(() =>
    form.objectives.listening.length +
    form.objectives.speaking.length +
    form.objectives.reading.length +
    form.objectives.writing.length +
    form.objectives.literature_in_action.length
  , [form.objectives])

  const headerColor = bgColors[index % bgColors.length]

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden card-hover group">
      {/* Header */}
      <div className={`${headerColor} px-4 py-3`}>
        <div className="flex items-center gap-3">
          {/* Form Number */}
          <span className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-base shrink-0">
            {form.form}
          </span>
          {/* Form Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-zinc-900">Form {form.form}</span>
            </div>
            <span className="text-xs text-zinc-600 block truncate">{form.cefr_level}</span>
          </div>
        </div>
      </div>
      
      {/* Body */}
      <div className="p-4 space-y-2.5">
        {/* Stats */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-500">Standards</span>
          <span className="font-semibold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full">{form.content_standards.length}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-500">Objectives</span>
          <span className="font-semibold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full">{totalObjs}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-500">Grammar</span>
          <span className="font-semibold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full">{form.syllabus_content.grammar_textbook_based.length}</span>
        </div>
        
        {/* Themes */}
        <div className="pt-3 border-t border-zinc-100">
          <p className="text-[10px] text-zinc-400 mb-1.5">{form.syllabus_content.themes.length} Themes</p>
          <div className="flex flex-wrap gap-1">
            {form.syllabus_content.themes.slice(0, 2).map((theme, tidx) => (
              <span
                key={tidx}
                className="px-2 py-0.5 bg-zinc-100 rounded text-[10px] text-zinc-600 truncate max-w-[90px]"
              >
                {theme}
              </span>
            ))}
            {form.syllabus_content.themes.length > 2 && (
              <span className="px-2 py-0.5 bg-zinc-50 rounded text-[10px] text-zinc-400">
                +{form.syllabus_content.themes.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

// Memoized Skill Bar Chart component
const SkillBarChart = memo(function SkillBarChart({
  skill,
  index,
  data
}: {
  skill: SkillType
  index: number
  data: CurriculumData
}) {
  const barColor = barColors[index % barColors.length]
  
  // Calculate actual skill progression
  const progression = useMemo(() => {
    const normalizedTarget = skill.toLowerCase().trim().replace(/_/g, ' ')
    return data.forms.map((form) => ({
      form: form.form,
      count: form.content_standards.filter(
        (cs) => cs.skill.toLowerCase().trim().replace(/_/g, ' ') === normalizedTarget
      ).length,
      cefr: form.cefr_level,
    }))
  }, [data.forms, skill])

  const maxCount = Math.max(...progression.map(p => p.count), 1)

  return (
    <div className="bg-zinc-50 rounded-2xl p-4">
      {/* Header with icon and skill name */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-zinc-700 shadow-sm shrink-0">
          {skillIcons[skill] || skillIcons[skill.replace(/_/g, ' ')]}
        </div>
        <h3 className="font-semibold text-sm text-zinc-900">
          <CopyableText text={skill} />
        </h3>
      </div>
      
      {/* Bar chart */}
      <div className="flex items-end gap-2 h-24 px-1">
        {progression.map(({ form, count }) => {
          const height = count > 0 ? Math.max(4, Math.min(56, (count / maxCount) * 52)) : 4
          return (
            <div key={form} className="flex-1 flex flex-col items-center gap-1.5">
              {/* Bar */}
              <div
                className={`w-full ${barColor} rounded-t transition-all duration-300`}
                style={{ height: `${height}px` }}
              />
              {/* Count label */}
              <span className="text-xs font-bold text-zinc-900 leading-none">{count}</span>
              {/* Form label */}
              <span className="text-[10px] text-zinc-500 leading-none">F{form}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
})

export default function OverviewView({ data }: OverviewViewProps) {
  // Memoized skill list - deduplicated
  const skillList = useMemo(() => {
    const skillsMap = new Map<string, SkillType>()
    data.forms.forEach((form) => {
      form.content_standards.forEach((cs) => {
        const normalizedSkill = cs.skill.toLowerCase().trim().replace(/_/g, ' ')
        if (!skillsMap.has(normalizedSkill)) {
          skillsMap.set(normalizedSkill, cs.skill as SkillType)
        }
      })
    })
    return Array.from(skillsMap.values())
  }, [data.forms])

  // Memoized total content standards
  const totalContentStandards = useMemo(() =>
    data.forms.reduce((acc, form) => acc + form.content_standards.length, 0)
  , [data.forms])

  // Memoized total objectives
  const totalObjectives = useMemo(() =>
    data.forms.reduce(
      (acc, form) =>
        acc +
        form.objectives.listening.length +
        form.objectives.speaking.length +
        form.objectives.reading.length +
        form.objectives.writing.length +
        form.objectives.literature_in_action.length,
      0
    )
  , [data.forms])

  // Memoized themes
  const uniqueThemes = useMemo(() => {
    const allThemes = data.forms.flatMap((f) => f.syllabus_content.themes)
    return [...new Set(allThemes)]
  }, [data.forms])

  // Memoized text types
  const uniqueTextTypes = useMemo(() => {
    const allTextTypes = data.forms.flatMap((f) => f.syllabus_content.text_types)
    return [...new Set(allTextTypes)]
  }, [data.forms])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-pastel-lime rounded-[2rem] p-6 card-hover">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">
              <CopyableText text={data.curriculum} className="text-xl font-bold" />
            </h1>
            <p className="text-sm text-zinc-600">KSSM Curriculum • CEFR Aligned</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-[2rem] p-5 border border-zinc-200 card-hover text-center">
          <p className="text-3xl font-bold text-zinc-900">{data.forms.length}</p>
          <p className="text-xs text-zinc-500 mt-1">Forms</p>
        </div>
        <div className="bg-white rounded-[2rem] p-5 border border-zinc-200 card-hover text-center">
          <p className="text-3xl font-bold text-zinc-900">{skillList.length}</p>
          <p className="text-xs text-zinc-500 mt-1">Skills</p>
        </div>
        <div className="bg-white rounded-[2rem] p-5 border border-zinc-200 card-hover text-center">
          <p className="text-3xl font-bold text-zinc-900">{totalContentStandards}</p>
          <p className="text-xs text-zinc-500 mt-1">Standards</p>
        </div>
      </div>

      {/* CEFR Progression */}
      <div className="bg-white rounded-[2rem] p-6 border border-zinc-200 card-hover">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5 text-zinc-700" />
          <h2 className="font-semibold text-zinc-900">CEFR Progression</h2>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {CEFR_STEPS.map((step, idx) => {
            const formData = data.forms.find((f) => f.form === step.form)
            const standardsCount = formData?.content_standards.length || 0
            return (
              <CefrCard
                key={step.form}
                step={step}
                standardsCount={standardsCount}
                bgColor={bgColors[idx % bgColors.length]}
              />
            )
          })}
        </div>
      </div>

      {/* Form Overview */}
      <div className="bg-white rounded-[2rem] p-6 border border-zinc-200 card-hover">
        <div className="flex items-center gap-2 mb-5">
          <GraduationCap className="w-5 h-5 text-zinc-700" />
          <h2 className="font-semibold text-zinc-900">Form Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {data.forms.map((form, idx) => (
            <FormCard key={form.form} form={form} index={idx} />
          ))}
        </div>
      </div>

      {/* Skills by Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 border border-zinc-200 card-hover">
          <div className="flex items-center gap-2 mb-5">
            <Target className="w-5 h-5 text-zinc-700" />
            <h2 className="font-semibold text-zinc-900">Skills by Form</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skillList.map((skill, idx) => (
              <SkillBarChart key={skill} skill={skill} index={idx} data={data} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Themes */}
          <div className="bg-zinc-900 rounded-[2rem] p-6 text-white card-hover">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-lime-400" />
              <h2 className="font-semibold">Themes</h2>
            </div>
            <p className="text-xs text-zinc-400 mb-3">{uniqueThemes.length} unique themes</p>
            <div className="flex flex-wrap gap-2">
              {uniqueThemes.slice(0, 6).map((theme, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-white/10 rounded-lg text-xs text-zinc-300"
                >
                  {theme.length > 20 ? theme.slice(0, 20) + '...' : theme}
                </span>
              ))}
              {uniqueThemes.length > 6 && (
                <span className="px-2.5 py-1 accent-lime text-zinc-900 rounded-lg text-xs font-medium">
                  +{uniqueThemes.length - 6}
                </span>
              )}
            </div>
          </div>

          {/* Text Types */}
          <div className="bg-pastel-purple rounded-[2rem] p-6 card-hover">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-zinc-700" />
              <h2 className="font-semibold text-zinc-900">Text Types</h2>
            </div>
            <p className="text-xs text-zinc-600 mb-3">{uniqueTextTypes.length} types covered</p>
            <div className="flex flex-wrap gap-2">
              {uniqueTextTypes.slice(0, 5).map((type, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-white/70 rounded-lg text-xs text-zinc-700">
                  {type}
                </span>
              ))}
              {uniqueTextTypes.length > 5 && (
                <span className="px-2.5 py-1 bg-white/50 rounded-lg text-xs text-zinc-500">
                  +{uniqueTextTypes.length - 5}
                </span>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-pastel-blue rounded-[2rem] p-6 card-hover">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-zinc-700" />
              <h2 className="font-semibold text-zinc-900">Quick Stats</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-white/70 rounded-xl">
                <span className="text-xs text-zinc-600">Total Objectives</span>
                <span className="font-bold text-zinc-900">{totalObjectives}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/70 rounded-xl">
                <span className="text-xs text-zinc-600">Content Standards</span>
                <span className="font-bold text-zinc-900">{totalContentStandards}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Progression */}
      <div className="bg-zinc-900 rounded-[2rem] p-6 text-white card-hover">
        <div className="flex items-center gap-2 mb-5">
          <BookOpen className="w-5 h-5 text-lime-400" />
          <h2 className="font-semibold">Learning Progression</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-2xl p-4">
            <h3 className="text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wide">Lower Secondary</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full accent-lime mt-1.5" />
                <span className="text-zinc-300">A1 → B1 foundation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full accent-lime mt-1.5" />
                <span className="text-zinc-300">Basic grammar structures</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full accent-lime mt-1.5" />
                <span className="text-zinc-300">Everyday communication</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-2xl p-4">
            <h3 className="text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wide">Upper Secondary</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5" />
                <span className="text-zinc-300">B1+ → B2 advanced</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5" />
                <span className="text-zinc-300">Complex language</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5" />
                <span className="text-zinc-300">Academic skills</span>
              </li>
            </ul>
          </div>

          <div className="accent-lime rounded-2xl p-4 text-zinc-900">
            <h3 className="text-xs font-medium text-zinc-700 mb-3 uppercase tracking-wide">Target Outcome</h3>
            <div className="text-center py-2">
              <p className="text-4xl font-bold mb-1">B2</p>
              <p className="text-xs text-zinc-700">Independent User</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
