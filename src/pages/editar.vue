<template>
  <q-page class="row flex-center fit bg-grey-4 q-pa-md">
    <q-card flat class="col-xl-6 col-lg-10 col-md-12 col-sm-12 col-xs-12 bg-grey-4" text-color="dark">
      <q-card-title class="q-mx-md">
        {{Boolean(Number(this.$route.params.id)) ? 'Editar' : 'Novo'}} cliente
      </q-card-title>
      <q-card-main class="row">
        <q-field class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-md" label="Nome" label-width="12" :error="$v.formulario.nome.$error">
          <q-input class="border-light text-dark" inverted-light color="white" clearable v-model="formulario.nome" @blur="$v.formulario.nome.$touch" />
          <div slot="helper" v-if="!$v.formulario.nome.required && $v.formulario.nome.$error">Campo obrigatório.</div>
          <div slot="helper" v-if="!$v.formulario.nome.minLength && $v.formulario.nome.$error">O nome não pode conter menos que {{$v.formulario.nome.$params.minLength.min}} caracteres.</div>
          <div slot="helper" v-if="!$v.formulario.nome.maxLength && $v.formulario.nome.$error">O nome não pode conter mais que {{$v.formulario.nome.$params.maxLength.max}} caracteres.</div>
        </q-field>

        <q-field class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-md" label="CPF" label-width="12" :error="$v.formulario.cpf.$error">
          <q-input class="border-light text-dark" inverted-light color="white" clearable v-model="formulario.cpf" @blur="$v.formulario.cpf.$touch" v-mask="['###.###.###-##']" />
          <div slot="helper" v-if="!$v.formulario.cpf.required && $v.formulario.cpf.$error">Campo obrigatório.</div>
          <div slot="helper" v-if="!$v.formulario.cpf.minLength && $v.formulario.cpf.$error">CPF inválido.</div>
        </q-field>

        <q-field class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-md" label="Telefone(s)" label-width="12" :error="$v.formulario.telefones.$error">
          <q-chips-input class="border-light text-dark" inverted-light color="white" add-icon="add" :chips-color="$v.formulario.telefones.$error ? 'white' : 'dark'" chips-bg-color="transparent" v-model="formulario.telefones" @blur="$v.formulario.telefones.$touch" @add="$v.formulario.telefones.$touch" v-mask="['(##) ####-####', '(##) #####-####']" />
          <div slot="helper" v-if="!$v.formulario.telefones.required && $v.formulario.telefones.$error">Campo obrigatório.</div>
          <div slot="helper" v-if="!$v.formulario.telefones.minLength && $v.formulario.telefones.$each.$error">Telefone inválido.</div>
        </q-field>

        <q-field class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-md" label="Endereço" label-width="12" :error="$v.formulario.endereco.$error">
          <q-input class="border-light text-dark" inverted-light color="white" clearable v-model="formulario.endereco" @blur="$v.formulario.endereco.$touch" />
          <div slot="helper" v-if="!$v.formulario.endereco.required && $v.formulario.endereco.$error">Campo obrigatório.</div>
          <div slot="helper" v-if="!$v.formulario.endereco.minLength && $v.formulario.endereco.$error">O endereço não pode conter menos que {{$v.formulario.nome.$params.minLength.min}} caracteres.</div>
          <div slot="helper" v-if="!$v.formulario.endereco.maxLength && $v.formulario.endereco.$error">O endereço não pode conter mais que {{$v.formulario.nome.$params.maxLength.max}} caracteres.</div>
        </q-field>

        <q-field class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-md" label="Bairro" label-width="12" :error="$v.formulario.bairro.$error">
          <q-input class="border-light text-dark" inverted-light color="white" clearable v-model="formulario.bairro" @blur="$v.formulario.bairro.$touch" />
          <div slot="helper" v-if="!$v.formulario.bairro.required && $v.formulario.bairro.$error">Campo obrigatório.</div>
          <div slot="helper" v-if="!$v.formulario.bairro.minLength && $v.formulario.bairro.$error">O bairro não pode conter menos que {{$v.formulario.bairro.$params.minLength.min}} caracteres.</div>
          <div slot="helper" v-if="!$v.formulario.bairro.maxLength && $v.formulario.bairro.$error">O bairro não pode conter mais que {{$v.formulario.bairro.$params.maxLength.max}} caracteres.</div>
        </q-field>

        <q-field class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-md" label="Cidade" label-width="12" :error="$v.formulario.cidade.$error">
          <q-input class="border-light text-dark" inverted-light color="white" clearable v-model="formulario.cidade" @blur="$v.formulario.cidade.$touch" />
          <div slot="helper" v-if="!$v.formulario.cidade.required && $v.formulario.cidade.$error">Campo obrigatório.</div>
          <div slot="helper" v-if="!$v.formulario.cidade.minLength && $v.formulario.cidade.$error">A cidade não pode conter menos que {{$v.formulario.cidade.$params.minLength.min}} caracteres.</div>
          <div slot="helper" v-if="!$v.formulario.cidade.maxLength && $v.formulario.cidade.$error">A cidade não pode conter mais que {{$v.formulario.cidade.$params.maxLength.max}} caracteres.</div>
        </q-field>

        <q-field class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-md" label="Origem do cliente" label-width="12" :error="$v.formulario.origemCliente.$error">
          <q-select class="border-light text-dark" inverted-light color="white" v-model="formulario.origemCliente" :options="origemClientes" @blur="$v.formulario.origemCliente.$touch" />
          <div slot="helper" v-if="!$v.formulario.origemCliente.required && $v.formulario.origemCliente.$error">Campo obrigatório.</div>
          <q-field v-if="formulario.origemCliente === 'Outro'" class="col-6 q-pt-sm" :error="$v.outraOrigemCliente.$error">
            <q-input class="border-light text-dark" inverted-light color="white" clearable v-model="outraOrigemCliente" @blur="$v.outraOrigemCliente.$touch" />
            <div slot="helper" v-if="!$v.outraOrigemCliente.required && $v.outraOrigemCliente.$error">Campo obrigatório.</div>
            <div slot="helper" v-if="!$v.outraOrigemCliente.minLength && $v.outraOrigemCliente.$error">A origem do cliente não pode conter menos que {{$v.outraOrigemCliente.$params.minLength.min}} caracteres.</div>
            <div slot="helper" v-if="!$v.outraOrigemCliente.maxLength && $v.outraOrigemCliente.$error">A origem do cliente não pode conter mais que {{$v.outraOrigemCliente.$params.maxLength.max}} caracteres.</div>
          </q-field>
        </q-field>

        <q-field class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-md" label="Situação" label-width="12" :error="$v.formulario.situacao.$error">
          <q-select class="border-light text-dark" inverted-light color="white" v-model="formulario.situacao" :options="situacoes" @blur="$v.formulario.situacao.$touch" />
          <div slot="helper" v-if="!$v.formulario.situacao.required && $v.formulario.situacao.$error">Campo obrigatório.</div>
          <q-field v-if="formulario.situacao === 'Outro'" class="col-6 q-pt-sm" :error="$v.outraSituacao.$error">
            <q-input class="border-light text-dark" inverted-light color="white" clearable v-model="outraSituacao" @blur="$v.outraSituacao.$touch" />
            <div slot="helper" v-if="!$v.outraSituacao.required && $v.outraSituacao.$error">Campo obrigatório.</div>
            <div slot="helper" v-if="!$v.outraSituacao.minLength && $v.outraSituacao.$error">A situação não pode conter menos que {{$v.outraSituacao.$params.minLength.min}} caracteres.</div>
            <div slot="helper" v-if="!$v.outraSituacao.maxLength && $v.outraSituacao.$error">A situação não pode conter mais que {{$v.outraSituacao.$params.maxLength.max}} caracteres.</div>
          </q-field>
        </q-field>
      </q-card-main>
      <q-card-actions align="end">
        <div class="q-pr-lg q-pb-lg">
          <q-btn color="dark" label="Salvar" icon="save" size="form-inverted" @click="Salvar" />
        </div>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
export default {
  name: 'Editar',
  data () {
    return {
      id: Number(this.$route.params.id) || 0,
      formulario: {
        nome: '',
        cpf: '',
        telefones: [],
        endereco: '',
        bairro: '',
        cidade: '',
        origemCliente: '',
        situacao: ''
      },
      outraSituacao: '',
      outraOrigemCliente: '',
      origemClientes: [
        {
          label: 'Venda externa',
          value: 'Venda externa'
        },
        {
          label: 'Indicação',
          value: 'Indicação'
        },
        {
          label: 'Facebook',
          value: 'Facebook'
        },
        {
          label: 'Outro',
          value: 'Outro'
        }
      ],
      situacoes: [
        {
          label: 'Ativo',
          value: 'Ativo'
        },
        {
          label: 'Inativo',
          value: 'Inativo'
        },
        {
          label: 'Inadimplente',
          value: 'Inadimplente'
        },
        {
          label: 'Outro',
          value: 'Outro'
        }
      ]
    }
  },
  validations: {
    formulario: {
      nome: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(50)
      },
      cpf: {
        required,
        minLength: minLength(14)
      },
      telefones: {
        required,
        $each: {
          required,
          minLength: minLength(14)
        }
      },
      endereco: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(50)
      },
      bairro: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(50)
      },
      cidade: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(50)
      },
      origemCliente: {
        required
      },
      situacao: {
        required
      }
    },
    outraSituacao: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(50)
    },
    outraOrigemCliente: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(50)
    }
  },
  mounted () {
    if (this.id > 0) {
      this.Cliente(this.id)
    }
  },
  methods: {
    Salvar () {
      this.$v.formulario.$touch()
      if (this.formulario.situacao === 'Outro') {
        this.$v.outraSituacao.$touch()
        if (!this.$v.outraSituacao.$error) {
          this.formulario.situacao = this.outraSituacao
        }
      }
      if (this.formulario.origemCliente === 'Outro') {
        this.$v.outraOrigemCliente.$touch()
        if (!this.$v.outraOrigemCliente.$error) {
          this.formulario.origemCliente = this.outraOrigemCliente
        }
      }
      if (this.$v.formulario.$error) {
        this.$q.notify({
          type: 'negative',
          timeout: 1000,
          message: 'O formulário contém erro(s)!'
        })
      } else {
        if (this.id > 0) {
          this.$axios.patch(`/clientes/${this.id}`, this.formulario).then(Res => {
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
        } else {
          this.$axios.post('/clientes', this.formulario).then(Res => {
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
    },
    Cliente (id) {
      this.$axios.get(`/clientes/${id}`).then(Res => {
        let cliente = Res.data
        delete cliente.id
        this.formulario = cliente
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
</script>
