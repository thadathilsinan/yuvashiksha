import { Provider } from "react-redux";
import "./App.css";

import Login from "./components/login/Login";
import { store } from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <div id="root">
        <Login />
      </div>
    </Provider>
  );
}

export default App;
