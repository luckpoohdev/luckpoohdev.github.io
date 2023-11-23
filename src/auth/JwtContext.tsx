import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios from '../utils/axios';
import localStorageAvailable from '../utils/localStorageAvailable';
//
import { isValidToken, setSession } from './utils';
import sanitizeStrapiData from 'src/utils/sanitizeStrapiData';
import { ActionMapType, AuthStateType, AuthUserType, JWTContextType } from './types';
//
import { useDispatch } from 'src/redux/store';
import { setUserMerchants } from 'src/redux/slices/merchant';
// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    isAuthenticated: boolean;
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

import { randomNumberRange } from 'src/_mock';

const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const reduxDispatch = useDispatch()
  const [state, dispatch] = useReducer(reducer, initialState);

  const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';
      console.log('initialize accessToken', accessToken)

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        
        const response = await axios.get('/api/users/me');

        const { data: user } = response;
        
        const userMerchants = await axios.get(`/api/merchants?filters[$or][0][team][member_users][id][$contains]=${user.id}&filters[$or][1][team][manager_users][id][$contains]=${user.id}&populate=stores`)

        const sanitizedUserMerchants = userMerchants?.data?.data?.length ? sanitizeStrapiData(userMerchants.data.data) : []
        
        reduxDispatch(setUserMerchants(sanitizedUserMerchants.reduce((ret, merchant) => {
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
        }, {})))

        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: Types.INITIAL,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const response = await axios.post('/api/auth/local', {
      identifier: email,
      password,
    });

    const { jwt, user } = response.data;
    const accessToken = jwt

    setSession(accessToken);

    const userMerchants = await axios.get(`/api/merchants?filters[$or][0][team][member_users][id][$contains]=${user.id}&filters[$or][1][team][manager_users][id][$contains]=${user.id}&populate=stores`)

    const sanitizedUserMerchants = userMerchants?.data?.data?.length ? sanitizeStrapiData(userMerchants.data.data) : []

    reduxDispatch(setUserMerchants(sanitizedUserMerchants.reduce((ret, merchant) => {
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
    }, {})))
    
    dispatch({
      type: Types.LOGIN,
      payload: {
        user,
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, firstname: string, surname: string) => {
      const response = await axios.post('/api/auth/local/register', {
        email,
        username: email,
        password,
        firstname,
        surname,
      });
      const { jwt, user } = response.data;
      const accessToken = jwt

      localStorage.setItem('accessToken', accessToken);

      dispatch({
        type: Types.REGISTER,
        payload: {
          user,
        },
      });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(() => {
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'jwt',
      login,
      loginWithGoogle: () => {},
      loginWithGithub: () => {},
      loginWithTwitter: () => {},
      register,
      logout,
    }),
    [state.isAuthenticated, state.isInitialized, state.user, login, logout, register]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
