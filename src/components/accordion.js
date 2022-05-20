import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AvatarChips from './chipAvatar'
import {useEffect} from "react";


const STATUS_DISPLAY = {
    ASSIGNED: '待处理',
    CANCELED: '取消、撤回',
    DONE: '已完成',
    ERROR: '错误',
    NEW: '新创建',
    PREPARED: '准备中',
    SCHEDULED: '排期中',
    STARTED: '已开始',
    DENY: '驳回',
    UNRIPE: '未知',
}
const TASK_DISPLAY = {
    submit_achievement: '提交',
    withdraw_achievement: '撤回',
    approve_achievement_lv1: '一级审批',
    approve_achievement_lv2: '二级审批',
}

const APPROVAL_TYPE = {
    SINGLE: '单签',
    JOIN: '会签',
    OR: '或签'
}

export default function ControlledAccordions(props) {
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div>{
            props.log.map((item, index) => {
                return (
                    <Accordion key={index} expanded={expanded === item.id} onChange={handleChange(item.id)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        ><ListItemButton>
                            <AvatarChips name={item.data.owner.name} mime={item.data.owner.mime || ''}/>
                            <ListItemText
                                primary={TASK_DISPLAY[item.data.permission] + ' ' + APPROVAL_TYPE[item.data.flow_type]}
                                secondary={<React.Fragment>
                                    <Typography
                                        sx={{display: 'inline'}}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >{'状态:  ' + STATUS_DISPLAY[item.status]}
                                    </Typography>
                                </React.Fragment>}
                            />
                        </ListItemButton>
                        </AccordionSummary>
                        <AccordionDetails>

                            <List>
                                {item.task.map((item1, index1) => {
                                    return (
                                        <ListItem key={index1} disablePadding divider>
                                            <ListItemButton>
                                                <AvatarChips name={item1.owner_name} mime={item1.owner_mime}/>
                                                <ListItemText primary={STATUS_DISPLAY[item1.status]}
                                                              secondary={
                                                                  <React.Fragment>
                                                                      <Typography
                                                                          sx={{display: 'inline'}}
                                                                          component="span"
                                                                          variant="body2"
                                                                          color="text.primary"
                                                                      >
                                                                          {item1.finished ? item1.finished.slice(0, 10) : `待执行`}
                                                                      </Typography>
                                                                      {`---${item1.comments ? item1.comments : '暂无备忘'}`}
                                                                  </React.Fragment>
                                                              }
                                                />

                                            </ListItemButton>
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                )
            })
        }

        </div>
    );
}
