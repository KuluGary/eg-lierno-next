import Header from 'components/Header/Header';
import React from 'react'

const AuthContext = React.createContext({
    isAuthenticated: false,
    setAuthenticated: () => { },
    userId: null,
    setUser: () => { }
})

export const AuthProvider = ({ children, authenticated, user }) => {
    const [isAuthenticated, setAuthenticated] = React.useState(authenticated);
    const [userId, setUser] = React.useState(user);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                setAuthenticated,
                userId,
                setUser
            }}>
                {/* <Header/> */}
                {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = React.useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function useIsAuthenticated() {
    const context = useAuth();

    return context.isAuthenticated;
}

export function getUser() {
    const context = useAuth();

    return context.userId;
}