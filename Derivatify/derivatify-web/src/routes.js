import Dashboard from "views/Dashboard.jsx";
import Create from "views/Create.jsx"
import Buy from "views/Buy.jsx"
import Sell from "views/Sell.jsx"

var routes = [
  {
    path: "/portfolio",
    name: "Portfolio",
    icon: "dashboard",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/buy",
    name: "Buy",
    icon: "attach_money",
    component: Buy,
    layout: "/admin"
  },
  {
    path: "/sell",
    name: "Sell",
    icon: "account_balance_wallet",
    component: Sell,
    layout: "/admin"
  },
  {
    path: "/create",
    name: "My Derivatives",
    icon: "monetization_on",
    component: Create,
    layout: "/admin"
  }
];
export default routes;
