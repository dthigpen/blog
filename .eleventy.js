module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("style");
    eleventyConfig.addWatchTarget("style");
};
