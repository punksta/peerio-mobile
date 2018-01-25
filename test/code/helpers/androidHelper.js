function selectorWithText(query) {
    return `android=new UiSelector().text("${query}")`;
}

module.exports = {
    selectorWithText
};
