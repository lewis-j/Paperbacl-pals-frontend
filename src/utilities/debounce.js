export function debounce(func, wait) {
  let timeout;

  function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }

  executedFunction.cancel = function () {
    clearTimeout(timeout);
  };

  return executedFunction;
}
