
const messageInput = document.querySelector('.message-input');
const sendButton = document.querySelector('.send-button');
const chatMessages = document.querySelector('.chat-messages');

// fonction pour envoyer 
function sendMessage() {
    const messageText = messageInput.value.trim(); // Récupère et nettoie le texte du message

    if (messageText) { // qi msg vide
        // Crée un nouvel élément de message
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'sent'); // applique les classes CSS

        //ajout de l'heure
        messageElement.innerHTML = `<p>${messageText}</p><span class="timestamp">${new Date().toLocaleTimeString()}</span>`;

        // Ajoute le message dans la zone de chat
        chatMessages.appendChild(messageElement);

        // dEFILLE LE CHAT
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Spprime
        messageInput.value = '';
    }
}

//envoie en apputant sur le bouton
sendButton.addEventListener('click', sendMessage);

// envoie avec enter
messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
