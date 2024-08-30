import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";
import "react-native-gesture-handler";
enableScreens();

import Login from "./Login";
import Home from "./Home";
import SelecionarContrato from "./SelecionarContrato/SelectContrato";
import SemBoleto from "./SemBoleto";
import Contato from "./Contato";
import Chat from "./Chat";
import Desativado from "./Desativado";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="SelecionarContrato" component={SelecionarContrato} />
      <Stack.Screen name="SemBoleto" component={SemBoleto} />
      <Stack.Screen name="Contato" component={Contato} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Desativado" component={Desativado} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
