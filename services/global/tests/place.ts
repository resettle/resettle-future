import { APIClient } from '@resettle/api'
import { GLOBAL_API_SCHEMAS } from '@resettle/api/global'

const client = new APIClient({
  baseURL: 'http://localhost:3000',
})

const response = await client.request(GLOBAL_API_SCHEMAS.place.search, {
  query: {
    country_code: 'US',
    q: 'New York',
    fuzzy: true,
  },
})

console.log(response)
