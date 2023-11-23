import BaseLink from 'next/link'

import useRouter from 'src/hooks/useRouter'

const NextLink = ({ href, children, ...props }) => {
    const router = useRouter()
    return (
        <BaseLink
            href={href}
            onClick={(e) => {
                e.preventDefault()
                router.push(href)
            }}
            {...props}
        >{children}</BaseLink>
    )
}

export default NextLink