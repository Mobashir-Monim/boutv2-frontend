import { AuthProvider } from "./AuthContext"

export const ContextApplier = ({ children }) => {
    return <>
        <AuthProvider>
            {children}
        </AuthProvider>
    </>
}