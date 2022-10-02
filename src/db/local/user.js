export const getStoredUser = () => {
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user"));
        // if (user.expirationTime < (new Date()).getTime())
        //     return null;

        return user;
    } catch (error) {
        return null;
    }
}

export const setStoredUser = user => {
    user = typeof (user) === "string" ? user : JSON.stringify(user);
    localStorage.setItem("user", user);
}