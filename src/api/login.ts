import http from "./http";
import { config } from '@/config.js'

const url = config.BACKEND_USER_URL

export const login = (data : {email: string, password : string , is_remember : boolean}) => {
    return http.post(url + '/v1/login/login', data)
}

export const register = (data : {email: string, password : string , captcha : string}) => {
    return http.post(url + '/v1/login/register', data)
}

export const ping_jwt = () => {
    return http.get(url + '/v1/base/ping-jwt')
}

export const send_captcha = (data : {email: string}) => {
    return http.post(url + '/v1/login/captcha', data)
}