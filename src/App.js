import { Routes, Route } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepage';
import Chatpage from './pages/Chatpage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Homepage />} exact />
        <Route path='/chats' element={<Chatpage />} exact />
      </Routes>
    </div>
  );
}

export default App;
