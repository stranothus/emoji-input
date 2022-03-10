const emojiInput = document.querySelector("emoji-input");

document.body.onload = () => {
    emojiInput.addEmoji("think", "https://image.emojipng.com/171/46171.jpg");
};

const button = document.createElement("button");
button.textContent = "Click me";
button.onclick = () => emojiInput.insertEmoji("https://image.emojipng.com/171/46171.jpg");
document.body.appendChild(button);