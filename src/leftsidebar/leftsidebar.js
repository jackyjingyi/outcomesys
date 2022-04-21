import {useEffect, useState} from "react";
import {ROLES} from "../config";

export function LeftSidebar(props) {
    const [user, setUser] = useState()
    const [role, setRole] = useState(props.role)
    const [sidebarList, setSidebarList] = useState();

    useEffect(() => {
        switch (role) {
            case ROLES.SECRETARY:
                setSidebarList(SecretarySideBar(props))
                break
            case ROLES.PROJECT_WORKER:
                setSidebarList(MemberSideBar(props))
                break
            case ROLES.PROJECT_SPONSOR:
                setSidebarList(Sponsor(props))
                break
            case ROLES.APPROVAL_LEADER:
                setSidebarList(Leader(props))
                break
            default://-1 TODO: ADD DEV ADMIN
                setSidebarList(Visitor(props))
                break
        }
    }, [props, role])

    return (
        <div>
            {sidebarList}
        </div>
    )
}

function SecretarySideBar(props) {
    const requiredRole = ROLES.SECRETARY

    function clickHandler(e) {
        props.setAction(e.target.dataset)
    }

    return (
        <nav className="nav flex-column">
            <a className="nav-link" href="#" onClick={(e) => clickHandler(e)} data-target={`create-project`} data-role={requiredRole}>创建项目</a>
            <a className="nav-link" href="#" onClick={(e) => clickHandler(e)}  data-target={`project-list`} data-role={requiredRole}>项目列表</a>
            <a className="nav-link disabled">上传成果</a>
        </nav>
    )
}

function MemberSideBar(props) {
    return (
        <nav className="nav flex-column">
            <a className="nav-link active" aria-current="page" href="#">项目成员</a>
            <a className="nav-link" href="#">上传成果</a>
            <a className="nav-link" href="#">项目列表</a>
        </nav>
    )
}

function Sponsor(props) {
    return (
        <nav className="nav flex-column">
            <a className="nav-link active" aria-current="page" href="#">1级审批</a>
            <a className="nav-link" href="#">创建项目</a>
            <a className="nav-link" href="#">审批项目</a>
            <a className="nav-link disabled">上传成果</a>
        </nav>
    )
}

function Leader(props) {
    return (
        <nav className="nav flex-column">
            <a className="nav-link active" aria-current="page" href="#">二级审批</a>
            <a className="nav-link" href="#">创建项目</a>
            <a className="nav-link" href="#">审批项目</a>
            <a className="nav-link disabled">上传成果</a>
        </nav>
    )
}

function Visitor(props) {
    return (
        <div>'visitor'</div>
    )
}