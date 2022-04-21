import axios from "axios";

// get project list from backend return json

const AUTH_TOKEN = window.localStorage.getItem('access_token') || 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjUzMDQ2NzUzLCJpYXQiOjE2NTA0NTQ3NTMsImp0aSI6ImY0MjZmODk5MTNmMzRhNTdhOGJkMjM4MjFhYmJjMzRlIiwidXNlcl9pZCI6IjEyMzQ1Njc4OSJ9.Zukkx21Zvlt1r6-FxiQA5h6PgllaebBovSWSPV_M0Fc'

const API = axios.create({
    baseURL: `http://127.0.0.1:8800/api`,
})

API.defaults.headers.common['Authorization'] = AUTH_TOKEN

export default API;
export {AUTH_TOKEN};