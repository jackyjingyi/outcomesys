import {useEffect, useState} from "react";
import {Link, Outlet, useParams,useLocation, useNavigate} from "react-router-dom";
import {ModalDialog} from "react-bootstrap";

function ErrorManager() {
    const location = useLocation()
    const navigate = useNavigate()
    return (
        <div className={`msgPanel`}>
            <ModalDialog>
                {location.state}

                <button className={`btn btn-sm btn-primary`} onClick={()=>{
                    navigate(-1)
                }}>
                    back
                </button>
            </ModalDialog>
        </div>
    )
}


export {ErrorManager};