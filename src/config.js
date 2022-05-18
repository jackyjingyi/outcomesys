const DEBUG = true

const ROLES = {
    SECRETARY: {value: 1, name: '商务秘书'},
    PROJECT_WORKER: {value: 2, name: '项目参与者'},
    PROJECT_SPONSOR: {value: 3, name: '项目负责人'},
    APPROVAL_LEADER: {value: 4, name: '分管领导'},
    ADMIN: {value: 5, name: '管理员'},
    DEV: {value: 6, name: '开发人员'},
    LEADER: {value: 7, name: '领导'},
    ANON: {value: -1, name: '游客'}
}

const DATA_CODES = {
    CREATE_PROJECT: 'create-project',
    PROJECT_LIST: 'project-list',
    PROJECT_DETAIL: 'project-detail'
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


export {ROLES, DATA_CODES, PROJECT_TYPES, PROJECT_CATE, PROJECT_TEAM, DEBUG};