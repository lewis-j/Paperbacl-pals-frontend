import { useState } from "react";
import SearchModal from "../components/SearchModal/SearchModal";

export const useSearchModal = () => {
  const [modal, setModal] = useState({
    isOpen: false,
  });

  const openSearchModal = () => {
    setModal({ isOpen: true });
  };

  const closeModal = () => {
    setModal({ isOpen: false });
  };

  const renderSearchModal = (searchType) => {
    return (
      <SearchModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        searchType={searchType}
      />
    );
  };

  return {
    openSearchModal,
    renderSearchModal,
  };
};
