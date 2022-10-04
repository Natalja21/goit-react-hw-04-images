import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDataImages } from './services/Api';
import ImageGallery from './ImageGallery/ImageGallery';
import SearchBar from './Searchbar/Searchbar';
import LoadMoreBtn from './Button/Button';
import Loader from './Loader/Loader';
import styles from '../components/App.module.css';
import Modal from './Modal/Modal';
import Scroll from './Scroll/Scroll';

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [largeImageURL, setLargeImageURL] = useState('');
  const [tags, setTags] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [invisible, setInvisible] = useState(false);

  useEffect(() => {
    if (query === "") {
      setInvisible(true);
      return;
    }
    const fetchImages = async () => {
      
      setInvisible(true);
      setLoading(true);
      try {
        const { totalHits, hits } = await getDataImages(query, page);
        if (totalHits === 0) {
          toast.warning(
            `Sorry, there are no images matching search query "${query}". Please try again.`,
            {
              theme: 'colored',
              closeOnClick: true,
            }
          );
          setImages([]);
          
        }

        setImages(prev => [...prev, ...hits]);
        

        if (Math.ceil(totalHits / (page * 12)) > 1) {
          setInvisible(false);
          console.log(Math.ceil(totalHits / (page * 12)) > 1);
        }
      } catch (error) {
        const errorMessage = toast.warning(
          'Oops, something went wrong try again later!',
          {
            theme: 'colored',
            closeOnClick: true,
          }
        );
        return errorMessage;
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [query, page]);

  const toggleModal = (largeImageURL, tags) => {
    setShowModal(prev => !prev);
    setLargeImageURL(largeImageURL);
    setTags(tags);
  };

  const handleSubmitSearchBar = query => {
    setQuery(query);
    setPage(1);
    setImages([]);
  
  };

  const onLoadingMore = () => {
    setPage(prev => prev + 1);
  };
  const onToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const imagesLenght = images.Length !== 0;

  return (
    <div className={styles.App}>
      <SearchBar onSubmitSearchBar={handleSubmitSearchBar} />
      {loading && <Loader />}
      {imagesLenght && (
        <ImageGallery images={images} toggleModal={toggleModal} />
      )}
      {imagesLenght && !invisible && (
        <LoadMoreBtn type="button" text="Load More" onLoading={onLoadingMore} />
      )}
      {imagesLenght && page > 1 && <Scroll onToTop={onToTop} />}
      {showModal && (
        <Modal toggleModal={toggleModal}>
          <img src={largeImageURL} alt={tags} />
        </Modal>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
