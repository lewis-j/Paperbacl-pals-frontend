import styles from "./BookContainer.module.scss";
import { IconBookOff } from "@tabler/icons";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { NoContent, Placeholder, Button, FadeIn } from "../../../../components";
import { useState } from "react";
import { Row, Col } from "../../../../lib/BootStrap";

const defaultNoContent = {
  text: "No Books Yet!",
  icon: IconBookOff,
  description: null,
  buttonText: null,
  buttonIcon: null,
  onClick: null,
};

const BookContainer = ({ children: cards, noContent = defaultNoContent }) => {
  const [renderBookCount, setRenderBookCount] = useState(12);
  const [loadingSection, setLoadingSection] = useState(false);

  const handleClick = () => {
    setLoadingSection(true);
    setTimeout(() => {
      setLoadingSection(false);
      setRenderBookCount((previousState) => previousState + 12);
    }, 300);
  };

  const renderBooks = () => {
    if (cards.length === 0) {
      const { text, icon, description, buttonText, buttonIcon, onClick } = {
        ...defaultNoContent,
        ...noContent,
      };
      return (
        <NoContent text={text} icon={icon}>
          {description && <div>{description}</div>}
          {buttonText && (
            <Button
              variant="primary"
              icon={buttonIcon}
              onClick={onClick}
              classNa
            >
              {buttonText}
            </Button>
          )}
        </NoContent>
      );
    }
    const books = cards.slice(0, renderBookCount);
    const loadingCount = cards.slice(
      renderBookCount,
      renderBookCount + 12
    ).length;

    return (
      <>
        <Row>
          <FadeIn delay={100}>{books}</FadeIn>
          {loadingSection &&
            [...Array(loadingCount).keys()].map((i) => (
              <Col sm="4" md="3" xl="2" key={i} className={styles.cardWrapper}>
                <Placeholder />
              </Col>
            ))}
          {cards.length > renderBookCount && (
            <Button icon={faArrowDown} variant="accept" onClick={handleClick}>
              Show more
            </Button>
          )}
        </Row>
      </>
    );
  };
  return <div className={styles.container}>{renderBooks()}</div>;
};

export default BookContainer;
