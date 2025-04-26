import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface ReadingProgressData {
  current_page: number;
  percentage_read: number;
}

const ReadingPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 40;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const { data: progress, isLoading } = useQuery({
    queryKey: ['reading-progress', bookId],
    queryFn: async () => {
      try {
        const response = await axios.get(`/reading-service/${bookId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        return response.data as ReadingProgressData;
      } catch (error) {
        console.error('Error fetching reading progress:', error);
        return null;
      }
    },
    enabled: isAuthenticated && !!bookId,
  });

  useEffect(() => {
    if (progress?.current_page) {
      setCurrentPage(progress.current_page);
    }
  }, [progress]);

  const updateProgress = useMutation({
    mutationFn: async (newProgress: { current_page: number; percentage_read: number }) => {
      console.log('Updating reading progress...', newProgress);
      return axios.put(`/reading-service/${bookId}`, {
        book_id: bookId,
        user_id: user?.id,
        current_page: newProgress.current_page,
        percentage_read: newProgress.percentage_read
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
    },
    onSuccess: () => {
      console.log('Reading progress updated successfully');
    },
    onError: (error) => {
      console.error('Error updating reading progress:', error);
    }
  });

  const handlePageChange = async (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      
      const percentageRead = Math.round((newPage / totalPages) * 100);
      await updateProgress.mutateAsync({
        current_page: newPage,
        percentage_read: percentageRead
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <div className="text-center py-8">Завантаження...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-4">
          <Link to="/" className="flex items-center text-blue-500 hover:text-blue-600 mr-4">
            <ArrowLeft className="mr-2" size={20} />
            На головну
          </Link>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-8 min-h-[600px] flex flex-col">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold">Сторінка {currentPage} з {totalPages}</h2>
          </div>
          
          <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-500 italic">
              Тестова сторінка {currentPage}
            </p>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              <ChevronLeft size={20} />
              Попередня
            </button>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Наступна
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingPage;