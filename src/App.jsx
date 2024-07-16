import React from "react";
import Home from "./pages/home/Home";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Users from "./pages/users/Users";
import Products from "./pages/products/Products";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Login from "./pages/login/Login";
import "./styles/global.scss";
import User from "./pages/user/User";
import Product from "./pages/product/Product";
import { TokenProvider} from "./components/TokenProvider"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Register from "./pages/register/Register";
import Complaint from './pages/complaint/Complaint'
import TestResidence from "./pages/testResidence/TestResidence";

const queryClient = new QueryClient();

function App() {

  const TopLayout=()=>{
    return (
      <div className="main">
      
      <div className="contentContainer">
            <QueryClientProvider client={queryClient}>
              <Outlet />
            </QueryClientProvider>
          </div>
      <Footer />
    </div>
    )
  }  
  
  const Layout = () => {
    return (
      <>
      
     
        <Navbar />
      <div className="container">
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="contentContainer">
            <QueryClientProvider client={queryClient}>
              <Outlet />
            </QueryClientProvider>
          </div>
        </div>
        </>
      
    );
  };

  const router = createBrowserRouter([

    {
      path: "/",
      element: <TopLayout />,
      children: [
        {
          path: "/",
          element: <Layout />,
          children: [
            {
              path: "/",
              element: <Home />,
            },
            {
              path: "/complaint",            
              element: <Complaint />,
            },

            {
              path: "/test-residence",            
              element: <TestResidence />,
            },
            {
              path: "/users",
              element: <Users />,
            },
            {
              path: "/products",
              element: <Products />,
            },
            {
              path: "/users/:id",
              element: <User />,
            },
            {
              path: "/products/:id",
              element: <Product />,
            },
          ],

        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
       
      ],
    }
  ]);

  return (

  <TokenProvider>
    <RouterProvider router={router} /> 
  </TokenProvider>
 
  )
}

export default App;
