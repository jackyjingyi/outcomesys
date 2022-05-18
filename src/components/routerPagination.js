import {Link} from "react-router-dom";


function RouterPagination(props) {

    const numberLinks = () => {
        const l = []
        if (props.total_pages <= 10) {
            for (let i = 1; i <= props.total_pages; i++) {
                l.push(i)
            }
        }
        return l
    }
    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination">
                <li className={`page-item  ${props.previous === null ? 'disabled' : ''}`} key={`previous`}>
                    <Link className={`page-link`} to={`${props.pagePrefix}/${props.previous}`}>
                        <span aria-hidden="true">&laquo;</span>
                    </Link>
                </li>
                {
                    numberLinks().map(k => {
                        return (
                            <li className={`page-item ${props.current === k ? 'active' : ''}`} key={k}><Link
                                className={`page-link`} to={`${props.pagePrefix}/${k}`}>{k}</Link>
                            </li>
                        )
                    })
                }
                <li className={`page-item  ${props.next === null ? 'disabled' : ''}`} key={`next`}
                    aria-disabled={props.next !== null}>
                    <Link className={`page-link`} to={`${props.pagePrefix}/${props.next}`}
                    >
                        <span aria-hidden="true">&raquo;</span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default RouterPagination;