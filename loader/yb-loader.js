const REG = /<script>([\s\S]+?)<\/script>/;

module.exports = function (source) {
  console.log("== yb-loader  running ==", source);

  const __source = source.match(REG);
  console.log(__source);

  return (__source && __source[1]) || source;
};
