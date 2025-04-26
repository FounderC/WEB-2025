import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import BookList from './components/BookList';
import ReadingPage from './components/ReadingPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container mx-auto px-4 py-8">
          <Link to="/" className="text-3xl font-bold mb-8 hover:text-blue-600 transition-colors block">
            Digital Libra Library
          </Link>
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/read/:bookId" element={<ReadingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;