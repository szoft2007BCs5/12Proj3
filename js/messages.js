export class MessageManager {
    constructor() {
        // Egyel kijjebb hozva
        this.filePath = "../source/data/messages.json";
    }

    async init() {
        const messagesDiv = document.getElementById("messages");
        if (!messagesDiv) return;

        try {
            const response = await fetch(this.filePath);
            if (!response.ok) {
                throw new Error(`HTTP hiba! Státusz: ${response.status}`);
            }

            const data = await response.json(); 
            
            this.showRandomMessage(data, messagesDiv);

            setInterval(() => {
                this.showRandomMessage(data, messagesDiv);
            }, 4000);

        } catch (error) {
            console.error(`Hiba a ${this.filePath} fájl betöltésekor:`, error);
            messagesDiv.innerHTML = "<p>Hiba történt az üzenetek betöltésekor.</p>";
        }
    }

    showRandomMessage(data, element) {
        const keys = Object.keys(data);
        if (keys.length === 0) return;

        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const valueObj = data[randomKey];

        element.innerHTML = `
            <div class="msg-container">
                <h3>"${randomKey}"</h3>
                <p class="msg-italic">${valueObj.p}</p>
            </div>
        `;
    }
}

export const messageManager = new MessageManager();