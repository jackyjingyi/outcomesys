import axios from "axios";
import API from './axiosConfig'
import jwt_decode from 'jwt-decode'


function getUserList(params = null) {
    // get user info, TESTED
    return API.get('/accounts/users/', {
        params: params
    })
}

function getUserInfo(phone_number) {
    return API.get(`/accounts/users/${phone_number}/`)
}

function getSponsorList() {
    return API.get(`/accounts/users/get_sponsor_users/`)
}

function getApproverList() {
    return API.get(`/accounts/users/get_approver_users/`)
}

function getMemberList() {
    return API.get(`/accounts/users/get_member_users/`)
}

function getProjectListDisplay(page = null) {
    if (page !== 'null' && page) {
        console.log(page)
        return API.get(`/v1/project-system/project/?page=${page}`)
    }
    return API.get(`/v1/project-system/project/`)
}

function getMyprojects(page=null){
    if (page !== 'null' && page) {
        console.log(page)
        return API.get(`/v1/project-system/project/get_my_projects/?page=${page}`)
    }
    return API.get(`/v1/project-system/project/get_my_projects/`)
}

function postProject(param) {
    return API.post('/v1/project-system/project/', {...param})
}

function getProject(param) {
    return API.get(`/v1/project-system/project/${param}/`)
}

export {
    getUserList,
    getUserInfo,
    getSponsorList,
    getApproverList,
    getProjectListDisplay,
    postProject,
    getProject,
    getMemberList,
    getMyprojects
};