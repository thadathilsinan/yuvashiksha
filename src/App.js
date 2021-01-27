import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";

import Login from "./components/login/Login";
import Student from "./components/student/Student";
import Teacher from "./components/teacher/Teacher";
import Admin from "./components/admin/Admin";

import { store } from "./store/store";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <div id="root">
          <Route path="/" exact component={Login} />
          <Route path="/student" component={Student} />
          <Route path="/teacher" component={Teacher} />
          <Route path="/admin" component={Admin} />
        </div>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
