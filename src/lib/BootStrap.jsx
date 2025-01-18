import "./bootstrap-grid.css";

const Row = ({ children, className = "", style = {} }) => {
  return (
    <div className={`row ${className}`} style={style}>
      {children}
    </div>
  );
};

const Col = ({ sm, md, xl, children, className = "", style = {} }) => {
  // Construct the className string based on the props
  const bsClassName = `col-sm-${sm} col-md-${md} col-xl-${xl}`;

  return (
    <div className={`${bsClassName} ${className}`} style={style}>
      {children}
    </div>
  );
};

const Container = ({ fluid, children, className = "", style = {}, id }) => {
  // Determine the className based on the fluid prop
  const bsClassName = fluid ? `container-${fluid}` : `container`;

  return (
    <div className={`${bsClassName} ${className}`} style={style} id={id}>
      {children}
    </div>
  );
};

export { Row, Col, Container };
