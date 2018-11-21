<template>
  <q-card color="primary">
    <q-card-title class="bg-primary text-white q-py-sm">
      <q-icon class="q-pr-sm" name="event" size="23px" />
      <span class="uppercase q-subheading text-weight-bold">{{id ? 'Editar' : 'Nova'}} reserva</span>
    </q-card-title>
    <q-card-main class="row bg-white">
      <q-field class="col-6 q-pa-sm" :error="$v.reserva.hInicial.$error">
        <q-datetime float-label="Hora inicial" type="time" minimal modal color="primary" format="HH:mm" format24h format-model="date" v-model="reserva.hInicial" @blur="$v.reserva.hInicial.$touch" />
        <div slot="helper" v-if="!$v.reserva.hInicial.required && $v.reserva.hInicial.$error">Campo obrigatório.</div>
      </q-field>
      <q-field class="col-6 q-pa-sm" :error="$v.reserva.hFinal.$error">
        <q-datetime :disable="reserva.hInicial ? false : true" float-label="Hora final" type="time" minimal modal color="primary" format="HH:mm" format24h format-model="date" :min="horaFinal" v-model="reserva.hFinal" @blur="$v.reserva.hFinal.$touch" />
        <div slot="helper" v-if="!$v.reserva.hFinal.required && $v.reserva.hFinal.$error">Campo obrigatório.</div>
      </q-field>
      <q-field :class="opcao ? 'col-6 q-pa-sm' : 'col-12 q-pa-sm'" :error="$v.reserva.dtInicial.$error">
        <q-datetime :disable="reserva.hFinal ? false : true" :float-label="opcao ? 'Data inicial' : 'Data'" type="date" minimal modal color="primary" format="DD/MM/YYYY" format24h format-model="date" :min="dataInicial" v-model="reserva.dtInicial" @blur="$v.reserva.dtInicial.$touch" />
        <div slot="helper" v-if="!$v.reserva.dtInicial.required && $v.reserva.dtInicial.$error">Campo obrigatório.</div>
      </q-field>
      <q-field v-if="opcao" class="col-6 q-pa-sm" :error="$v.reserva.dtFinal.$error">
        <q-datetime :disable="reserva.hFinal ? false : true" float-label="Data final" type="date" minimal modal color="primary" format="DD/MM/YYYY" format24h format-model="date" :min="dataFinal" v-model="reserva.dtFinal" @blur="$v.reserva.dtFinal.$touch" />
        <div slot="helper" v-if="!$v.reserva.dtFinal.required && $v.reserva.dtFinal.$error">Campo obrigatório.</div>
      </q-field>
      <q-field v-if="reserva.dtInicial" :class="reserva.hFinal ? 'col-12 q-px-sm' : 'col-12 q-px-sm q-pt-md'">
        <q-checkbox v-model="opcao" color="primary" label="Repetir evento" left-label style="color: #979797;" />
      </q-field>
      <q-field class="col-12 q-pa-sm" :error="$v.formulario.nmEvento.$error">
        <q-input float-label="Evento" color="primary" clearable v-model="formulario.nmEvento" upper-case @blur="$v.formulario.nmEvento.$touch" />
        <div slot="helper" v-if="!$v.formulario.nmEvento.required && $v.formulario.nmEvento.$error">Campo obrigatório.</div>
        <div slot="helper" v-if="!$v.formulario.nmEvento.minLength && $v.formulario.nmEvento.$error">O nome do evento não pode conter menos que {{$v.formulario.nmEvento.$params.minLength.min}} caracteres.</div>
        <div slot="helper" v-if="!$v.formulario.nmEvento.maxLength && $v.formulario.nmEvento.$error">O nome do evento não pode conter mais que {{$v.formulario.nmEvento.$params.maxLength.max}} caracteres.</div>
      </q-field>
      <q-field :class="formulario.nmEvento ? 'col-12 q-px-sm' : 'col-12 q-px-sm q-pt-lg'">
        <q-input float-label="Sala" color="primary" v-model="descSala" disable />
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
  props: ['sala', 'modal'],
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
        salaId: this.sala.id,
        usuarioId: this.$store.state.session.id
      },
      reserva: {
        hInicial: '',
        hFinal: '',
        dtInicial: '',
        dtFinal: ''
      },
      opcao: false,
      horaInicial: Date.now(),
      horaFinal: '',
      dataInicial: Date.now(),
      dataFinal: '',
      descSala: `${this.sala.nrSala} - ${this.sala.tiposala.tpSala}`.toUpperCase()
    }
  },
  validations: {
    formulario: {
      nmEvento: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(30)
      }
    },
    reserva: {
      hInicial: {
        required
      },
      hFinal: {
        required
      },
      dtInicial: {
        required
      },
      dtFinal: {
        required
      }
    }
  },
  watch: {
    sala (sala) {
      this.formulario.salaId = sala.id
      this.descSala = `${sala.nrSala} - ${sala.tiposala.tpSala}`.toUpperCase()
    },
    modal (modal) {
      if (!modal) {
        this.opcao = false
        this.reserva.hInicial = ''
        this.reserva.hFinal = ''
        this.reserva.dtInicial = ''
        this.reserva.dtFinal = ''
        this.formulario.nmEvento = ''
        this.formulario.salaId = ''
        this.$v.$reset()
      }
    },
    'reserva.hInicial' (hInicial) {
      this.horaFinal = date.addToDate(hInicial, { hours: 1 })
    },
    'reserva.dtInicial' (dtInicial) {
      this.dataFinal = date.addToDate(dtInicial, { days: 1 })
    }
  },
  methods: {
    Salvar (id) {
      this.$v.formulario.$touch()
      this.$v.reserva.$touch()
      if (!this.$v.formulario.$error && !this.$v.reserva.$error) {
        // this.formulario.dtInicial =
        let formulario = JSON.parse(JSON.stringify(this.formulario))
        let salvar = id ? this.$axios.patch(`/reservas/${id}`, formulario) : this.$axios.post('/reservas', formulario)
        salvar.then(Res => {
          this.$q.notify({
            type: 'positive',
            timeout: 1000,
            message: 'Salvo com sucesso!'
          })
          this.$emit('modal')
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
