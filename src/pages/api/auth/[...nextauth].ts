import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import slugify from 'slugify'
import axios from 'axios'

import sanitizeStrapiData from 'src/utils/sanitizeStrapiData'

import { randomNumberRange } from 'src/_mock'

export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials
        const response = await (
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/local`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              identifier: email,
              password,
            }),
          })
        ).json()
        if (response.error) {
          throw new Error(response.error.message)
        } else if (!response?.user?.confirmed) {
          throw new Error(
            'The user is not yet confirmed. Please check your inbox for an activation link'
          )
        }
        return response
      },
    }),
  ],
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        const meJson = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me?populate[0]=role&populate[1]=avatar`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.jwt}` },
        })).json()
        user.user.role = slugify(meJson.role.name, {
          replacement: '_',
          lower: true,
          trim: true,
        })
        user.user.avatar = meJson?.avatar?.url;
        token.user = user.user
        token.accessToken = user.jwt
      }
      return token
    },
    async session({ session, token }) {

      session.user = token.user
      const userMerchants = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/merchants?filters[$or][0][team][member_users][id][$contains]=${session.user.id}&filters[$or][1][team][manager_users][id][$contains]=${session.user.id}&populate=stores`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token.accessToken}` },
      })).json()
      console.log(`${process.env.NEXT_PUBLIC_API_URL}/merchants?filters[$or][0][team][member_users][id][$contains]=${session.user.id}&filters[$or][1][team][manager_users][id][$contains]=${session.user.id}&populate=stores`, 'userMerchants', userMerchants);

      const sanitizedUserMerchants = userMerchants?.data?.length ? sanitizeStrapiData(userMerchants.data) : []

      session.user.merchants = sanitizedUserMerchants.reduce((ret, merchant) => {
        ret[merchant.id] = {
          id: merchant.id,
          name: merchant.name,
          vat_number: merchant.vat_number,
          stores: merchant.stores.reduce((ret, store) => {
            ret[store.id] = {
              completionPercent: randomNumberRange(1, 100),
              ...store,
            }
            return ret
          }, {}),
        }
        return ret
      }, {})
      session.accessToken = token.accessToken;

      return session
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  site: process.env.NEXTAUTH_URL,
  secret: process.env.AUTH_SECRET,
}

export default NextAuth(authOptions)
