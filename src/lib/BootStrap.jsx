import "./bootstrap-grid.css";

const Row = ({ children, className = "", style = {} }) => {
  return (
    <div className={`row ${className}`} style={style}>
      {children}
    </div>
  );
};

const Col = ({ sm, md, xl, children, className = "", style = {} }) => {
  // Construct the className string based on defined props only
  const sizeClasses = [
    sm && `col-sm-${sm}`,
    md && `col-md-${md}`,
    xl && `col-xl-${xl}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`${sizeClasses} ${className}`.trim()} style={style}>
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
