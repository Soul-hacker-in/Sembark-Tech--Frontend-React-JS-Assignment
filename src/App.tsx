import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar/Navbar';
import { AppRoutes } from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col transition-colors duration-300">
          <Navbar />
          
          <main className="flex-grow">
            <AppRoutes />
          </main>
          
          <footer className="border-t border-gray-150/40 dark:border-slate-800/40 py-6 text-center text-xs font-semibold text-gray-400 dark:text-slate-500 bg-white dark:bg-slate-900 transition-colors">
            <div className="max-w-7xl mx-auto px-4">
              <p>&copy; {new Date().getFullYear()} Sembark-Tech- Frontend-React JS-Assignment.</p>
            </div>
          </footer>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
