const img = (url) => url ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${url}` : ''

export default img