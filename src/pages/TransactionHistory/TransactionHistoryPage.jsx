import { useSelector } from "react-redux";
import { selectBooksWithHistory } from "../../features/library/userBooksSlice";
import styles from "./TransactionHistoryPage.module.scss";
import BookStatusTracker from "../../features/library/components/BookStatusTracker/BookStatusTracker";

const TransactionHistoryPage = () => {
  const booksWithHistory = useSelector(selectBooksWithHistory);

  const sortedBooks = [...booksWithHistory].sort((a, b) => {
    const aHistory =
      a.request?.statusHistory || a.requests?.[0]?.statusHistory || [];
    const bHistory =
      b.request?.statusHistory || b.requests?.[0]?.statusHistory || [];

    const aLatest = aHistory.length
      ? new Date(aHistory[aHistory.length - 1].timestamp)
      : new Date(0);
    const bLatest = bHistory.length
      ? new Date(bHistory[bHistory.length - 1].timestamp)
      : new Date(0);

    return bLatest - aLatest;
  });

  console.log(
    "*************************************************sorted books",
    sortedBooks
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Transaction History</h1>
      <div className={styles.bookList}>
        {sortedBooks.map((bookItem) => {
          const request = bookItem.request || bookItem.requests?.[0];
          if (!request) return null;

          const sender = bookItem.isOwned ? request.sender : bookItem.owner;

          return (
            <BookStatusTracker
              key={bookItem._id}
              userBook={{
                ...bookItem,
                owner: bookItem.owner || {},
                sender: sender || {},
                request: {
                  ...request,
                  sender: sender || {},
                  receiver: request.receiver || {},
                },
              }}
              isBorrower={!bookItem.isOwned}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
