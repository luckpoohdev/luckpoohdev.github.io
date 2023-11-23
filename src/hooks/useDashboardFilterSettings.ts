import { useSelector } from 'src/redux/store'

import useRouter from 'src/hooks/useRouter'
import { useAuthContext } from 'src/auth/useAuthContext'

const useDashboardFilterSettings = () => {
    const { session } = useAuthContext()
    const user = session?.user ?? {}
    const router = useRouter()
    const ret = useSelector((state) => ({
        stores: router.hashParams.get('merchant') ? user?.merchants?.[router.hashParams.get('merchant')]?.stores : [],
        selectedStoreId: state.dashboard.selectedStoreId,
        datePeriod: state.dashboard.datePeriod,
        selectedDatePeriod: state.dashboard.selectedDatePeriod,
    }))
    return ret
}

export default useDashboardFilterSettings