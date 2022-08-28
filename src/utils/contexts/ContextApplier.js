import { AuthProvider } from "./AuthContext"
import { LoadingScreenProvider } from "./LoadingScreenContext"

export const ContextApplier = ({ children }) => {
    return <>
        <LoadingScreenProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </LoadingScreenProvider>
    </>
}