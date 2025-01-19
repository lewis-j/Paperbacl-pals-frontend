import { Modal } from "../../../../components";
import { StarRating } from "../StarRating";

const RatingModal = ({ newRating, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rate a book">
      RatingModal {newRating}
      <StarRating rating={newRating} />
    </Modal>
  );
};

export default RatingModal;
