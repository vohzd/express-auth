<template lang="html">
  <section>
    <h1>Auth</h1>
    <section>
      {{ notifications }}
    </section>
    <div v-if="!currentUser">
      <h3>Not Logged in</h3>
      <section>
        <h4>Login</h4>
        <input placeholder="Email" v-model="email" />
        <input placeholder="Password" v-model="password"/>
        <button @click="login">Login</button>
      </section>
      <section>
        <h4>Register</h4>
        <input placeholder="Email" v-model="email" />
        <input placeholder="Password" v-model="password"/>
        <input placeholder="Password (Again)" v-model="password"/>
        <button @click="register">Register</button>
      </section>
    </div>
    <div v-if="currentUser">
      <h1>You are logged in as: {{ currentUser.email }} (id: {{ currentUser._id }})</h1>
      <button @click="logout">Logout</button>
    </div>
  </section>
</template>

<script>
export default {
  data(){
    return {
      currentUser: null,
      email: null,
      password: null,
      notifications: ""
    }
  },
  methods: {
    check(){
      this.$axios.post("http://localhost:1337/check").then((res) => {
        if (res.data.success){
          this.currentUser = res.data.user;
        }
      }).catch((err) => {
        console.log(err);
      })
    },
    register(){
      this.$axios.post("http://localhost:1337/register", {
        "email": this.email,
        "password": this.password
      }).then((res) => {
        this.notifications = res.data.message;
        this.currentUser = res.data.user;
      }).catch((err) => {
        console.log(err);
      })
    },
    login(){
      this.$axios.post("http://localhost:1337/login", {
        "email": this.email,
        "password": this.password
      }).then((res) => {
        this.notifications = res.data.message;
        this.currentUser = res.data.user;
      }).catch((err) => {
        console.log(err);
      })
    },
    logout(){
      this.$axios.post("http://localhost:1337/logout").then((res) => {
        if (res.data.success){
          this.currentUser = res.data.user;
        }
      }).catch((err) => {
        console.log(err);
      })
    },
  },
  mounted(){
    this.$axios.defaults.withCredentials = true;
    this.check();
  }
}
</script>

<style lang="css">
</style>
