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
  const getSlideItems = (num) => Math.min(children?.length || 0, num);

  var settings = {
    className: _s(className, styles.contianer),
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: getSlideItems(4),
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: getSlideItems(3),
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: getSlideItems(2),
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return <Slider {...settings}>{children}</Slider>;
};

export default ResponsiveSlider;
