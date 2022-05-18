import React, {useContext, useEffect, useReducer, useRef, useState} from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
    useParams, useNavigate, useLocation
} from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CreatableSelect from 'react-select/creatable';
import {Alert, Button, TextField} from "@mui/material";
import API from "../axiosConfig";
import {ProjectContext} from "../context_manager";
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    fontSize: 20
};

function CircularProgressWithLabel(props) {
    return (<Box sx={{position: 'relative', display: 'inline-flex', visibility: props.visibility}}>
        <CircularProgress variant="determinate" {...props} />
        <Box
            sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Typography variant="caption" component="div" color="text.secondary">
                {`${Math.round(props.value)}%`}
            </Typography>
        </Box>
    </Box>);
}

CircularProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     * @default 0
     */
    value: PropTypes.number.isRequired,
};


const getColor = (props) => {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isFocused) {
        return '#2196f3';
    }
    return '#eeeeee';
}

function BasicModal(props) {
    const [open, setOpen] = useState(props.open);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        setOpen(props.open)
    }, [props.open])

    return (<div>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-title"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="body2" component={'span'}>
                    {props.msg}
                </Typography>
            </Box>
        </Modal>
    </div>);
}


function FormModal(props) {
    // open control
    const location = useLocation()
    const {fileForm, setOpenFormModal, setFileForm, setNeedRefresh} = useContext(ProjectContext)
    const [open, setOpen] = useState(props.open)
    const [opt, setOpt] = useState(null)
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpenFormModal(false)
        setOpen(false);
    };
    const [selectedVal, setSelectedVal] = useState(null)
    const [file, setFile] = useState(null)
    const [fname, setFname] = useState('')
    const [alert, setAlert] = useState(false)
    const [progress, setProgress] = useState(0)
    const [progressVis, setProgressVis] = useState(`hidden`)
    const [msg, setMsg] = useState('')
    const uploadFile = useRef(null)

    useEffect(() => {
        if (props.open) {
            handleOpen()
        }
        if (!opt) {
            API.get('v1/project-system/file/get_latest_tags/').then((res) => {
                setOpt(res.data)
            })
        }
    }, [props.open])

    function submitFile() {
        console.log(uploadFile.current.value)
        setAlert(false)
        if (uploadFile.current.value && selectedVal.length >= 5) {
            setFileForm({
                tags: selectedVal.map((item, index) => {
                    return item.value
                }), file: uploadFile.current.files[0], name: fname,
            })
            console.log(fileForm)
            const d = {
                achievement: fileForm.achievement,
                creator: fileForm.creator,
                tags: JSON.stringify(selectedVal.map((item, index) => {
                    return item.value
                })),
                file: uploadFile.current.files[0],
                name: fname,
            }
            console.log(d)
            let formData = new FormData();
            // eslint-disable-next-line array-callback-return
            for (var key in d) {
                formData.append(key, d[key])
            }
            setProgressVis(`display`)
            API.post('v1/project-system/file/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }, onUploadProgress: function (progressEvent) {
                    const progress = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total))
                    setProgress(progress);

                }
            }).then((res) => {
                console.log(res)
                console.log("success")
                handleClose();
                setNeedRefresh()
            }).catch((err) => {
                console.log(err)
            })
        } else {
            setMsg('请输入正确值。')
            setAlert(true)
        }
    }

    return (<div>
        <Modal open={open}
               onClose={handleClose}
               aria-labelledby="modal-modal-title"
               aria-describedby="modal-modal-title"

        >
            <Box sx={style}>
                <Typography id="modal-modal-title"
                            variant={`h6`}
                            component={'h2'}
                            align={`center`}
                            gutterBottom={true}
                            noWrap={true}
                >
                    添加成果文件
                </Typography>
                <form>
                    <TextField fullWidth id="outlined-basic" label={`输入文件名`} variant="outlined" size={`small`}
                               onChange={(e) => {
                                   setFname(e.target.value)
                               }}
                               value={fname}
                               margin={`normal`} required/>
                    <CreatableMulti options={opt} placeholder={`输入标签`} setSelectedVal={setSelectedVal} required/>
                    <Button
                        variant="contained"
                        component="label"
                        className={`mt-3`}
                    >
                        选择文件
                        <input
                            ref={uploadFile}
                            type="file"
                            hidden
                            onChange={(e) => {
                                setFile(e.target.value)
                            }}
                            required={true}
                        />


                    </Button>{`  `}
                    <Typography align={`right`} component={`span`} variant={`overline`} margin={`normal`}>
                        {file}
                    </Typography>
                    <div className={`mt-2 float-end`}>
                        <CircularProgressWithLabel value={progress} visibility={progressVis}/>
                    </div>
                    {alert ? <Alert severity="error" onClose={() => {
                        setAlert(false)
                    }}>{msg}</Alert> : ''}
                    <br></br>
                    <div className={`row mt-3 float-end`}>
                        <Button
                            variant="contained"
                            component="label"
                            onClick={submitFile}
                            type={`submit`}
                        >提交</Button>
                    </div>
                </form>
            </Box>
        </Modal>
    </div>)

}

function CreatableMulti(props) {


    function handleChange(e) {
        props.setSelectedVal(e)
    }


    return (<CreatableSelect
        isMulti
        placeholder={`请至少选择或输入5个标签`}
        onChange={(e) => handleChange(e)}
        allowCreateWhileLoading={false}
        createOptionPosition={`last`}
        backspaceRemovesValue={true}
        options={props.options ? props.options : []}
    />)
}


function SubmitModal(props) {
    // 成果提交modal， 1. 选择审批人， 2. 选择会签或签 3. 填写comments
    const {setOpenSubmitModal, setNeedRefresh} = useContext(ProjectContext)
    const [open, setOpen] = useState(props.open)
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpenSubmitModal(false)
        setOpen(false);
    };

    useEffect(()=>{
        if (props.open) {
            handleOpen()
        } else {
            handleClose()
        }
    },[props.open])
    return (<div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {props.children}
                </Box>
            </Modal>
    </div>)
}

function StandardModal(props){
    const [open, setOpen] = useState(props.open)
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        props.setParentOpen(false)
        setOpen(false);
    };

    useEffect(()=>{
        if (props.open) {
            handleOpen()
        } else {
            handleClose()
        }
    },[props.open])
    return (<div>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {props.children}
            </Box>
        </Modal>
    </div>)
}


function LoadSuccessModal(props){
    const [open, setOpen] = useState(props.open)
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(()=>{
        if (props.open) {
            handleOpen()
        } else {
            handleClose()
        }
    },[props.open])

    return (<div>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>


            </Box>
        </Modal>

    </div>)


}

export {BasicModal, FormModal, SubmitModal,StandardModal};