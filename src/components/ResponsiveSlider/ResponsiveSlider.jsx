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

  const createSettingsWithSetPoint = (
    slides,
    totalSlides,
    showArrows = false
  ) => {
    const isOverContainer = slides > totalSlides;
    return {
      dots: true,
      slidesToShow: Math.min(slides, totalSlides),
      nextArrow: isOverContainer && showArrows ? <NextArrow /> : null,
      prevArrow: isOverContainer && showArrows ? <PrevArrow /> : null,
      swipeToSlide: isOverContainer,
      swipe: isOverContainer,
      infinite: isOverContainer,
    };
  };

  var settings = {
    className: _s(className, styles.container),
    ...createSettingsWithSetPoint(slideCount, 3),
    speed: 500,
    slidesToScroll: 1,
    centerMode: false,
    responsive: [
      {
        breakpoint: 1408,
        settings: {
          ...createSettingsWithSetPoint(slideCount, 2),
        },
      },
      {
        breakpoint: 1024,
        settings: {
          ...createSettingsWithSetPoint(slideCount, 1),
        },
      },
      {
        breakpoint: 990,
        settings: {
          ...createSettingsWithSetPoint(slideCount, 1),
        },
      },
      {
        breakpoint: 768,
        settings: {
          ...createSettingsWithSetPoint(slideCount, 2, true),
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
