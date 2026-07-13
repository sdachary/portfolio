export interface Skill {
  category: string
  name: string
}

export interface Experience {
  company: string
  role: string
  period: string
  desc: string
}

export interface Project {
  name: string
  slug: string
  status: string
  status_key: 'live' | 'progress' | 'local' | 'open-source'
  description: string
  tags?: string[]
  live_url?: string | null
  github_url?: string | null
  local?: boolean
  last_updated?: string | null
  github_remote?: string | null
}

export interface DualCardData {
  eyebrow: string
  title: string
  items: string[]
}

export interface Service {
  num: string
  title: string
  desc: string
  audience: 'employer' | 'client' | 'both'
}

export interface WorkTrack {
  role: string
  subtitle: string
  target: string
  desc: string
  cta: string
  href: string
  accent: string
}

export interface ActivityEntry {
  phase: string
  project: string
  description: string
  date: string
  status: 'active' | 'completed' | 'blocked'
}
