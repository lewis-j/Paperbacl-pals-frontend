export const getNewDefaultUserImg = (name, hexColor = null) => {
  const initials = name
    .split(" ")
    .map((elem) => elem[0].toUpperCase())
    .join("");

  const fillColor = hexColor
    ? hexColor
    : [...Array(6)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");
  return (
    "data:image/svg+xml," +
    encodeURIComponent(`
 <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
   <g>
   <rect x="0" y="0" width="100" height="100" fill="#${fillColor}"></rect>
   <text x="50%" y="50%" font-family="Verdana" dominant-baseline="middle"  text-anchor="middle" font-size="35" fill="white">${initials}</text>
 </g>
 </svg>
`)
  );
};

export const getDefaultUserImg = (name, hexColor = null) => {
  const initials = name
    .split(" ")
    .map((elem) => elem[0].toUpperCase())
    .join("");
  return (
    "data:image/svg+xml," +
    encodeURIComponent(`
 <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
   <g>
   <rect x="0" y="0" width="100" height="100" fill="red"></rect>
   <text x="50%" y="50%" font-family="Verdana" dominant-baseline="middle"  text-anchor="middle" font-size="35" fill="white">${initials}</text>
 </g>
 </svg>
`)
  );
};
