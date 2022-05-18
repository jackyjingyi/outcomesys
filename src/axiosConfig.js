import axios from "axios";

// get project list from backend return json
// project worker
const NormalUser = 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjU0NTAxNTM0LCJpYXQiOjE2NTE5MDk1MzQsImp0aSI6IjFkM2I3ZTRjNTgyYjRiNDJiYzFjYmYxNWQ2MzRhYTY2IiwidXNlcl9pZCI6IjE4ODM1MTY4NTQ3In0.5c6-uDdADX7FOPBmThLDbnJLjPg5ClbohrnrNKLUQUo'
// stuff
const AdminUserToken = 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjUzMDQ2NzUzLCJpYXQiOjE2NTA0NTQ3NTMsImp0aSI6ImY0MjZmODk5MTNmMzRhNTdhOGJkMjM4MjFhYmJjMzRlIiwidXNlcl9pZCI6IjEyMzQ1Njc4OSJ9.Zukkx21Zvlt1r6-FxiQA5h6PgllaebBovSWSPV_M0Fc'
// sponsor1

// sponsor2

// leader1

// leader2

const AUTH_TOKEN = window.localStorage.getItem('AUTH_TOKEN')
const API = axios.create({
    baseURL: `http://127.0.0.1:8800/api`,
})

API.defaults.headers.common['Authorization'] = AUTH_TOKEN

export default API;
export {AUTH_TOKEN};