<template>
  <q-page class="row flex-center fit bg-light">
    <q-card class="col-lg-4 col-md-5 col-sm-6 col-xs-10 bg-grey-4" :class="$q.screen.width > 1600 ? 'col-xl-2' : 'col-xl-3'">
      <q-card-title class="bg-primary text-white">
        <strong>{{$NodePackage.productName}}</strong>
      </q-card-title>
      <q-card-main>
        <q-input class="q-mt-lg q-mx-md border-light text-dark" placeholder="Usuário" inverted-light color="white" v-model="formulario.username" @keyup.enter="Entrar" :error="$v.formulario.username.$error" @blur="$v.formulario.username.$touch" />
        <q-input class="q-mt-lg q-mx-md border-light text-dark" type="password" placeholder="Senha" inverted-light color="white" v-model="formulario.password" @keyup.enter="Entrar" :error="$v.formulario.password.$error" @blur="$v.formulario.password.$touch" />
      </q-card-main>
      <q-card-actions align="center">
        <q-btn class="q-mb-sm" color="dark" label="Entrar" @click="Entrar" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  name: 'Login',
  data () {
    return {
      carregando: false,
      formulario: {
        username: '',
        password: ''
      }
    }
  },
  validations: {
    formulario: {
      username: {
        required
      },
      password: {
        required
      }
    }
  },
  mounted () {
    this.$q.loading.hide()
  },
  methods: {
    Entrar () {
      this.$v.formulario.$touch()
      if (this.$v.formulario.$error) {
        this.$q.notify({
          type: 'negative',
          timeout: 1000,
          message: 'Dados inválidos'
        })
      } else {
        this.$axios.post('/usuarios/login', this.formulario).then(Res => {
          this.$router.push({
            path: '/login/token',
            query: {
              accessToken: Res.data.id,
              usuarioId: Res.data.userId
            }
          })
        }).catch(Err => {
          let erro = Err.response.data.error.message.charAt(0).toUpperCase() + Err.response.data.error.message.substring(1)
          this.$q.notify({
            type: 'negative',
            timeout: 1000,
            message: erro
          })
        })
      }
    }
  }
}
</script>
