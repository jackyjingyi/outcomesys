const ROLES = {
    'SECRETARY': 1, 'PROJECT_WORKER': 2, 'PROJECT_SPONSOR': 3, 'APPROVAL_LEADER': 4, 'ADMIN': 5, 'DEV': 6, 'ANON': -1
}

const DATA_CODES = {
    'CREATE_PROJECT': 'create-project', 'PROJECT_LIST': 'project-list'
}

const PROJECT_TYPES = [
    {value: '-1', label: ''},
    {value: '0', label: '前瞻研究'},
    {value: '1', label: '策划规划设计'},
    {value: '2', label: '研讨竞赛'},
    {value: '3', label: '顾问咨询'},
]

const PROJECT_CATE = [
    {value: '-1', label: ''},
    {value: '0', label: '创新研究'},
    {value: '1', label: '业务服务'},
]

const PROJECT_TEAM = [
    {value: 1, label: '大数据重点实验中心'},
    {value: 2, label: '新型城镇化'},
    {value: 3, label: '主题公园&新场景'},
    {value: 4, label: '康旅度假'},
    {value: 5, label: '文化&品牌'},
    {value: 6, label: '新商业'},
    {value: 7, label: '华东分院'},
    {value: 8, label: '产品管理'},
    {value: 9, label: '联盟管理'},
    {value: 10, label: '统筹管理'},
    {value: 11, label: '综合管理'},
]

export {ROLES, DATA_CODES, PROJECT_TYPES, PROJECT_CATE, PROJECT_TEAM};