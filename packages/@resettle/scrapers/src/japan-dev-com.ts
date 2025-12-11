import type { ScrapeSourceTrustworthiness } from '@resettle/schema'

import assert from 'node:assert'
import type { Id, Scraper } from './types'

type SkillAbstract = {
  name: string
  id: Id
  system_name: string
  skill_type: string
}

type SkillDetailed = SkillAbstract & {
  created_at: string // Date
  updated_at: string // Date
  alt_name: string
  alt_name2: string
  position: number
  description: string | null
  short_name: string | null
  featured: boolean
  parent_skill_id: string | null
  guide_blog_post_id: string | null
}

type JobCompanyAbstract = {
  name: string
  has_active_jobs: boolean
  is_verified: boolean
  id: Id
  slug: string
  logo_url: string // https://japan-dev.com/cdn/company_logos/{logo_url}
  short_description: string
  sr_code: number
}

type JobCompanyDetailed = JobCompanyAbstract & {
  salary_min: number | null
  salary_max: number | null
  description: string
  location: string
  linkedin_url: string
  technologies: string
  company_reviews_count: number
  company_experiences_count: number
  hiring_now: boolean
  has_values: boolean
  has_sns_image: boolean
  application_conditions: string
  published_at: string // Date
  employee_count: string // enum
  created_at: string // Date
  updated_at: string // Date
  is_home_published: boolean
  home_rating: string | null
  homepage_url: string
  published: boolean
  no_overseas_visa_sponsorship: boolean
  spam_strictness: string
  company_jobs_count: number
}

type JobDetailedAttributes = {
  id: Id
  title: string
  contract_type: string | null
  slug: string
  intro: string | null
  salary_min: number | null
  salary_max: number | null
  technologies: string
  requirements: string | null
  benefits: string | null
  skills: SkillDetailed[]
  company_description: string | null
  location: string
  application_email: string
  featured: boolean
  published: boolean
  created_at: string // Date
  updated_at: string // Date
  raw_content: string
  application_url: string // URL 'https://hrmos.co/pages/moneyforward/jobs/2116343163783999503/apply?source=japan-dev.com&utm_source=japan-dev.com'
  job_post_date: string // 'Apr 18, 2025'
  details: string | null
  is_deleted: boolean
  company_id: number
  japanese_level: string | null
  english_level: string | null
  is_internship: boolean
  position: number
  is_japanese_only: boolean
  application_conditions: string
  published_at: string // Date
  remote_level: RemoteLevelEnum
  employment_type: EmploymentTypeEnum
  seniority_level: SeniorityLevelEnum
  english_level_enum: EnglishLevelEnum
  japanese_level_enum: JapaneseLevelEnum
  candidate_location: CandidateLocationEnum
  sponsors_visas: SponsorsVisasEnum
  either_language_ok: boolean
  is_gyomu_itaku: boolean
  company: JobCompanyDetailed
}

type JobDetailed = {
  data: {
    id: Id
    type: 'job_detail'
    attributes: JobDetailedAttributes
  }
}

// language level: Native, Fluent (N1+), Business (N2+), Conversational (N3+), Basic or below (N3-)
type JapaneseLevelEnum =
  | 'japanese_unknown'
  | 'japanese_level_not_required'
  | 'japanese_level_conversational'
  | 'japanese_level_business_level'
  | 'japanese_level_fluent'
  | 'japanese_level_native'

type EnglishLevelEnum =
  | 'english_unknown'
  | 'english_level_not_required'
  | 'english_level_conversational'
  | 'english_level_business_level'
  | 'english_level_fluent'
  | 'english_level_native'

type SponsorsVisasEnum =
  | 'sponsors_visas_unknown'
  | 'sponsors_visas_yes'
  | 'sponsors_visas_no'

type RemoteLevelEnum =
  | 'remote_level_none'
  | 'remote_level_partial'
  | 'remote_level_around_office'
  | 'remote_level_full_japan'
  | 'remote_level_full_worldwide'

type SeniorityLevelEnum =
  | 'seniority_level_unknown'
  | 'seniority_level_junior'
  | 'seniority_level_mid_level'
  | 'seniority_level_new_grad'
  | 'seniority_level_senior'

type EmploymentTypeEnum =
  | 'employment_type_full_time'
  | 'employment_type_part_time'

type CandidateLocationEnum =
  | 'candidate_location_anywhere'
  | 'candidate_location_japan_only'

type CompanySizeEnum = '1-10' | '11-50' | '51-250' | '251-1000'

type JobSearchAbstract = {
  id: Id
  title: string
  intro: string | null
  benefits: string | null
  skills: SkillAbstract[]
  skill_names: string[]
  alternate_skill_names: string[]
  company_description: string | null
  location: string
  details: string | null
  japanese_level: JapaneseLevelEnum
  english_level: EnglishLevelEnum
  company_name: string
  slug: string
  salary_min: number | null
  salary_max: number | null
  requirements: string | null
  application_email: string | null
  created_at: string // ISO Date string
  updated_at: string // ISO Date string
  application_url: string | null
  job_post_date: string
  company_id: number
  is_internship: boolean
  is_japanese_only: boolean
  japanese_level_enum: JapaneseLevelEnum
  english_level_enum: EnglishLevelEnum
  published_at: string // ISO Date string
  remote_level: RemoteLevelEnum
  employment_type: EmploymentTypeEnum
  seniority_level: SeniorityLevelEnum
  candidate_location: CandidateLocationEnum
  sponsors_visas: SponsorsVisasEnum
  company: JobCompanyAbstract
  has_salary_data: boolean
  salary_tags: string[]
  job_type_names: string[]
  company_tag_names: string[]
  company_is_startup: boolean
  contract_type: string // enum
  sr_code: number
}

type JobSearchResult = {
  results: {
    indexUid: 'Job_production'
    hits: JobSearchAbstract[]
    query: string
    processingTimeMs: number
    limit: number
    offset: number
    estimatedTotalHits: number
    facetStats: {}
  }[]
}

type CompanySearchAbstract = {
  id: Id
  name: string
  locations: string[]
  description: string
  skill_names: string[]
  skills: SkillAbstract[]
  slug: string
  salary_min: number | null
  salary_max: number | null
  logo_url: string // https://japan-dev.com/cdn/company_logos/{logo_url}
  recruiting_url: string
  location: string
  employee_count: CompanySizeEnum
  linkedin_url: string
  japanese_level: JapaneseLevelEnum
  remote_level: RemoteLevelEnum
  technologies: string
  company_reviews_count: number
  company_experiences_count: number
  hiring_now: boolean
  is_b2b: boolean
  is_b2c: boolean
  has_technical_founder: boolean
  has_saas: boolean
  is_verified: boolean
  published_at: string // ISO Date string
  has_values: boolean
  application_conditions: string
  has_sns_image: boolean
  subjective_rating: number
  created_at: string // ISO Date string
  updated_at: string // ISO Date string
  published: boolean
  is_startup: boolean
  is_consultancy: boolean
  has_in_house_product: boolean
  has_global_office: boolean
  is_home_published: boolean
  home_rating: number | null
  company_jobs_count: number
  sr_code: number
  job_types: string[]
  has_active_jobs: boolean
}

type CompanySearchResult = {
  results: {
    indexUid: 'Company_production'
    hits: CompanySearchAbstract[]
    query: string
    processingTimeMs: number
    limit: number
    offset: number
    estimatedTotalHits: number
    facetStats: {}
  }[]
}

type CompanyDetailedAttributes = {
  name: string
  slug: string
  description: string
  salary_min: number | null
  salary_max: number | null
  logo_url: string
  recruiting_url: string
  employee_count: CompanySizeEnum
  linkedin_url: string
  blog_url: string
  instagram_url: string
  japanese_level: JapaneseLevelEnum
  japanese_policy: string
  remote_level: RemoteLevelEnum
  technologies: string
  hiring_now: boolean
  has_active_jobs: boolean
  published_at: string // ISO Date string
  is_verified: boolean
  has_values: boolean
  has_sns_image: boolean
  salary_policy: string
  homepage_url: string
  location: string
  twitter_url: string
  facebook_url: string
  tech_stack_policy: string
  alert_notification: string
  diversity_policy: string
  family_policy: string
  values_policy: string
  images1: string
  images2: string
  images3: string
  images_free: string
  videos_policy: string
  dev_videos_policy: string
  dev_team_leader_policy: string | null
  dev_team_members_policy: string
  dev_tech_stack_policy: string
  eng_culture_policy: string
  eng_career_policy: string
  primary_language_policy: string
  foreign_employees_policy: string
  relocation_policy: string
  language_learning_policy: string
  remote_policy: string
  skills: SkillDetailed[]
  benefits_policy: string
  career_growth_policy: string
  vacation_policy: string
  overtime_policy: string
  interview_policy: string
  headquarters_latitude: string
  headquarters_longitude: string
  work_hours_policy: string
  visa_policy: string
  direct_jobs_allowed: boolean
  application_conditions: string
  long_description: string
  external_notes: string
  aliases: string | null
  sponsors_visas: boolean
  industry: string | null
  founded_at: string // ISO Date string
  funding_status: string
  capital: string
  is_public: boolean
  single_column: boolean
  is_startup: boolean
  has_saas: boolean
  long_mission: string
  employee_count_japan: string
  english_level: EnglishLevelEnum | number
  founders: string | null
  global_hq_location: string
  japan_hq_location: string
  global_locations: string
  japan_locations: string
  has_female_execs: boolean
  allows_side_work: boolean
  is_b2b: boolean
  is_b2c: boolean
  has_technical_founder: boolean
  has_flex_time: boolean | null
  has_sensible_hours: boolean | null
  hires_foreigners: boolean
  has_foreign_employees: boolean
  has_global_office: boolean
  has_us_office: boolean
  development_style: number
  offers_relocation: boolean
  industries: string
  mission: string | null
  specialties: string | null
  real_estate_support: boolean
  japanese_lessons: boolean | null
  has_foreign_founders: boolean | null
  remote_only: boolean | null
  is_consultancy: boolean
  has_in_house_product: boolean
  show_detailed_data: boolean
  is_home_published: boolean
  home_rating: string | null
  is_deleted: boolean
  no_overseas_visa_sponsorship: boolean
  applicant_dashboard_enabled: boolean
  created_at: string // ISO Date string
  updated_at: string // ISO Date string
  normalized_name: string
  job_skills: SkillDetailed[]
  company_reviews_count: number
  company_experiences_count: number
  company_jobs_count: number
}

type CompanyDetailed = {
  data: {
    id: string
    type: 'company_detail'
    attributes: CompanyDetailedAttributes
  }
}

const SEARCH_URL = 'https://meili.japan-dev.com/multi-search'

const buildJobQueryPayload = (offset: number, limit = 20) => ({
  queries: [
    {
      indexUid: 'Job_production',
      q: '',
      facets: [
        'candidate_location',
        'company_is_startup',
        'english_level_enum',
        'japanese_level_enum',
        'job_type_names',
        'location',
        'remote_level',
        'salary_tags',
        'seniority_level',
        'skill_names',
      ],
      attributesToHighlight: ['*'],
      highlightPreTag: '__ais-highlight__',
      highlightPostTag: '__/ais-highlight__',
      limit,
      offset,
    },
  ],
})

const buildCompanyQueryPayload = (offset: number, limit = 20) => ({
  queries: [
    {
      indexUid: 'Company_production',
      facets: [
        'employee_count',
        'has_active_jobs',
        'has_global_office',
        'has_in_house_product',
        'has_values',
        'is_consultancy',
        'is_startup',
        'job_types',
        'locations',
      ],
      limit,
      offset,
    },
  ],
})

const buildJobUrl = (slug: string) =>
  `https://api.japan-dev.com/api/v1/jobs/${slug}?i18n=en`

const buildCompanyUrl = (slug: string) =>
  `https://api.japan-dev.com/api/v1/slug_companies/${slug}?i18n=en`

const AUTHORIZATION_TOKEN =
  '3838486cea4344beaef2c4c5979be249fc5736ea4aab99fab193b5e7f540ffae'

const HEADERS = {
  Authorization: `Bearer ${AUTHORIZATION_TOKEN}`,
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

export const japanDev = {
  name: 'japan-dev.com' as const,
  trustworthiness: 'curated-niche' satisfies ScrapeSourceTrustworthiness,
  kind: 'explicit-company',
  companyScraper: {
    async count() {
      const resp = await fetch(SEARCH_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(buildCompanyQueryPayload(0, 20)),
      })

      const result = (await resp.json()) as CompanySearchResult

      return result.results[0].estimatedTotalHits
    },
    async list(limit, offsetOrCursor = 0) {
      assert(typeof offsetOrCursor === 'number')
      const resp = await fetch(SEARCH_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(buildCompanyQueryPayload(offsetOrCursor, limit)),
      })

      const firstResult = (await resp.json()) as CompanySearchResult

      return firstResult.results[0].hits
    },
    async get(id) {
      const resp = await fetch(buildCompanyUrl(id as string), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })

      return (await resp.json()) as CompanyDetailed
    },
  },
  jobScraper: {
    async count() {
      const resp = await fetch(SEARCH_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(buildJobQueryPayload(0, 20)),
      })

      const result = (await resp.json()) as JobSearchResult

      return result.results[0].estimatedTotalHits
    },
    async list(limit, offsetOrCursor = 0) {
      assert(typeof offsetOrCursor === 'number')
      const resp = await fetch(SEARCH_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(buildJobQueryPayload(offsetOrCursor, limit)),
      })

      const firstResult = (await resp.json()) as JobSearchResult

      return firstResult.results[0].hits
    },
    async get(id) {
      const resp = await fetch(buildJobUrl(id as string), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })

      return (await resp.json()) as JobDetailed
    },
    getTime(job) {
      return new Date(job.data.attributes.job_post_date)
    },
    getId(job) {
      return job.id
    },
  },
} satisfies Scraper<
  CompanySearchAbstract,
  CompanyDetailed,
  JobSearchAbstract,
  JobDetailed
>
