export const textColorStyles = {
    simple: "text-black/[0.5] dark:text-white",
    clickable: "hover:text-orange-500 text-blue-500 dark:text-blue-400",
};

export const borderColorStyles = {
    simple: "border-[#ddd] dark:border-[#171717]/[0.3]",
    primary: "border-blue-600 dark:border-indigo-600",
    secondary: "border-indigo-600 dark:border-blue-600"
}

export const transitioner = {
    simple: "transition-all duration-500 ease-liner transform-gpu"
}

export const bgColorStyles = {
    body: "bg-[#FDFBF9] dark:bg-[#232323]",
    contrast: "bg-[#fff] dark:bg-[#444]",
    patternA: "bg-[#fcf3fd] dark:bg-[#9AB086]",
    patternB: "bg-[#ffefe2] dark:bg-[#7BAAB3]",
    patternC: "bg-[#F7FAE9] dark:bg-[#9C7FAD]",
};

export const navStyles = {
    optionContainer: `rounded-full flex cursor-pointer relative px-3 py-2 text-center transition-all duration-500 ease-linear`,
    optionIcon: `material-icons-round my-auto font-bold ${transitioner.simple} text-white`,
    optionText: {
        base: `text-white my-auto`,
        hidden: `opacity-0 ml-0 text-[0rem]`,
        shown: `text-[0.8rem] opacity-100 ml-4`
    },
}

export const buttonStyles = {
    primary: "bg-blue-600 text-white hover:bg-rose-600 transition-all duration-300 ease-linear rounded-3xl px-4 py-2 drop-shadow-md hover:drop-shadow-2xl cursor-pointer text-center",
    secondary: "bg-indigo-600 text-white hover:bg-fuchsia-600 transition-all duration-300 ease-linear rounded-3xl px-4 py-2 drop-shadow-md hover:drop-shadow-2xl cursor-pointer text-center"
}

export const cardStyles = {
    simple: `drop-shadow-lg rounded-xl ${bgColorStyles.contrast}`,
    simpleCustomBg: `p-5 drop-shadow-lg rounded-xl border-[1px] ${borderColorStyles.simple} `,
    question: `px-10 py-10 drop-shadow-lg ${textColorStyles.simple} ${bgColorStyles.contrast} rounded-xl focus:drop-shadow-[0_0_5px_rgba(37,99,235,1)] hover:drop-shadow-[0_0_5px_rgba(37,99,235,1)] ${transitioner.simple}`,
}

export const modalBg = {
    simple: "w-[100%] lg:w-[calc(100vw-70px+1rem)] h-[calc(100vh-70px)] md:h-[95vh] lg:h-[100vh] top-[70px] left-0 lg:top-0 lg:left-[calc(70px+1rem)] bg-[#232323]/[0.8] z-40 fixed flex flex-col justify-center"
}

export const inputStyles = {
    labeled: {
        input: `outline-none peer py-2 px-3 rounded-3xl bg-[#232323]/[0.2] dark:bg-[#171717]/[0.3] ${textColorStyles.simple} hover:border-blue-500 focus:border-orange-500 ${transitioner.simple}`,
        label: `text-xs peer-focus:text-blue-400 peer-hover:text-blue-400 peer-focus:text-orange-500 mt-1 mr-3 text-right ${transitioner.simple}`,
        checkbox: `w-[0.8rem] h-[0.8rem] my-auto text-left rounded-full px-[0.5rem] py-[0.5rem] cursor-pointer outline-none border-[1.5px] ${borderColorStyles.simple} before:absolute before:top-[0.1rem] before:left-[0.1rem] relative before:p-[0.4rem] before:rounded-full before:bg-[#fff]/[0.2] before:transition-all before:duration-300 before:ease-linear`,
        checked: `before:!bg-blue-400`
    },
    minified: {
        input: `outline-none peer px-1 py-1 ${textColorStyles.simple} ${bgColorStyles.contrast} border-b-[1.5px] text-[0.9rem] ${borderColorStyles.simple} hover:border-blue-500 focus:border-orange-500 ${transitioner.simple}`
    },
    questioned: {
        input: `outline-none peer px-3 py-2 ${textColorStyles.simple} ${bgColorStyles.contrast} border-b-2 ${borderColorStyles.simple} hover:border-blue-500 focus:border-orange-500 ${transitioner.simple}`,
        label: `text-xs peer-focus:text-blue-400 peer-hover:text-blue-400 peer-checked:text-orange-500 mt-1 text-center ${transitioner.simple}`,
        question: `peer-focus:text-blue-400 peer-hover:text-blue-400 peer-focus:text-orange-500 peer-focus:border-orange-500 mb-1 border-b-2 text-[1rem] md:text-[1.1rem] pb-3 leading-5 ${transitioner.simple}`,
        markers: `text-[0.8rem] text-center md:text-left my-auto`,
    }
}

export const pageLayoutStyles = {
    scrollable: "w-[90%] mx-auto min-h-[calc(100vh-70px-2.5rem)] lg:min-h-[calc(100vh-5rem)]",
    fixed: "w-[100%] h-[calc(100vh-70px-2.5rem)] lg:h-[calc(100vh-5rem)]"
}

export const linkStyles = {
    primary: `text-blue-400 hover:text-rose-400 ${transitioner.simple}`
}

export const thesisStyles = {
    approved: {
        cardCustomStyle: `max-w-[800px] border-none flex flex-row items-center justify-between`,
        cardContent: `flex flex-col max-w-[calc(100%-40px-0.5rem)] pr-5`,
        cardContentTitle: `line-clamp-1 lg:line-clamp-2 mb-2 font-bold break-normal text-[0.9rem] border-b-2 ${borderColorStyles.simple}`,
        cardContentBody: `line-clamp-1 lg:line-clamp-3 text-justify text-[0.8rem]`,
    },
    pending: {
        container: `flex flex-row items-center gap-4 cursor-pointer group hover:bg-blue-500 ${transitioner.simple} p-2 rounded-xl`,
        icon: `material-icons-round p-2 rounded-full ${transitioner.simple} group-hover:bg-blue-500 group-hover:text-white`,
        title: `line-clamp-1 font-bold group-hover:text-white text-[1rem] ${transitioner.simple}`,
        details: `ml-2 text-black dark:text-gray-200 uppercase text-[0.8rem] flex flex-row items-center gap-2 group-hover:text-white ${transitioner.simple}`,
        textColor: `text-black dark:text-white group-hover:text-white ${transitioner.simple}`,
    },
    cardIcon: `material-icons-round my-auto font-bold bg-black dark:bg-[#fff]/[0.3] bg-opacity-10 p-2 rounded-lg drop-shadow-xl`
}

export const applicationTypeColors = {
    thesis: "bg-[#fcf3fd] dark:bg-[#9AB086]",
    project: "bg-[#ffefe2] dark:bg-[#7BAAB3]",
    internship: "bg-[#F7FAE9] dark:bg-[#9C7FAD]"
};
