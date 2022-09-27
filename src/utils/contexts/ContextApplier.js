import { AuthProvider } from "./AuthContext"
import { LoadingScreenProvider } from "./LoadingScreenContext"
import { ModalProvider } from "./ModalContext"

export const ContextApplier = ({ children }) => {
    return <>
        <LoadingScreenProvider>
            <ModalProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </ModalProvider>
        </LoadingScreenProvider>
    </>
}