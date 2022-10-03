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
    if (query === '') {
      setInvisible(true);
      return;
    }
    const fetchImages = async () => {
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
        setInvisible(true);
      }

      if (totalHits > images.length + hits.length) {
        setInvisible(false);
      }
      if (totalHits === images.length + hits.length) {
        setInvisible(true);
      }

      setImages(prev => [...prev, ...hits]);
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
  }
    fetchImages(page, query);
     
  },[ query, page]);

  
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
  const imagesLenght = images.Length !== 0

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
      {(imagesLenght && page > 1 ) && <Scroll onToTop={onToTop} />}
      {showModal && (
        <Modal toggleModal={toggleModal}>
          <img src={largeImageURL} alt={tags} />
        </Modal>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

// export default class OldApp extends Component {
//   state = {
//     images: [],
//     query: '',
//     page: 1,
//     totalHits: null,
//     largeImageURL: '',
//     tags: '',
//     loading: false,
//     showModal: false,
//     error: null,
//     invisible: false,
//   };

//   componentDidUpdate(_, prevState) {
//     const { page, query } = this.state;
//     if ((query && prevState.query !== query) || page > prevState.page) {
//       this.fetchImages(query, page);
//     }
//     if (prevState.query !== query) {
//       this.setState({ images: [] });
//     }
//     if (page > 1) {
//       window.scrollTo({
//         top: document.documentElement.scrollHeight,
//         behavior: 'smooth',
//       });
//     }
//   }

//   fetchImages = async () => {
//     const { query, page, images } = this.state;
//     this.setState({ loading: true, invisible: true });
//     try {
//       const { totalHits, hits } = await getDataImages(query, page);
//       if (totalHits === 0) {
//         toast.warning(
//           `Sorry, there are no images matching search query "${query}". Please try again.`,
//           {
//             theme: 'colored',
//             closeOnClick: true,
//           }
//         );
//         this.setState({ images: [], invisible: true });
//       }

//       if (totalHits > images.length + hits.length) {
//         this.setState({ invisible: false });
//       }
//       if (totalHits === images.length + hits.length) {
//         this.setState({ invisible: true });
//       }
//       this.setState(prevState => ({
//         images: [...prevState.images, ...hits],
//         totalHits,
//       }));
//     } catch (error) {
//       const errorMessage = toast.warning(
//         'Oops, something went wrong try again later!',
//         {
//           theme: 'colored',
//           closeOnClick: true,
//         }
//       );
//       this.setState({ error: errorMessage });
//     } finally {
//       this.setState({ loading: false });
//     }
//   };

//   toggleModal = (largeImageURL, tags) => {
//     this.setState(({ showModal }) => ({
//       showModal: !showModal,
//       largeImageURL,
//       tags,
//     }));
//   };

//   handleSubmitSearchBar = query => {
//     this.setState({ query, page: 1 });
//   };

//   onLoadingMore = () => {
//     this.setState(prevState => ({ page: prevState.page + 1 }));
//   };
//   onToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   render() {
//     const { loading, images, showModal, largeImageURL, tags, invisible } =
//       this.state;
//     const { handleSubmitSearchBar, onLoadingMore, toggleModal, onToTop } = this;
//     const imagesLength = images.length !== 0;

//     return (
//       <div className={styles.App}>
//         <SearchBar onSubmitSearchBar={handleSubmitSearchBar} />
//         {loading && <Loader />}
//         {imagesLength && (
//           <ImageGallery images={images} toggleModal={toggleModal} />
//         )}
//         {imagesLength && !invisible && (
//           <LoadMoreBtn
//             type="button"
//             text="Load More"
//             onLoading={onLoadingMore}
//           />
//         )}
//         {imagesLength && <Scroll onToTop={onToTop} />}
//         {showModal && (
//           <Modal toggleModal={toggleModal}>
//             <img src={largeImageURL} alt={tags} />
//           </Modal>
//         )}
//         <ToastContainer position="top-right" autoClose={3000} />
//       </div>
//     );
//   }
// }

export default App;
