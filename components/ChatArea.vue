<template>
  <div class="messages-container">
    <div class="sidebar">
      <div class="sidebar-header">
        <div>
          <h2>Utilisateurs</h2>
          <p v-if="currentUser" class="current-user">Connecte : {{ currentUser.username }}</p>
        </div>
        <button class="logout-button" @click="logout">Quitter</button>
      </div>

      <ul class="contact-list">
        <li
          v-for="user in users"
          :key="user.id"
          :class="['contact', selectedContact && selectedContact.id === user.id ? 'active' : '']"
          @click="selectContact(user)"
        >
          <img src="~/assets/resources/pdp.jpg" :alt="user.username" class="contact-img">
          <div class="contact-info">
            <p class="contact-name">{{ user.username }}</p>
            <p class="contact-meta">Conversation privee</p>
          </div>
        </li>
      </ul>

      <p v-if="users.length === 0" class="empty-state">
        Aucun autre utilisateur pour le moment.
      </p>
    </div>

    <div class="chat-area">
      <template v-if="selectedContact">
        <div class="chat-header">
          <img src="~/assets/resources/pdp.jpg" alt="Profil" class="profile-img">
          <div class="chat-info">
            <p class="chat-name">{{ selectedContact.username }}</p>
            <p class="status">Discussion privee</p>
          </div>
        </div>

        <div ref="chatMessages" class="chat-messages">
          <div
            v-for="message in messages"
            :key="message._id"
            :class="['message', message.sender === currentUser.id ? 'sent' : 'received']"
          >
            <p>{{ message.content }}</p>
            <div class="message-footer">
              <button
                v-if="message.sender === currentUser.id"
                type="button"
                class="delete-message-button"
                title="Supprimer ce message"
                @click="deleteMessage(message._id)"
              >
                Supprimer
              </button>
              <span class="timestamp">{{ formatDate(message.createdAt) }}</span>
            </div>
          </div>
        </div>

        <div class="message-input-area">
          <input
            ref="messageInput"
            v-model="newMessage"
            type="text"
            placeholder="Tapez votre message..."
            class="message-input"
            @keyup.enter="sendMessage"
          />
          <button class="send-button" @click="sendMessage">Envoyer</button>
        </div>
        <p v-if="errorMessage" class="chat-error">{{ errorMessage }}</p>
      </template>

      <div v-else class="chat-placeholder">
        <h2>Choisissez un utilisateur</h2>
        <p>Selectionnez un contact a gauche pour commencer une conversation privee.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatArea",
  data() {
    return {
      currentUser: null,
      users: [],
      selectedContact: null,
      newMessage: '',
      messages: [],
      messageInterval: null,
      errorMessage: '',
    };
  },

  mounted() {
    const storedUser = sessionStorage.getItem('currentUser');

    if (!storedUser) {
      localStorage.removeItem('currentUser');
      this.$router.push('/login');
      return;
    }

    try {
      this.currentUser = JSON.parse(storedUser);
    } catch (error) {
      sessionStorage.removeItem('currentUser');
      localStorage.removeItem('currentUser');
      this.$router.push('/login');
      return;
    }

    if (!this.currentUser || !this.currentUser.id || !this.currentUser.username) {
      sessionStorage.removeItem('currentUser');
      localStorage.removeItem('currentUser');
      this.$router.push('/login');
      return;
    }

    this.currentUser.id = String(this.currentUser.id);
    this.loadUsers();

    this.messageInterval = setInterval(() => {
      if (this.selectedContact) {
        this.loadMessages();
      }
    }, 3000);
  },

  beforeDestroy() {
    clearInterval(this.messageInterval);
  },

  methods: {
    async loadUsers() {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        this.users = data
          .map((user) => ({ ...user, id: String(user.id) }))
          .filter((user) => user.id !== this.currentUser.id);

        if (!this.selectedContact && this.users.length > 0) {
          this.selectContact(this.users[0]);
        }
      } catch (err) {
        console.error('Erreur de chargement des utilisateurs', err);
      }
    },

    async selectContact(user) {
      this.selectedContact = user;
      this.messages = [];
      await this.loadMessages();
    },

    async loadMessages() {
      if (!this.currentUser || !this.selectedContact) {
        return;
      }

      try {
        this.errorMessage = '';
        const params = new URLSearchParams({
          userId: this.currentUser.id,
          contactId: this.selectedContact.id,
        });
        const res = await fetch(`/api/messages?${params.toString()}`);
        const data = await res.json();

        if (!res.ok) {
          this.errorMessage = data.message || 'Impossible de charger les messages.';
          return;
        }

        this.messages = data;
        this.$nextTick(this.scrollToBottom);
      } catch (err) {
        console.error('Erreur de chargement des messages', err);
        this.errorMessage = 'Impossible de charger les messages.';
      }
    },

    async sendMessage() {
      const messageText = this.newMessage.trim();

      if (!messageText || !this.selectedContact) {
        return;
      }

      try {
        this.errorMessage = '';
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            senderId: this.currentUser.id,
            receiverId: this.selectedContact.id,
            content: messageText,
          }),
        });

        if (response.ok) {
          this.newMessage = "";
          await this.loadMessages();
        } else {
          const data = await response.json();
          this.errorMessage = data.message || 'Erreur lors de l envoi du message.';
          console.error('Erreur lors de l envoi du message');
        }
      } catch (err) {
        console.error('Erreur reseau', err);
        this.errorMessage = 'Erreur reseau pendant l envoi du message.';
      }
    },

    async deleteMessage(messageId) {
      if (!window.confirm('Supprimer ce message ?')) {
        return;
      }

      try {
        this.errorMessage = '';
        const response = await fetch(`/api/messages/${messageId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ senderId: this.currentUser.id }),
        });

        const data = await response.json();

        if (!response.ok) {
          this.errorMessage = data.message || 'Erreur lors de la suppression.';
          return;
        }

        this.messages = this.messages.filter((message) => message._id !== messageId);
      } catch (err) {
        console.error('Erreur de suppression', err);
        this.errorMessage = 'Erreur reseau pendant la suppression.';
      }
    },

    formatDate(value) {
      if (!value) {
        return '';
      }

      return new Date(value).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    },

    scrollToBottom() {
      if (this.$refs.chatMessages) {
        this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight;
      }
    },

    logout() {
      sessionStorage.removeItem('currentUser');
      localStorage.removeItem('currentUser');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped src="@/assets/styles.css"></style>
