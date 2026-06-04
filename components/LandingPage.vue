<template>

    
    <div class="landing-page"> 
        
       <img src="~/assets/resources/iconSansBg.png" alt="Logo" class="logo">
      
        <header class="header">
        
        <h1>Bienvenue sur Cat-Chat</h1>
        <p>ajout phrase accroche 🤠</p>
        <button  class="get-started-button" @click="goToLogin">Commencer</button> <!--eslint de merde qui me fait chier-->
      </header>
  
      <section class="features">
        <div class="feature">
          <h2>Communiquez instantanément</h2>
          <p>blalbalalalalabbaba</p>
        </div>
        <div class="feature">
          <h2>blalalalalablblla</h2>
          <p>blablablabla</p>
        </div>
        <div class="feature">
          <h2>Balalalalalal</h2>
          <p>blavbllallala</p>
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