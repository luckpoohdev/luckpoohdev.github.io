import { useMemo } from 'react'
import { TypedDocumentNode, DocumentNode, useQuery as useQueryBase, QueryHookOptions } from '@apollo/client'

import sanitizeStrapiData from 'src/utils/sanitizeStrapiData'

export const useQuery = (gql: DocumentNode | TypedDocumentNode, options: QueryHookOptions, debug) => {
    const query = useQueryBase(gql, options)
    const sanitizedData = useMemo(() => {
        return query.data ? sanitizeStrapiData(query.data, debug) : null
    }, [ query.data, query.loading ])
    const results = sanitizedData ? Object.values(sanitizedData) : null
    return {
        ...query,
        data: results ? (results.length > 1 ? results : results[0]) : null,
        meta: Object.values(query?.data ?? {})?.[0]?.meta,
    }
}