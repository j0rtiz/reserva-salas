<template>
  <q-page
    class="row"
    :class="{'flex-center fit bg-grey-4': !$q.screen.sm && !$q.screen.xs, 'justify-center items-start bg-white q-pt-sm': $q.screen.sm, 'justify-center items-start bg-white q-pt-xl': $q.screen.xs}"
  >
    <transition
      appear
      enter-active-class="animated flipInX"
      leave-active-class="animated flipOutX"
    >
      <q-card
        class="col-lg-4 col-md-5 col-sm-6 col-xs-12"
        :class="$q.screen.width > 1600 ? 'col-xl-2' : 'col-xl-3'"
        :flat="$q.screen.sm || $q.screen.xs"
        color="white"
        text-color="faded"
      >
        <q-card-title
          class="q-py-sm"
          :class="{'bg-primary text-white': !$q.screen.sm && !$q.screen.xs, 'text-center q-pt-lg': $q.screen.sm, 'text-center q-pt-xl': $q.screen.xs}"
        >
          <span
            class="text-weight-medium"
            :class="$q.screen.sm || $q.screen.xs ? 'q-display-1' : 'q-title'"
          >{{$NodePackage.productName}}</span>
        </q-card-title>
        <q-card-main
          class="row"
          :class="$q.screen.xs ? 'q-mt-xl' : 'q-mt-sm'"
        >
          <q-field
            class="q-body-2 col-12 q-pa-sm"
            :error="$v.formulario.username.$error"
          >
            <q-input
              class="text-weight-regular"
              v-model="formulario.username"
              float-label="Usuário"
              color="primary"
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
            class="q-body-2 col-12 q-pa-sm"
            :error="$v.formulario.password.$error"
          >
            <q-input
              class="text-weight-regular"
              v-model="formulario.password"
              float-label="Senha"
              type="password"
              color="primary"
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
        <q-card-actions class="q-pa-md">
          <q-btn
            class="full-width"
            color="primary"
            label="Entrar"
            size="form"
            rounded
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
        maxLength: maxLength(30)
      },
      password: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(30)
      }
    }
  },
  methods: {
    Entrar () {
      this.$v.formulario.$touch()
      if (!this.$v.formulario.$error) {
        const formulario = JSON.parse(JSON.stringify(this.formulario))
        this.$axios.post('/usuarios/login', formulario).then((Res) => {
          this.$router.push({
            path: '/login/token',
            query: {
              accessToken: Res.data.id,
              usuarioId: Res.data.userId
            }
          })
        }).catch(this.AxiosCatch)
      }
    }
  }
}
</script>
