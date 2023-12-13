import {
    Route,
    BrowserRouter as Router,
    Routes as RRDRoutes,
} from "react-router-dom";
import AdminRoute from "./auth/helper/adminRoutes";
import ClientRoute from "./auth/helper/clientRoutes";
import UserDashboard from "./pages/userDashboard";
import AdminDashboard from "./pages/adminDashboard";
import Login from "./pages/login";
import NotFound from "./pages/notFound";
import FileUpload from "./pages/FileUpload";
import ManageUsers from "./pages/ManageUsers";
import ChangePassword from "./pages/ChangePassword";
import CreateUser from "./pages/CreateUser";
import UpdateUser from "./pages/UpdateUser";
import FileMetaData from "./pages/FileMetaData";
import FileData from "./pages/FileData";


const Routes = () => {
    // const history = createBrowserHistory();
    return (
        <>
            <Router>
                <RRDRoutes>

                    <Route
                        path="/admin/dashboard"
                        element={
                            <AdminRoute>
                                <AdminDashboard/>
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <AdminRoute>
                                <ManageUsers/>
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/changepassword"
                        element={
                            <AdminRoute>
                                <ChangePassword/>
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/user/update/:userid"
                        element={
                            <AdminRoute>
                                <UpdateUser/>
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/createuser"
                        element={
                            <AdminRoute>
                                <CreateUser/>
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ClientRoute>
                                <UserDashboard/>
                            </ClientRoute>
                        }
                    />
                    <Route
                        path="/changepassword"
                        element={
                            <ClientRoute>
                                <ChangePassword/>
                            </ClientRoute>
                        }
                    />

                    <Route
                        path="/not-found"
                        element={
                            <ClientRoute>
                                <NotFound/>
                            </ClientRoute>
                        }
                    />

                    <Route
                        path="/file-upload"
                        element={
                            <ClientRoute>
                                <FileUpload/>
                            </ClientRoute>
                        }
                    />

                    <Route
                        path="/file-meta-data"
                        element={
                            <ClientRoute>
                                <FileMetaData/>
                            </ClientRoute>
                        }
                    />

                    <Route
                        path="/file-data"
                        element={
                            <ClientRoute>
                                <FileData/>
                            </ClientRoute>
                        }
                    />

                    <Route path="/" exact Component={Login}/>
                </RRDRoutes>
            </Router>
        </>
    );
};

export default Routes;
