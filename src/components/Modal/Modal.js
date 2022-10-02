import { useEffect } from "react";
import { useAuth } from "../../utils/contexts/AuthContext";
import { useModal } from "../../utils/contexts/ModalContext";
import { pageLayoutStyles, transitioner } from "../../utils/styles/styles";
import SimpleCard from "../Card/SimpleCard";

const Modal = ({ navShown }) => {
    const { show, content, title, hideModal } = useModal();
    const { user } = useAuth();
    let modalClasses = `w-[100%] ${show ? "h-[100vh] opacity-100" : "h-[0vh] opacity-0"} top-0 left-0`;

    if (user)
        modalClasses = `w-[100%] ${show ? "h-[calc(100vh-70px)] lg:h-[100vh] opacity-100" : "h-[0vh] opacity-0"} top-[70px] lg:top-0 ${navShown ? "lg:w-[calc(100vw-250px)] lg:left-[250px]" : "lg:w-[calc(100vw-70px-1rem)] lg:left-[calc(70px+1rem)]"}`;


    return <div className={`${modalClasses} ${transitioner.simple} fixed z-20 overflow-hidden flex flex-col justify-center bg-[#171717]/[0.7] ${transitioner.simple}`} onClick={hideModal} onKeyDown={event => { if (event.key === "Escape") hideModal() }}>
        <div className="w-[90%] md:w-[80%] mx-auto" onClick={event => event.stopPropagation()}>
            <SimpleCard title={title}>
                <div className="mt-5 overflow-scroll p-5 no-scroll-bar min-h-[50vh] max-h-[60vh] md:max-h-[80vh]">
                    {content}
                </div>
                <span className={`material-icons-round absolute top-[-13px] right-[-13px] bg-red-500 rounded-full cursor-pointer`} onClick={hideModal}>close</span>
            </SimpleCard>
        </div>
    </div>
}

export default Modal;