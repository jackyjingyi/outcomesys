import './infopanel.css';
import {useEffect, useReducer, useRef, useState} from "react";
import {ROLES, DATA_CODES, PROJECT_TYPES, PROJECT_CATE, PROJECT_TEAM} from "../config";
import {Form} from "react-bootstrap";
import Select from "react-select";
import Async, {useAsync} from "react-select/async"
import AsyncSelect from 'react-select/async';
import {getSponsorList, getUserList, getApproverList, getProjectListDisplay, postProject} from "../api";

export function InfoPanel(props) {
    const role = props.role
    // handel information fetched from db
    // const [panel, setPanel]=useState()
    // require 类型, data, user info.

    const [panel, setPanel] = useState(null)
    console.log(props.data)

    useEffect(() => {
        // console.log(props)
        if (props.target) {

            switch (props.target) {
                case DATA_CODES.CREATE_PROJECT:
                    setPanel(<CreateProjectForm {...props}/>)
                    break;
                case DATA_CODES.PROJECT_LIST:
                    setPanel(<ProjectList {...props}/>)
                    break;
                default:
                    setPanel(<div></div>)
            }
        } else {
            setPanel(<div></div>)
        }

    }, [props, props.target])

    return (<div className={`info-content`}>
        {panel}
    </div>)
}

function CreateProjectForm(props) {
    // todo: 1. first display how to create project, then user input contract No.
    // todo: 2. integrate with funcs
    const [formData, setFormData] = useReducer(
        (formData, newFormData) => ({...formData, ...newFormData}), {
            project_id: '',
            project_title: '',
            project_type: '',
            project_cate: '',
            project_team: '',
            project_sponsor: '',
            project_approver: '',
            project_issuer:props.user.id
        },
    )

    const [displayForm, setDisplayForm]=useState(true)

    const clearMultiTeam = useRef(null)
    const clearMultiSponsor = useRef(null)
    const clearMultiApprover = useRef(null)

    const formPanel = <form id={`theform`}>
                    <div>
                        <div>
                            <label htmlFor="project_id" className="form-label">合同编号</label>
                            <input className="form-control"
                                   id="project_id"
                                   value={formData.project_id}
                                   onChange={(e) => setFormData({
                                       project_id: e.target.value
                                   })}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project_title" className="form-label">项目名称</label>
                            <input className="form-control"
                                   id="project_title"
                                   value={formData.project_title}
                                   onChange={(e) => setFormData({
                                       project_title: e.target.value
                                   })}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project_type" className="form-label">项目类型</label>
                            <select className="form-select"
                                    id="project_type"
                                    value={formData.project_type}
                                    onChange={(e) => setFormData({
                                        project_type: e.target.value
                                    })}
                            >
                                {PROJECT_TYPES.map((value, index) => {
                                    return <option key={index} value={value.value}>{value.label}</option>
                                })}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project_cate" className="form-label">项目分类</label>
                            <select className="form-select"
                                    id="project_cate"
                                    value={formData.project_cate}
                                    onChange={(e) => setFormData({
                                        project_cate: e.target.value
                                    })}
                            >
                                {PROJECT_CATE.map((value, index) => {
                                    return <option key={index} value={value.value}>{value.label}</option>
                                })}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project_team" className="form-label">项目团队</label>
                            <Select options={PROJECT_TEAM}
                                    isMulti={true}
                                    placeholder={`请选择团队`}
                                    defaultValue={formData.project_team}
                                    onChange={(e) => setFormData({
                                        project_team: e.map((item, index) => {
                                            return item.value
                                        })
                                    })}
                                    aria-label={`project_team`}
                                    backspaceRemovesValue={true}
                                    ref={clearMultiTeam}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project_sponsor" className="form-label">项目负责人</label>
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                loadOptions={getSponsor}
                                isMulti={true}
                                placeholder={`请选择项目负责人`}
                                aria-label={`project_sponsor`}
                                defaultValue={formData.project_sponsor}
                                onChange={(e) => setFormData({
                                    project_sponsor: e.map((item, index) => {
                                        return item.id
                                    })
                                })}
                                backspaceRemovesValue={true}
                                ref ={clearMultiSponsor}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project_approver" className="form-label">分管领导</label>
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                loadOptions={getApprover}
                                isMulti={true}
                                placeholder={`请选择分管领导`}
                                aria-label={`project_approver`}
                                defaultValue={formData.project_approver}
                                onChange={(e) => setFormData({
                                    project_approver: e.map((item, index) => {
                                        return item.id
                                    })
                                })}
                                backspaceRemovesValue={true}
                                ref ={clearMultiApprover}
                            />
                        </div>
                        <div className={`submitPanel`}>
                            <button onClick={createProject}>提交</button>

                            <button type={`reset`} onClick={resetForm}>重置</button>
                        </div>
                    </div>
                </form>
    const msgPanel = <div>提交成功</div>
    const panelHandler = displayForm? formPanel:msgPanel
    async function getSponsor() {
        const userList = await getSponsorList()
        return userList.data
    }

    async function getApprover() {
        const userList = await getApproverList()
        return userList.data
    }

    function checkFormData() {
        let valid = true
        Object.keys(formData).map(function (key) {
            if (formData[key] === '') {
                valid = false
            }
        })
        return valid
    }

    function createProject() {
        if (checkFormData()) {
            postProject(formData).then((res)=>{
                console.log(res)
                // todo: 1. show success 2. flush formDATA 3. change page
                resetForm();
                setDisplayForm(false)
            }).catch((err)=>{
                console.log(err)
            })
        }else{
            //todo alert user need fill all required field
        }
    }

    function resetForm(){
        setFormData({
            project_id: '',
            project_title: '',
            project_type: '',
            project_cate: '',
            project_team: '',
            project_sponsor: '',
            project_approver: '',
            project_issuer:props.user.id
        })
        clearMultiTeam.current.clearValue();
        clearMultiSponsor.current.clearValue();
        clearMultiApprover.current.clearValue();
    }


    return (<div className={`formContainer`}>
            设置背景色4
            {panelHandler}
        </div>

    )
}


function ProjectList(props) {
    // todo: display project list
    // 2022/4/19
    const [projects, setProjects] = useState([])

    useEffect(() => {
        getProjectListDisplay().then((res) => {
            console.log(res)
            setProjects(res.data)
        })

    }, [])
    return (<table className="table">
        <thead>
        <tr>
            <th scope="col">#</th>
            <th scope="col">项目名称</th>
            <th scope="col">项目类型</th>
            <th scope="col">项目组</th>
        </tr>
        </thead>
        <tbody>
        {
            projects.map((item, index) => {
                return (
                    <tr>
                        <td>{index + 1}</td>
                        <td>{item.project_title}</td>
                        <td>{item.get_project_type_display}</td>
                        <td>{
                            item.project_team.map((t, i) => {
                                return (
                                    <a data-target={t.id}>{t.name} </a>
                                )
                            })
                        }</td>
                    </tr>
                )

            })
        }
        </tbody>
    </table>)
}

function AchievementList(props) {
    // todo: display achievements based on props.project_id
}

function AchievementInit(props) {
    // todo*: init an achievement
}

function AchievementDetail(props) {
    // todo: display Achievement object
}

function ProcessList(props) {
    // todo: display all process against user
}

function ProcessDetail(props) {
    // todo: Process Detail, provide different funcs based on different role
}

