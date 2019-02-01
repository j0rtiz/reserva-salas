<template>
  <q-page class="row flex-center fit bg-blue-grey-2 q-pa-sm">
    <div class="col-xl-6 col-lg-8 col-md-10 col-sm-12 col-xs-12">
      <q-card color="white">
        <q-card-title class="bg-primary text-white q-py-sm">
          <span>{{id ? 'Editar' : 'Novo'}} usuário</span>
        </q-card-title>
        <q-card-main class="row">
          <q-field
            class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 q-px-sm q-pt-md"
            label="Nome de usuário"
            label-width="12"
            :error="$v.formulario.username.$error"
          >
            <q-input
              v-model="formulario.username"
              color="primary"
              clearable
              autofocus
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
            class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 q-px-sm q-pt-md"
            label="Telefone"
            label-width="12"
            :error="$v.formulario.phone.$error"
          >
            <q-input
              v-model="formulario.phone"
              color="primary"
              clearable
              type="tel"
              v-mask="['(##) ####-####', '(##) #####-####']"
              @blur="$v.formulario.phone.$touch"
            />
            <div
              slot="helper"
              v-if="!$v.formulario.phone.required && $v.formulario.phone.$error"
            >Campo obrigatório.</div>
            <div
              slot="helper"
              v-if="!$v.formulario.phone.minLength"
            >O telefone não pode conter menos que {{$v.formulario.phone.$params.minLength.min}} caracteres.</div>
          </q-field>
          <q-field
            class="col-12 q-px-sm q-pt-md"
            label="E-mail"
            label-width="12"
            :error="$v.formulario.email.$error"
          >
            <q-input
              v-model="formulario.email"
              color="primary"
              clearable
              type="email"
              @blur="$v.formulario.email.$touch"
            />
            <div
              slot="helper"
              v-if="!$v.formulario.email.required && $v.formulario.email.$error"
            >Campo obrigatório.</div>
            <div
              slot="helper"
              v-if="!$v.formulario.email.email && $v.formulario.email.$error"
            >E-mail inválido.</div>
          </q-field>
          <q-field
            class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 q-px-sm q-pt-md"
            label="Senha"
            label-width="12"
            :error="$v.formulario.password.$error"
          >
            <q-input
              v-model="formulario.password"
              color="primary"
              type="password"
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
          <q-field
            class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 q-px-sm q-pt-md"
            label="Confirmar senha"
            label-width="12"
            :error="$v.formulario.confirmacaoPassword.$error"
          >
            <q-input
              v-model="formulario.confirmacaoPassword"
              color="primary"
              type="password"
              @blur="$v.formulario.confirmacaoPassword.$touch"
            />
            <div
              slot="helper"
              v-if="!$v.formulario.confirmacaoPassword.sameAsPassword && $v.formulario.confirmacaoPassword.$error"
            >A senha têm que ser igual.</div>
          </q-field>
        </q-card-main>
        <q-card-actions class="q-pa-md">
          <q-btn
            class="full-width"
            color="primary"
            label="Salvar"
            icon="save"
            size="form"
            @click="Salvar(id)"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { required, minLength, maxLength, sameAs, requiredIf, email } from 'vuelidate/lib/validators'
export default {
  name: 'Usuario',
  data () {
    return {
      id: Number(this.$route.params.id),
      usuarioId: this.$store.state.session.id,
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
        maxLength: maxLength(30)
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
        maxLength: maxLength(30)
      },
      confirmacaoPassword: {
        sameAsPassword: sameAs('password')
      }
    }
  },
  mounted () {
    this.$q.loading.show()
    this.Usuario(this.usuarioId, this.id)
  },
  methods: {
    Usuario (usuarioId, id) {
      if (usuarioId === id) {
        this.$axios.get(`/usuarios/${id}`).then(Res => {
          let formulario = Res.data
          let regex = formulario.phone.length === 11 ? /(\d{2})(\d{5})(\d{4})$/ : /(\d{2})(\d{4})(\d{4})$/
          formulario.phone = formulario.phone.replace(regex, '($1) $2-$3')
          this.formulario = formulario
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
        this.$router.push('/')
      }
    },
    Salvar (id) {
      this.$v.formulario.$touch()
      if (!this.$v.formulario.$error) {
        let formulario = JSON.parse(JSON.stringify(this.formulario))
        formulario.phone = formulario.phone.replace(/[() -]/g, '')
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
