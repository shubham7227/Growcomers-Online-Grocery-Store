import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Addresses from "./pages/shop/userProfile/Addresses";
import Cart from "./pages/shop/Cart";
import Home from "./pages/shop/Home";
import Login from "./pages/Login";
import PagenotFound from "./pages/PagenotFound";
import Product from "./pages/shop/Product";
import ProductListing from "./pages/shop/ProductListing";
import Profile from "./pages/shop/userProfile/Profile";
import Signup from "./pages/Signup";
import Wishlist from "./pages/shop/Wishlist";
import {
  getAccessToken,
  getUser,
  loginwithtoken,
} from "./redux/slice/authSlice";
import ClientAuth from "./security/ClientAuth";
import RequireAuth from "./security/RequireAuth";
import AddAddress from "./pages/shop/userProfile/AddAddress";
import EditAddress from "./pages/shop/userProfile/EditAddress";
import ReviewsHistory from "./pages/shop/userProfile/ReviewsHistory";
import OrderHistory from "./pages/shop/userProfile/OrderHistory";
import ManageOrder from "./pages/shop/userProfile/ManageOrder";
import Checkout from "./pages/shop/checkout/Checkout";
import Categories from "./pages/shop/Categories";
import Brands from "./pages/shop/Brands";
import SingleBrand from "./pages/shop/SingleBrand";
import SingleCategory from "./pages/shop/SingleCategory";
import { fetchINRvalue } from "./redux/slice/daiSlice";
import AdminUsers from "./pages/admin/Users";
import AdminOrders from "./pages/admin/Orders";
import AdminBrands from "./pages/admin/BrandAll";
import AdminCategories from "./pages/admin/CategoriesAll";
import AdminProducts from "./pages/admin/Products";
import AdminManageOrder from "./pages/admin/ManageOrder";
import AdminManageUsers from "./pages/admin/ManageUsers";
import AdminManageProducts from "./pages/admin/ManageProducts";
import AdminManageBrands from "./pages/admin/ManageBrands";
import AdminManageCategories from "./pages/admin/ManageCategories";
import AdminAddProduct from "./pages/admin/AddProduct";
import AdminAddCategory from "./pages/admin/AddCategory";
import AdminAddBrand from "./pages/admin/AddBrand";
import GoogleLogin from "./pages/GoogleLogin";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import TrainModel from "./pages/admin/TrainModel";

function App() {
  const dispatch = useDispatch();
  const token = useSelector(getAccessToken);
  const user = useSelector(getUser);

  useEffect(() => {
    if (token && !user) {
      dispatch(loginwithtoken(token));
    }
    dispatch(fetchINRvalue());
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/google-login" element={<GoogleLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify" element={<VerifyEmail />} />

        <Route path="/" element={<ClientAuth />}>
          <Route index element={<Home />} />
          <Route path="cart" element={<Cart />} />
          <Route path="products" element={<ProductListing />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/:id" element={<SingleCategory />} />
          <Route path="brands" element={<Brands />} />
          <Route path="brands/:id" element={<SingleBrand />} />
          <Route path="product/:id" element={<Product />} />
        </Route>

        <Route path="/" element={<RequireAuth allowedRole="CUSTOMER" />}>
          <Route path="profile">
            <Route path="address" element={<Addresses />} />
            <Route path="address/add" element={<AddAddress />} />
            <Route path="address/edit/:id" element={<EditAddress />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="orders/:id" element={<ManageOrder />} />
            <Route path="reviews" element={<ReviewsHistory />} />
            <Route path="my" element={<Profile />} />
            <Route
              index
              element={<Navigate to="/profile/my" replace={true} />}
            />
          </Route>
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>

        <Route path="/admin" element={<RequireAuth allowedRole="ADMIN" />}>
          <Route
            index
            element={<Navigate to="/admin/orders" replace={true} />}
          />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminManageOrder />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminManageUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/add" element={<AdminAddProduct />} />
          <Route path="products/:id" element={<AdminManageProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="categories/add" element={<AdminAddCategory />} />
          <Route path="categories/:id" element={<AdminManageCategories />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="brands/add" element={<AdminAddBrand />} />
          <Route path="brands/:id" element={<AdminManageBrands />} />
          <Route path="train" element={<TrainModel />} />
          <Route path="*" element={<p>Admin side pages</p>} />
        </Route>

        <Route path="/*" element={<PagenotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
