export const textColorStyles = "text-black dark:text-white";

export const borderColorStyles = {
    simple: "border-black dark:border-white",
}

export const transitioner = {
    simple: "transition-all duration-200 ease-liner"
}

export const bgColorStyles = {
    body: "bg-white dark:bg-[#232323]",
    contrast: "bg-[#ddd] dark:bg-[#444]"
};

export const buttonStyles = {
    primary: "bg-blue-600 text-white hover:bg-rose-600 transition-all duration-300 ease-linear rounded-xl px-4 py-2 drop-shadow-md hover:drop-shadow-2xl cursor-pointer text-center",
    secondary: "bg-indigo-600 text-white hover:bg-fuchsia-600 transition-all duration-300 ease-linear rounded-xl px-4 py-2 drop-shadow-md hover:drop-shadow-2xl cursor-pointer text-center"
}

export const cardStyles = {
    simple: `p-5 drop-shadow-lg ${textColorStyles} ${bgColorStyles.contrast}`,
    question: `px-10 py-10 drop-shadow-lg ${textColorStyles} ${bgColorStyles.contrast} rounded-xl focus:drop-shadow-[0_0_5px_rgba(37,99,235,1)] hover:drop-shadow-[0_0_5px_rgba(37,99,235,1)] ${transitioner.simple}`,
}

export const modalBg = {
    simple: "w-[100%] lg:w-[calc(100vw-70px+1rem)] h-[calc(100vh-70px)] md:h-[95vh] lg:h-[100vh] top-[70px] left-0 lg:top-0 lg:left-[calc(70px+1rem)] bg-[#232323]/[0.8] z-40 fixed flex flex-col justify-center"
}

export const inputStyles = {
    labeled: {
        input: `outline-none peer px-3 py-2 ${textColorStyles} ${bgColorStyles.contrast} border-b-2 ${borderColorStyles.simple} hover:border-blue-500 focus:border-orange-500 ${transitioner.simple}`,
        label: `text-xs peer-focus:text-blue-400 peer-hover:text-blue-400 peer-focus:text-orange-500 mt-1 text-right ${transitioner.simple}`
    },
    minified: {
        input: `outline-none peer px-1 py-1 ${textColorStyles} ${bgColorStyles.contrast} border-y-[1px] focus:border-x-[0.5px] border-y-[1px] hover:border-x-[0.5px] text-[0.9rem] ${borderColorStyles.simple} hover:border-blue-500 focus:border-orange-500 ${transitioner.simple}`
    },
    questioned: {
        input: `outline-none peer px-3 py-2 ${textColorStyles} ${bgColorStyles.contrast} border-b-2 ${borderColorStyles.simple} hover:border-blue-500 focus:border-orange-500 ${transitioner.simple}`,
        label: `text-xs peer-focus:text-blue-400 peer-hover:text-blue-400 peer-checked:text-orange-500 mt-1 text-center ${transitioner.simple}`,
        question: `text-xs peer-focus:text-blue-400 peer-hover:text-blue-400 peer-focus:text-orange-500 peer-focus:border-orange-500 mb-1 border-b-2 text-[1rem] md:text-[1.1rem] pb-3 leading-5 ${transitioner.simple}`,
        markers: `text-[0.8rem] text-center md:text-left my-auto`,
    }
}

export const pageLayoutStyles = {
    scrollable: "w-[90%] mx-auto min-h-[calc(100vh-70px-1rem)] lg:min-h-[calc(100vh-1.25rem)]",
    fixed: "w-[100%] h-[calc(100vh-70px-1rem)] lg:h-[calc(100vh-1.25rem)]"
}