export const textColorStyles = "text-black dark:text-white";

export const borderColorStyles = {
    simple: "border-black dark:border-white"
}

export const bgColorStyles = {
    body: "bg-white dark:bg-[#232323]",
    contrast: "bg-[#ddd] dark:bg-[#444]"
};

export const buttonStyles = {
    primary: "bg-blue-600 text-white hover:bg-rose-600 transition-all duration-300 ease-linear rounded-xl px-4 py-2 drop-shadow-md hover:drop-shadow-2xl",
    secondary: "bg-emerald-600 text-white hover:bg-indigo-600 transition-all duration-300 ease-linear rounded-xl px-4 py-2 drop-shadow-md hover:drop-shadow-2xl"
}

export const cardStyles = {
    simple: `p-5 drop-shadow-lg ${textColorStyles} ${bgColorStyles.contrast}`
}

export const modalBg = {
    simple: "w-[100%] lg:w-[calc(100vw-70px+1rem)] h-[calc(100vh-70px)] md:h-[95vh] lg:h-[100vh] top-[70px] left-0 lg:top-0 lg:left-[calc(70px+1rem)] bg-[#232323]/[0.8] z-40 fixed flex flex-col justify-center"
}