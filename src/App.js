import {forwardRef, useCallback, useEffect, useReducer, useRef, useState} from "react";
import {Link, NavLink, Outlet, Route, Routes, useLocation, useNavigate, useParams} from "react-router-dom";

import './App.css';
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// local package
import {getProject, getUserInfo} from './api'
import jwt_decode from "jwt-decode";
import CreateProjectForm from './project/project/project_creation'
import ProjectList, {MyProjectsListTable, ProjectListTable} from "./project/project/project_lists";
import ProjectDetail from "./project/project/project_detail";
import {ROLES} from "./config";
import {ErrorManager} from "./errors/errormanager";
import API, {AUTH_TOKEN} from "./axiosConfig";
import {BasicModal, FormModal, SubmitModal, StandardModal} from "./components/modal";
import {ProjectContext} from "./context_manager";
import {Button, ButtonGroup, IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import Paper from '@mui/material/Paper'
import BasicPagination from "./components/basicPagination";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {styled} from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FilledInput from "@mui/material/FilledInput";
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Select from "react-select";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CustomizedSnackbars from './components/alert'
import Checkbox from '@mui/material/Checkbox';
import {deepOrange, pink, green} from '@mui/material/colors';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import HomeIcon from '@mui/icons-material/Home';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AddTaskIcon from '@mui/icons-material/AddTask';
import ApprovalIcon from '@mui/icons-material/Approval';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import BugReportIcon from '@mui/icons-material/BugReport';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import axios from "axios";
import {DEBUG} from './config';
import BadgeAvatars from './components/avatar'


const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff', ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function tokenInit(token) {
    return jwt_decode(token)
}

function tokenDecode(accessInfo, token) {
    return jwt_decode(token)
}


function App() {
    const location = useLocation();
    const [requestErrorCode, setRequestErrorCode] = useState(200)
    // token 是常变化的，所以作为api入参
    const [accessToken, setAccessToken] = useState(window.localStorage.getItem('AUTH_TOKEN'))
    // const [accessToken, setAccessToken] = useState(AUTH_TOKEN)
    const [user, setUser] = useState() //todo userID, name , change to useReducer
    const [role, setRole] = useState() // todo, decode => get user info

    const [accessInfo, setAccessInfo] = useReducer(tokenDecode, accessToken, tokenInit)

    const [action, setAction] = useState(null)
    const [data, setData] = useState({})
    const initUserInfo = useCallback(() => {
        if (accessToken) {
            const info = jwt_decode(accessToken)
            return getUserInfo(info.user_id)
        }
    }, [accessToken])


    useEffect(() => {
        initUserInfo().then((res) => {
            // set user
            setUser(res.data)
            window.localStorage.setItem('user', JSON.stringify(res.data))

            // set to local storage

        }).catch((err) => {
            // raise exception
        })
    }, [initUserInfo])

    useEffect(() => {
        // todo: change data panel

        setData(action) // todo, action=>request=>res=>setdata
    }, [action])
    return (<Routes>
        <Route path={'/'} element={<PanelManager user={user}/>}>
            {/* 项目统计 */}
            <Route index element={<div>统计图</div>}/>
            <Route path={`/projects`} element={<ProjectList/>}>
                <Route path={`page/:pageID`} element={<ProjectListTable/>}/>
                <Route path={`myprojects`} element={<MyProjectsListTable/>}/>
                <Route path={`myprojects/page/:pageID`} element={<MyProjectsListTable/>}/>
                <Route path="" element={<ProjectListTable/>}/>
            </Route>
            <Route path={`/project/instance/:projectID`} element={<ProjectDetailManager/>}>
                <Route path={`achievements`} element={<Achievements/>}>
                    <Route path={`:achievementID/sub/`} element={<AchievementSub/>}/>
                </Route>
                <Route path={`create-achievement`} element={<AchievementCreate user={user}/>}/>
                <Route path={`achievements/:achievementID/`} element={<AchievementDetail user={user}/>}/>
                <Route path={`log`} element={<div>log</div>}/>
                <Route path={`detail`} element={<ProjectDetail/>}/>
                <Route path={``} element={<Achievements/>}/>
            </Route>
            <Route path={`/create-project`} element={<CreateProjectForm {...data} user={user}/>}/>
            <Route path={`/approval-center`} element={<div>审核中心(仅负责人、分管领导）</div>}/>
            <Route path={`/user-management`} element={<div>开发中</div>}/>
            <Route path={`/dev`} element={<Dev/>}/>
            <Route path={`/role`} element={<RoleChange/>}/>
            <Route path={`/error`} element={<ErrorManager/>}/>
        </Route>
    </Routes>);
}

function RoleChange() {
    const [user, setUser] = useState(JSON.parse(window.localStorage.getItem('user')) || '')
    const [needRefresh, setNeedRefresh] = useReducer(x => x + 1, 0)
    useEffect(() => {
        setUser(JSON.parse(window.localStorage.getItem('user')))
    }, [needRefresh])

    function clickHandler(e, t) {
        let username;
        const password = 'c0oWYn6lT#zd1ztD'
        switch (t) {
            case 'SECRETARY':
                username = '1001'
                break;
            case 'ADMIN':
                username = '1002'
                break;
            case 'PROJECT_WORKER1':
                username = '1003'
                break
            case 'PROJECT_WORKER2':
                username = '1004'
                break
            case 'PROJECT_SPONSOR1':
                username = '1005'
                break
            case 'PROJECT_SPONSOR2':
                username = '1006'
                break
            case 'APPROVAL_LEADER1':
                username = '1007'
                break
            case 'APPROVAL_LEADER2':
                username = '1008'
                break
            default:
                username = '1001'
                break
        }
        console.group('Change User')
        axios.post(`http://127.0.0.1:8800/api/token/`, {
            username: username, password: password,
        }).then((res) => {
            console.log(res)
            window.localStorage.setItem('AUTH_TOKEN', 'JWT ' + res.data.access)
            window.location.reload()
        }).catch((err) => {
            console.log(err)
        })
        setNeedRefresh()
    }

    return (<div>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Box sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                    <nav aria-label="main mailbox folders">
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton onClick={(e) => clickHandler(e, 'SECRETARY')}>
                                    <ListItemText primary="商务秘书"/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={(e) => clickHandler(e, 'ADMIN')}>
                                    <ListItemText primary="管理员"/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={(e) => clickHandler(e, 'PROJECT_WORKER1')}>
                                    <ListItemText primary="普通项目成员1"/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={(e) => clickHandler(e, 'PROJECT_WORKER2')}>
                                    <ListItemText primary="普通项目成员2"/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={(e) => clickHandler(e, 'PROJECT_SPONSOR1')}>
                                    <ListItemText primary="项目负责人1"/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={(e) => clickHandler(e, 'PROJECT_SPONSOR2')}>
                                    <ListItemText primary="项目负责人2"/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={(e) => clickHandler(e, 'APPROVAL_LEADER1')}>
                                    <ListItemText primary="项目leader1"/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={(e) => clickHandler(e, 'APPROVAL_LEADER2')}>
                                    <ListItemText primary="项目leader2"/>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </nav>
                </Box>
            </Grid>
            <Grid item xs={6}>
                当前用户：{user.name}
            </Grid>
        </Grid>
    </div>)
}

function PanelManager(props) {

    const location = useLocation()
    const [badgeInvisible, setBadgeInvisible] = useState(false)

    const sidemenu = () => {
        if (props.user) {
            if (props.user.role === ROLES.SECRETARY.value || props.user.role === ROLES.DEV.value || props.user.role === ROLES.ADMIN.value) {
                return (<Link to={`/create-project`} className={`text-decoration-none leftMenuLink`}>
                    <ListItemButton
                        selected={location.pathname.split('/')[1] === 'create-project'}
                        divider>
                        <ListItemIcon>
                            <AddTaskIcon/>
                        </ListItemIcon>
                        <ListItemText primary="创建项目"/>
                    </ListItemButton>
                </Link>)
            }
        }
        return null
    }

    function avatarClickHandler() {
        // 更改为检查是否有task待处理
        setBadgeInvisible(!badgeInvisible)
    }

    return (<div className={`container-fluid`}>

        <div className={`topNavbar border-bottom clearfix`}>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={1}>
                        {/* todo 换成一张图*/}
                        <img className={`appLogo`} src={`https://materials-bay.octiri.com/projects/logoiri-icon1.png`}
                             alt={`banner`}/>
                    </Grid>
                    <Grid item xs={7}>
                        <Typography variant={`h2`} align={`left`} className={`mt-3 ms-5`}>
                            成果审批系统
                        </Typography>
                    </Grid>
                    <Grid className={`userInfo`} item xs={4}>
                        <div className={`userHeaders float-end`}>
                            <Stack direction={`row`}>
                                <Box onClick={avatarClickHandler}>
                                    <BadgeAvatars user={props.user} invisible={badgeInvisible}/>
                                </Box>
                                <Typography align={`left`} className={`mt-1 p-1`}
                                            variant={`h6`}> {props.user ? props.user.name : ''}
                                </Typography><br/>
                            </Stack>
                        </div>
                    </Grid>
                </Grid>
            </Box>

        </div>
        <Box className={`mainPanel`}>
            {/* todo change to 15vw*/}
            <Grid container>
                <Grid item xs={1} className={`leftSidebar border`}>
                    <nav aria-label="left sidebar">
                        <List>
                            <Link to={``} className={`text-decoration-none leftMenuLink`}>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={location.pathname.split('/')[1] === ''}
                                        divider>
                                        <ListItemIcon>
                                            <HomeIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary="首页"/>
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                            {sidemenu()}
                            <Link to={`/projects`} className={`text-decoration-none leftMenuLink`}>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={location.pathname.split('/')[1] === 'projects' || location.pathname.split('/')[1] === 'project'}
                                        divider>
                                        <ListItemIcon>
                                            <FormatListBulletedIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary="项目列表"/>
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                            <NavLink to={`/approval-center`} className={`text-decoration-none leftMenuLink`}>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={location.pathname.split('/')[1] === 'approval-center'}
                                        divider>
                                        <ListItemIcon>
                                            <ApprovalIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary="审核中心"/>
                                    </ListItemButton>
                                </ListItem>
                            </NavLink>
                        </List>
                        {DEBUG ? <Link to={`/role`} className={`text-decoration-none leftMenuLink`}>
                            <ListItem disablePadding>
                                <ListItemButton
                                    selected={location.pathname.split('/')[1] === 'role'}
                                    divider>
                                    <ListItemIcon>
                                        <BugReportIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="角色切换(测试用)"/>
                                </ListItemButton>
                            </ListItem>
                        </Link> : null}
                        {DEBUG ? <Link to={`/dev`} className={`text-decoration-none leftMenuLink`}>
                            <ListItem disablePadding>
                                <ListItemButton
                                    selected={location.pathname.split('/')[1] === 'dev'}
                                    divider>
                                    <ListItemIcon>
                                        <DeveloperModeIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="开发资料(开发用）"/>
                                </ListItemButton>
                            </ListItem>
                        </Link> : null}
                    </nav>
                </Grid>
                <Grid item xs={11} className={`rightPanel border p-3`}>
                    <div className={`row infoPanel p-3`}>
                        <Outlet/>
                        {/*<InfoPanel {...data} user={user}/>*/}
                    </div>
                    <div className={`row innerFooter border-top`}>
                        <Box>
                            <Typography className={`mt-3 pt-3`} align={`center`} variant={`h5`}>
                                数字大脑研发：大数据重点实验中心
                                粤公网安备 44030502008599号
                            </Typography>
                        </Box>
                    </div>
                </Grid>
            </Grid>
        </Box>
    </div>);
}

function ProjectDetailManager() {
    const params = useParams();

    // const [user,setUser] = useState(JSON.parse(window.localStorage.getItem('user')))
    function tab1() {
        const user = JSON.parse(window.localStorage.getItem('user'))

        if (user.role === ROLES.DEV.value || user.role === ROLES.SECRETARY.value || user.role === ROLES.ADMIN.value) {
            return (<li className="nav-item" role="presentation">
                <button className="nav-link" id="output-tab" data-bs-toggle="tab" data-bs-target="#output"
                        type="button" role="tab" aria-controls="output" aria-selected="false">
                    <NavLink
                        className={`text-decoration-none`}
                        to={`/project/instance/${params.projectID}/detail`}
                    >项目详情</NavLink>
                </button>
            </li>)
        }

    }

    function tab2() {
        const user = JSON.parse(window.localStorage.getItem('user'))

        if (user.role === ROLES.DEV.value || user.role === ROLES.SECRETARY.value || user.role === ROLES.ADMIN.value) {
            return (<li className="nav-item" role="presentation">
                <button className="nav-link" id="log-tab" data-bs-toggle="tab" data-bs-target="#log"
                        type="button" role="tab" aria-controls="log" aria-selected="false"><NavLink
                    className={`text-decoration-none`}
                    to={`/project/instance/${params.projectID}/log`}
                >记录</NavLink>
                </button>
            </li>)
        }
    }

    return (<div>
        <ul className="nav nav-tabs" id="myTab" role="tablist">
            {/* todo: 改为 navigate 项目详情改为仅管理员可见 */}

            <li className="nav-item" role="presentation">
                <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home"
                        type="button" role="tab" aria-controls="home" aria-selected="true">
                    <NavLink
                        className={`text-decoration-none`}
                        to={`/project/instance/${params.projectID}/achievements`}
                    >成果列表</NavLink>
                </button>
            </li>
            {tab1()}
            {tab2()}
        </ul>
        <br></br>
        <div className="tab-content" id="myTabContent">
            <Outlet/>

        </div>

    </div>)
}

function Achievements() {
    const navigate = useNavigate()
    const params = useParams();
    const user = JSON.parse(window.localStorage.getItem('user'))
    const [achievements, setAchievements] = useState(null)
    const [project, setProject] = useState(null)
    const [pageInfo, setPageInfo] = useReducer((pageInfo, newPageInfo) => ({...pageInfo, ...newPageInfo}), {
        previous: -1, next: -1, current: -1, count: -1, total_pages: -1,
    })
    const [isMember, setIsMember] = useState(true)
    useEffect(() => {
        if (!project) {
            API.get(`/v1/project-system/project/${params.projectID}`).then((res) => {
                setProject(res.data)
                const membersID = res.data.project_members.map((item, index) => {
                    return item.id
                }) // list
                console.log(membersID, membersID.includes(user.id))
                if (!membersID.includes(user.id)) {
                    setIsMember(false)
                }
                return API.get(`/v1/project-system/achievement/get_achievements_by_projectid/?projectid=${params.projectID}`)
            }).then((res) => {
                console.log(res.data)
                setAchievements(res.data.results)
                setPageInfo({
                    previous: res.data.links.previous ? res.data.current - 1 : null,
                    next: res.data.links.next ? res.data.current + 1 : null,
                    current: res.data.current,
                    count: res.data.count,
                    total_pages: res.data.total_pages,
                })
            }).catch((err) => {
                navigate(`/error`, {state: err.response.status})
            })
        } else {
            API.get(`/v1/project-system/achievement/get_achievements_by_projectid/?projectid=${params.projectID}&page=${pageInfo.current}`).then((res) => {
                setAchievements(res.data.results)
                setPageInfo({
                    previous: res.data.links.previous ? res.data.current - 1 : null,
                    next: res.data.links.next ? res.data.current + 1 : null,
                    current: res.data.current,
                    count: res.data.count,
                    total_pages: res.data.total_pages,
                })
            }).catch((err) => {
                navigate(`/error`, {state: err.response.status})
            })
        }
    }, [params.projectID, pageInfo.current])

    return (<div className={`row justify-content-start m-3`}>
        <div className={`col-9 border`}>
            <div className={`row`}>
                <div className={`mt-3 float-start col-md-6`}>
                    <h5>{project ? project.project_title : null}</h5>
                </div>
                <div className={`mt-3 col-md-6`}>
                    <Button className={`float-end`} variant={`contained`} size={`small`} color={`primary`}
                            disabled={!isMember}>
                        <Link className={`text-decoration-none text-light`}
                              to={`/project/instance/${params.projectID}/create-achievement`}>创建成果</Link>
                    </Button>
                </div>
            </div>
            <div className={`row`}>
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">成果名称</th>
                        <th scope="col">成果列表</th>
                        <th scope="col">工作阶段</th>
                        <th scope="col">提交人</th>
                        <th scope="col">状态</th>
                    </tr>
                    </thead>
                    <tbody>
                    {achievements ? achievements.map((item, index) => {
                        return (<tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                <NavLink style={({isActive}) => {
                                    return {backgroundColor: isActive ? "pink" : "yellow",}
                                }}
                                         to={`/project/instance/${params.projectID}/achievements/${item.id}/sub`}>
                                    {item.name}
                                </NavLink>
                            </td>
                            <td>{item.output_list}</td>
                            <td>{item.stage}</td>
                            <td>{item.creator_name}</td>
                            <td>{item.state_display_name}
                            </td>
                        </tr>)
                    }) : null}
                    </tbody>
                </table>

            </div>
            <div className={`row float-end bottom-0`}>
                <BasicPagination {...pageInfo} setPageInfo={setPageInfo}/>
            </div>
        </div>
        <div className={`col-3 border`}>
            <div className="card">
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <dd>
                            项目名称
                        </dd>
                        <dl className={`description`}>
                            {project ? project.project_title : null}
                        </dl>
                    </li>
                    <li className="list-group-item">
                        <dd>
                            项目分类
                        </dd>
                        <dl className={`description`}>
                            {project ? project.get_project_cate_display : null}
                        </dl>
                    </li>
                    <li className="list-group-item">
                        <dd>
                            项目类型
                        </dd>
                        <dl className={`description`}>
                            {project ? project.get_project_type_display : null}
                        </dl>
                    </li>
                    <li className="list-group-item">
                        123
                        <Outlet/>
                    </li>
                </ul>
            </div>
        </div>
    </div>)
}

function AchievementSub() {
    // todo:check user role
    const params = useParams()
    useEffect(() => {
        getProject(params.projectID).then((res) => {
            console.log(res.data)
        })
    }, [params.projectID])

    return (<div>
        <dd>
            成果ID： {params.achievementID}
        </dd>
        <dl className={`description`}>
            <NavLink
                to={`/project/instance/${params.projectID}/achievements/${params.achievementID}/`}>成果管理</NavLink>
        </dl>
    </div>)
}


function AchievementDetail() {
    // 1. created achievement detail
    // 2. can change \ submit \ withdraw
    const params = useParams()
    const navigate = useNavigate()
    const user = JSON.parse(window.localStorage.getItem('user'))
    const [isDisabled, setIsDisabled] = useState(true)
    // modal controller
    const [openFormModal, setOpenFormModal] = useState(false)
    const [openSubmitModal, setOpenSubmitModal] = useState(false)
    const [openBasicModal, setOpenBasicModal] = useState(false)
    const [basicComments, setBasicComments] = useState('')
    const [basicModalTitle, setBasicModalTitle] = useState('')
    const [basicModalChecked, setBasicModalChecked] = useState(false)
    const [basicModalButtonDisabled, setBasicModalButtonDisabled] = useState(true)
    const [basicModalConfirmButton, setBasicModalConfirmButton] = useState(null)

    const [form, setForm] = useReducer((form, newForm) => ({...form, ...newForm}), {
        id: -1,
        project_title: '',
        name: '',
        stage: '',
        output_list: '',
        creator_name: '',
        created: '',
        updated: '',
        project: -1,
        creator: -1,
        files: [],
        project_sponsor: [],
        project_appover: []
    })
    const [history, setHistory] = useReducer((form, newForm) => ({...form, ...newForm}), {
        id: -1,
        project_title: '',
        name: '',
        stage: '',
        output_list: '',
        creator_name: '',
        created: '',
        updated: '',
        project: -1,
        creator: -1,
        files: [],
    })
    const [fileForm, setFileForm] = useReducer((fileForm, newFileForm) => ({...fileForm, ...newFileForm}), {
        achievement: params.achievementID, creator: user.id, tags: [], file: null, name: ''
    })
    const [isCreator, setIsCreator] = useState(false)
    const [pageInfo, setPageInfo] = useReducer((pageInfo, newPageInfo) => ({...pageInfo, ...newPageInfo}), {
        previous: -1, next: -1, current: -1, count: -1, total_pages: -1,
    })
    const [files, setFiles] = useState([])
    const [needRefresh, setNeedRefresh] = useReducer(x => x + 1, 0) // 强制更新
    const creatFileButtonRef = useRef(null)
    const [approvalForm, setApprovalForm] = useReducer((approvalForm, newApprovalForm) => ({...approvalForm, ...newApprovalForm}), {
        flow_type: 'SINGLE', required_approver: [], level: 1, comments: ''
    })
    const [modalLock, setModalLock] = useState(false)
    const [loading, setLoading] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertType, setAlertType] = useState(``)
    const [alertMsg, setAlertMsg] = useState('')
    const [permissions, setPermissions] = useReducer((permissions, newPermissions) => ({...permissions, ...newPermissions}), {
        // add_achievement:1,
        change_achievement: -1,
        submit_achievement: -1,
        withdraw_achievement: -1,
        approve_achievement_lv1: -1,
        approve_achievement_lv2: -1,
        final_review_achievement: -1,
    })
    useEffect(() => {
        // 首先获取 Achievement的基本信息
        API.get(`v1/project-system/achievement/${params.achievementID}`).then((res) => {
            setForm({...res.data})
            // 取消不发送，反填数据
            setHistory({...res.data})
            // if (user.id in )
            const sponsors = res.data.project_sponsor
            for (let i = 0; i < sponsors.length; i++) {

                if (user.id == sponsors[i].id) {
                    setApprovalForm({level: 2})
                }
            }
            return API.get(`v1/project-system/file/get_files_by_achievement_id/?achievement_id=${params.achievementID}`)
        }).then((res) => {
            // 获取文件列表
            setPageInfo({
                previous: res.data.links.previous,
                next: res.data.links.next,
                current: res.data.current,
                count: res.data.count,
                total_pages: res.data.total_pages,
            })
            setFiles(res.data.results)
            return API.get(`v1/project-system/achievement/${params.achievementID}/get_request_user_permissions/`)
        }).then((res) => {
            console.log(res)
            setPermissions({
                change_achievement: res.data.includes(`change_achievement`) ? 1 : 0,
                submit_achievement: res.data.includes(`submit_achievement`) ? 1 : 0,
                withdraw_achievement: res.data.includes(`withdraw_achievement`) ? 1 : 0,
                approve_achievement_lv1: res.data.includes(`approve_achievement_lv1`) ? 1 : 0,
                approve_achievement_lv2: res.data.includes(`approve_achievement_lv2`) ? 1 : 0,
                final_review_achievement: res.data.includes(`final_review_achievement`) ? 1 : 0,
            })

        })
    }, [params.achievementID, needRefresh])

    useEffect(() => {
        if (pageInfo.current !== -1) {
            API.get(`v1/project-system/file/get_files_by_achievement_id/?achievement_id=${params.achievementID}&page=${pageInfo.current}`).then((res) => {
                setPageInfo({
                    previous: res.data.links.previous,
                    next: res.data.links.next,
                    current: res.data.current,
                    count: res.data.count,
                    total_pages: res.data.total_pages,
                })
                setFiles(res.data.results)
            })
        }
    }, [pageInfo.current, needRefresh])

    useEffect(() => {
        if (form.creator !== -1) {
            checkUserPermission();
        }
    }, [form.creator])


    // create new file
    function handleCreate() {
        // 添加成果文件
        setOpenFormModal(true)
    }

    function checkUserPermission() {
        // todo, 如果用户为创建者，关联按钮
        // if user == achievement creator only
        console.group('checking user permissions')
        console.log(user.id, form.creator)
        if (user.id !== form.creator && user.role !== ROLES.ADMIN.value && user.role !== ROLES.DEV.value) {
            console.log('user is not achievement creator')
            console.log(creatFileButtonRef)
            setIsCreator(false)
        } else {
            setIsCreator(true)
        }
        console.groupEnd()

    }


    function handleChangeAchievement() {
        // 变更成果基本信息
        // todo show loading
        setIsDisabled(true)
        setTimeout(() => {
            API.patch(`v1/project-system/achievement/${params.achievementID}/`, {
                ...form
            }).then((res) => {
                console.group('patch achievement return')
                console.log(res.data)

                setForm({...res.data})
                setHistory({...res.data})
            }).catch((err) => {
                console.log('error', err.response.data)
                setForm({...history})
            })
        }, 1500)
        console.groupEnd()
    }

    function handleAchievementChangeCancel() {
        // 基本成果信息修改取消
        setIsDisabled(true)
        setForm({...history})
    }

    function handleDownload(e, i) {
        // 文件下载
        console.log(e, i)
        const fileID = i
    }

    function handleDelete() {
        // 文件删除
    }

    function handleFileChange() {
        // 文件修改
    }


    function actionButtons() {
        const achievementActions = {
            // add_achievement: {isDefault: false}, not in this page
            // change_achievement: {isDefault: false},
            // view_achievement: {isDefault: true},
            submit_achievement: {
                isDefault: false, name: ['提交'], permission: 'submit_achievement', action_code: ['submit_achievement']
            }, delete_achievement: {
                isDefault: false, name: ['删除'], permission: 'delete_achievement', action_code: ['delete_achievement']
            }, withdraw_achievement: {
                isDefault: false,
                name: ['撤销'],
                permission: 'withdraw_achievement',
                action_code: ['withdraw_achievement']
            }, approve_achievement_lv1: {
                isDefault: false,
                name: ['通过', '驳回'],
                permission: 'approve_achievement_lv1',
                action_code: ['approve1', 'deny1']
            }, approve_achievement_lv2: {
                isDefault: false,
                name: ['通过', '驳回'],
                permission: 'approve_achievement_lv2',
                action_code: ['approve2', 'deny2']
            }, final_review_achievement: {
                isDefault: false,
                name: ['通过', '驳回'],
                permission: 'final_review_achievement',
                action_code: ['approve_review', 'deny_review']
            },
        }
        return (<ButtonGroup variant={`contained`} disableElevation>
            {Object.keys(achievementActions).map((key) => {
                const item = achievementActions[key]
                return item.name.map((p, i) => {
                    if (permissions[item.permission] === 1) {
                        // 如果权限列表包含相关权限，创建相关的Button
                        return (<Button
                            actionCode={item.action_code[i]}
                            data-action={item.action_code[i]}
                            onClick={(e) => handleAction(e,)}
                        >
                            {p}
                        </Button>)
                    }
                })
            })}
        </ButtonGroup>)

    }

    function handleAction(e) {
        console.log(e.target.dataset.action)
        switch (e.target.dataset.action) {
            case 'submit_achievement':
                return submitAchievementHandler();
            case 'delete_achievement':
                return deleteAchievementHandler()
            case 'withdraw_achievement':
                return withdrawAchievementHandler()
            case 'approve1':
                return approveAchievementFirstHandler()
            case 'deny1':
                return denyAchievementFirstHandler()
            case 'approve2':
                return approveAchievementSecondHandler()
            case 'deny2':
                return denyAchievementSecondHandler()
            case 'approve_review':
                return approveReviewAchievementHandler()
            case 'deny_review':
                return denyReviewAchievementHandler()
            default:
                return;
        }
    }

    function submitAchievement() {
        // lock panel
        setModalLock(true)
        setLoading(true)

        // check if valid
        console.group('Checking approval modal information')
        if (approvalForm.flow_type && approvalForm.required_approver.length > 0) {
            console.log("pass")
            console.log(approvalForm)
            API.put(`v1/project-system/achievement/${params.achievementID}/submit/`, {...approvalForm}).then((res) => {
                console.log(res)
                setLoading(false)
                setAlertType('success')
                setAlertMsg('成果提交成功！')
                setAlertOpen(true)
                setNeedRefresh()
            }).catch((err) => {
                setLoading(false)
                setAlertType('error')
                setAlertMsg(err.response.data.msg)
                setAlertOpen(true)
                console.log(err)
            }).finally(() => {
                setModalLock(false)
                setOpenSubmitModal(false)
                setApprovalForm({
                    flow_type: 'SINGLE', required_approver: [], level: 1, comments: ''
                })
            })
        } else {
            console.log("fail")
            console.log(approvalForm)
            setModalLock(false)
            setOpenSubmitModal(false)
        }
        console.groupEnd('end')
        // submit
        // 清空

    }

    function withdrawAchievement() {
        setModalLock(true)
        setOpenBasicModal(false)
        setLoading(true)
        console.group('put withdraw start')
        console.log(basicComments)
        API.put(`v1/project-system/achievement/${params.achievementID}/withdraw/`, {
            comments: basicComments
        }).then((res) => {
            console.log(res)
            setLoading(false)
            setAlertType('success')
            setAlertMsg('撤销成果！')
            setAlertOpen(true)
            setNeedRefresh()
        }).catch((err) => {
            setLoading(false)
            setAlertType('error')
            setAlertMsg(err.response.data.msg)
            setAlertOpen(true)
            console.log(err)
        }).finally(() => {
            setModalLock(false)
            setBasicComments('')
        })
        console.groupEnd()
    }

    function submitAchievementHandler() {
        console.group('ACTION')
        console.log('submit')
        console.groupEnd()
        // 提交成果
        // step1 . 判断有无文件，无文件进行提示
        setOpenSubmitModal(true);

    }

    function deleteAchievement() {
        console.log('delete')
    }

    function deleteAchievementHandler() {
        console.group('ACTION')
        console.log('delete')
        setBasicModalTitle('删除确认')
        setOpenBasicModal(true)
        setBasicModalConfirmButton(<Button
            onClick={deleteAchievement}
            disabled={modalLock}
        >确认
        </Button>)
        console.groupEnd()
    }


    function withdrawAchievementHandler() {
        console.group('ACTION')
        console.log('withdraw')
        setBasicModalTitle('撤销确认')
        setOpenBasicModal(true)
        setBasicModalConfirmButton(<Button
            onClick={withdrawAchievement}
            disabled={modalLock}
        >确认
        </Button>)
        console.groupEnd()
        // withdrawAchievement()

    }

    function approveAchievementFirst() {
        console.group('Approval Stage1 Start')
        console.log(`Approval1`)
        console.log(approvalForm.level)
        setOpenBasicModal(false)
        // level should equal to 1
        API.put(`v1/project-system/achievement/${params.achievementID}/approve/`, {
            comments: basicComments
        }).then((res) => {
            console.log(res)
            setLoading(false)
            setAlertType('success')
            setAlertMsg('成果提交成功！')
            setAlertOpen(true)
            setNeedRefresh()
        }).catch((err) => {
            console.log(err)
            setLoading(false)
            setAlertType('error')
            setAlertMsg(err.response.data.msg)
            setAlertOpen(true)
        }).finally(() => {
            setModalLock(false)
            setBasicComments('')
        })
        console.groupEnd()
    }

    function approveAchievementFirstHandler() {
        console.group('ACTION')
        console.log('approve1')
        setBasicModalTitle('通过确认')
        setOpenBasicModal(true)

        setBasicModalConfirmButton(<Button
            onClick={approveAchievementFirst}
            disabled={modalLock}
        >确认
        </Button>)

        console.groupEnd()

    }

    function denyAchievementFirst() {
        console.log('Deny1')
    }

    function denyAchievementFirstHandler() {
        console.group('ACTION')
        console.log('deny1')
        setBasicModalTitle('驳回确认')
        setOpenBasicModal(true)
        setBasicModalConfirmButton(<Button
            onClick={denyAchievementFirst}
            disabled={modalLock}
        >确认
        </Button>)
        console.groupEnd()
    }

    function approveAchievementSecond() {
        console.log(`approve 2`)
        setOpenBasicModal(false)
        API.put(`v1/project-system/achievement/${params.achievementID}/approve/`, {
            comments: basicComments
        }).then((res) => {
            console.log(res)
            setLoading(false)
            setAlertType('success')
            setAlertMsg('成果提交成功！')
            setAlertOpen(true)
            setNeedRefresh()

        }).catch((err) => {
            console.log(err)
            setLoading(false)
            setAlertType('error')
            setAlertMsg(err.response.data.msg)
            setAlertOpen(true)
        }).finally(() => {
            setModalLock(false)
            setBasicComments('')
        })
    }

    function approveAchievementSecondHandler() {
        console.group('ACTION')
        console.log('approve2')
        setBasicModalTitle('通过确认')
        setOpenBasicModal(true)
        setBasicModalConfirmButton(<Button
            onClick={approveAchievementSecond}
            disabled={modalLock}
        >确认
        </Button>)
        console.groupEnd()

    }

    function denyAchievementSecond() {
        console.log(`deny 2`)
    }

    function denyAchievementSecondHandler() {
        console.group('ACTION')
        console.log('deny2')
        setBasicModalTitle('驳回确认')
        setOpenBasicModal(true)
        setBasicModalConfirmButton(<Button
            onClick={denyAchievementSecond}
            disabled={modalLock}
        >确认
        </Button>)
        console.groupEnd()

    }

    function approveReviewAchievement() {
        console.log(`approve review`)
    }

    function approveReviewAchievementHandler() {
        console.group('ACTION')
        console.log('approve_review')
        setBasicModalTitle('复核确认')
        setOpenBasicModal(true)
        setBasicModalConfirmButton(<Button
            onClick={approveReviewAchievement}
            disabled={modalLock}
        >确认
        </Button>)
        console.groupEnd()
    }

    function denyReviewAchievement() {
        console.log('deny Review')
    }

    function denyReviewAchievementHandler() {
        console.group('ACTION')
        console.log('deny_review')
        setBasicModalTitle('复核驳回')
        setOpenBasicModal(true)
        setBasicModalConfirmButton(<Button
            onClick={denyReviewAchievement}
            disabled={modalLock}
        >确认
        </Button>)
        console.groupEnd()
    }

    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    return (<div>
        <div>
            <Button variant={`contained`}
                    onClick={() => {
                        navigate(`/project/instance/${params.projectID}/achievements`)
                    }}>返回项目
            </Button>
            <Paper elevations={24} className={`mt-2`}>
                <div className={`row m-3`}>
                    <div className={`col-md-8 border`}>
                        <form>
                            <div>
                                <div className={`mb-3`}>
                                    <label htmlFor={`stage`} className={`form-label`}>
                                        成果名称*
                                    </label>
                                    <input className={`form-control`}
                                           id={`stage`}
                                           value={form.name}
                                           onChange={(e) => {
                                               setForm({
                                                   name: e.target.value
                                               })
                                           }}
                                           placeholder={`填写该成果名称`}
                                           required={true}
                                           disabled={isDisabled}
                                    />
                                </div>
                                <div className={`mb-3`}>
                                    <label htmlFor={`stage`} className={`form-label`}>
                                        工作阶段
                                    </label>
                                    <input className={`form-control`}
                                           id={`stage`}
                                           value={form.stage}
                                           onChange={(e) => {
                                               setForm({
                                                   stage: e.target.value
                                               })
                                           }}
                                           placeholder={`填写该成果的工作阶段`}
                                           required={true}
                                           disabled={isDisabled}
                                    />
                                </div>
                                <div className={`mb-3`}>
                                    <label htmlFor={`output_list`} className={`form-label`}>
                                        成果清单
                                    </label>
                                    <input className={`form-control`}
                                           id={`output_list`}
                                           value={form.output_list}
                                           onChange={(e) => {
                                               setForm({
                                                   output_list: e.target.value
                                               })
                                           }}
                                           placeholder={`当前成果的清单`}
                                           required={true}
                                           disabled={isDisabled}
                                    />
                                </div>
                                <div className={`mb-3`}>
                                    <label htmlFor={`creator`} className={`form-label`}>
                                        创建人(当前用户）
                                    </label>
                                    <input className={`form-control`}
                                           id={`creator`}
                                           value={form.creator_name}
                                           required={true}
                                           disabled={true}
                                    />
                                </div>
                            </div>
                            {!isDisabled ? <div className={`m-2`}>
                                <Button variant={`contained`} type={`button`}
                                        onClick={handleChangeAchievement}>提交</Button>
                                {`  `}
                                <Button variant={`contained`} type={`reset`}
                                        onClick={handleAchievementChangeCancel}>取消</Button>
                            </div> : <div className={`m-2`}>
                                <Button variant={`contained`} type={`button`} onClick={() => {
                                    setIsDisabled(false)
                                }} sx={{visibility: isCreator ? 'display' : 'hidden'}}
                                        disabled={permissions.change_achievement !== 1}
                                >修改</Button>
                            </div>}
                        </form>
                    </div>
                    <div className={`col-md-4 border`}>
                        这里不能修改<br/>
                        {/*项目名称： {`  `} {project.project_title}*/}
                        <br/>other attributes
                        <br/>todo: 文件信息
                    </div>
                </div>
                <div className={`row m-3 border`} key={`filePanel`}>
                    <div className={`m-2`}>
                        <Button className={`float-end me-2`} onClick={handleCreate} variant={`contained`}
                                size={`small`}
                                disabled={!(permissions.change_achievement === 1 && isCreator)}
                                ref={creatFileButtonRef}
                        > <AddIcon fontSize="small"/>
                        </Button>
                    </div>
                    {/*    if files */}
                    <div>
                        <table className={`table table-bordered`}>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>文件名</th>
                                <th>时间</th>
                                <th>标签</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {files ? files.map((item, index) => {
                                return (<tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        {item.name}
                                    </td>
                                    <td>{item.created.slice(0, 10)}</td>
                                    <td className={`d-flex flex-row`}>
                                        {item.tags.map((item, index) => {
                                            return (<div className={`me-3`}>
                                                <h6>
                                                                    <span key={index}
                                                                          className={`badge bg-info text-dark`}>{item}</span>
                                                </h6>
                                            </div>)
                                        })}
                                    </td>
                                    <td>
                                        <IconButton aria-label="change" size={`small`}
                                                    onClick={(e) => handleFileChange(e, item.id)}
                                                    disabled={permissions.change_achievement !== 1}
                                        >
                                            <ModeEditOutlineIcon fontSize="inherit"/>
                                        </IconButton>

                                        <IconButton aria-label="download" size={`small`}
                                                    onClick={(e) => handleDownload(e, item.id)}>
                                            <DownloadIcon fontSize="inherit"/>
                                        </IconButton>

                                        <IconButton aria-label="delete" size={`small`}
                                                    onClick={handleDelete}>
                                            <DeleteIcon fontSize="inherit"/>
                                        </IconButton>
                                    </td>
                                </tr>)
                            }) : null}
                            </tbody>
                        </table>
                        <div className={`row float-end bottom-0`}>
                            <BasicPagination {...pageInfo} setPageInfo={setPageInfo}/>
                        </div>
                    </div>
                </div>
                <div className={`row m-3 submitPanel`}>
                    {actionButtons()}
                </div>
                <div className={`row`}>
                    <ProjectContext.Provider value={{fileForm, setOpenFormModal, setFileForm, setNeedRefresh}}>
                        <FormModal open={openFormModal}/>

                    </ProjectContext.Provider>
                    <ProjectContext.Provider value={{setOpenSubmitModal, setNeedRefresh}}>
                        <SubmitModal open={openSubmitModal}>
                            <Typography id="modal-modal-title" variant="h6" component="h2" align={`center`}>
                                成果提交
                            </Typography>
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth sx={{m: 1}}>
                                            <InputLabel htmlFor="outlined-adornment-amount">{`成果名称`}</InputLabel>
                                            <FilledInput
                                                id="outlined-adornment-amount"
                                                value={form.name}
                                                variant={`filled`}
                                                size={`small`}
                                                label="Amount"
                                                disabled={true}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth sx={{m: 1}}>
                                            <InputLabel htmlFor="outlined-adornment-amount">{`工作阶段`}</InputLabel>
                                            <FilledInput
                                                id="outlined-adornment-amount"
                                                value={form.stage}
                                                variant={`filled`}
                                                size={`small`}
                                                label="Amount"
                                                disabled={true}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth sx={{m: 1}}>
                                            <InputLabel htmlFor="outlined-adornment-amount">{`成果清单`}</InputLabel>
                                            <FilledInput
                                                id="outlined-adornment-amount"
                                                value={form.output_list}
                                                variant={`filled`}
                                                size={`small`}
                                                label="Amount"
                                                disabled={true}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth sx={{m: 1}}>
                                            <InputLabel htmlFor="outlined-adornment-amount">{`提交人`}</InputLabel>
                                            <FilledInput
                                                id="outlined-adornment-amount"
                                                value={form.creator_name}
                                                variant={`filled`}
                                                size={`small`}
                                                label="Amount"
                                                disabled={true}
                                            />
                                        </FormControl>
                                    </Grid>{

                                    approvalForm.level === 1 ? <Grid item xs={12}>
                                        <FormControl fullWidth sx={{m: 1}}>
                                            <InputLabel htmlFor="outlined-adornment-amount"
                                                        shrink={true}>{`选择审批人`}</InputLabel>
                                            <Select
                                                isMulti
                                                isRtl={true}
                                                placeholder={`请选择审批人`}
                                                onChange={(e) => {
                                                    setApprovalForm({
                                                        required_approver: e.map((item, index) => {
                                                            return {id: item.value, name: item.label}
                                                        })
                                                    })
                                                }}
                                                backspaceRemovesValue={true}
                                                options={form.project_sponsor ? form.project_sponsor.map((item, index) => {
                                                    return {label: item.name, value: item.id}
                                                }) : []}
                                                isDisabled={modalLock || approvalForm.level !== 1}

                                            />
                                        </FormControl>
                                    </Grid> : <Grid item xs={12}>
                                        <FormControl fullWidth sx={{m: 1}}>
                                            <InputLabel htmlFor="outlined-adornment-amount"
                                                        shrink={true}>{`选择审批人`}</InputLabel>
                                            <Select
                                                isMulti
                                                isRtl={true}
                                                placeholder={`请选择审批人`}
                                                onChange={(e) => {
                                                    setApprovalForm({
                                                        required_approver: e.map((item, index) => {
                                                            return {id: item.value, name: item.label}
                                                        })
                                                    })
                                                }}
                                                backspaceRemovesValue={true}
                                                options={form.project_approver ? form.project_approver.map((item, index) => {
                                                    return {label: item.name, value: item.id}
                                                }) : []}
                                                isDisabled={modalLock || approvalForm.level !== 2}
                                                sx={{visibility: approvalForm.level === 2}}
                                            />
                                        </FormControl>
                                    </Grid>}
                                    <Grid item xs={12}>
                                        <FormControl fullWidth sx={{m: 1}}>
                                            <InputLabel htmlFor="outlined-adornment-amount"
                                                        shrink={true}>{`审批类型`}</InputLabel>
                                            <Select
                                                isRtl={true}
                                                placeholder={`请选择审批类型`}
                                                defaultValue={{label: '单签', value: 'SINGLE'}}
                                                onChange={(e) => {
                                                    setApprovalForm({
                                                        flow_type: e.value
                                                    })
                                                }}
                                                backspaceRemovesValue={true}
                                                options={[{label: '单签', value: 'SINGLE'}, {
                                                    label: '会签', value: 'JOIN'
                                                }, {label: '或签', value: 'OR'},]}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth sx={{m: 1}}>
                                            <InputLabel htmlFor="file-list"
                                                        shrink={true}>{`文件列表`}</InputLabel>
                                            <Item>
                                                {files.map((item, index) => {
                                                    return (<div>
                                                        {item.file_name}
                                                    </div>)
                                                })}
                                            </Item>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth sx={{m: 1}}>
                                            <TextField
                                                id="comments"
                                                label="备注"
                                                placeholder="输入简短备注"
                                                multiline
                                                value={approvalForm.comments}
                                                onChange={(e) => {
                                                    setApprovalForm({
                                                        comments: e.target.value
                                                    })
                                                }}
                                                variant={`standard`}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <ButtonGroup className={`float-end`} variant={`contained`} size={`small`}
                                                     color={`primary`}>
                                            {/*todo add submit function*/}
                                            <Button
                                                onClick={submitAchievement}
                                                disabled={modalLock}
                                            >
                                                确认
                                            </Button>
                                            <Button onClick={() => {
                                                setOpenSubmitModal(false)
                                            }

                                            }
                                                    disabled={modalLock}
                                            >
                                                取消
                                            </Button>
                                        </ButtonGroup>
                                    </Grid>

                                </Grid>
                            </Box>
                        </SubmitModal>

                    </ProjectContext.Provider>
                    <StandardModal open={openBasicModal} setParentOpen={setOpenBasicModal}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" align={`center`}>
                            {basicModalTitle}
                        </Typography>
                        <Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth sx={{m: 1}}>
                                        <TextField
                                            id="comments"
                                            label="备注"
                                            placeholder="输入简短备注"
                                            multiline
                                            value={basicComments}
                                            onChange={(e) => {
                                                setBasicComments(e.target.value)
                                            }}
                                            variant={`standard`}
                                            minRows={5}
                                            disabled={modalLock}
                                        />
                                    </FormControl>
                                </Grid>
                                {/*<Grid item xs={12}>*/}
                                {/*    <Checkbox className={`float-start`} sx={{*/}
                                {/*        color: pink[800],*/}
                                {/*        '&.Mui-checked': {*/}
                                {/*            color: pink[600],*/}
                                {/*        },*/}
                                {/*    }}*/}
                                {/*              checked={basicModalChecked}*/}
                                {/*              onChange={(e) => {*/}
                                {/*                  setBasicModalChecked(*/}
                                {/*                      e.target.checked*/}
                                {/*                  )*/}
                                {/*              }}*/}
                                {/*    /><Typography align={`left`} className={`float-start mt-2 p-1`} color={`error`}*/}
                                {/*                  variant={`body2`}>*/}
                                {/*    我确认删除后，该成果下的所有内容与文件会一同删除，且无法恢复。*/}
                                {/*</Typography>*/}
                                {/*</Grid>*/}
                                <Grid item xs={12}>
                                    <ButtonGroup className={`float-end`} variant={`contained`} size={`small`}
                                                 color={`primary`}>
                                        {/*todo add submit function*/}
                                        {basicModalConfirmButton}

                                        <Button onClick={() => {
                                            setOpenBasicModal(false)
                                        }}
                                        >
                                            取消
                                        </Button>
                                    </ButtonGroup>
                                </Grid>
                            </Grid>
                        </Box>
                    </StandardModal>
                    <div>
                        <Backdrop
                            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                            open={loading}
                            // onClick={handleClose}
                        >
                            <CircularProgress color="inherit"/>
                        </Backdrop>
                    </div>
                </div>
            </Paper>
            <br/>
            <div>
                <CustomizedSnackbars open={alertOpen} setOpen={setAlertOpen} severity={alertType} msg={alertMsg}/>
            </div>
        </div>
    </div>)
}

function AchievementCreate(props) {
    const navigate = useNavigate()
    const params = useParams()
    const [project, setProject] = useReducer((formData, newFormData) => ({...formData, ...newFormData}), params.projectID, getProject)
    const [form, setForm] = useReducer((form, newForm) => ({...form, ...newForm}), {
        project: params.projectID, name: '', stage: '', output_list: '', creator: props.user ? props.user.id : ''
    })
    const [isDisabled, setIsDisabled] = useState(false)
    const [type, setType] = useState(props.type || 0) //0 等待提交，1 已有数据
    const [achievementBasicInfo, setAchievementBasicInfo] = useReducer((achievementBasicInfo, newAchievementBasicInfo) => ({...achievementBasicInfo, ...newAchievementBasicInfo}), {
        project: '',
        stage: '',
        output_list: '',
        creator: '',
        id: '',
        project_title: '',
        creator_name: '',
        created: '',
        updated: '',
    })
    const [msg, setMsg] = useState('')
    const [openModal, setOpenModal] = useState(false)

    useEffect(() => {
        getProject(params.projectID).then((res) => {
            setProject(res.data)
        }).catch((err) => {
            console.log(err)
        })
        if (form.creator === '' && props.user) {
            setForm({
                creator: props.user.id
            })
        }
    }, [props.user])

    function subAchievement() {
        if (form.creator === '' && props.user) {
            setForm({
                creator: props.user.id
            })
        }
        API.post(`/v1/project-system/achievement/`, {
            ...form
        }).then((res) => {
            console.log(res)
            setAchievementBasicInfo({...res.data})
            setIsDisabled(true)
            setOpenModal(true)
            setMsg('创建成功')
            setTimeout(() => {
                navigate(`/project/instance/${params.projectID}/achievements/${res.data.id}/`)
            }, 1500)

        }).catch((err) => {
            console.log(err.response)
            navigate(`/error`, {state: err.response.status})
        })
    }

    return (<div>
        <h4>创建成果</h4>
        <button
            className={`btn btn-primary btn-sm`}
            onClick={() => {
                navigate(-1)
            }}>返回项目
        </button>
        <div className={`row m-3`}>
            <div className={`col-md-8 border`}>
                <form>
                    <div>
                        <div className={`mb-3`}>
                            <label htmlFor={`stage`} className={`form-label`}>
                                成果名称*
                            </label>
                            <input className={`form-control`}
                                   id={`stage`}
                                   value={form.name}
                                   onChange={(e) => {
                                       setForm({
                                           name: e.target.value
                                       })
                                   }}
                                   placeholder={`填写该成果名称`}
                                   required={true}
                                   disabled={isDisabled}
                            />
                        </div>
                        <div className={`mb-3`}>
                            <label htmlFor={`stage`} className={`form-label`}>
                                工作阶段
                            </label>
                            <input className={`form-control`}
                                   id={`stage`}
                                   value={form.stage}
                                   onChange={(e) => {
                                       setForm({
                                           stage: e.target.value
                                       })
                                   }}
                                   placeholder={`填写该成果的工作阶段`}
                                   required={true}
                                   disabled={isDisabled}
                            />
                        </div>
                        <div className={`mb-3`}>
                            <label htmlFor={`output_list`} className={`form-label`}>
                                成果清单
                            </label>
                            <input className={`form-control`}
                                   id={`output_list`}
                                   value={form.output_list}
                                   onChange={(e) => {
                                       setForm({
                                           output_list: e.target.value
                                       })
                                   }}
                                   placeholder={`当前成果的清单`}
                                   required={true}
                                   disabled={isDisabled}
                            />
                        </div>
                        <div className={`mb-3`}>
                            <label htmlFor={`creator`} className={`form-label`}>
                                创建人(当前用户）
                            </label>
                            <input className={`form-control`}
                                   id={`creator`}
                                   value={props.user ? props.user.name : ''}
                                   required={true}
                                   disabled={true}
                            />
                        </div>
                    </div>
                    <button type={`button`} onClick={subAchievement}>提交</button>
                    <button type={`reset`}>取消</button>
                </form>
            </div>
            <div className={`col-md-4 border`}>
                这里不能修改<br/>
                项目名称： {`  `} {project.project_title}
                <br/>other attributes
            </div>
        </div>
        <div className={`row`}>
            <BasicModal msg={msg} open={openModal}/>
        </div>
    </div>)
}


function Dev() {
    const [currentURI, setCurrentURI] = useState(`https://materials-bay.octiri.com/projects/business.svg`)

    function changeURI(e) {
        e.preventDefault();
        switch (currentURI) {
            case `https://materials-bay.octiri.com/projects/business.svg`:
                setCurrentURI('https://materials-bay.octiri.com/projects/sys.svg')
                break;
            case 'https://materials-bay.octiri.com/projects/sys.svg':
                setCurrentURI('https://materials-bay.octiri.com/projects/business.svg')
                break;
            default:
                setCurrentURI('https://materials-bay.octiri.com/projects/business.svg')
        }
    }

    return (<div>
        <div className={`row`}>
            <div className={`align-content-center`}>
                <button className={`btn btn-sm btn-primary`} onClick={(e) => changeURI(e)} aria-label="Next">
                    <span aria-hidden="true">下一张&raquo;</span>
                </button>
            </div>
        </div>
        <div>
            <img src={currentURI}/>
        </div>

    </div>)

}

export default App;
