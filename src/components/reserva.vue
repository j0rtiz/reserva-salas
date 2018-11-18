<template>
  <q-card class="bg-primary">
    <q-card-title class="bg-primary text-white q-py-sm">
      <span class="uppercase text-weight-medium">{{id ? 'Editar' : 'Nova'}} reserva</span>
    </q-card-title>
    <q-card-main class="row bg-white">
      <q-field class="col-12 q-pa-sm q-pt-md" :error="$v.formulario.dtInicial.$error">
        <q-datetime float-label="Data inicial" type="datetime" minimal modal color="primary" format="DD/MM/YYYY - hh:mm" format24h format-model="date" :min="dtInicial" v-model="formulario.dtInicial" @blur="$v.formulario.dtInicial.$touch" />
        <div slot="helper" v-if="!$v.formulario.dtInicial.required && $v.formulario.dtInicial.$error">Campo obrigatório.</div>
      </q-field>
      <q-field class="col-12 q-pa-sm" :error="$v.formulario.dtFinal.$error">
        <q-datetime :disable="formulario.dtInicial ? false : true" float-label="Data final" type="datetime" minimal modal color="primary" format="DD/MM/YYYY - hh:mm" format24h format-model="date" :min="dtFinal" v-model="formulario.dtFinal" @blur="$v.formulario.dtFinal.$touch" />
        <div slot="helper" v-if="!$v.formulario.dtFinal.required && $v.formulario.dtFinal.$error">Campo obrigatório.</div>
      </q-field>
      <q-field class="col-12 q-pa-sm" :error="$v.formulario.nmEvento.$error">
        <q-input float-label="Evento" color="primary" clearable v-model="formulario.nmEvento" upper-case @blur="$v.formulario.nmEvento.$touch" />
        <div slot="helper" v-if="!$v.formulario.nmEvento.required && $v.formulario.nmEvento.$error">Campo obrigatório.</div>
        <div slot="helper" v-if="!$v.formulario.nmEvento.minLength && $v.formulario.nmEvento.$error">O nome do evento não pode conter menos que {{$v.formulario.nmEvento.$params.minLength.min}} caracteres.</div>
        <div slot="helper" v-if="!$v.formulario.nmEvento.maxLength && $v.formulario.nmEvento.$error">O nome do evento não pode conter mais que {{$v.formulario.nmEvento.$params.maxLength.max}} caracteres.</div>
      </q-field>
      <q-field class="col-12 q-pa-sm">
        <q-input float-label="Sala" color="primary" v-model="sala" readonly />
      </q-field>
    </q-card-main>
    <q-card-actions class="bg-white q-pt-lg" :align="$q.screen.sm || $q.screen.xs ? 'center' : 'end'">
      <q-btn class="full-width" color="primary" label="Salvar" icon="save" size="form" @click="Salvar(id)" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { date } from 'quasar'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
export default {
  name: 'Reserva',
  props: ['Card', 'modal'],
  data () {
    return {
      id: Number(this.$route.params.id),
      formulario: {
        dtPreReserva: Date.now(),
        dtInicial: '',
        dtFinal: '',
        nmEvento: '',
        inReserva: false,
        inPreReserva: true,
        salaId: this.Card.id,
        usuarioId: this.$store.state.session.id
      },
      sala: `${this.Card.nrSala} - ${this.Card.tiposala.tpSala}`.toUpperCase(),
      dtInicial: Date.now(),
      dtFinal: date.addToDate(Date.now(), { hours: 1 })
    }
  },
  validations: {
    formulario: {
      dtInicial: {
        required
      },
      dtFinal: {
        required
      },
      nmEvento: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(30)
      }
    }
  },
  watch: {
    modal (modal) {
      if (!modal) {
        this.formulario.dtInicial = ''
        this.formulario.dtFinal = ''
        this.formulario.nmEvento = ''
        this.formulario.salaId = ''
        this.$v.formulario.$reset()
      }
    }
  },
  methods: {
    Salvar (id) {
      this.$v.formulario.$touch()
      if (!this.$v.formulario.$error) {
        let formulario = JSON.parse(JSON.stringify(this.formulario))
        let salvar = id ? this.$axios.patch(`/reservas/${id}`, formulario) : this.$axios.post('/reservas', formulario)
        salvar.then(Res => {
          this.$q.notify({
            color: 'positive',
            timeout: 1000,
            message: 'Salvo com sucesso!'
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
