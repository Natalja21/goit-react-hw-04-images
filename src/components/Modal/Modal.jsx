import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

const Modal = props => {
  const modalRoot = document.querySelector('#modal-root');
  const modalClosed = e => {
    if (e.currentTarget === e.target) {
      props.toggleModal();
    }
  };
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        props.toggleModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [props]);

  return createPortal(
    <div
      className={styles.overlay}
      onClick={e => {
        modalClosed(e);
      }}
    >
      <div className={styles.modal}>{props.children}</div>
    </div>,
    modalRoot
  );
};

export default Modal;
