import { ReactElement } from 'react'

type ConditionWrapperProps = {
    condition: boolean,
    wrapper: Function,
    children: ReactElement,
}

const ConditionWrapper = ({ condition, wrapper, children }: ConditionWrapperProps) => condition ? wrapper(children) : children

export default ConditionWrapper