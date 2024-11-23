import { ReactNode, useState, useEffect } from "react";
import { Auth, Empresa, EmpresaResponse, User, UserResponse } from "../interfaces/api";
import { useFetch } from "../hooks/useFetch";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { AuthContext } from "../contexts/AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [empresa, setEmpresa] = useState<Empresa | null>(null);

    const [responseEmpresa, fetchDataEmpresa] = useFetch<{company: Empresa}>();
    const [responseUser, fetchDataUser] = useFetch<UserResponse>();

    const { setItem, getItem, removeItem } = useLocalStorage();

    const getLoginByLocalStorage = async (): Promise<Auth | null> => {
        const token = await getItem('token');
        const empresa = await getItem('empresa');
        const user = await getItem('user');
        
        if (token && empresa && user) {
            setIsAuthenticated(true);
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
        const fetchData = async () => {
            const storedData = await getLoginByLocalStorage();
            if (storedData) {
                setDataLogin(storedData);
            }
        };
    
        fetchData();
    }, []);

    const login = (data: Auth) => {
        setItem('token', data.token);
        setItem('empresa', data.empresa.toString());
        setItem('user', data.usuario.toString());
        setDataLogin(data);
        setIsAuthenticated(true);
    };

    const logout = () => {
        removeItem('token');
        removeItem('empresa');
        removeItem('user');
        setDataLogin(null);
        setIsAuthenticated(false);
    };

    const getEmpresaData = async () => {
        if (dataLogin) {
            const url = `${process.env.EXPO_PUBLIC_API_URL}/empresa/${dataLogin.empresa}?empresa=${dataLogin.empresa}`; 
            const headers = { 
                'Authorization': `Bearer ${dataLogin.token}`,
                'Content-Type': 'application/json'
            };
            const method = 'GET';
            await fetchDataEmpresa(url, { headers, method });
            if (responseEmpresa.data) {
                setEmpresa(responseEmpresa.data.company);
            }
        }
    };

    const getUserData = async () => {
        if (dataLogin) {
            const url = `${process.env.EXPO_PUBLIC_API_URL}/usuario/${dataLogin.usuario}?empresa=${dataLogin.empresa}`; 
            const headers = {
                'Authorization': `Bearer ${dataLogin.token}`, 
                'Content-Type': 'application/json'
            };
            const method = 'GET';
            await fetchDataUser(url, { headers, method });
            if (responseUser.data && dataLogin.usuario) {
                setUser(responseUser.data.user);
            }
        }
    };

    useEffect(() => {
        if(responseEmpresa.error || responseUser.error) logout();
        if (dataLogin && isAuthenticated) {
            getEmpresaData();
            getUserData();
            return 
        }
        logout();
    }, [dataLogin, isAuthenticated, !responseEmpresa.data, !responseUser.data, responseEmpresa.error, responseUser.error]);

    return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout, dataLogin, user, empresa }}>
        {children}
      </AuthContext.Provider>
    );
};