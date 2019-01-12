<template>
  <q-page
    class="row bg-light"
    :class="$q.screen.sm || $q.screen.xs ? 'justify-between items-stretch' : 'flex-center fit'"
  >
    <transition
      appear
      enter-active-class="animated flipInX"
      leave-active-class="animated flipOutX"
    >
      <q-card
        class="col-lg-4 col-md-5 col-sm-12 col-xs-12 bg-white"
        :class="$q.screen.width > 1600 ? 'col-xl-2' : 'col-xl-3'"
        :style="$q.screen.sm || $q.screen.xs ? 'border-radius: 0;' : ''"
      >
        <q-card-title class="bg-primary text-white q-py-sm">
          <strong>{{$NodePackage.productName}}</strong>
        </q-card-title>
        <q-card-main class="row q-mt-sm">
          <q-field
            class="col-xl-12 col-lg-12 col-md-12 col-sm-6 col-xs-12 q-pa-sm"
            label="Usuário"
            label-width="12"
            :error="$v.formulario.username.$error"
          >
            <q-input
              class="border-1"
              inverted-light
              color="white"
              v-model="formulario.username"
              autofocus
              clearable
              @blur="$v.formulario.username.$touch"
            />
            <div
              slot="helper"
              v-if="!$v.formulario.username.required && $v.formulario.username.$error"
            >Campo obrigatório.</div>
            <div
              slot="helper"
              v-if="!$v.formulario.username.minLength"
            >O nome de usuário não pode conter menos que {{$v.formulario.username.$params.minLength.min}} caracteres.</div>
            <div
              slot="helper"
              v-if="!$v.formulario.username.maxLength"
            >O nome de usuário não pode conter mais que {{$v.formulario.username.$params.maxLength.max}} caracteres.</div>
          </q-field>
          <q-field
            class="col-xl-12 col-lg-12 col-md-12 col-sm-6 col-xs-12 q-pa-sm"
            label="Senha"
            label-width="12"
            :error="$v.formulario.password.$error"
          >
            <q-input
              class="border-1"
              inverted-light
              color="white"
              v-model="formulario.password"
              type="password"
              @keyup.enter="Entrar"
              @blur="$v.formulario.password.$touch"
            />
            <div
              slot="helper"
              v-if="!$v.formulario.password.required && $v.formulario.password.$error"
            >Campo obrigatório.</div>
            <div
              slot="helper"
              v-if="!$v.formulario.password.minLength"
            >A senha não pode conter menos que {{$v.formulario.password.$params.minLength.min}} caracteres.</div>
            <div
              slot="helper"
              v-if="!$v.formulario.password.maxLength"
            >A senha não pode conter mais que {{$v.formulario.password.$params.maxLength.max}} caracteres.</div>
          </q-field>
        </q-card-main>
        <q-card-actions
          class="q-mx-md q-mb-md"
          :align="$q.screen.sm || $q.screen.xs ? 'center' : 'end'"
        >
          <q-btn
            class="full-width primary-dark"
            color="primary"
            label="Entrar"
            icon="done"
            size="form"
            @click="Entrar"
          />
        </q-card-actions>
      </q-card>
    </transition>
  </q-page>
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
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
        required,
        minLength: minLength(5),
        maxLength: maxLength(20)
      },
      password: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(20)
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
