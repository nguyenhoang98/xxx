import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import { useRouter } from 'next/router';
import { useLocalStorageState } from 'utils/useLocalStorageState';
import { useGetQueryParam } from 'utils/useRouterQuery';
import userApi from 'api/userApi';
import authApi from 'api/authApi';
import LoadingScreen from 'components/LoadingScreen';
import UnauthenticatedApp from 'pages/unauthenticated-app';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const vndLoginDomain = publicRuntimeConfig.REACT_APP_VND_LOGIN_DOMAIN;

const AuthContext = createContext({});

const AuthProvider = props => {
  const router = useRouter();
  const tokenInUrl = useGetQueryParam('token-id');
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useLocalStorageState('token-id');
  const [userInfo, setUserInfo] = useState({ fullName: '', role: '' });

  const logout = useCallback(async () => {
    setLoading(true);
    await authApi.logoutByToken();
    setToken('');
    window.location.href = `${vndLoginDomain}/logout?httpReferer=${window.location.href}`;
  }, []);

  const checkUserStaging = useCallback(authorities => {
    let permission;

    authorities.forEach(membership => {
      if (membership === 'ROLE_sas-sale/authorization') permission = 'MAKER';
      if (membership === 'ROLE_sas-sale-manager/authorization')
        permission = 'CHECKER';
    });

    return permission;
  }, []);

  const getPermission = useCallback(authorities => {
    const userStaging = checkUserStaging(authorities);
    if (userStaging) return userStaging;

    let VND_STAFF_JD;
    let VND_STAFF_PERMISSION;

    authorities.forEach(membership => {
      if (membership.match(/ROLE_POS0000\d{2}\/EXECUTE/g))
        VND_STAFF_JD = 'EXECUTE';
    });

    authorities.forEach(membership => {
      if (membership.match(/ROLE_ROL000002\/MAKER_LV2/g))
        VND_STAFF_PERMISSION = 'MAKER_LV2';
      if (membership.match(/ROLE_ROL000002\/MAKER_LV3/g))
        VND_STAFF_PERMISSION = 'MAKER_LV3';
      if (membership.match(/ROLE_ROL000002\/CHECKER_LV2/g))
        VND_STAFF_PERMISSION = 'CHECKER_LV2';
      if (membership.match(/ROLE_ROL000002\/CHECKER_LV3/g))
        VND_STAFF_PERMISSION = 'CHECKER_LV3';
      if (membership.match(/ROLE_ROL000002\/CHECKER_LV4/g))
        VND_STAFF_PERMISSION = 'CHECKER_LV4';
    });

    if (VND_STAFF_JD && VND_STAFF_PERMISSION) {
      return `${VND_STAFF_JD}_${VND_STAFF_PERMISSION}`;
    }
    return null;
  }, []);

  const isChecker = useCallback(permission => {
    return permission && permission.includes('CHECKER');
  }, []);

  const isMaker = useCallback(permission => {
    return permission && permission.includes('MAKER');
  }, []);

  useEffect(() => {
    if (token) return;

    if (tokenInUrl) {
      setToken(tokenInUrl);
      router.replace(router.pathname);
      return;
    }

    setLoading(false);
  }, []);

  useEffect(async () => {
    if (token && !userInfo.role) {
      const { data } = await userApi.getUserInfoByToken(token);
      const permission = getPermission(data.authorities);
      setUserInfo({
        fullName: data.fullName,
        role: permission,
        isMaker: isMaker(permission),
        isChecker: isChecker(permission)
      });
      setLoading(false);
    }
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      logout,
      userInfo
    }),
    [token, logout, userInfo]
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return <AuthContext.Provider value={value} {...props} />;
};

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}

const ProtectedRoute = ({ children }) => {
  const { token, userInfo } = useAuth();

  if (!token) {
    window.location.href = `${vndLoginDomain}/login?httpReferer=${window.location.href}`;
    return false;
  }

  if (!userInfo.role) {
    return <UnauthenticatedApp />;
  }

  return children;
};

export { AuthProvider, useAuth, ProtectedRoute };
