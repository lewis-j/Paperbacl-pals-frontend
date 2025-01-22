import styles from "./BookContainer.module.scss";
import { IconBookOff } from "@tabler/icons";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { NoContent, Placeholder, Button, FadeIn } from "../../../../components";
import { useState, useEffect } from "react";
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
  const renderCount = 12;
  const getInitialCount = () => {
    const width = window.innerWidth;
    if (width >= 1200) {
      // xl breakpoint
      return 12;
    } else if (width >= 768) {
      // md breakpoint
      return 8;
    } else if (width >= 576) {
      return 6; // sm and xs breakpoints
    } else {
      return 2; // xs breakpoints
    }
  };

  const [renderBookCount, setRenderBookCount] = useState(getInitialCount());
  const [loadingSection, setLoadingSection] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setRenderBookCount(getInitialCount());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = () => {
    setLoadingSection(true);
    setTimeout(() => {
      setLoadingSection(false);
      setRenderBookCount((previousState) => previousState + renderCount);
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
      renderBookCount + renderCount
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
            <div className={styles.showMoreWrapper}>
              <Button
                className={styles.showMore}
                icon={faArrowDown}
                variant="accept"
                onClick={handleClick}
              >
                Show more
              </Button>
            </div>
          )}
        </Row>
      </>
    );
  };
  return <div className={styles.container}>{renderBooks()}</div>;
};

export default BookContainer;
