import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars(props) {
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        setOpen(false);
        props.setOpen(false);
    };

    return (
        <Stack spacing={2} sx={{width: '100%'}}>
            {/*<Button variant="outlined" onClick={handleClick}>*/}
            {/*    Open success snackbar*/}
            {/*</Button>*/}
            <Snackbar open={props.open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={props.severity} sx={{width: '100%'}}>
                    {props.msg}
                </Alert>
            </Snackbar>
        </Stack>
    );
}