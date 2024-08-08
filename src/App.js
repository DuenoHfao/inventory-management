import { createBrowserRouter,RouterProvider } from "react-router-dom";
import LoginPage from "./views/LoginPage";
import HomePage from "./views/ItemPageHome";
import UserManage from "./views/UserManagePage";
import AddUser from "./views/AddUserPage";
import BookingPage from "./views/BookingPage";
import LogsPage from "./views/LogsPage"
import AddItemPage from "./views/AddItemPage";

function App() {

  const router = createBrowserRouter([
    {path: "/", element: <HomePage />},
    {path: "/login", element: <LoginPage />},
    {path: "/userManage", element: <UserManage />},
    {path: "/addUser", element: <AddUser />},
    {path: "/bookings/:id", element: <BookingPage />},
    {path: "/logs", element: <LogsPage />},
    {path: "/addItem", element: <AddItemPage />}
  ])

  return (
    <RouterProvider router = {router}></RouterProvider>
  );
}

export default App;
