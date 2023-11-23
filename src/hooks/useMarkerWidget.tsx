// react
import { createContext, useContext, useState, useRef, useEffect } from 'react'
// marker.io
import markerSDK from '@marker.io/browser';

export const MarkerWidgetContext = createContext(null);

export const MarkerWidgetProvider = ({ children }) => {
    const markerWidgetRef = useRef(null);
    const [ mounted, setMounted ] = useState(false);
    useEffect(() => {
        const loadWidget = async () => {
            const widget = await markerSDK.loadWidget({
                project: '64c7a8a22a9a3c336a9643b2',
            });
            markerWidgetRef.current = widget;
            setMounted(true);
        };
        loadWidget();
    }, []);
    return (
        <MarkerWidgetContext.Provider value={markerWidgetRef.current}>
            {children}
        </MarkerWidgetContext.Provider>
    );
}

const useMarkerWidget = () => useContext(MarkerWidgetContext);

export default useMarkerWidget;