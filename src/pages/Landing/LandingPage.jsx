import { Button } from "../../components";
import { Outlet } from "react-router-dom";
import logo_white from "../../Assets/imgs/pppals_white.png";
import { HashLink as Link } from "react-router-hash-link";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import tutorialContent from "../../Assets/content/tutorialContent";
import styles from "./LandingPage.module.scss";
import { Col, Container, Row } from "../../lib/BootStrap";

const Hero = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imgWrapper}>
        <div className={styles.filter}></div>
        <Container>
          <Row>
            <Col md="6" style={{ zIndex: 2 }}>
              <div className={styles.panel}>
                <div className={styles.logo}>
                  <img src={logo_white} alt="Paper back pals logo" />
                </div>
                <div className={styles.btnWrapper}>
                  <Link className={styles.learnMoreLink} smooth to="#Demo">
                    <Button
                      icon={faArrowDown}
                      variant="menu-white-outline"
                      size="lg"
                    >
                      Learn more
                    </Button>
                  </Link>
                </div>
              </div>
            </Col>
            <Col md="6" style={{ zIndex: 5 }} id="signup">
              <Outlet />
            </Col>
          </Row>
        </Container>
      </div>

      <div className={styles.appDiscription}>
        <h2>Track Your Book Journey</h2>
        <p>
          {`Ever wondered where that favorite novel disappeared to? Or suddenly
          remembered you still have your friend's book from last summer?
          Paperback Pals helps you keep track of your borrowed and lent books,
          making sure your literary treasures always find their way home.
          Simple, social, and perfect for book lovers who love sharing their
          collections with friends.`}
        </p>
      </div>
    </div>
  );
};

const MediaObject = ({ img, header, paragraph, imgRight = false }) => {
  const rowClassName = `${imgRight ? "order-md-last" : ""} mb-5 mb-md-0`;
  return (
    <Row className="pt-5 d-flex align-items-center">
      <Col sm="12" md="6" className={rowClassName}>
        <div className={styles.tint}>
          <img src={img.src} className={styles.thumbnail} alt={img.alt} />
        </div>
      </Col>
      <Col sm="12" md="6">
        <div className="text-center mt-sm-4">
          <h3>{header}</h3>
          <p>{paragraph}</p>
        </div>
      </Col>
    </Row>
  );
};

const TutorialSection = () => {
  return (
    <Container id="Demo">
      {tutorialContent.map((content, i) => {
        return (
          <MediaObject
            key={`tutorialContent-${i}`}
            img={content.img}
            header={content.header}
            paragraph={content.paragraph}
            imgRight={content.imgRight}
          />
        );
      })}
    </Container>
  );
};

const LandingPage = () => {
  return (
    <>
      <Hero />
      <div className={styles.tutorialSection}>
        <TutorialSection />
        <div className={styles.divider} />
        <div className={styles.toTopBtnContianer}>
          <Link
            smooth
            to="signup/#signup"
            scroll={(el) =>
              el.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            <Button
              icon={faArrowUp}
              variant="granite-outline"
              className={styles.toTopBtn}
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
