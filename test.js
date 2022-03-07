const emojiInput = document.querySelector("emoji-input");
const button = document.querySelector("button");

button.onclick = () => {
    emojiInput.insertEmoji("https://image.emojipng.com/171/46171.jpg");
};