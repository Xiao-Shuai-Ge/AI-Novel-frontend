import http from "./http";
import { config } from '@/config.js'

const url = config.BACKEND_NOVEL_URL

export const create_chapter = (data : {
    novel_id: string,
    title: string,
    content: string,
    summary: string,
}) => {
    return http.post(url + '/v1/novel/create-chapter', data)
}

export const create_character = (data : {
    novel_id: string,
    name: string,
    avatar: string,
    summary: string,
}) => {
    return http.post(url + '/v1/novel/create-character', data)
}

export const delete_chapter = (data : {id: string}) => {
    return http.post(url + '/v1/novel/delete-chapter', data)
}

export const delete_character = (data : {id: string}) => {
    return http.post(url + '/v1/novel/delete-character', data)
}

export const get_chapter_list = (data : {novel_id : string}) => {
    return http.get(url + '/v1/novel/get-chapter-list', {params: data})
}

export const get_character_list = (data : {novel_id : string}) => {
    return http.get(url + '/v1/novel/get-character-list', {params: data})
}

export const get_chapter = (data : {id: string}) => {
    return http.get(url + '/v1/novel/get-chapter' ,{params: data})
}

export const get_character = (data : {id: string}) => {
    return http.get(url + '/v1/novel/get-character', {params: data})
}

export const update_chapter = (data : {
    id: string,
    title: string,
    content: string,
    summary: string,
}) => {
    console.log(data)
    return http.post(url + '/v1/novel/update-chapter', data)
}

export const update_character = (data : {
    id: string,
    name: string,
    avatar: string,
    summary: string,
}) => {
    return http.post(url + '/v1/novel/update-character', data)
}