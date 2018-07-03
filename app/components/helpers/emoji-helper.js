const ranges = [
    '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
    '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
    '\ud83d[\ude80-\udeff]', // U+1F680 to U+1F6FF
    ' ' // Also allow one space
].join('|');

const MAX_JUMBOJI_COUNT = 3;

function isOnlyEmojis(str) {
    if (!str) return false;
    const noEmojis = str.replace(new RegExp(ranges, 'g'), '');
    return !noEmojis;
}

function findEmojis(str) {
    return str.match(new RegExp(ranges, 'g'), '') || [];
}

function emojiCount(str) {
    return findEmojis(str).length;
}

// Should be Jumboji when the message is only Emojis, seperated by a max of one space
// and when EmojiCount is <= a certain threshold
function shouldBeJumboji(str) {
    return isOnlyEmojis(str) && emojiCount(str) <= MAX_JUMBOJI_COUNT;
}

export default shouldBeJumboji;
