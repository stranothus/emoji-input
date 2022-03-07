import getCaret from "./getCaret.js";

class EmojiInput extends HTMLElement {
    constructor() {
        super();

        this.contentEditable = true;

        let styles = ``;
        
        const input = document.createElement("input");
        input.type = "text";
        this.parentElement.appendChild(input);

        // default style
        let css = window.getComputedStyle(input);
        styles += `emoji-input {\n`;
        for (const i in css) {
            const val = css.getPropertyValue(i);

            if(!val) continue;

            styles += `${i}: ${val};\n`;
        }
        styles += `border-style: solid;\nborder-width: 1px;\nborder-radius: 2px;\npadding: 2px 3px;\n}`;

        // focus style
        input.focus();
        css = window.getComputedStyle(input);
        styles += `emoji-input:focus {\n`;
        for (const i in css) {
            const val = css.getPropertyValue(i);

            if(!val) continue;

            styles += `${i}: ${val};\n`;
        }
        styles += `}`;

        this.parentElement.removeChild(input);

        const head = document.head;
        const style = document.createElement("style");
        if(style.stylesheet) {
            style.stylesheet.cssText = styles;
        } else {
            style.appendChild(document.createTextNode(styles));
        }

        head.prepend(style);
    }
    insertEmoji(emoji) {
        const caret = (getCaret(this) || [this.innerHTML.length])[0] - 1;

        this.innerHTML = `${this.innerHTML.substring(0, caret)}<img src="${emoji}" height="${+window.getComputedStyle(this).getPropertyValue("font-size").slice(0, -2) - 2}">${caret < this.innerHTML.length ? this.innerHTML.substring(caret) : ""}`;
    }
}

customElements.define("emoji-input", EmojiInput);