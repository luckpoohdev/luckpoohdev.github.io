// react
import { createContext, useContext, useState, useRef, useEffect } from 'react'
// tawk
import TawkMessengerReact from '@tawk.to/tawk-messenger-react'

export const TawkContext = createContext([])

export const TawkProvider = ({ children }) => {
    const [ mounted, setMounted ] = useState(false)
    const tawkRef = useRef(null)
    useEffect(() => {
        setMounted(true)
    }, [])
    return (
        <TawkContext.Provider value={tawkRef.current}>
            <TawkMessengerReact
                propertyId="63fe19e94247f20fefe3226c"
                widgetId="1gqc9aemh"
                ref={tawkRef}
            />
            {children}
        </TawkContext.Provider>
    )
}

const useTawk = () => useContext(TawkContext)

export default useTawk