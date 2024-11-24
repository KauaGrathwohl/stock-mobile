import { createStackNavigator } from '@react-navigation/stack';
import DrawerRoutes from './drawer.routes';
import {CreateSuppliers, DetailsSuppliers, EditSuppliers} from "@/src/app/(auth)/suppliers";
import { DetailsCategories,CreateCategories,EditCategories } from '../(auth)/categories'
import { DetailsStocks, CreateStocks, EditStocks } from '../(auth)/stocks';
import { CreateStockFlow } from '../(auth)/stockFlow';

const Stack = createStackNavigator();

export default function StackRoutes() {
    const routerPageInGoBack = (route: any) => {
      
        const namePages = [
            'DetailsCategories',
            'EditCategories',
            'CreateCategories',

            'DetailsSuppliers',
            'EditSuppliers',
            'CreateSuppliers',
        
            'DetailsStock',
            'EditStock',
            'CreateStock'
        ];

        return namePages.includes(route.name);
    };

    return (
        <Stack.Navigator
            screenOptions={({ route }) => ({
                headerShown: routerPageInGoBack(route)
            })}
        >
            <Stack.Screen name="Drawer"            component={DrawerRoutes} />

            <Stack.Screen name="DetailsCategories" component={DetailsCategories} options={{ headerTitle: "Detalhes do Item", headerBackTitle: "Voltar"}} />
            <Stack.Screen name="EditCategories"    component={EditCategories} options={{headerTitle: "Edição do Item",headerBackTitle: "Voltar"}} />
            <Stack.Screen name="CreateCategories"  component={CreateCategories} options={{headerTitle: "Criação do Item",headerBackTitle: "Voltar"}} />

            <Stack.Screen name="DetailsSuppliers"  component={DetailsSuppliers} options={{ headerTitle: "Detalhes do Fornecedor", headerBackTitle: "Voltar"}} />
            <Stack.Screen name="EditSuppliers"     component={EditSuppliers} options={{ headerTitle: "Edição do Fornecedor", headerBackTitle: "Voltar"}} />
            <Stack.Screen name="CreateSuppliers"   component={CreateSuppliers} options={{ headerTitle: "Criação do Fornecedor", headerBackTitle: "Voltar"}} />

            <Stack.Screen name="DetailsStock"      component={DetailsStocks} options={{ headerTitle: "Detalhes do Lote", headerBackTitle: "Voltar"}} />
            <Stack.Screen name="EditStock"         component={EditStocks} options={{ headerTitle: "Edição do Lote", headerBackTitle: "Voltar"}} />
            <Stack.Screen name="CreateStock"       component={CreateStocks} options={{ headerTitle: "Criação do Lote", headerBackTitle: "Voltar"}} />

            <Stack.Screen name="CreateStockFlow"   component={CreateStockFlow} options={{ headerTitle: "Criar Movimentação", headerBackTitle: "Voltar"}} />
        
        </Stack.Navigator>
    );
}