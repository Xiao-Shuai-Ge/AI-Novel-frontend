import http from './http'
import { config } from '@/config.js'

const url = config.BACKEND_USER_URL

export const get_user_self = () => {
    return http.get(url + '/v1/user/get-user-self')
}