export interface Question {
  id: string
  dimension: string
  question_number: number
  content: string
  option_a: string
  option_b: string
}

export interface TestResult {
  id: string
  type: string
  name_cn: string
  name_en: string
  description: string
  radar_data: number[]
  scores: {
    EI: { E: number; I: number; dominant: string }
    SN: { S: number; N: number; dominant: string }
    TF: { T: number; F: number; dominant: string }
    JP: { J: number; P: number; dominant: string }
  }
  dimension_analysis: Record<string, string>
  career_suggestions: string[]
  compatible_types: string[]
  incompatible_types: string[]
  color: string
}

export interface AuthUser {
  id: string
  username: string
  email: string
  is_admin: boolean
}
