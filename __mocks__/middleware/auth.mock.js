module.exports = TEST_USER_ID = "65f1e8afd91baac7eb38d5cc";

module.exports = jest.fn((req, res, next) => {
  console.log("🔑 Mock auth middleware called");
  req.userData = { id: TEST_USER_ID };
  next();
});
