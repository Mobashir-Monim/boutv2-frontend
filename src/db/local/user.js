export const getUser = () => {
    const user = localStorage.getItem("user");

    if (user) return JSON.parse(user);

    return null;
}

export const setUser = user => {
    user = typeof (user) === "string" ? user : JSON.stringify(user);
    localStorage.setItem("user", user);
}