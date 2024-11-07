import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Employees from './pages/Employees';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Home from './pages/Home';
import Login from './pages/Login';
import PrivateRoute from './components/private'; // Ensure this path is correct
import './index.css';
import './styles/tailwind.css';

function App() {
    return (    
        <Router>
            <div>
                <Navbar />
                <Switch>
                    <Route path="/login" component={Login} />
                    <PrivateRoute path="/" exact component={Home} />
                    <PrivateRoute path="/employees" component={Employees} />
                    <PrivateRoute path="/customers" component={Customers} />
                    <PrivateRoute path="/orders" component={Orders} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
