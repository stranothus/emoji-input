import getCaret from "./getCaret.js";

class EmojiInput extends HTMLElement {
    emojis = {};
    list = document.createElement("div");
    lastCaret = 0;

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
        const caret = +(getCaret(this) || this.lastCaret || this.innerHTML.length);
        emoji = this.emojis[emoji] || emoji;
        const insert = `<img src="${emoji}" height="${+window.getComputedStyle(this).getPropertyValue("font-size").slice(0, -2) - 2}">`;

        this.innerHTML = `${this.innerHTML.substring(0, caret)}${insert} ${caret < this.innerHTML.length ? this.innerHTML.substring(caret) : ""}`;
    }
    addEmoji(name, emoji) {
        this.emojis[name] = emoji.replace(/\s/g, "");

        const button = document.createElement("button");
        button.innerHTML = `${name} <img src="${emoji}" height="${+window.getComputedStyle(this).getPropertyValue("font-size").slice(0, -2) - 2}">`;
        button.onclick = () => {
            const caret = +(getCaret(this) || this.lastCaret || this.innerHTML.length);
            const replace = this.innerHTML.substring(0, caret).match(/:\S*$/)[0];
            const newText = this.innerHTML.substring(0, caret).replace(/:\S*$/, "");

            this.innerHTML = newText + this.innerHTML.substring(caret);

            this.lastCaret = newText.length;
            button.blur();

            this.insertEmoji(name);

            this.parentElement.removeChild(this.list);
        };

        this.list.appendChild(button);
    }
    connectedCallback() {
        this.addEventListener("keyup", event => {
            const caret = +(getCaret(this) || this.lastCaret || this.innerHTML.length);
            const untilNow = this.innerHTML.substring(0, caret);
            
            if(/:\S*$/.test(untilNow)) {
                if(!document.contains(this.list)) this.before(this.list);

                const substring = untilNow.match(/:\S*$/)[0].replace(/^:/, "");

                this.list.childNodes.forEach(v => {
                    if(v.textContent.toLowerCase().indexOf(substring.toLowerCase()) + 1) {
                        v.style.display = "block";
                    } else {
                        v.style.display = "none";
                    }
                })
            } else {
                if(this.parentElement.contains(this.list)) this.parentElement.removeChild(this.list);
            }

            this.lastCaret = caret + 1;
        });
    }
}

customElements.define("emoji-input", EmojiInput);