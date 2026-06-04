<template>
  <div class="register-container">
    <h2>Inscription</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="username">Pseudo :</label>
        <input
          id="username"
          v-model="username"
          type="text"
          name="username"
          required
          placeholder="Choisissez un pseudo"
        />
      </div>
      <div class="form-group">
        <label for="email">Email :</label>
        <input
          id="email"
          v-model="email"
          type="email"
          name="email"
          required
          placeholder="Entrez votre email"
        />
      </div>
      <div class="form-group">
        <label for="password">Mot de passe :</label>
        <input
          id="password"
          v-model="password"
          type="password"
          name="password"
          required
          placeholder="Entrez votre mot de passe"
        />
      </div>
      <button type="submit" class="register-button">S'inscrire</button>
    </form>

    <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
    <p>Deja un compte ? <nuxt-link to="/login">Connectez-vous ici</nuxt-link></p>
  </div>
</template>

<script>
export default {
  name: "UserRegister",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleRegister() {
      this.errorMessage = "";

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Inscription reussie !');
          this.$router.push('/login');
        } else {
          this.errorMessage = data.message || 'Erreur lors de l inscription';
        }
      } catch (err) {
        console.error('Erreur reseau :', err);
        this.errorMessage = 'Erreur de connexion.';
      }
    },
  },
};
</script>

<style src="@/assets/registerStyle.css"></style>
