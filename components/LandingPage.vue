<template>
  <div class="landing-page">
    <img src="~/assets/resources/iconSansBg.png" alt="Logo Cat-Chat" class="logo">

    <header class="header">
      <h1>Bienvenue sur Cat-Chat</h1>
      <p>Discutez simplement avec vos contacts, o&ugrave; que vous soyez.</p>
      <button class="get-started-button" @click="goToLogin">Commencer</button>
    </header>

    <section class="features">
      <div class="feature">
        <h2>Messagerie priv&eacute;e</h2>
        <p>Choisissez un utilisateur et &eacute;changez directement avec lui.</p>
      </div>
      <div class="feature">
        <h2>Conversations enregistr&eacute;es</h2>
        <p>Retrouvez vos messages gr&acirc;ce &agrave; leur sauvegarde dans MongoDB.</p>
      </div>
      <div class="feature">
        <h2>Simple et accessible</h2>
        <p>Connectez-vous depuis un ordinateur ou un t&eacute;l&eacute;phone.</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
  methods: {
    goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style src="@/assets/landingpage.css"></style>
