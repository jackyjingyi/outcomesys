import {useEffect, useMemo, useReducer, useRef, useState} from "react";
import {getApproverList, getMemberList, getSponsorList, postProject} from "../../api";
import {PROJECT_CATE, PROJECT_TEAM, PROJECT_TYPES} from "../../config";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import API from "../../axiosConfig";
import data from "bootstrap/js/src/dom/data";
import {useParams} from "react-router-dom";

async function getProjectDetail(projectID) {
    return await API.get(`/v1/project-system/project/${projectID}/`)
}


function ProjectDetail() {
    const params = useParams();
    // todo: 1. first display how to create project, then user input contract No.
    // todo: 2. integrate with funcs
    const [formData, setFormData] = useReducer((formData, newFormData) => ({...formData, ...newFormData}), params.projectID, getProjectDetail)
    const [history, setHistory] = useState(null)
    const [isDisabled, setIsDisabled] = useState(true)
    const multiTeam = useRef(null)
    const multiSponsor = useRef(null)
    const multiApprover = useRef(null)
    const [refresh, setRefresh] = useReducer(x => x + 1, 0)
    const [msg, setMsg] = useState('')
    const [tempMembers, setTempMembers] = useState([])

    async function getApprover() {
        const userList = await getApproverList()
        return userList.data
    }

    async function getMembers() {
        const userList = await getMemberList()
        return userList.data
    }

    function handleMembersChange(e) {
        console.log(e)
        setFormData({
            project_members: e.map((item, index) => {
                return item.value
            })
        })
        setTempMembers(
            e
        )
    }

    useEffect(() => {
        if (!formData.project_id) {
            const info = getProjectDetail(params.projectID);
            info.then((res) => {
                setFormData({
                    project_id: res.data.project_id,
                    project_title: res.data.project_title,
                    project_type: res.data.project_type,
                    project_cate: res.data.project_cate,
                    project_members: res.data.project_members.map((item, index) => {
                        return item.id
                    }),
                    project_sponsor: res.data.project_sponsor.map((item, index) => {
                        return item.id
                    }),
                    project_approver: res.data.project_approver.map((item, index) => {
                        return item.id
                    }),
                    project_issuer: res.data.project_issuer.id,
                    // project_created:res.data.project_created,
                })
                setHistory({
                    project_id: res.data.project_id,
                    project_title: res.data.project_title,
                    project_type: res.data.project_type,
                    project_cate: res.data.project_cate,
                    project_members: res.data.project_members,
                    project_sponsor: res.data.project_sponsor,
                    project_approver: res.data.project_approver,
                    project_issuer: res.data.project_issuer.id,
                    // project_created:res.data.project_created
                })
                multiTeam.current.setValue(res.data.project_members.map((item, index) => {
                    if (item) {
                        return {value: item.id, label: item.name}
                    }

                }));
                multiSponsor.current.setValue(res.data.project_sponsor.map((item, index) => {
                    return {value: item.id, label: item.name}
                }))
                multiApprover.current.setValue(res.data.project_approver.map((item, index) => {
                    return {value: item.id, label: item.name}
                }))
            })
        }
    }, [])

    const cancelChange = () => {

        setFormData({
            project_id: history.project_id,
            project_title: history.project_title,
            project_type: history.project_type,
            project_cate: history.project_cate,
            project_members: history.project_members.map((item, index) => {
                return item.id
            }),
            project_sponsor: history.project_sponsor.map((item, index) => {
                return item.id
            }),
            project_approver: history.project_approver.map((item, index) => {
                return item.id
            }),
            project_issuer: history.project_issuer.id
        })

        multiTeam.current.setValue(history.project_members.map((item, index) => {
            if (item) {
                return {value: item.id, label: item.name}
            }
        }));
        multiSponsor.current.setValue(history.project_sponsor.map((item, index) => {
            return {value: item.id, label: item.name}
        }))
        multiApprover.current.setValue(history.project_approver.map((item, index) => {
            return {value: item.id, label: item.name}
        }))

        setIsDisabled(true)
    }

    function checkFormData() {
        let valid = true
        // eslint-disable-next-line array-callback-return
        Object.keys(formData).map(function (key) {
            if (formData[key] === '') {
                valid = false
            }
        })
        return valid
    }

    const updateSubmit = () => {
        // 1. check if not changed
        // 2. check if all required value are fulfilled
        // return to success information
        if (checkFormData()) {
            console.log(formData)
            // put change
            API.patch(`/v1/project-system/project/${params.projectID}/`, {...formData}).then((res) => {
                setIsDisabled(true);
                setMsg('????????????')
                setRefresh();
                setTimeout(() => {
                    setMsg('')
                }, 3000)
            })
        } else {
            // raise alert
        }
    }
    return (
        <div className={`formContainer mt-3 ms-3`}>
            <form id={`theform`}>
                <div>
                    <div>
                        <label htmlFor="project_id" className="form-label">????????????</label>
                        <input className="form-control"
                               id="project_id"
                               value={formData.project_id || ''}
                               onChange={(e) => setFormData({
                                   project_id: e.target.value
                               })}
                               disabled={isDisabled}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="project_title" className="form-label">????????????</label>
                        <input className="form-control"
                               id="project_title"
                               value={formData.project_title || ''}
                               onChange={(e) => setFormData({
                                   project_title: e.target.value
                               })}
                               disabled={isDisabled}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="project_type" className="form-label">????????????</label>
                        <select className="form-select"
                                id="project_type"
                                value={formData.project_type}
                                onChange={(e) => setFormData({
                                    project_type: e.target.value
                                })}
                                disabled={isDisabled}
                        >
                            {PROJECT_TYPES.map((value, index) => {
                                return <option key={index} value={value.value}>{value.label}</option>
                            })}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="project_cate" className="form-label">????????????</label>
                        <select className="form-select"
                                id="project_cate"
                                value={formData.project_cate}
                                onChange={(e) => setFormData({
                                    project_cate: e.target.value
                                })}
                                disabled={isDisabled}
                        >
                            {PROJECT_CATE.map((value, index) => {
                                return <option key={index} value={value.value}>{value.label}</option>
                            })}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="project_team" className="form-label">????????????</label>
                        <AsyncSelect loadOptions={getMembers}
                                     cacheOptions
                                     defaultOptions
                                     isMulti={true}
                                     placeholder={`?????????????????????`}
                                     defaultValue={formData.project_members}
                                     onChange={(e) => handleMembersChange(e)}
                                     aria-label={`project_members`}
                                     backspaceRemovesValue={true}
                                     isDisabled={isDisabled}
                                     ref ={multiTeam}

                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="project_sponsor" className="form-label">???????????????</label>
                        <Select
                            options = {tempMembers}
                            isMulti={true}
                            placeholder={`????????????????????????`}
                            aria-label={`project_sponsor`}
                            defaultValue={formData.project_sponsor}
                            onChange={(e) => setFormData({
                                project_sponsor: e.map((item, index) => {
                                    return item.value
                                })
                            })}
                            backspaceRemovesValue={true}
                            isDisabled={isDisabled}
                            ref={multiSponsor}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="project_approver" className="form-label">????????????</label>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={getApprover}
                            isMulti={true}
                            placeholder={`?????????????????????`}
                            aria-label={`project_approver`}
                            defaultValue={formData.project_approver}
                            onChange={(e) => setFormData({
                                project_approver: e.map((item, index) => {
                                    return item.value
                                })
                            })}
                            backspaceRemovesValue={true}
                            ref={multiApprover}
                            isDisabled={isDisabled}
                        />
                    </div>
                    <div className={`submitPanel`}>
                        <button type={`button`}
                                disabled={!isDisabled}
                                onClick={() => {
                                    setIsDisabled(false)
                                }}>??????
                        </button>
                        <button type={`button`}
                                disabled={isDisabled}
                                onClick={() => {
                                    updateSubmit()
                                }}>??????
                        </button>
                        <button type={`button`}
                                disabled={isDisabled}
                                onClick={() => cancelChange()}>??????
                        </button>
                    </div>
                </div>
            </form>
            <div>
                {msg}
            </div>
        </div>
    )
}

export default ProjectDetail;