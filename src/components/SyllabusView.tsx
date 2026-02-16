import { useState, useMemo, useCallback, memo } from 'react'
import type { CurriculumData, FormData } from '@/types/curriculum'
import { CopyableText, CopyIcon } from './CopyButton'
import { GraduationCap, BookOpen, Type, Hash, Sparkles } from 'lucide-react'

interface SyllabusViewProps {
  data: CurriculumData
}

const tabs = [
  { id: 'textbook' as const, label: 'Textbook Units', icon: <BookOpen className="w-4 h-4" />, color: 'bg-pastel-lime' },
  { id: 'grammar' as const, label: 'Grammar', icon: <BookOpen className="w-4 h-4" />, color: 'bg-pastel-purple' },
  { id: 'vocabulary' as const, label: 'Vocabulary', icon: <Hash className="w-4 h-4" />, color: 'bg-pastel-cyan' },
  { id: 'texttypes' as const, label: 'Text Types', icon: <Type className="w-4 h-4" />, color: 'bg-pastel-orange' },
]

const bgColors = ['bg-pastel-lime', 'bg-pastel-blue', 'bg-pastel-purple', 'bg-pastel-pink', 'bg-pastel-yellow']

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

// Memoized tab button
const TabButton = memo(function TabButton({
  tab,
  isActive,
  onClick,
}: {
  tab: typeof tabs[0]
  isActive: boolean
  onClick: (id: typeof tabs[0]['id']) => void
}) {
  return (
    <button
      onClick={() => onClick(tab.id)}
      className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
        isActive
          ? `${tab.color} text-zinc-900 shadow-sm`
          : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
      }`}
    >
      {tab.icon}
      {tab.label}
    </button>
  )
})

// Textbook Units Card Component - Shows grammar and vocabulary units
// For Forms 1-2: Shows combined (they align by unit)
// For Forms 3-5: Shows separate sections (grammar rules vs vocab themes)
const TextbookUnitsCard = memo(function TextbookUnitsCard({ form, index }: { form: FormData; index: number }) {
  const headerColor = ['bg-pastel-lime', 'bg-pastel-blue', 'bg-pastel-purple', 'bg-pastel-pink', 'bg-pastel-yellow'][index % 5]

  const grammarUnits = form.syllabus_content.grammar_textbook_based
  const vocabUnits = form.syllabus_content.vocabulary_by_unit

  // Check if grammar and vocab align (same unit numbers with matching topics)
  // Forms 1-2 have matching topics, Forms 3-5 have different topics
  const hasAlignedUnits = useMemo(() => {
    if (grammarUnits.length === 0 || vocabUnits.length === 0) return false
    if (grammarUnits.length !== vocabUnits.length) return false
    
    // Check if at least 3 units have matching topics
    let matches = 0
    for (const g of grammarUnits) {
      const matchingVocab = vocabUnits.find(v => v.unit === g.unit)
      if (matchingVocab && g.topic === matchingVocab.topic) {
        matches++
      }
    }
    return matches >= 3
  }, [grammarUnits, vocabUnits])

  // Combined units for Forms 1-2
  const combinedUnits = useMemo(() => {
    if (!hasAlignedUnits) return []
    
    const allUnitNums = new Set<number>()
    grammarUnits.forEach(u => allUnitNums.add(u.unit))
    vocabUnits.forEach(u => allUnitNums.add(u.unit))
    
    return Array.from(allUnitNums).sort((a, b) => a - b).map(unitNum => {
      const grammar = grammarUnits.find(u => u.unit === unitNum)
      const vocab = vocabUnits.find(u => u.unit === unitNum)
      return {
        unit: unitNum,
        topic: vocab?.topic || grammar?.topic || `Unit ${unitNum}`,
        grammar: grammar?.structures || [],
        vocabCategories: vocab?.categories || []
      }
    })
  }, [grammarUnits, vocabUnits, hasAlignedUnits])

  // Format copy text
  const textbookCopyText = useMemo(() => {
    let text = `Form ${form.form} - ${form.cefr_level}\n${'='.repeat(40)}\n\n`
    
    if (hasAlignedUnits && combinedUnits.length > 0) {
      combinedUnits.forEach((unit) => {
        text += `Unit ${unit.unit}: ${unit.topic}\n`
        if (unit.grammar.length > 0) {
          text += `  Grammar:\n`
          unit.grammar.forEach((s, i) => { text += `    ${i + 1}. ${s.title}\n` })
        }
        if (unit.vocabCategories.length > 0) {
          text += `  Vocabulary:\n`
          unit.vocabCategories.forEach((c, i) => { text += `    ${i + 1}. ${c.category}\n` })
        }
        text += '\n'
      })
    } else {
      // Separate sections for non-aligned forms
      text += `GRAMMAR UNITS (${grammarUnits.length}):\n\n`
      grammarUnits.forEach(g => {
        text += `Unit ${g.unit}: ${g.topic}\n`
        g.structures.forEach((s, i) => { text += `  ${i + 1}. ${s.title}\n` })
        text += '\n'
      })
      
      text += `\nVOCABULARY UNITS (${vocabUnits.length}):\n\n`
      vocabUnits.forEach(v => {
        text += `Unit ${v.unit}: ${v.topic}\n`
        v.categories.forEach((c, i) => { text += `  ${i + 1}. ${c.category}\n` })
        text += '\n'
      })
    }
    return text
  }, [form, combinedUnits, grammarUnits, vocabUnits, hasAlignedUnits])

  // Format single item for copy
  const formatGrammarCopy = (g: typeof grammarUnits[0]) => {
    return `Unit ${g.unit}: ${g.topic}\n${g.structures.map((s, i) => `${i + 1}. ${s.title}`).join('\n')}`
  }
  const formatVocabCopy = (v: typeof vocabUnits[0]) => {
    return `Unit ${v.unit}: ${v.topic}\n${v.categories.map((c, i) => `${i + 1}. ${c.category}`).join('\n')}`
  }

  const unitCount = hasAlignedUnits 
    ? combinedUnits.length 
    : grammarUnits.length + vocabUnits.length

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
          <CopyIcon text={textbookCopyText} title="Copy all units" />
        </div>
        <span className="mt-2 inline-block px-3 py-1 bg-white/60 rounded-full text-xs font-medium">
          {hasAlignedUnits ? `${unitCount} units` : `${grammarUnits.length} grammar · ${vocabUnits.length} vocab`}
        </span>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {hasAlignedUnits ? (
          // Forms 1-2: Combined view
          combinedUnits.map(unit => (
            <div key={unit.unit} className="group/unit bg-zinc-50 rounded-xl p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span className="px-2 py-0.5 bg-white rounded-lg text-xs font-mono font-medium border border-zinc-200 shrink-0 mt-0.5">
                    U{unit.unit}
                  </span>
                  <h3 className="font-medium text-xs text-zinc-900">
                    <CopyableText text={unit.topic} showIcon={false} />
                  </h3>
                </div>
                <CopyIcon text={`Unit ${unit.unit}: ${unit.topic}\nGrammar: ${unit.grammar.length}\nVocab: ${unit.vocabCategories.length}`} size={12} title="Copy unit" />
              </div>

              {unit.grammar.length > 0 && (
                <div className="mt-2 pl-7">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 mb-1">Grammar</h4>
                  <div className="space-y-1">
                    {unit.grammar.map((structure, idx) => (
                      <div key={idx} className="text-[10px] text-zinc-600">
                        <CopyableText text={structure.title} showIcon={false} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {unit.vocabCategories.length > 0 && (
                <div className="mt-2 pl-7">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 mb-1">Vocabulary</h4>
                  <div className="flex flex-wrap gap-1">
                    {unit.vocabCategories.map((cat, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white rounded-lg text-[10px] text-zinc-700 border border-zinc-100">
                        <CopyableText text={cat.category} showIcon={false} />
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          // Forms 3-5: Separate sections
          <>
            {/* Grammar Section */}
            {grammarUnits.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-zinc-700 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Grammar Units ({grammarUnits.length})
                </h4>
                <div className="space-y-2">
                  {grammarUnits.map(g => (
                    <div key={`g-${g.unit}`} className="group/unit bg-zinc-50 rounded-xl p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-mono font-medium shrink-0">
                            G{g.unit}
                          </span>
                          <h3 className="font-medium text-xs text-zinc-900">
                            <CopyableText text={g.topic} showIcon={false} />
                          </h3>
                        </div>
                        <CopyIcon text={formatGrammarCopy(g)} size={12} title="Copy" />
                      </div>
                      <div className="mt-2 pl-7">
                        <div className="space-y-1">
                          {g.structures.slice(0, 2).map((s, idx) => (
                            <div key={idx} className="text-[10px] text-zinc-600">
                              <CopyableText text={s.title} showIcon={false} />
                            </div>
                          ))}
                          {g.structures.length > 2 && (
                            <span className="text-[10px] text-zinc-400">+{g.structures.length - 2} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vocabulary Section */}
            {vocabUnits.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-zinc-700 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  Vocabulary Units ({vocabUnits.length})
                </h4>
                <div className="space-y-2">
                  {vocabUnits.map(v => (
                    <div key={`v-${v.unit}`} className="group/unit bg-zinc-50 rounded-xl p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-lg text-xs font-mono font-medium shrink-0">
                            V{v.unit}
                          </span>
                          <h3 className="font-medium text-xs text-zinc-900">
                            <CopyableText text={v.topic} showIcon={false} />
                          </h3>
                        </div>
                        <CopyIcon text={formatVocabCopy(v)} size={12} title="Copy" />
                      </div>
                      <div className="mt-2 pl-7">
                        <div className="flex flex-wrap gap-1">
                          {v.categories.slice(0, 3).map((cat, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-white rounded text-[10px] text-zinc-600 border border-zinc-100">
                              {cat.category}
                            </span>
                          ))}
                          {v.categories.length > 3 && (
                            <span className="text-[10px] text-zinc-400">+{v.categories.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
})

// Grammar Card Component
const GrammarCard = memo(function GrammarCard({ form, index }: { form: FormData; index: number }) {
  const headerColor = ['bg-pastel-purple', 'bg-pastel-lime', 'bg-pastel-blue', 'bg-pastel-pink', 'bg-pastel-yellow'][index % 5]
  
  // Format all grammar content for copy
  const grammarCopyText = useMemo(() => {
    let text = `Form ${form.form} - ${form.cefr_level} - Grammar\n${'='.repeat(40)}\n\n`
    form.syllabus_content.grammar_textbook_based.forEach((unit) => {
      text += `Unit ${unit.unit}: ${unit.topic}\n`
      unit.structures.forEach((s, sidx) => {
        text += `  ${sidx + 1}. ${s.title}\n`
      })
      text += '\n'
    })
    if (form.syllabus_content.grammar_non_textbook.length > 0) {
      text += `Additional Grammar:\n${form.syllabus_content.grammar_non_textbook.map((g, i) => `  ${i + 1}. ${g}`).join('\n')}\n`
    }
    return text
  }, [form])

  // Format single unit for copy
  const formatUnitCopy = (unit: typeof form.syllabus_content.grammar_textbook_based[0]) => {
    return `Unit ${unit.unit}: ${unit.topic}\n${unit.structures.map((s, i) => `${i + 1}. ${s.title}`).join('\n')}`
  }
  
  return (
    <div className="group bg-white rounded-[2rem] border border-zinc-200 overflow-hidden card-hover flex flex-col">
      {/* Header with copy button */}
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
          {/* Macro copy - minimal icon in corner */}
          <CopyIcon text={grammarCopyText} title="Copy all grammar" />
        </div>
        <span className="mt-2 inline-block px-3 py-1 bg-white/60 rounded-full text-xs font-medium">
          {form.syllabus_content.grammar_textbook_based.length} units
        </span>
      </div>
      
      <div className="p-4 space-y-3 flex-1">
        {form.syllabus_content.grammar_textbook_based.map(unit => (
          <div key={unit.unit} className="group/unit bg-zinc-50 rounded-xl p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <span className="px-2 py-0.5 bg-white rounded-lg text-xs font-mono font-medium border border-zinc-200 shrink-0 mt-0.5">
                  U{unit.unit}
                </span>
                {/* Granular copy - text itself is clickable */}
                <h3 className="font-medium text-xs text-zinc-900">
                  <CopyableText text={unit.topic} showIcon={false} />
                </h3>
              </div>
              {/* Unit-level copy - minimal icon */}
              <CopyIcon text={formatUnitCopy(unit)} size={12} title="Copy unit" />
            </div>
            <div className="space-y-1 mt-2 pl-7">
              {unit.structures.map((structure, idx) => (
                <div key={idx} className="text-[10px] text-zinc-600">
                  <CopyableText text={structure.title} showIcon={false} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {form.syllabus_content.grammar_non_textbook.length > 0 && (
        <div className="px-4 pb-4">
          <div className="bg-pastel-orange/50 rounded-xl p-3">
            <h4 className="text-[10px] font-semibold uppercase tracking-wide text-zinc-600 mb-2">
              Additional
            </h4>
            <div className="flex flex-wrap gap-1">
              {form.syllabus_content.grammar_non_textbook.map((item, idx) => (
                <span key={idx} className="text-[10px] text-zinc-700">
                  <CopyableText text={item} showIcon={false} />
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

// Vocabulary Card Component
const VocabularyCard = memo(function VocabularyCard({ form, index }: { form: FormData; index: number }) {
  const headerColor = ['bg-pastel-cyan', 'bg-pastel-lime', 'bg-pastel-purple', 'bg-pastel-pink', 'bg-pastel-yellow'][index % 5]
  
  // Format all vocabulary for copy
  const vocabCopyText = useMemo(() => {
    let text = `Form ${form.form} - ${form.cefr_level} - Vocabulary\n${'='.repeat(40)}\n\n`
    form.syllabus_content.vocabulary_by_category.forEach((cat) => {
      text += `${cat.category}:\n${cat.words.map((w, i) => `  ${i + 1}. ${w}`).join('\n')}\n\n`
    })
    return text
  }, [form])

  // Format single category for copy
  const formatCategoryCopy = (category: typeof form.syllabus_content.vocabulary_by_category[0]) => {
    return `${category.category}:\n${category.words.map((w, i) => `${i + 1}. ${w}`).join('\n')}`
  }
  
  return (
    <div className="group bg-white rounded-[2rem] border border-zinc-200 overflow-hidden card-hover flex flex-col">
      {/* Header with copy button */}
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
          {/* Macro copy - minimal icon */}
          <CopyIcon text={vocabCopyText} title="Copy all vocabulary" />
        </div>
        <span className="mt-2 inline-block px-3 py-1 bg-white/60 rounded-full text-xs font-medium">
          {form.syllabus_content.vocabulary_by_category.length} categories
        </span>
      </div>
      
      <div className="p-4 space-y-3 flex-1">
        {form.syllabus_content.vocabulary_by_category.map((category, idx) => (
          <div key={idx} className="group/category bg-zinc-50 rounded-xl p-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-medium text-xs text-zinc-900 flex-1">
                <CopyableText text={category.category} showIcon={false} />
              </h4>
              {/* Category copy - minimal icon */}
              <CopyIcon text={formatCategoryCopy(category)} size={12} title="Copy category" />
            </div>
            <div className="flex flex-wrap gap-1">
              {category.words.map((word, widx) => (
                <span key={widx} className="px-2 py-0.5 bg-white rounded-lg text-[10px] text-zinc-700 border border-zinc-100">
                  <CopyableText text={word} showIcon={false} />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

// Text Types Card Component
const TextTypesCard = memo(function TextTypesCard({ form }: { form: FormData }) {
  // Format text types for copy
  const textTypesCopyText = useMemo(() => {
    return `Form ${form.form} - ${form.cefr_level} - Text Types\n${'='.repeat(40)}\n\n${form.syllabus_content.text_types.map((t, i) => `${i + 1}. ${t}`).join('\n')}`
  }, [form])
  
  return (
    <div className="group bg-white/60 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-bold">
            {form.form}
          </span>
          <span className="font-medium text-zinc-900">Form {form.form}</span>
        </div>
        {/* Copy all - minimal icon */}
        <CopyIcon text={textTypesCopyText} size={12} title="Copy all text types" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {form.syllabus_content.text_types.map((type, idx) => (
          <span key={idx} className="text-xs text-zinc-700 bg-white/80 px-2 py-1 rounded-lg">
            <CopyableText text={type} showIcon={false} />
          </span>
        ))}
      </div>
    </div>
  )
})

// Themes Card Component
const ThemesCard = memo(function ThemesCard({ form }: { form: FormData }) {
  // Format themes for copy
  const themesCopyText = useMemo(() => {
    return `Form ${form.form} - ${form.cefr_level} - Themes\n${'='.repeat(40)}\n\n${form.syllabus_content.themes.map((t, i) => `${i + 1}. ${t}`).join('\n')}`
  }, [form])
  
  return (
    <div className="group bg-white/60 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-bold">
            {form.form}
          </span>
          <span className="font-medium text-zinc-900">Form {form.form}</span>
        </div>
        {/* Copy all - minimal icon */}
        <CopyIcon text={themesCopyText} size={12} title="Copy all themes" />
      </div>
      <ul className="space-y-2">
        {form.syllabus_content.themes.map((theme, idx) => (
          <li key={idx} className="text-sm flex items-center gap-2 text-zinc-700">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-500 flex-shrink-0" />
            <span className="line-clamp-1">
              <CopyableText text={theme} showIcon={false} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
})

export default function SyllabusView({ data }: SyllabusViewProps) {
  const [activeTab, setActiveTab] = useState<typeof tabs[0]['id']>('textbook')
  const [selectedForms, setSelectedForms] = useState<number[]>([1, 2, 3, 4, 5])

  const toggleForm = useCallback((form: number) => {
    setSelectedForms(prev =>
      prev.includes(form)
        ? prev.filter(f => f !== form)
        : [...prev, form].sort((a, b) => a - b)
    )
  }, [])

  const handleTabClick = useCallback((id: typeof tabs[0]['id']) => {
    setActiveTab(id)
  }, [])

  const filteredForms = useMemo(() => {
    return data.forms.filter(f => selectedForms.includes(f.form))
  }, [data.forms, selectedForms])

  const gridClass = useMemo(() => {
    switch (filteredForms.length) {
      case 1: return 'grid-cols-1'
      case 2: return 'grid-cols-1 md:grid-cols-2'
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
    }
  }, [filteredForms.length])

  const smallGridClass = useMemo(() => {
    switch (filteredForms.length) {
      case 1: return 'grid-cols-1'
      case 2: return 'grid-cols-1 sm:grid-cols-2'
      case 3: return 'grid-cols-1 sm:grid-cols-3'
      case 4: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
      default: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
    }
  }, [filteredForms.length])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-pastel-yellow rounded-[2rem] p-6 card-hover">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Syllabus Explorer</h1>
            <p className="text-sm text-zinc-600">Compare syllabus content side by side</p>
          </div>
        </div>
      </div>

      {/* Form Selector */}
      <div className="bg-white rounded-[2rem] p-6 border border-zinc-200 card-hover">
        <h2 className="text-sm font-semibold text-zinc-700 mb-4">Select Forms</h2>
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

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={handleTabClick}
          />
        ))}
      </div>

      {/* Content */}
      {activeTab === 'textbook' && (
        <div className={`grid gap-4 ${gridClass}`}>
          {filteredForms.map((form, index) => (
            <TextbookUnitsCard key={form.form} form={form} index={index} />
          ))}
        </div>
      )}

      {activeTab === 'grammar' && (
        <div className={`grid gap-4 ${gridClass}`}>
          {filteredForms.map((form, index) => (
            <GrammarCard key={form.form} form={form} index={index} />
          ))}
        </div>
      )}

      {activeTab === 'vocabulary' && (
        <div className={`grid gap-4 ${gridClass}`}>
          {filteredForms.map((form, index) => (
            <VocabularyCard key={form.form} form={form} index={index} />
          ))}
        </div>
      )}

      {activeTab === 'texttypes' && (
        <div className="bg-pastel-orange rounded-[2rem] p-6 card-hover">
          <div className="flex items-center gap-2 mb-5">
            <Type className="w-5 h-5 text-zinc-700" />
            <h2 className="text-lg font-semibold">Text Types by Form</h2>
          </div>
          <div className={`grid gap-4 ${smallGridClass}`}>
            {filteredForms.map((form) => (
              <TextTypesCard key={form.form} form={form} />
            ))}
          </div>
        </div>
      )}

      {/* Themes */}
      <div className="bg-pastel-lime rounded-[2rem] p-6 card-hover">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-5 h-5 text-zinc-700" />
          <h2 className="text-lg font-semibold">Themes Across All Forms</h2>
        </div>
        <div className={`grid gap-4 ${smallGridClass}`}>
          {filteredForms.map((form) => (
            <ThemesCard key={form.form} form={form} />
          ))}
        </div>
      </div>
    </div>
  )
}
