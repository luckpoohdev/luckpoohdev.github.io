import { createContext, useContext, useState, useEffect } from 'react'
import { getSession } from 'next-auth/react'

export const SessionContext = createContext({ session: null, status: 'loading' })

export const SessionProvider = ({ children }) => {
    const [ session, setSession ] = useState(null)
    const [ status, setStatus ] = useState('loading')
    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSession()
            setStatus('loaded')
            setSession(session ? {
                user: session.user,
            } : null)
        }
        fetchSession()
    }, [])
    return (
        <SessionContext.Provider value={{ session, status }}>
            {children}
        </SessionContext.Provider>
    )
}

const useSession = () => useContext(SessionContext)

export default useSession