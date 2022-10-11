import { Switch, Route, Redirect } from 'react-router-dom';
import AdminDashboard from './admin/AdminDashboard';
import CreateCategory from './admin/CreateCategory';
import CreateProduct from './admin/CreateProduct';
import Home from './home/Home';
import ProductDetails from './home/ProductDetails';
import Cart from './order/Cart';
import Checkout from './order/Checkout';
import ShippingAddress from './order/ShippingAddress';
import AdminRoute from './protectedRoutes/AdminRoute';
import PrivateRoute from './protectedRoutes/PrivateRoute';
import Dashboard from './user/Dashboard';
import Login from './user/Login';
import Register from './user/Register';

const Main = () => {
    return (
        <div>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" exact component={Login} />
                <Route path="/register" exact component={Register} />
                <Route path="/product/:id" exact component={ProductDetails} />
                <PrivateRoute path="/user/dashboard">
                    <Dashboard />
                </PrivateRoute>
                <PrivateRoute exact path="/cart">
                    <Cart />
                </PrivateRoute>
                <PrivateRoute exact path="/shipping">
                    <ShippingAddress />
                </PrivateRoute>
                <PrivateRoute exact path="/checkout">
                    <Checkout />
                </PrivateRoute>
                <AdminRoute exact path="/admin/dashboard">
                    <AdminDashboard />
                </AdminRoute>
                <AdminRoute exact path="/create/category">
                    <CreateCategory />
                </AdminRoute>
                <AdminRoute exact path="/create/product">
                    <CreateProduct />
                </AdminRoute>

                <Redirect to="/" />
            </Switch>
        </div>
    )
}

export default Main;