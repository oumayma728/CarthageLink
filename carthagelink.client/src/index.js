import ReactDOM from 'react-dom/client'; // correct: using 'react-dom/client'
import App from './App.js';
import { BrowserRouter } from 'react-router-dom'; // correct: wrapping with BrowserRouter

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
