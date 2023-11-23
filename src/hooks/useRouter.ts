import { NextRouter, useRouter as useNextRouter } from 'next/router'

interface Router extends NextRouter {
    hashParams: URLSearchParams;
    updateHashParams: (newHashParams: { [ key: string ]: string }, replace: boolean) => void;
    push: (url: string, as?: string, options?: Object) => Promise<boolean>;
    replace: (url: string, as?: string, options?: Object) => Promise<boolean>;
}

const persistHashParams = [ 'merchant' ]
const push = (url: string, as: string, options: Object, router: Router, nextRouter: NextRouter):Promise<boolean> => {
    const urlParts = url.split('#')
    url = urlParts[0]
    const hashParams = new URLSearchParams(urlParts[1])
    for (let i = 0; i < persistHashParams.length; i++) {
        if (router.hashParams.has(persistHashParams[i])) {
            hashParams.set(persistHashParams[i], router.hashParams.get(persistHashParams[i]) ?? '')
        }
    }
    return new Promise((resolve, reject) => {
        nextRouter.push(`${url}${Array.from(hashParams.values()).length ? `#${hashParams.toString()}` : ''}`, as, options)
            .then((ret) => resolve(ret))
            .catch((e) => {
                if (!e.cancelled) {
                    reject(e)
                } else {
                    resolve(false)
                }
            }
        )
    })
}
const replace = (url: string, as: string, options: Object, router: Router, nextRouter: NextRouter):Promise<boolean> => {
    const urlParts = url.split('#')
    url = urlParts[0]
    const hashParams = new URLSearchParams(urlParts[1])
    for (let i = 0; i < persistHashParams.length; i++) {
        if (router.hashParams.has(persistHashParams[i])) {
            hashParams.set(persistHashParams[i], router.hashParams.get(persistHashParams[i]) ?? '')
        }
    }
    return new Promise((resolve, reject) => {
        nextRouter.replace(`${url}${Array.from(hashParams.values()).length ? `#${hashParams.toString()}` : ''}`, as, options)
            .then((ret) => resolve(ret))
            .catch((e) => {
                if (!e.cancelled) {
                    reject(e)
                } else {
                    resolve(false)
                }
            }
        )
    })
}

const updateHashParams = (hashParams: URLSearchParams, newHashParams: { [ key: string ]: string }) => {
    const newHashParamNames = Object.keys(newHashParams)
    for (let i = 0; i < newHashParamNames.length; i++) {
        const newParamName = newHashParamNames[i]
        if (newHashParams[newParamName] === null) {
            hashParams.delete(newParamName)
        } else {
            hashParams.set(newParamName, newHashParams[newParamName])
        }
    }
    return hashParams
}

const useRouter = () => {
    const nextRouter = useNextRouter()
    const router: Router = {
        ...useNextRouter(),
        hashParams: new URLSearchParams(nextRouter.asPath.split('#')[1]),
        updateHashParams: (newHashParams, replace = false) => replace ? (
            router.replace(`#${updateHashParams(router.hashParams, newHashParams).toString()}`)
        ) : (
            router.push(`#${updateHashParams(router.hashParams, newHashParams).toString()}`)
        ),
        push: (url, as = '', options = {}) => push(url, as, options, router, nextRouter),
        replace: (url, as = '', options = {}) => replace(url, as, options, router, nextRouter),
    }
    router.asPath = router.asPath.split('#')[0]
    return router
}

export default useRouter