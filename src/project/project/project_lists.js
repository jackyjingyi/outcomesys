import {useEffect, useState, useReducer} from "react";
import {NavLink, Outlet, Route, useParams} from "react-router-dom";
import {getMyprojects, getProjectListDisplay} from "../../api";
import {Link} from "react-router-dom";
import ProjectDetail from "./project_detail";
import RouterPagination from "../../components/routerPagination";
import Box from "@mui/material/Box";


function ProjectListTable() {
    // todo 改为仅管理员可见
    const params = useParams()
    const [projects, setProjects] = useState([])
    const [pagePrefix, setPagePrefix] = useState('/projects/page')
    const [pageInfo, setPageInfo] = useReducer((pageInfo, newPageInfo) => ({...pageInfo, ...newPageInfo}), {
        previous: -1,
        next: -1,
        current: -1,
        count: -1,
        total_pages: -1,
    })
    useEffect(() => {
        getProjectListDisplay(params.pageID).then((res) => {
            setProjects(res.data.results)
            setPageInfo({
                previous: res.data.links.previous ? res.data.current - 1 : null,
                next: res.data.links.next ? res.data.current + 1 : null,
                current: res.data.current,
                count: res.data.count,
                total_pages: res.data.total_pages,
            })
        })
    }, [params.pageID])
    return (  <div>
        <div className={`row`}>
            <ProjectTable projects={projects}/>
        </div>
        <div className={`row float-end bottom-0`}>
            {/* 如果不足10条 不显示 */}
            <RouterPagination {...pageInfo} setPageInfo={setPageInfo} pagePrefix={pagePrefix}/>
        </div>
    </div>)
}

function MyProjectsListTable() {
    const params = useParams()
    const [projects, setProjects] = useState([])
    const [pagePrefix, setPagePrefix] = useState('/projects/myprojects/page')
    const [pageInfo, setPageInfo] = useReducer((pageInfo, newPageInfo) => ({...pageInfo, ...newPageInfo}), {
        previous: -1,
        next: -1,
        current: -1,
        count: -1,
        total_pages: -1,
    })
    useEffect(() => {
        getMyprojects(params.pageID).then((res) => {
            setProjects(res.data.results)
            setPageInfo({
                previous: res.data.links.previous ? res.data.current - 1 : null,
                next: res.data.links.next ? res.data.current + 1 : null,
                current: res.data.current,
                count: res.data.count,
                total_pages: res.data.total_pages,
            })
        })

    }, [params.pageID])
    return (
        <div>
            <div className={`row`}>
                <ProjectTable projects={projects}/>
            </div>
            <div className={`row float-end bottom-0`}>
                {/* 如果不足10条 不显示 */}
                <RouterPagination {...pageInfo} setPageInfo={setPageInfo} pagePrefix={pagePrefix}/>
            </div>
        </div>
    )
}


function ProjectTable(props) {

    return (
        <table className={`table m-1 border`}>
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">项目名称</th>
                <th scope="col">项目类型</th>
            </tr>
            </thead>
            <tbody>
            {props.projects.map((item, index) => {
                return (<tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                        <Link to={`/project/instance/${item.id}`} key={item.id}>
                            {item.project_title}
                        </Link>
                    </td>
                    <td>{item.get_project_type_display}</td>
                </tr>)
            })}
            </tbody>
        </table>
    )
}

function ProjectList() {

    return (<Box className={`mt-2`}>

        <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
                <button className="nav-link active" id="allProjects-tab" data-bs-toggle="tab"
                        data-bs-target="#allProjects"
                        type="button" role="tab" aria-controls="allProjects" aria-selected="true">
                    <NavLink
                        className={`text-decoration-none`}
                        to={`/projects`}
                    >全部项目</NavLink>
                </button>
            </li>
            <li className="nav-item" role="presentation">
                <button className="nav-link" id="myProjects-tab" data-bs-toggle="tab" data-bs-target="#myProjects"
                        type="button" role="tab" aria-controls="myProjects" aria-selected="false">
                    <NavLink
                        className={`text-decoration-none`}
                        to={`/projects/myprojects`}
                    >我参与的</NavLink>
                </button>
            </li>
        </ul>
        <div className={`tab-content m-3`} id="myTabContent">
            <div className="tab-pane fade show active" id="allProjects" role="tabpanel"
                 aria-labelledby="allProjects-tab">
                <div>
                    {/*limit 10*/}
                    <div className={`row`}>
                        <Outlet/>
                    </div>
                </div>

            </div>
        </div>
    </Box>)
}

export default ProjectList;
export {ProjectListTable,MyProjectsListTable};