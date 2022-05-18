import {Link} from "react-router-dom";

function BasicPagination(props) {
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
        <nav aria-label={`pagination`}>
            <ul className="pagination">
                <li className={`page-item  ${props.previous === null ? 'disabled' : ''}`} key={`previous`}
                    onClick={() => {
                        if (props.previous) {
                            props.setPageInfo({
                                current: props.previous
                            })
                        }
                    }}>
                    <a href={`#`} className={`page-link`} aria-label={`previous`}>
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                {
                    numberLinks().map(k => {
                        return (
                            <li className={`page-item ${props.current === k ? 'active' : ''}`} key={k}
                                onClick={() => {
                                    props.setPageInfo({
                                        current: k
                                    })
                                }}
                            ><a className={`page-link`} href={`#`} aria-label={k}>
                                {k}
                            </a>

                            </li>
                        )
                    })
                }
                <li className={`page-item  ${props.next === null ? 'disabled' : ''}`} key={`next`}
                    aria-disabled={props.next !== null}
                    onClick={() => {
                        if (props.next !== null) {
                            props.setPageInfo({
                                current: props.next
                            })
                        }
                    }}
                ><a href={`#`} aria-label={'next'} className={`page-link`}>
                    <span aria-hidden="true">&raquo;</span>
                </a>

                </li>
            </ul>
        </nav>
        // <nav aria-label="Page navigation example">
        //     <ul className="pagination">
        //         <li className="page-item">
        //             <a className="page-link" href="#" aria-label="Previous">
        //                 <span aria-hidden="true">&laquo;</span>
        //             </a>
        //         </li>
        //         <li className="page-item"><a className="page-link" href="#">1</a></li>
        //         <li className="page-item"><a className="page-link" href="#">2</a></li>
        //         <li className="page-item"><a className="page-link" href="#">3</a></li>
        //         <li className="page-item">
        //             <a className="page-link" href="#" aria-label="Next">
        //                 <span aria-hidden="true">&raquo;</span>
        //             </a>
        //         </li>
        //     </ul>
        // </nav>

    )
}
export default BasicPagination;