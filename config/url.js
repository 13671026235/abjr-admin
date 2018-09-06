import env from './env'

const DEV_URL = 'http://localhost:8080/abjr-console/api/v1'
const PRO_URL = 'http://localhost:8080/abjr-console/api/v1'

export default env === 'development' ? DEV_URL : PRO_URL
