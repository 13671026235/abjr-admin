import HttpRequest from '@/libs/axios'

class McHttpRequest extends HttpRequest {
  request (options) {
    options.baseURL = 'http://localhost:8080/abjr-mc/api/v1'
    return super.request(options)
  }
}

const axios = new McHttpRequest()

export default axios
