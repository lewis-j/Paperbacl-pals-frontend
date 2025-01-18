import images from "../imgs/landingImages";

const { assortment_books, front_composition_books, open_book } = images;

const tutorialContent = [
  {
    header: "Build Your Lending Library",
    paragraph:
      "Create your personal collection of books available for lending and let friends browse what you're willing to share!",
    img: {
      src: assortment_books,
      alt: "pile of books",
    },
    imgRight: false,
  },
  {
    header: "Share Books With Friends",
    paragraph:
      "Approve borrowing requests and track when books change hands. Keep your lending history organized and clear.",
    img: {
      src: front_composition_books,
      alt: "sharing books between friends",
    },
    imgRight: true,
  },
  {
    header: "Track Reading Progress",
    paragraph:
      "Follow your friends' reading progress and see their page counts. Stay updated on projected return dates and keep your library organized.",
    img: {
      src: open_book,
      alt: "open book showing progress",
    },
    imgRight: false,
  },
];

export default tutorialContent;
