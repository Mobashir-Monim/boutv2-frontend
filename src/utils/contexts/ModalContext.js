import { createContext, useContext, useState } from "react";

export const ModalContext = createContext(undefined);

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [modalState, setModalState] = useState({
        show: false,
        content: null,
        title: null
    });

    const showModal = (title, content) =>
        setModalState({ show: true, content: content, title: title })

    const hideModal = () =>
        setModalState({ show: false, content: null, title: null })

    const value = {
        show: modalState.show,
        title: modalState.title,
        content: modalState.content,
        showModal,
        hideModal
    };

    return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}