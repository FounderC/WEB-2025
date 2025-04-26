import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { BookOpen, Eye, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  publication_year?: number;
  file_url?: string;
  cover_url?: string;
}

const BookList = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');

  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      console.log('Sending request to /book');
      try {
        const response = await axios.get('/book');
        console.log('Response received:', response.data);
        return response.data.books || [];
      } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
      }
    },
  });

  const createReadingProgress = useMutation({
    mutationFn: async (bookId: string) => {
      console.log('Creating initial reading progress...');
      return axios.post('/reading-service', {
        book_id: bookId,
        user_id: user?.id,
        current_page: 1,
        percentage_read: 0
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
    },
    onSuccess: () => {
      console.log('Initial reading progress created successfully');
    },
    onError: (error) => {
      console.error('Error creating initial reading progress:', error);
    }
  });

  const startReading = async (bookId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await createReadingProgress.mutateAsync(bookId);
      navigate(`/read/${bookId}`);
    } catch (error) {
      console.error('Помилка створення прогресу:', error);
      navigate(`/read/${bookId}`);
    }
  };

  const uniqueGenres: string[] = [...new Set((books as Book[]).map((book: Book) => book.genre))];
  const uniqueAuthors: string[] = [...new Set((books as Book[]).map((book: Book) => book.author))];

  const filteredBooks = (books as Book[]).filter((book: Book) => {
    const matchesGenre = !selectedGenre || book.genre === selectedGenre;
    const matchesAuthor = !selectedAuthor || book.author === selectedAuthor;
    return matchesGenre && matchesAuthor;
  });

  if (isLoading) {
    return <div className="text-center py-4">Завантаження...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Помилка завантаження книг. Перевірте що бекенд запущений.</div>;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-4">
          <select
            className="p-2 border rounded"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">Всі жанри</option>
            {uniqueGenres.map((genre: string) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded"
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
          >
            <option value="">Всі автори</option>
            {uniqueAuthors.map((author: string) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </div>
        
        {!isAuthenticated ? (
          <div className="flex gap-4">
            <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Увійти
            </Link>
            <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Зареєструватися
            </Link>
          </div>
        ) : (
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            <LogOut size={20} />
            Вийти
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book: Book) => (
          <div key={book.id} className="border rounded-lg p-4 shadow">
            <h2 className="text-xl font-bold mb-2">{book.title}</h2>
            <p className="text-gray-600 mb-1">Автор: {book.author}</p>
            <p className="text-gray-600 mb-2">Жанр: {book.genre}</p>
            <p className="text-gray-700 mb-4">{book.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => window.location.href = `/book/${book.id}`}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                <Eye size={20} />
                Переглянути деталі
              </button>
              <button
                onClick={() => startReading(book.id)}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                <BookOpen size={20} />
                Почати читання
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;