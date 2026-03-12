import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DeploymentsScreen from "../screens/deployments/deployments-screen";
import DeploymentDetailScreen from "../screens/deployments/deployment-detail-screen";

const DeploymentsStack = createNativeStackNavigator({
  screenOptions: {
    headerBackButtonDisplayMode: "minimal",
    headerTransparent: true,
  },
  screens: {
    DeploymentsList: {
      screen: DeploymentsScreen,
      options: {
        title: "",
      },
    },
    DeploymentDetail: {
      screen: DeploymentDetailScreen,
      options: {
        title: "",
        headerTransparent: true,
      },
    },
  },
});

export default DeploymentsStack;
