import type { ScrapeSourceTrustworthiness } from '@resettle/schema'

export type Id = string | number

export type OffsetOrCursor = string | number | undefined

export type ScrapeSource = 'japan-dev.com'

export type StandaloneCompanyScraper<CompanyAbstract, CompanyDetailed> = {
  count: () => Promise<number>
  get: (id: Id) => Promise<CompanyDetailed | null>
  list: (
    limit: number,
    offsetOrCursor?: OffsetOrCursor,
  ) => Promise<CompanyAbstract[]>
}

export type StandaloneJobScraper<JobAbstract, JobDetailed> = {
  count: () => Promise<number>
  getId: (job: JobAbstract) => string | number
  getTime: (job: JobDetailed) => Date
  get: (id: string | number) => Promise<JobDetailed | null>
  list: (
    limit: number,
    offsetOrCursor?: OffsetOrCursor,
  ) => Promise<JobAbstract[]>
}

export type JobWithCompanyScraper<
  CompanyAbstract,
  CompanyDetailed,
  JobAbstract,
  JobDetailed,
> = {
  count: () => Promise<number>
  getCompanyId: (company: CompanyAbstract) => string | number
  getJobId: (job: JobAbstract) => string | number
  getJobTime: (job: JobDetailed) => Date
  get: (
    id: string | number,
  ) => Promise<{ job: JobDetailed; company: CompanyDetailed } | null>
  list: (
    limit: number,
    offsetOrCursor?: OffsetOrCursor,
  ) => Promise<{ job: JobAbstract; company: CompanyAbstract }[]>
}

type ScraperCommon = {
  name: ScrapeSource
  trustworthiness: ScrapeSourceTrustworthiness
}

export type ExplicitCompanyScraper<
  CompanyAbstract,
  CompanyDetailed,
  JobAbstract,
  JobDetailed,
> = ScraperCommon & {
  kind: 'explicit-company'
  companyScraper: StandaloneCompanyScraper<CompanyAbstract, CompanyDetailed>
  jobScraper: StandaloneJobScraper<JobAbstract, JobDetailed>
}

export type ImplicitCompanyScraper<
  CompanyAbstract,
  CompanyDetailed,
  JobAbstract,
  JobDetailed,
> = ScraperCommon & {
  kind: 'implicit-company'
  jobScraper: JobWithCompanyScraper<
    CompanyAbstract,
    CompanyDetailed,
    JobAbstract,
    JobDetailed
  >
}

export type Scraper<
  CompanyAbstract,
  CompanyDetailed,
  JobAbstract,
  JobDetailed,
> =
  | ExplicitCompanyScraper<
      CompanyAbstract,
      CompanyDetailed,
      JobAbstract,
      JobDetailed
    >
  | ImplicitCompanyScraper<
      CompanyAbstract,
      CompanyDetailed,
      JobAbstract,
      JobDetailed
    >
