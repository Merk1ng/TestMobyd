import React, {Fragment} from 'react';
import {
    createSwitchNavigator,
    createAppContainer,
    createDrawerNavigator,
} from 'react-navigation';
import {LoginScreen} from './screens/common/LoginScreen';
import * as firebase from 'firebase';
import Splash from './screens/common/Splash';
import {Home} from './screens/Home';
import {Main} from './screens/3_retail/Main'
import LogOutButton from './components/LogOutButton';
import ServiceDetails from './screens/1_service_wholesale/ServiceDetails';
import Downloading from './screens/common/Downloading';
import Uploading from './screens/common/Uploading';
import SurveyDetails from './screens/2_wholesale/SurveyDetails';
import Reports from './screens/1_service_wholesale/Reports';
import InternalOrdersList from './screens/3_retail/InternalOrdersList';
import {ExternalOrdersList} from './screens/3_retail/ExternalOrdersList';
import {PurchasesList} from './screens/3_retail/PurchasesList';
import {PurchasesPTU}  from './screens/3_retail/PurchasesPTU';
import {PurchaseDetailsPTU} from './screens/3_retail/PurchaseDetailsPTU';
import {PurchaseDetails} from './screens/3_retail/PurchaseDetails';
import {InventoryList} from './screens/3_retail/InventoryList';
import {InventoryDetails} from './screens/3_retail/InventoryDetails';
import {InternalOrderDetails} from './screens/3_retail/InternalOrderDetails';
import {ExternalOrderDetails} from './screens/3_retail/ExternalOrderDetails';
import Settings from './screens/common/Settings';
import {PriceTags} from './screens/PriceTags';
import {RetailTechnicDetails} from './screens/4_service_retail/RetailTechnicDetails';
import FoodServiceOrderDetails from './screens/5_foodservice/FoodServiceOrderDetails';
import FoodServiceOrdersList from './screens/5_foodservice/FoodServiceOrdersList';
import {FranchOrderDetails} from './screens/6_franchise/FranchOrderDetails';
import News from './screens/6_franchise/News';
import {Calculations} from './screens/6_franchise/Calculations';
import {Education} from './screens/6_franchise/Education';
import {Tsd} from './screens/6_franchise/Tsd';
import SurveyList from './screens/2_wholesale/SurveyList';
import ServiceList from './screens/1_service_wholesale/ServiceList';
import TaskList from './screens/common/Task/TaskList';
import RetailTechnicList from './screens/4_service_retail/RetailTechnicList';

const firebaseConfig = {
    apiKey: "AIzaSyAw4cCY1vcc8Kq_PJ3PGxyd20i2H1P4SLQ",
    authDomain: "pivko-group.firebaseapp.com",
    databaseURL: "https://pivko-group.firebaseio.com",
    projectId: "pivko-group",
    storageBucket: "pivko-group.appspot.com",
    messagingSenderId: "906071345304",
    appId: "1:906071345304:web:39a629f5cd7eb6eb01e8ed",
    measurementId: "G-1Y22T80RR5",
};

console.disableYellowBox = true;

firebase.initializeApp(firebaseConfig);

const RetailStack = createDrawerNavigator({
        HomeScreen: {screen: Main},
        InternalOrderList: {screen: InternalOrdersList},
        InternalOrderDetails: {
            screen: InternalOrderDetails, navigationOptions: {
                drawerLabel: () => null,
            },
        },
        DetailsScreen: {
            screen: InternalOrderDetails, navigationOptions: {
                drawerLabel: () => null,
            },
        },
        ExternalOrderList: {screen: ExternalOrdersList},
        ExternalOrderDetails: {
            screen: ExternalOrderDetails, navigationOptions: {
                drawerLabel: () => null,
            },
        },

        PurchasesPTU: {screen: PurchasesPTU},
        PurchaseDetailsPTU: {
            screen: PurchaseDetailsPTU, navigationOptions: {
                drawerLabel: () => null,
            },
        },
        PurchasesList: {screen: PurchasesList},
        PurchaseDetails: {
            screen: PurchaseDetails, navigationOptions: {
                drawerLabel: () => null,
            },
        },
        InventoryList: {screen: InventoryList},
        InventoryDetails: {
            screen: InventoryDetails, navigationOptions: {
                drawerLabel: () => null,
            },
        },
        PriceTags: {screen: PriceTags},
        TaskList: {screen: TaskList},
        Downloading: {screen: Downloading},
        Settings: {screen: Settings},
        LogOutButton: {screen: LogOutButton},
    }, {
        contentOptions: {
            itemsContainerStyle: {
                marginVertical: 20,
            },
            items: [],
        },
    },
);

const WholesaleStack = createDrawerNavigator({
        HomeScreen: {screen: SurveyList},
        DetailsScreen: {screen: SurveyDetails},
        Uploading: {screen: Uploading},
        Downloading: {screen: Downloading},
        LogOutButton: {screen: LogOutButton},
    }, {
        contentOptions: {
            itemsContainerStyle: {
                marginVertical: 20,
            },
        },
    },
);

const FoodServiceStack = createDrawerNavigator({
        HomeScreen: {screen: Home},
        InternalOrderDetails: {
            screen: FoodServiceOrderDetails, navigationOptions: {
                drawerLabel: () => null,
            },
        },
        InternalOrderList: {screen: FoodServiceOrdersList},
        Uploading: {screen: Uploading},
        Downloading: {screen: Downloading},
        LogOutButton: {screen: LogOutButton},
    }, {
        contentOptions: {
            itemsContainerStyle: {
                marginVertical: 20,
            },
        },
    },
);

const TechnicStack = createDrawerNavigator({
    HomeScreen: {screen: ServiceList},
    DetailsScreen: {screen: ServiceDetails},
    ReportsScreen: {screen: Reports},
    Uploading: {screen: Uploading},
    Downloading: {screen: Downloading},
    LogOutButton: {screen: LogOutButton},
}, {
    contentOptions: {
        itemsContainerStyle: {
            marginVertical: 20,
        },
    },
});

const RetailTechnicStack = createDrawerNavigator({
    HomeScreen: {screen: RetailTechnicList},
    DetailsScreen: {screen: RetailTechnicDetails},
    Downloading: {screen: Downloading},
    LogOutButton: {screen: LogOutButton},
}, {
    contentOptions: {
        itemsContainerStyle: {
            marginVertical: 20,
        },
    },
});

const AuthorizationStack = createDrawerNavigator({
    HomeScreen: {screen: LoginScreen},
});

const FranchiseStack = createDrawerNavigator({
    HomeScreen: {screen: Home},
    Calculations: {screen: Calculations},
    Tsd: {screen: Tsd},
    News: {screen: News},
    Education: {screen: Education},
    Downloading: {screen: Downloading},
    LogOutButton: {screen: LogOutButton},
    FranchOrderDetails: {
        screen: FranchOrderDetails, navigationOptions: {
            drawerLabel: () => null,
        },
    },
}, {
    contentOptions: {
        itemsContainerStyle: {
            marginVertical: 20,
        },
    },
});

export default createAppContainer(createSwitchNavigator({
        Splash: Splash,
        AuthorizationStack: AuthorizationStack,
        WholesaleStack: WholesaleStack,
        TechnicStack: TechnicStack,
        FoodServiceStack: FoodServiceStack,
        RetailStack: RetailStack,
        RetailTechnicStack: RetailTechnicStack,
        FranchiseStack: FranchiseStack,
    }, {
        initialRouteName: 'Splash',
    },
));
