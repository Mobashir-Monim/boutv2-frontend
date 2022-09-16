import { useEffect } from "react";
import { useAuth } from "../../utils/contexts/AuthContext";
import { useModal } from "../../utils/contexts/ModalContext";
import { pageLayoutStyles, transitioner } from "../../utils/styles/styles";
import SimpleCard from "../Card/SimpleCard";

const Modal = ({ navShown }) => {
    const { show, content, title, hideModal } = useModal();
    const { user } = useAuth();
    let modalClasses = "w-[100%] h-[100vh] top-0 left-0";

    if (user) {
        modalClasses = `w-[100%] h-[calc(100vh-70px)] lg:h-[100vh] top-[70px] lg:top-0 ${navShown ? "lg:w-[calc(100vw-250px)] lg:left-[250px]" : "lg:w-[calc(100vw-70px-1rem)] lg:left-[calc(70px+1rem)]"}`;
    }

    return <div className={`${modalClasses} ${transitioner.simple} block fixed ${show ? "z-20" : "-z-50 hidden"} flex flex-col justify-center bg-[#171717]/[0.7]`} onClick={hideModal} onKeyDown={event => { if (event.key === "Escape") hideModal() }}>
        <div className="w-[95%] md:w-[80%] mx-auto" onClick={event => event.stopPropagation()}>
            <SimpleCard title={title}>
                <div className="mt-5 overflow-scroll p-5 no-scroll-bar min-h-[50vh] max-h-[80vh]">
                    {content}
                </div>
            </SimpleCard>
        </div>
    </div>
}

export default Modal;