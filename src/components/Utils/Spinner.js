const Spinner = ({ dimensions }) => {
    return <svg className={`spinner ${dimensions ? dimensions : "h-10 w-10 md:h-20 md:w-20"} stroke-[#000]/[0.5] dark:stroke-[#fff]/[0.5]`} viewBox="0 0 50 50">
        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
    </svg>
}

export default Spinner;