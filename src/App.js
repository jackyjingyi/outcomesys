import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import {LeftSidebar} from "./leftsidebar/leftsidebar";
import {ErrorManager} from "./errors/errormanager";
import {useEffect, useReducer, useState, useCallback} from "react";
import {InfoPanel} from "./infopanel/infopanel";
import {AUTH_TOKEN} from "./axiosConfig";
// local package
import {getUserInfo, getUserList} from './api'
import jwt_decode from "jwt-decode";
import axios from "axios";

function tokenInit(token) {
    return jwt_decode(token)
}

function tokenDecode(accessInfo, token) {
    return jwt_decode(token)
}

function App() {
    // 主屏
    const [requestErrorCode, setRequestErrorCode] = useState(200)
    // token 是常变化的，所以作为api入参
    const [accessToken, setAccessToken] = useState(window.localStorage.getItem('access_token') || 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjUzMDQ2NzUzLCJpYXQiOjE2NTA0NTQ3NTMsImp0aSI6ImY0MjZmODk5MTNmMzRhNTdhOGJkMjM4MjFhYmJjMzRlIiwidXNlcl9pZCI6IjEyMzQ1Njc4OSJ9.Zukkx21Zvlt1r6-FxiQA5h6PgllaebBovSWSPV_M0Fc')    //todo:
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
            console.log(res)
            setUser(res.data)
        })
    }, [initUserInfo])

    useEffect(() => {
        // todo: change data panel

        setData(action) // todo, action=>request=>res=>setdata
    }, [action])
    return (<div className={`container-fluid`}>
        <div className={`topNavbar border-bottom clearfix`}>
            <div className={`appLogo float-md-start`}>
                logo图<br></br>
                设置背景颜色1
                height :10vh
                width:100vw
            </div>
            <div className={`userInfo float-md-end`}>
                <div className={`userHeaders`}>
                    <img src={user ? user.mime : ''} alt={`头像`} height={`35vh`} className={`rounded-circle`}/>
                    <span> {user ? user.name : ''}</span>
                </div>
            </div>

        </div>
        <div className={`row mainPanel`}>
            {/* left side bar */}
            <div className={`col-md-2 leftSidebar border`}>
                设置背景色2
                <LeftSidebar role={1} setAction={setAction}/>
            </div>
            <div className={`col-md-10 rightPanel border`}>
                设置背景色3
                <div className={`row infoPanel`}>
                    <InfoPanel {...data} user={user}/>
                </div>
                <div className={`row innerFooter border-top`}>
                    背景色5， footer 内容
                    footer
                </div>
            </div>
            {/*    error msg panel */}
            <div>
                <ErrorManager code={requestErrorCode}/>
            </div>
        </div>
    </div>);
}

export default App;
