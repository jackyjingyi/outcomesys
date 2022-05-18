import {useEffect, useReducer, useRef, useState} from "react";
import {getApproverList, getSponsorList, postProject, getMemberList} from "../../api";
import {PROJECT_CATE, PROJECT_TYPES} from "../../config";
import Select from "react-select";
import AsyncSelect from "react-select/async";


function CreateProjectForm(props) {
    // todo: 1. first display how to create project, then user input contract No.
    // todo: 2. integrate with funcs
    const [formData, setFormData] = useReducer(
        (formData, newFormData) => ({...formData, ...newFormData}), {
            project_id: '',
            project_title: '',
            project_type: '',
            project_cate: '',
            project_sponsor: '',
            project_approver: '',
            project_issuer: props.user ? props.user.id : '',
        },
    )
    const [tempMembers, setTempMembers] = useState([])

    const [displayForm, setDisplayForm] = useState(true)

    const clearMultiTeam = useRef(null)
    const clearMultiSponsor = useRef(null)
    const clearMultiApprover = useRef(null)

    useEffect(() => {
        if (props.user) {
            setFormData({
                project_issuer: props.user.id
            })
        }
    }, [props.user])

    async function getSponsor() {
        const userList = await getSponsorList()
        return userList.data
    }

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

    function checkFormData() {
        let valid = true
        console.log(formData)
        // eslint-disable-next-line array-callback-return
        Object.keys(formData).map(function (key) {
            if (formData[key] === '') {
                valid = false
            }
        })
        return valid
    }

    function createProject() {
        if (checkFormData()) {
            postProject(formData).then((res) => {
                console.log(res)
                // todo: 1. show success 2. flush formDATA 3. change page
                resetForm();
                setDisplayForm(false)
            }).catch((err) => {
                console.log(err)
            })
        } else {
            //todo alert user need fill all required field
            console.group("post project error")
            console.groupEnd()
        }
    }

    function resetForm() {
        setFormData({
            project_id: '',
            project_title: '',
            project_type: '',
            project_cate: '',
            project_members: '',
            project_sponsor: '',
            project_approver: '',
            project_issuer: props.user.id
        })
        clearMultiTeam.current.clearValue();
        clearMultiSponsor.current.clearValue();
        clearMultiApprover.current.clearValue();
    }


    return (<div className={`formContainer border` }>
            <form id={`theform m-3 p-3`}>
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
                        <label htmlFor="project_members" className="form-label">项目团队</label>
                        <AsyncSelect loadOptions={getMembers}
                                     cacheOptions
                                     defaultOptions
                                     isMulti={true}
                                     placeholder={`请选择团队成员`}
                                     defaultValue={formData.project_members}
                                     onChange={(e) => handleMembersChange(e)}
                                     aria-label={`project_members`}
                                     backspaceRemovesValue={true}
                                     ref={clearMultiTeam}
                                     isSearchable={true}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="project_sponsor" className="form-label">项目负责人</label>
                        <Select
                            options={tempMembers}
                            isMulti={true}
                            placeholder={`请选择项目负责人`}
                            aria-label={`project_sponsor`}
                            defaultValue={formData.project_sponsor}
                            onChange={(e) => setFormData({
                                project_sponsor: e.map((item, index) => {
                                    return item.value
                                })
                            })}
                            backspaceRemovesValue={true}
                            ref={clearMultiSponsor}
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
                                    return item.value
                                })
                            })}
                            backspaceRemovesValue={true}
                            ref={clearMultiApprover}
                        />
                    </div>
                    <div className={`submitPanel`}>
                        <button type={`button`} onClick={createProject}>提交</button>
                        <button type={`reset`} onClick={resetForm}>重置</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreateProjectForm;