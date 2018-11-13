<template>
  <q-page class="row bg-secondary" :class="$q.screen.sm || $q.screen.xs ? 'justify-between items-stretch' : 'flex-center fit'">
    <transition appear enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
      <q-card class="col-xl-6 col-lg-8 col-md-10 col-sm-12 col-xs-12 bg-white" :style="$q.screen.sm || $q.screen.xs ? 'border-radius: 0;' : ''">
        <q-card-title class="bg-primary text-white q-py-sm">
          <strong>{{id ? 'Editar' : 'Novo'}} usuário</strong>
        </q-card-title>
        <q-card-main class="row q-mt-sm">
          <q-field class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 q-pa-sm" label="Nome de usuário" label-width="12" :error="$v.formulario.username.$error">
            <q-input color="primary" clearable v-model="formulario.username" autofocus @blur="$v.formulario.username.$touch" />
            <div slot="helper" v-if="!$v.formulario.username.required && $v.formulario.username.$error">Campo obrigatório.</div>
            <div slot="helper" v-if="!$v.formulario.username.minLength">O nome de usuário não pode conter menos que {{$v.formulario.username.$params.minLength.min}} caracteres.</div>
            <div slot="helper" v-if="!$v.formulario.username.maxLength">O nome de usuário não pode conter mais que {{$v.formulario.username.$params.maxLength.max}} caracteres.</div>
          </q-field>
          <q-field class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 q-pa-sm" label="Telefone" label-width="12" :error="$v.formulario.phone.$error">
            <q-input color="primary" clearable v-model="formulario.phone" type="tel" @blur="$v.formulario.phone.$touch" v-mask="['(##) ####-####', '(##) #####-####']" />
            <div slot="helper" v-if="!$v.formulario.phone.required && $v.formulario.phone.$error">Campo obrigatório.</div>
            <div slot="helper" v-if="!$v.formulario.phone.minLength">O telefone não pode conter menos que {{$v.formulario.phone.$params.minLength.min}} caracteres.</div>
          </q-field>
          <q-field class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 q-pa-sm" label="E-mail" label-width="12" :error="$v.formulario.email.$error">
            <q-input color="primary" clearable v-model="formulario.email" type="email" @blur="$v.formulario.email.$touch" />
            <div slot="helper" v-if="!$v.formulario.email.email && $v.formulario.email.$error">E-mail inválido.</div>
          </q-field>
          <q-field class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 q-pa-sm" label="Senha" label-width="12" :error="$v.formulario.password.$error">
            <q-input color="primary" v-model="formulario.password" type="password" @blur="$v.formulario.password.$touch" />
            <div slot="helper" v-if="!$v.formulario.password.required && $v.formulario.password.$error">Campo obrigatório.</div>
            <div slot="helper" v-if="!$v.formulario.password.minLength">A senha não pode conter menos que {{$v.formulario.password.$params.minLength.min}} caracteres.</div>
            <div slot="helper" v-if="!$v.formulario.password.maxLength">A senha não pode conter mais que {{$v.formulario.password.$params.maxLength.max}} caracteres.</div>
          </q-field>
          <q-field class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 q-pa-sm" label="Confirmar senha" label-width="12" :error="$v.formulario.confirmacaoPassword.$error">
            <q-input color="primary" v-model="formulario.confirmacaoPassword" type="password" @blur="$v.formulario.confirmacaoPassword.$touch" />
            <div slot="helper" v-if="!$v.formulario.confirmacaoPassword.sameAsPassword && $v.formulario.confirmacaoPassword.$error">A senha têm que ser igual.</div>
          </q-field>
        </q-card-main>
        <q-card-actions class="q-mx-md q-mb-md" :align="$q.screen.sm || $q.screen.xs ? 'center' : 'end'">
          <q-btn class="full-width" color="primary" label="Salvar" icon="save" size="form" @click="Salvar(id)" />
        </q-card-actions>
      </q-card>
    </transition>
  </q-page>
</template>

<script>
import { required, minLength, maxLength, sameAs, requiredIf, email } from 'vuelidate/lib/validators'
export default {
  name: 'Usuario',
  data () {
    return {
      id: Number(this.$route.params.id),
      formulario: {
        username: '',
        phone: '',
        email: '',
        password: '',
        confirmacaoPassword: ''
      }
    }
  },
  validations: {
    formulario: {
      username: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(25)
      },
      phone: {
        required,
        minLength: minLength(14)
      },
      email: {
        required,
        email
      },
      password: {
        required: requiredIf(function () {
          return !this.id
        }),
        minLength: minLength(5),
        maxLength: maxLength(25)
      },
      confirmacaoPassword: {
        sameAsPassword: sameAs('password')
      }
    }
  },
  mounted () {
    this.$q.loading.show()
    this.Usuario(this.id)
  },
  methods: {
    Usuario (id) {
      if (id) {
        this.$axios.get(`/usuarios/${id}`).then(Res => {
          let usuario = Res.data
          delete usuario.id
          delete usuario.confirmacaoPassword
          this.formulario = usuario
        }).catch(Err => {
          let erro = Err.response.data.error.message.charAt(0).toUpperCase() + Err.response.data.error.message.substring(1)
          this.$q.notify({
            type: 'negative',
            timeout: 1000,
            message: erro
          })
        })
        this.$q.loading.hide()
      } else {
        this.$q.loading.hide()
      }
    },
    Salvar (id) {
      this.$v.formulario.$touch()
      if (!this.$v.formulario.$error) {
        let formulario = JSON.parse(JSON.stringify(this.formulario))
        const salvar = id ? this.$axios.patch(`/usuarios/${id}`, formulario) : this.$axios.post('/usuarios', formulario)
        salvar.then(Res => {
          this.$q.notify({
            type: 'positive',
            timeout: 1000,
            message: 'Salvo com sucesso!'
          })
          this.$router.push('/')
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
