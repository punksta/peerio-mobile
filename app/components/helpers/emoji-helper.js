const ranges = [
    '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
    '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
    '\ud83d[\ude80-\udeff]' // U+1F680 to U+1F6FF
    // ' ', // Also allow spaces
].join('|');

function isOnlyEmojis(str) {
    if (!str) return true;
    const noEmojis = str.replace(new RegExp(ranges, 'g'), '');
    const noSpace = noEmojis.replace(/[\s\n]/gm, '');
    return !noSpace;
}

function findEmojis(str) {
    return str.match(new RegExp(ranges, 'g'), '') || [];
}

function numEmojis(str) {
    return findEmojis(str).length;
}

// Jumoboji = larger size smoji
function shouldBeJumboji(str) {
    return isOnlyEmojis(str) && numEmojis(str) <= 3;
}

export default shouldBeJumboji;
