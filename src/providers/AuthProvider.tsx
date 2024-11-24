import { ReactNode, useState, useEffect } from "react";
import { Auth, Empresa, User, UserResponse } from "../interfaces/api";
import { useFetch } from "../hooks/useFetch";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { AuthContext } from "../contexts/AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [empresa, setEmpresa] = useState<Empresa | null>(null);

    const [responseEmpresa, fetchDataEmpresa] = useFetch<{ company: Empresa }>();
    const [responseUser, fetchDataUser] = useFetch<UserResponse>();

    const { setItem, getItem, removeItem } = useLocalStorage();

    const getLoginByLocalStorage = async (): Promise<Auth | null> => {
        const token = await getItem('token');
        const empresa = await getItem('empresa');
        const user = await getItem('user');

        if (token && empresa && user) {
            return {
                menssage: '',
                token,
                empresa: parseInt(empresa),
                usuario: parseInt(user)
            };
        }
        return null;
    };

    const [dataLogin, setDataLogin] = useState<Auth | null>(null);

    useEffect(() => {
        const fetchStoredData = async () => {
            const storedData = await getLoginByLocalStorage();
            if (storedData) {
                setDataLogin(storedData);
                setIsAuthenticated(true);
            }
        };
        fetchStoredData();
    }, []);

    const login = async (data: Auth) => {
        await setItem('token', data.token);
        await setItem('empresa', data.empresa.toString());
        await setItem('user', data.usuario.toString());
        setDataLogin(data);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        resetStates();
        await removeItem('token');
        await removeItem('empresa');
        await removeItem('user');
    };

    const resetStates = () => {
        setDataLogin(null);
        setIsAuthenticated(false);
        setUser(null);
        setEmpresa(null);
    };

    const getEmpresaData = async () => {
        if (dataLogin) {
            const url = `${process.env.EXPO_PUBLIC_API_URL}/empresa/${dataLogin.empresa}?empresa=${dataLogin.empresa}`;
            const headers = {
                'Authorization': `Bearer ${dataLogin.token}`,
                'Content-Type': 'application/json'
            };
            await fetchDataEmpresa(url, { headers, method: 'GET' });
        }
    };

    const getUserData = async () => {
        if (dataLogin) {
            const url = `${process.env.EXPO_PUBLIC_API_URL}/usuario/${dataLogin.usuario}?empresa=${dataLogin.empresa}`;
            const headers = {
                'Authorization': `Bearer ${dataLogin.token}`,
                'Content-Type': 'application/json'
            };
            await fetchDataUser(url, { headers, method: 'GET' });
        }
    };

    useEffect(() => {
        if (dataLogin && isAuthenticated) {
            getEmpresaData();
            getUserData();
        }
    }, [dataLogin, isAuthenticated]);

    useEffect(() => {
        if (responseEmpresa.error || responseUser.error) {
            logout();
        }

        if (responseEmpresa.data) {
            setEmpresa(responseEmpresa.data.company);
        }

        if (responseUser.data) {
            setUser(responseUser.data.user);
        }
    }, [responseEmpresa, responseUser]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, dataLogin, user, empresa }}>
            {children}
        </AuthContext.Provider>
    );
};
