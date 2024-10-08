import { CSSReset, ColorModeProvider, theme, ThemeProvider } from "@chakra-ui/react";
import { Route } from "react-router-dom";
import ThemeToggler from "./Components/ThemeToggler";
import axios from "axios";
import UserProvider from "./Context/UserContext";
import EditorLogin from "./Pages/Editor/Login";
import EditorSignup from "./Pages/Editor/Signup";
import EditorDashboard from "./Pages/Editor/Dashboard";
import YoutuberLogin from "./Pages/Youtuber/Login";
import YoutuberSignup from "./Pages/Youtuber/Signup";
import YoutuberDashboard from "./Pages/Youtuber/Dashboard";
import Home from "./Pages/Home";
import adminHome from "./Pages/adminHome";

axios.defaults.baseURL = 'http://127.0.0.1:3000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset />
          <ThemeToggler />
          <Route exact path="/" component={Home} />
          <Route exact path="/admin" component={adminHome} />
          <Route exact path="/editor/login" component={EditorLogin} />
          <Route exact path="/editor/signup" component={EditorSignup} />
          <Route exact path="/editor/dashboard" component={EditorDashboard} />
          <Route exact path="/youtuber/login" component={YoutuberLogin} />
          <Route exact path="/youtuber/signup" component={YoutuberSignup} />
          <Route exact path="/youtuber/dashboard" component={YoutuberDashboard} />
        </ColorModeProvider>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App
