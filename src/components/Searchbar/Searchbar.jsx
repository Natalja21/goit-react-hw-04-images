import { useState } from 'react';
import styles from './Searchbar.module.css';
import { toast } from 'react-toastify';

const SearchBar = props => {
  const [query, setQuery] = useState('');

  const handelQueryChange = e => {
    setQuery(e.currentTarget.value.toLowerCase());
  };
  const handelSubmit = e => {
    e.preventDefault();
    if (query.trim() === '') {
      toast.warning('Please, enter keyword !', {
        theme: 'colored',
        closeOnClick: true,
      });
      return;
    }
    props.onSubmitSearchBar(query);

    setQuery('');
  };

  return (
    <header className={styles.Searchbar}>
      <form onSubmit={handelSubmit} className={styles.SearchForm}>
        <input
          className={styles.SearchForm__input}
          name="query"
          type="text"
          autoComplete="off"
          value={query}
          autoFocus
          placeholder="Search images and photos"
          onChange={handelQueryChange}
        />
        <button type="submit" className={styles.SearchForm__button}>
          <span className={styles.SearchForm__span}>Search</span>
        </button>
      </form>
    </header>
  );
};

export default SearchBar;
