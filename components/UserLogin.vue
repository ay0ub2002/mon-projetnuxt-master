<template>
  <div class="login-container">
    <h2>Connexion</h2>
    <form id="loginForm" @submit.prevent="handleSubmit">
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
      <button type="submit">Se connecter</button>
    </form>

    <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
    <p>Pas encore de compte ? <nuxt-link to="/register">Inscrivez-vous ici</nuxt-link></p>
  </div>
</template>

<script>
export default {
  name: "UserLogin",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleSubmit() {
      this.errorMessage = "";

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          sessionStorage.setItem('currentUser', JSON.stringify(data.user));
          localStorage.removeItem('currentUser');
          this.$router.push('/');
        } else {
          this.errorMessage = data.message || 'Erreur de connexion';
        }
      } catch (error) {
        console.error('Erreur reseau :', error);
        this.errorMessage = 'Erreur de connexion';
      }
    },
  },
};
</script>

<style src="@/assets/loginstyles.css"></style>
