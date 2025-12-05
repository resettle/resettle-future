import { APIClient } from '@resettle/api'
import { INTELLIGENCE_API_SCHEMAS } from '@resettle/api/intelligence'

const client = new APIClient({
  baseURL: 'http://localhost:3001',
})

const response = await client.request(INTELLIGENCE_API_SCHEMAS.place.search, {
  query: {
    country_code: 'US',
    q: 'New York',
  },
})

console.log(response)
