const loader1 = (source) => {
  return source + "//注释1";
};

const loader2 = (source) => {
  return source + "//注释2";
};

module.exports = {
  loader1,
  loader2,
};
