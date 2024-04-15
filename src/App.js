import './App.css';
import './style/comm.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/login/login';
import Index from './pages/index';
import Detail from './pages/detail/detail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/index' element={<Index />}></Route>
        <Route path='/detail' element={<Detail />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
