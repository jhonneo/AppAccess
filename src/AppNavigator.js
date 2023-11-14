import { createStackNavigator } from '@react-navigation/stack';

import Login from './Login';
import Home from './Home';
import Tab2Screen from './Tab2Screen';
import SelecionarContrato from './SelecionarContrato/SelectContrato';
import SemBoleto from './SemBoleto';

const Stack = createStackNavigator();

function AppNavigator() {
    return (
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false  
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Tab2Screen" component={Tab2Screen} />
        <Stack.Screen name="SelecionarContrato" component={SelecionarContrato} />
        <Stack.Screen name="SemBoleto" component={SemBoleto} />
      </Stack.Navigator>
    );
  }
  

export default AppNavigator;
