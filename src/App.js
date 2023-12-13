import "./App.css";
import React from "react";
import {Redirect, Route, Switch} from "react-router";
import {ToastContainer} from "react-toastify";
import NotFound from "./pages/notFound";
import AdminDashboard from "./pages/adminDashboard";
import SideBar from "./components/sideBar";
import NavBar from "./components/navBar";
import Login from "./pages/login";
import FileUpload from "./pages/FileUpload";
import FileData from "./pages/FileData";

function App() {
    return (
        <div className="row">
            {/* side navbar */}
            <div className="col-md-3">
                <SideBar/>
            </div>
            <div className="col-md-8">
                {/* top navbar */}
                <NavBar/>
                {/* routing container */}
                <div className="container">
                    <Switch>
                        <Route path="/login" component={Login}/>
                        <Route path="/dashboard" component={AdminDashboard}/>
                        {/*<Route path="/userList" component={UserList} />*/}
                        <Route path="/not-found" component={NotFound}/>
                        <Route path="/file-upload" component={FileUpload}/>
                        <Route path="/file-data" component={FileData}/>
                        <Redirect from="/" exact to="/login"/>
                        <Redirect to="/not-found"/>
                    </Switch>
                </div>
            </div>
            <div className="col-md-1"></div>
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={true}
                rtl={false}
            />
        </div>
    );
}

export default App;
