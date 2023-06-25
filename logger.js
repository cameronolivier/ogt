const logger = (active) => {
  return {
    info: (...args) => {
      if (active) {
        console.log(...args);
      }
    },
    error: (...args) => {
      console.error(...args);
    },
  };
};

module.exports = {
  logger,
};
