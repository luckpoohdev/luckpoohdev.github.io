import type { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';
import getConfig from 'next/config';
import axios from 'axios';
import { getServerSession } from 'next-auth/next'

import { authOptions } from './auth/[...nextauth]'

const { publicRuntimeConfig } = getConfig();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions);
  const token = session.accessToken;
  return httpProxyMiddleware(req, res, {
    target: 'https://dev.api.advisoa.dk',
    changeOrigin: true,
    pathRewrite: [{
        patternStr: '^/api/graphql',
        replaceStr: '/graphql',
    }],
    headers: {
        Authorization: `Bearer ${token}`,
    },
  });
};

export const config = {
  api: {
    externalResolver: true,
  },
};