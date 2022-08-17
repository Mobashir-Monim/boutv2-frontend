export const textColorStyles = "text-black dark:text-white";

export const borderColorStyles = {
    simple: "border-black dark:border-white"
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
    simple: `p-5 drop-shadow-lg ${textColorStyles} ${bgColorStyles.contrast}`
}

export const modalBg = {
    simple: "w-[100%] lg:w-[calc(100vw-70px+1rem)] h-[calc(100vh-70px)] md:h-[95vh] lg:h-[100vh] top-[70px] left-0 lg:top-0 lg:left-[calc(70px+1rem)] bg-[#232323]/[0.8] z-40 fixed flex flex-col justify-center"
}

export const transitioner = {
    simple: "transition-all duration-200 ease-liner"
}

export const inputStyles = {
    labeled: {
        input: `outline-none peer px-3 py-2 ${textColorStyles} ${bgColorStyles.contrast} border-b-2 ${borderColorStyles.simple} hover:border-blue-500 focus:border-orange-500 ${transitioner.simple}`,
        label: `text-xs peer-focus:text-blue-400 peer-hover:text-blue-400 peer-focus:text-orange-500 mt-1 text-right ${transitioner.simple}`
    },
    minified: {
        input: `outline-none peer px-3 py-2 ${textColorStyles} ${bgColorStyles.contrast} border-b-[1px] border-r-[0.5px] text-[0.9rem] ${borderColorStyles.simple} hover:border-blue-500 focus:border-orange-500 ${transitioner.simple}`
    }
}