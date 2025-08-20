import { createBrowserRouter ,RouterProvider } from 'react-router-dom'
import Register from './components/register'
import Login from './components/Login'
import Home from './components/Home'
import Applayout from './components/Applayout'
import Userprotectroute from './components/userprotectroute'
import Products from './pages/Product'
import './App.css'
import { UserContextProvider} from './context/user.context'
import SingleProductPage from './pages/singleproductpage'
import CartPage from './pages/cart'
import OrderPage from './pages/order'
import OrderHistoryPage from './pages/orderhistory'
import CreateProduct from './pages/admincreatepage'
import OrderHistoryPage2 from './pages/orderhistory2'
function App() {

const router = createBrowserRouter([
  {
    path: '/',
    element: <Applayout/>,
    children:[
      {
      path:"/",
      element: <Home/>
    },{
      path: "/products",
      element: <Userprotectroute><Products/></Userprotectroute>
    },{
      path: "/products/:id",
      element: <Userprotectroute><SingleProductPage/></Userprotectroute>
    },{
      path: "/cart",
      element: <Userprotectroute><CartPage/></Userprotectroute>
    }
    ,{
      path: "/order",
      element: <Userprotectroute><OrderPage/></Userprotectroute>
    },{
      path: "/order-history",
      element: <Userprotectroute><OrderHistoryPage/></Userprotectroute>
    },{
      path:'/admin/products',
      element: <Userprotectroute><CreateProduct/></Userprotectroute>
    },{
      path:'/admin/orders',
      element: <Userprotectroute><OrderHistoryPage2/></Userprotectroute>
    }
]
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/register',
    element: <Register/>
  }
])
  return (
    <>

   
     <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
      

    </>
  )
}

export default App
