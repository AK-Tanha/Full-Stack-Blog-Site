import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AddPost from "../pages/admin/addPost/AddPost";
import ManageItems from "../pages/admin/addPost/ManageItems";
import UpdatePost from "../pages/admin/addPost/UpdatePost";
import AdminLayout from "../pages/admin/AdminLayout";
import AddCategory from "../pages/admin/category/AddCategory";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import ManageUser from "../pages/admin/user/ManageUser";
import Singleblogs from "../pages/blogs/singleblogs/Singleblogs";
import Home from "../pages/Home/Home";
import About from "../pages/miniPages/About";
import Contact from "../pages/miniPages/Contact";
import PrivacyPolicy from "../pages/miniPages/PrivacyPolicy";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import Profile from "../pages/user/Profile";
import PrivateRoutes from "./PrivateRoutes";
import UserLayout from "../Component/UserLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // 1. Auth Pages (Separate Minimal Layout)
      {
        path: "/log-in",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },

      // 2. Public Site Layout (With Navbar & Footer)
      {
        path: "/",
        element: <UserLayout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/about-us",
            element: <About />,
          },
          {
            path: "/privacy-policy",
            element: <PrivacyPolicy />,
          },
          {
            path: "/contact-us",
            element: <Contact />,
          },
          {
            path: "/blogs/:id",
            element: <Singleblogs />,
          },
          {
            path: "/profile",
            element: (
              <PrivateRoutes>
                <Profile />
              </PrivateRoutes>
            ),
          },
        ],
      },

      // 3. Admin Dashboard Layout
      {
        path: "dashboard",
        element: (
          <PrivateRoutes>
            <AdminLayout />
          </PrivateRoutes>
        ),
        children: [
          {
            path: "",
            element: <Dashboard />,
          },
          {
            path: "add-new-post",
            element: <AddPost />,
          },
          {
            path: "add-category",
            element: <AddCategory />,
          },
          {
            path: "update-items/:id",
            element: <UpdatePost />,
          },
          {
            path: "manage-items",
            element: <ManageItems />,
          },
          {
            path: "users",
            element: <ManageUser />,
          },
        ],
      },
    ],
  },
]);

export default router;
