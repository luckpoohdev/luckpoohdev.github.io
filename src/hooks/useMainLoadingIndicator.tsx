import { createContext, useContext, useState } from 'react'

const Context = createContext(null)

export const MainLoadingIndicatorProvider = ({ children }) => {
    const state = useState(false)
    return <Context.Provider value={state}>{children}</Context.Provider>
}

const useMainLoadingIndicator = () => useContext(Context)

export default useMainLoadingIndicator