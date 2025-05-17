import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Rules from './components/Rules';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/rules" element={<Rules />} />
          <Route path="/" element={<Rules />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
