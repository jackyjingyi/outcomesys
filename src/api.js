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

function getProjectListDisplay() {
    return API.get(`/v1/project/`)
}

function postProject(param) {
    return API.post('/v1/project/', {...param})
}

export {getUserList, getUserInfo, getSponsorList, getApproverList, getProjectListDisplay, postProject};