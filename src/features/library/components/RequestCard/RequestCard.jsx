import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../../components";
import { createBookRequest } from "../../userBooksSlice";
import * as asyncStatus from "../../../../data/asyncStatus";

import styles from "./RequestCard.module.scss";
import { BookModalForm } from "../ModalForms";

const RequestCard = ({
  userBook,
  decline = () => {
    alert("decline");
  },
}) => {
  const userBookStatus = useSelector((state) => state.userBooks.status);
  const dispatch = useDispatch();
  const {
    _id: userBook_id,
    owner: { _id: recipient_id },
  } = userBook;
  const handleBookRequest = async () => {
    await dispatch(createBookRequest({ userBook_id, recipient_id })).unwrap();
    decline();
  };

  const isLoading = userBookStatus === asyncStatus.LOADING;
  return (
    <div className={styles.container}>
      <BookModalForm.UserBookDetails userBook={userBook} />
      <div className={styles.button}>
        <Button
          disabled={isLoading}
          variant="decline"
          onClick={() => decline()}
        >
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          variant="primary"
          onClick={handleBookRequest}
        >
          Make Request
        </Button>
      </div>
    </div>
  );
};

export default RequestCard;
