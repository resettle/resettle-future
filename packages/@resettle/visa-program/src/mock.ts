import type { OccupationClassification } from '@resettle/schema'

import { getRefValue } from './refs'
import type { Context } from './types'

export const createMockContext = (): Context => {
  const date = new Date('2024-07-25')
  return {
    getRefValue,
    stateInputOverrides: {},
    exchangeRatesData: [
      {
        currency_code: 'USD',
        rate_to_usd: 1,
        created_at: date,
      },
      {
        currency_code: 'EUR',
        rate_to_usd: 0.8674,
        created_at: date,
      },
      {
        currency_code: 'GBP',
        rate_to_usd: 0.7409,
        created_at: date,
      },
      {
        currency_code: 'CAD',
        rate_to_usd: 1.369,
        created_at: date,
      },
      {
        currency_code: 'AUD',
        rate_to_usd: 1.5404,
        created_at: date,
      },
      {
        currency_code: 'JPY',
        rate_to_usd: 145.27,
        created_at: date,
      },
      {
        currency_code: 'SGD',
        rate_to_usd: 1.2841,
        created_at: date,
      },
    ],
    institutionRankingsData: [
      {
        name: 'Harvard University',
        id: 'us-harvard-university',
        alternates: [],
        country: 'US',
        qs: 1,
        arwu: 1,
        twur: 2,
        usnwr: 1,
      },
      {
        name: 'University of Oxford',
        id: 'gb-university-of-oxford',
        alternates: [],
        country: 'GB',
        qs: 2,
        arwu: 7,
        twur: 1,
        usnwr: 3,
      },
    ],
    fortuneGlobal500Data: [
      {
        rank: 1,
        company: 'Walmart',
        ticker: 'WMT',
        revenue_in_millions: 648125,
        profit_in_millions: 15511,
        assets_in_millions: 252399,
        employees: 2100000,
        industry: 'General Merchandisers',
        city: 'Bentonville',
        state: 'Arkansas',
        country: 'US',
      },
    ],
    occupationClassificationCrosswalksData: [
      ['isco-2008-2511', 'anzsco-2013-261311'],
      ['isco-2008-2511', 'anzsco-2013-261312'],
      ['isco-2008-2511', 'anzsco-2022-261311'],
      ['isco-2008-2511', 'anzsco-2022-261312'],
      ['isco-2008-2511', 'nol-2024-21211'],
      ['isco-2008-2511', 'uksoc-2020-2136'],
      ['isco-2008-2511', 'ussoc-2010-15-1131'],
      ['noc-2016-2173', 'noc-2021-21711'],
      ['ussoc-2010-15-1131', 'ussoc-2018-15-1132'],
      ['noc-2016-2173', 'ussoc-2018-15-1132'],
    ]
      .map(([s, t]) => [
        { source_id: s, target_id: t },
        { source_id: t, target_id: s },
      ])
      .flat(),
    occupationClassificationsData: [
      {
        classification: 'isco-2008',
        codes: [
          { code: '2', label: 'Professionals' },
          {
            code: '25',
            label: 'Information and communications technology professionals',
          },
          {
            code: '251',
            label: 'Software and applications developers and analysts',
          },
          { code: '2511', label: 'Systems analysts' },
        ],
      },
      {
        classification: 'nol-2024',
        codes: [
          {
            code: '2',
            label: 'Natural and applied sciences and related occupations',
          },
          {
            code: '21',
            label: 'Professional occupations in natural and applied sciences',
          },
          {
            code: '212',
            label: 'Information systems and data processing',
          },
          {
            code: '2121',
            label: 'Information systems specialists',
          },
          {
            code: '21211',
            label: 'Data scientists',
          },
        ],
      },
      {
        classification: 'osca-2024',
        codes: [
          {
            code: '2',
            label: 'Professionals',
          },
          {
            code: '21',
            label: 'Natural and Physical Science Professionals',
          },
          {
            code: '217',
            label: 'ICT Professionals',
          },
          {
            code: '2171',
            label: 'ICT business and systems analysts',
          },
          {
            code: '217101',
            label: 'ICT business analyst',
          },
        ],
      },
      {
        classification: 'noc-2016',
        codes: [
          {
            code: '2',
            label: 'Natural and applied sciences and related occupations',
          },
          {
            code: '21',
            label: 'Professional occupations in natural and applied sciences',
          },
          {
            code: '217',
            label: 'Computer and information systems professionals',
          },
          {
            code: '2173',
            label: 'Software engineers and designers',
          },
        ],
      },
      {
        classification: 'noc-2021',
        codes: [
          {
            code: '2',
            label: 'Natural and applied sciences and related occupations',
          },

          {
            code: '21',
            label: 'Professional occupations in natural and applied sciences',
          },
          {
            code: '217',
            label: 'Computer and information systems professionals',
          },
          {
            code: '2171',
            label: 'Information systems analysts and consultants',
          },
          {
            code: '21711',
            label: 'Information systems analysts and consultants',
          },
        ],
      },
      {
        classification: 'uksoc-2020',
        codes: [
          {
            code: '2',
            label: 'Professional occupations',
          },
          {
            code: '21',
            label: 'Science, engineering and technology professionals',
          },
          {
            code: '213',
            label: 'Information technology professionals',
          },
          {
            code: '2136',
            label: 'Programmers and software development professionals',
          },
        ],
      },
      {
        classification: 'ussoc-2010',
        codes: [
          {
            code: '15',
            label: 'Computer and Mathematical Occupations',
          },
          {
            code: '15-1',
            label: 'Computer Specialists',
          },
          {
            code: '15-113',
            label: 'Software Developers',
          },
          {
            code: '15-1131',
            label: 'Computer Programmers',
          },
        ],
      },
      {
        classification: 'ussoc-2018',
        codes: [
          {
            code: '15',
            label: 'Computer and Mathematical Occupations',
          },
          {
            code: '15-1',
            label: 'Computer Specialists',
          },
          {
            code: '15-113',
            label: 'Software Developers',
          },
          {
            code: '15-1132',
            label: 'Software Developers, Applications',
          },
        ],
      },
      {
        classification: 'anzsco-2013',
        codes: [
          {
            code: '2',
            label: 'Professionals',
          },
          {
            code: '26',
            label: 'ICT Professionals',
          },
          {
            code: '261',
            label: 'Business and Systems Analysts, and Programmers',
          },
          {
            code: '2613',
            label: 'Software and Applications Programmers',
          },
          {
            code: '261311',
            label: 'Analyst Programmer',
          },
        ],
      },
      {
        classification: 'anzsco-2022',
        codes: [
          {
            code: '2',
            label: 'Professionals',
          },
          {
            code: '26',
            label: 'ICT Professionals',
          },
          {
            code: '261',
            label: 'Business and Systems Analysts, and Programmers',
          },
          {
            code: '2613',
            label: 'Software and Applications Programmers',
          },
          {
            code: '261311',
            label: 'Analyst Programmer',
          },
        ],
      },
    ]
      .map(c =>
        c.codes
          .map(cc => [
            {
              id: `${c.classification}-${cc.code}`,
              classification: c.classification as OccupationClassification,
              code: cc.code,
              label: cc.label,
            },
          ])
          .flat(),
      )
      .flat(),
  }
}
