<template>
    <div class="container">
        <div class="card card-default">
            <div class="card-header">Connexion</div>
            <div class="card-body">
                <div class="alert alert-danger" v-if="has_error">
                    <p>Erreur, impossible de se connecter avec ces identifiants.</p>
                </div>
                <form autocomplete="off" @submit.prevent="login" method="post">
                    <div class="form-group">
                        <label for="email">E-mail</label>
                        <input type="email" id="email" class="form-control" placeholder="user@example.com" v-model="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Mot de passe</label>
                        <input type="password" id="password" class="form-control" v-model="password" required>
                    </div>
                    <button type="submit" class="btn btn-default">Connexion</button>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      email: null,
      password: null,
      has_error: false
    }
  },
  mounted () {
    //
  },
  methods: {
    login () {
    // get the redirect object
      var app = this
      this.$auth.login({
        params: {
          email: app.email,
          password: app.password
        },
        success: function () {
          this.$router.push({ name: 'home' })
        },
        error: function () {
          app.has_error = true
        },
        rememberMe: true,
        fetchUser: true
      })
    }
  }
}
</script>
