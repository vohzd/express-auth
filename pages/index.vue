<template lang="html">
  <section>
    <h1>Auth</h1>
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
      <h1>You are logged in as: {{ currentUser }}</h1>
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
    }
  },
  methods: {
    check(){
      this.$axios.post("http://localhost:1337/check", {
        options: {
          "withCredentials": true
        }
      }).then((res) => {
        console.log(res);
      }).catch((err) => {
        console.log(err);
      })
    },
    register(){
      this.$axios.post("http://localhost:1337/register", {
        "email": this.email,
        "password": this.password
      }).then((res) => {
        console.log(res);
      }).catch((err) => {
        console.log(err);
      })
    },
    login(){
      this.$axios.post("http://localhost:1337/login", {
        "email": this.email,
        "password": this.password
      }).then((res) => {
        console.log(res);
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
