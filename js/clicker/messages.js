// =========================================================================
// ÜZENETEK MEGJELENÍTÉSE (MESSAGES SYSTEM)
// =========================================================================

document.addEventListener("DOMContentLoaded", async () => {
    const messagesDiv = document.getElementById("messages");
    // A filePath-t a try előtt definiáljuk, hogy a catch-ben is lássuk
    const filePath = "../source/data/messages.json"; 

    try {
        // 1. Megvárjuk a hálózati választ (await)
        const response = await fetch(filePath);
        
        // Ellenőrizzük, hogy a fájl létezik-e (pl. nem 404 hiba)
        if (!response.ok) {
            throw new Error(`HTTP hiba! Státusz: ${response.status}`);
        }

        // 2. Megvárjuk, amíg a szöveget JSON objektummá alakítja
        const data = await response.json(); 
        
        // 3. Megjelenítjük azonnal az elsőt (hogy ne legyen üres 5 mp-ig)
        showRandomMessage(data, messagesDiv);

        // 4. Beállítjuk az időzítőt
        setInterval(() => {
            showRandomMessage(data, messagesDiv);
        }, 4000);

    } catch (error) {
        console.error(`Hiba a ${filePath} fájl betöltésekor:`, error);
        messagesDiv.innerHTML = "<p>Hiba történt az üzenetek betöltésekor.</p>";
    }
});

function showRandomMessage(data, element) {
    const keys = Object.keys(data);
    
    // Biztonsági ellenőrzés, ha üres lenne a JSON
    if (keys.length === 0) return;

    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const valueObj = data[randomKey];

    // Formázás
    element.innerHTML = `
        <div style="text-align: center;">
            <h3>"${randomKey}"</h3>
            <p style="font-style: italic;">${valueObj.p}</p>
        </div>
    `;
}