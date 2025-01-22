import React from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./ResponsiveSlider.module.scss";
import "./ResponsiveSlider.scss";
import { _s } from "../../style";

const NextArrow = ({ className, style, onClick }) => {
  return (
    <div className={_s("slick-next", styles.arrow)} onClick={onClick}>
      <FontAwesomeIcon icon={faChevronRight} />
    </div>
  );
};

const PrevArrow = ({ className, style, onClick }) => {
  return (
    <div className={_s("slick-prev", styles.arrow)} onClick={onClick}>
      <FontAwesomeIcon icon={faChevronLeft} />
    </div>
  );
};
const ResponsiveSlider = ({ className, children }) => {
  // const getSlideItems = (num) => Math.min(children?.length || 0, num);
  const slideCount = children?.length || 0;

  const createSettingsWithSetPoint = (slides, totalSlides) => {
    const isOverContainer = slides > totalSlides;
    console.log("slides", slides);
    console.log("totalSlides", totalSlides);
    console.log("isOverContainer", isOverContainer);
    return {
      dots: isOverContainer,
      slidesToShow: totalSlides,
      nextArrow: isOverContainer ? <NextArrow /> : null,
      prevArrow: isOverContainer ? <PrevArrow /> : null,
      swipeToSlide: isOverContainer,
      swipe: isOverContainer,
      infinite: isOverContainer,
    };
  };

  var settings = {
    className: _s(className, styles.container),
    ...createSettingsWithSetPoint(slideCount, 4),
    infinite: false,
    speed: 500,
    slidesToScroll: 1,
    centerMode: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          ...createSettingsWithSetPoint(slideCount, 3),
        },
      },
      {
        breakpoint: 600,
        settings: {
          ...createSettingsWithSetPoint(slideCount, 2),
        },
      },
      {
        breakpoint: 480,
        settings: {
          ...createSettingsWithSetPoint(slideCount, 1),
        },
      },
    ],
  };
  return (
    <div className={styles.sliderWrapper}>
      <Slider {...settings}>{children}</Slider>
    </div>
  );
};

export default ResponsiveSlider;
