import { useEffect, useRef, useMemo } from 'react';
import debounce from 'lodash/debounce';

const useDebounce = (callback, timeout = 1000) => {

    const ref = useRef();

    useEffect(() => {
        ref.current = callback;
    }, [callback]);

    const debouncedCallback = useMemo(() => {

        const func = (...args) => {
            ref.current?.(...args);
        };

        return debounce(func, timeout);

    }, []);

    return debouncedCallback;
};

export default useDebounce;