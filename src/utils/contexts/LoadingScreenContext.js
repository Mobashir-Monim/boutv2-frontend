import { createContext, useContext, useState } from "react";

export const LoadingScreenContext = createContext(undefined);

export const useLoadingScreen = () => useContext(LoadingScreenContext);

export const LoadingScreenProvider = ({ children }) => {
    const [loadingScreenState, setLoadingScreenState] = useState({
        isLoading: false,
        message: "Breaking stones..."
    });

    const showLoadingScreen = message =>
        setLoadingScreenState({ isLoading: true, message: message ? message : loadingScreenState.message })

    const hideLoadingScreen = () =>
        setTimeout(() => { setLoadingScreenState({ isLoading: false, message: "Breaking stones..." }) }, 500);

    const value = { loadingScreenState, showLoadingScreen, hideLoadingScreen, };

    return <LoadingScreenContext.Provider value={value}>{children}</LoadingScreenContext.Provider>
}