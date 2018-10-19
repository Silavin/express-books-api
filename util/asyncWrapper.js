const asyncWrapper = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    console.log(`There is an error: ${err}`);
  });
};

module.exports = asyncWrapper;
