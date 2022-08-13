import { Link } from "react-router-dom";

const BaseButton = ({ text, type = "button", clickFunction, params, link, style }) => {
    if (link) {
        return <Link to={link} className={style}>{text}</Link>
    }

    if (clickFunction) {
        if (params) {
            return <button onClick={() => clickFunction(params)} type={type} className={style}>
                {text}
            </button>
        }

        return <button onClick={clickFunction} type={type} className={style}>
            {text}
        </button>
    }

    return <button type={type} className={style}>
        {text}
    </button>
}

export default BaseButton;