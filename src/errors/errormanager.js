import {useEffect, useState} from "react";

export function ErrorManager(props) {
    const [message, setMessage] = useState()
    const [showMsg, setShowMsg] = useState(false)

    useEffect(() => {
        switch (props.code) {
            case 401:
                setMessage(HTTP401())
                setShowMsg(true)
                break;
            case 403:
                setMessage(HTTP403());
                setShowMsg(true)
                break;
            case 404:
                setMessage(HTTP404());
                setShowMsg(true)
                break;
            case 500:
                setMessage(HTTP500());
                setShowMsg(true)
                break
            default:
                setShowMsg(false)
                break
        }

    }, [props.code])

    // display error when necessary
    return (
        <div className={`msgPanel`} aria-disabled={showMsg}>
            {message}
        </div>
    )
}

function HTTP401() {
    return (
        <div>
            401
        </div>
    )
}

function HTTP403() {
    return (
        <div>
            403
        </div>
    )
}

function HTTP404() {
    return (
        <div>
            404
        </div>
    )
}

function HTTP500() {
    return (
        <div>
            500
        </div>
    )
}