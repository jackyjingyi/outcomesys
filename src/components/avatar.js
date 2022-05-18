import * as React from 'react';
import {styled} from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import {red, green} from "@mui/material/colors";

const StyledBadge = styled(Badge)(({theme}) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#ef5350',
        color: '#ef5350',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));


export default function BadgeAvatars(props) {
    return (
        <StyledBadge
            overlap="circular"
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            variant="dot"
            invisible={props.invisible}
        >
            <Avatar alt={`memo`} src={props.user ? props.user.mime : ''} sx={{bgcolor: green[500]}}>
                {props.user ? props.user.name.slice(props.user.name.length - 2, props.user.name.length) : ''}
            </Avatar>
        </StyledBadge>
    );
}