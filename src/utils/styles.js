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
    secondary: "bg-orange-600 text-white hover:bg-lime-600 transition-all duration-300 ease-linear rounded-xl px-4 py-2 drop-shadow-md hover:drop-shadow-2xl"
}

export const cardStyles = {
    simple: `p-5 drop-shadow-lg ${textColorStyles} ${bgColorStyles.contrast}`
}

