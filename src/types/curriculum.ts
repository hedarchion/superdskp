export interface FocusArea {
  focus: string
  learning_standard: string
}

export interface ContentStandard {
  code: string
  skill: string
  standard: string
  focus_areas: FocusArea[]
}

export interface PerformanceBand {
  band: number
  descriptors: string[]
  notes: string
}

export interface GrammarStructure {
  title: string
  content: string
}

export interface GrammarUnit {
  unit: number
  topic: string
  structures: GrammarStructure[]
}

export interface VocabularyCategory {
  category: string
  words: string[]
}

export interface VocabularyUnit {
  unit: number
  topic: string
  categories: VocabularyCategory[]
}

export interface SyllabusContent {
  themes: string[]
  grammar_textbook_based: GrammarUnit[]
  grammar_non_textbook: string[]
  vocabulary_by_unit: VocabularyUnit[]
  vocabulary_by_category: VocabularyCategory[]
  text_types: string[]
}

export interface Objectives {
  listening: string[]
  speaking: string[]
  reading: string[]
  writing: string[]
  literature_in_action: string[]
}

export interface FormData {
  form: number
  cefr_level: string
  content_standards: ContentStandard[]
  performance_standards_listening: PerformanceBand[]
  performance_standards_speaking: PerformanceBand[]
  performance_standards_reading: PerformanceBand[]
  performance_standards_writing: PerformanceBand[]
  syllabus_content: SyllabusContent
  objectives: Objectives
}

export interface CurriculumData {
  curriculum: string
  forms: FormData[]
}

export type SkillType = 'Listening' | 'Speaking' | 'Reading' | 'Writing' | 'Literature in Action'
