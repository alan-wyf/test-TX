import './App.css';
import './style/comm.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/login/login';
import Index from './pages/index';
import Detail from './pages/detail/detail';
import {
  legacyLogicalPropertiesTransformer,
  StyleProvider,
} from '@ant-design/cssinjs';

function App() {
  return (
    <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/index' element={<Index />}></Route>
          <Route path='/detail' element={<Detail />}></Route>
        </Routes>
      </BrowserRouter>
    </StyleProvider>

  );
}

export default App;
