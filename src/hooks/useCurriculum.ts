import { useState, useEffect, useMemo } from 'react'
import type { CurriculumData, FormData, SkillType } from '@/types/curriculum'

// Metadata type (lightweight)
export interface CurriculumMetadata {
  curriculum: string
  forms: { form: number; cefr_level: string }[]
}

// Cache for loaded forms
const formCache = new Map<number, FormData>()

// Load metadata only (fast ~259 bytes)
export function useCurriculumMetadata() {
  const [metadata, setMetadata] = useState<CurriculumMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('data/metadata.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load metadata')
        return res.json()
      })
      .then((data: CurriculumMetadata) => {
        setMetadata(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { metadata, loading, error }
}

// Load a specific form on demand (cached)
export function useForm(formNumber: number) {
  const [form, setForm] = useState<FormData | null>(formCache.get(formNumber) || null)
  const [loading, setLoading] = useState(!formCache.has(formNumber))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Return cached version immediately
    if (formCache.has(formNumber)) {
      setForm(formCache.get(formNumber)!)
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`data/form${formNumber}.json`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load form ${formNumber}`)
        return res.json()
      })
      .then((data: { curriculum: string; form: FormData }) => {
        formCache.set(formNumber, data.form)
        setForm(data.form)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [formNumber])

  return { form, loading, error }
}

// Load all forms (for views that need complete data)
export function useCurriculum() {
  const [data, setData] = useState<CurriculumData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if all forms are cached
    const cachedForms: FormData[] = []
    let allCached = true
    for (let i = 1; i <= 5; i++) {
      if (formCache.has(i)) {
        cachedForms.push(formCache.get(i)!)
      } else {
        allCached = false
        break
      }
    }

    if (allCached) {
      setData({
        curriculum: 'KSSM Bahasa Inggeris (CEFR Aligned)',
        forms: cachedForms.sort((a, b) => a.form - b.form)
      })
      setLoading(false)
      return
    }

    // Load metadata first, then all forms in parallel
    fetch('data/metadata.json')
      .then(res => res.json())
      .then((metadata: CurriculumMetadata) => {
        // Load all forms in parallel
        return Promise.all(
          metadata.forms.map(f => {
            if (formCache.has(f.form)) {
              return Promise.resolve(formCache.get(f.form)!)
            }
            return fetch(`data/form${f.form}.json`)
              .then(res => res.json())
              .then((data: { form: FormData }) => {
                formCache.set(f.form, data.form)
                return data.form
              })
          })
        ).then(forms => ({
          curriculum: metadata.curriculum,
          forms: forms.sort((a, b) => a.form - b.form)
        }))
      })
      .then((curriculumData: CurriculumData) => {
        setData(curriculumData)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { data, loading, error }
}

// Optimized hooks with useMemo
export function useForms(data: CurriculumData | null) {
  return useMemo(() => data?.forms || [], [data])
}

export function useSkills(data: CurriculumData | null): SkillType[] {
  return useMemo(() => {
    if (!data) return []
    const skills = new Set<SkillType>()
    data.forms.forEach(form => {
      form.content_standards.forEach(cs => {
        skills.add(cs.skill as SkillType)
      })
    })
    return Array.from(skills)
  }, [data])
}

export function getContentStandardsBySkill(form: FormData, skill: SkillType) {
  return form.content_standards.filter(cs => cs.skill === skill)
}

export function useAllSkillsAcrossForms(data: CurriculumData | null) {
  return useMemo(() => {
    if (!data) return []
    const skillMap = new Map<SkillType, { form: number; cefr: string; standards: FormData['content_standards'] }[]>()
    
    data.forms.forEach(form => {
      form.content_standards.forEach(cs => {
        const skill = cs.skill as SkillType
        if (!skillMap.has(skill)) {
          skillMap.set(skill, [])
        }
        const entry = skillMap.get(skill)!
        const formEntry = entry.find(e => e.form === form.form)
        if (formEntry) {
          formEntry.standards.push(cs)
        } else {
          entry.push({
            form: form.form,
            cefr: form.cefr_level,
            standards: [cs]
          })
        }
      })
    })
    
    return Array.from(skillMap.entries())
  }, [data])
}

export function useSyllabusComparison(data: CurriculumData | null) {
  return useMemo(() => {
    if (!data) return []
    
    return data.forms.map(form => ({
      form: form.form,
      cefr: form.cefr_level,
      themes: form.syllabus_content.themes,
      grammarCount: form.syllabus_content.grammar_textbook_based.length,
      vocabularyCategories: form.syllabus_content.vocabulary_by_category.length,
      vocabularyUnits: form.syllabus_content.vocabulary_by_unit.length,
      textTypes: form.syllabus_content.text_types.length,
      grammar: form.syllabus_content.grammar_textbook_based,
      vocabulary: form.syllabus_content.vocabulary_by_category,
      textTypesList: form.syllabus_content.text_types
    }))
  }, [data])
}
