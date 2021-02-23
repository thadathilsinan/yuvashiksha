import { Provider } from "react-redux";
import { BrowserRouter, Redirect, Route } from "react-router-dom";
import "./App.css";

import LoginRoute from "./components/login/LoginRoute";
import Student from "./components/student/Student";
import Teacher from "./components/teacher/Teacher";
import Admin from "./components/admin/Admin";

import { store } from "./store/store";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <div id="root">
          <Route path="/" component={LoginRoute} />
          <Route path="/student" component={Student} />
          <Route path="/teacher" component={Teacher} />
          <Route path="/admin" component={Admin} />

          {/* <Route path="/test" /> */}
          <Redirect to="/" />
        </div>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
