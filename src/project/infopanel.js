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
                    // setPanel(<CreateProjectForm {...props} type={`create`} data={null}/>)
                    break;
                case DATA_CODES.PROJECT_LIST:
                    // setPanel(<ProjectList {...props} setPanel={setPanel}/>)
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


function ProjectDetail(props) {
    // todo 项目详情，成果列表，日志，权限管理，

    return (
        <div>

        </div>
    )

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

