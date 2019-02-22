<template>
  <div>
    <q-card color="primary">
      <q-card-title class="bg-primary text-white q-py-sm">
        <q-icon
          class="q-pr-sm"
          name="event"
          size="23px"
        />
        <span class="q-subheading text-weight-bold uppercase">Nova reserva</span>
      </q-card-title>
      <q-card-main class="row bg-light">
        <q-field class="col-12 q-pa-sm q-pt-md">
          <q-input
            float-label="Sala"
            color="primary"
            v-model="descricaoSala"
            disable
          />
        </q-field>
        <q-field
          class="col-12 q-pa-sm"
          :error="$v.formulario.nomeEvento.$error"
        >
          <q-input
            float-label="Evento"
            color="primary"
            upper-case
            clearable
            v-model="formulario.nomeEvento"
            @blur="$v.formulario.nomeEvento.$touch"
          />
          <div
            slot="helper"
            v-if="!$v.formulario.nomeEvento.required && $v.formulario.nomeEvento.$error"
          >Campo obrigatório.</div>
          <div
            slot="helper"
            v-if="!$v.formulario.nomeEvento.minLength && $v.formulario.nomeEvento.$error"
          >O nome do evento não pode conter menos que {{$v.formulario.nomeEvento.$params.minLength.min}} caracteres.</div>
          <div
            slot="helper"
            v-if="!$v.formulario.nomeEvento.maxLength && $v.formulario.nomeEvento.$error"
          >O nome do evento não pode conter mais que {{$v.formulario.nomeEvento.$params.maxLength.max}} caracteres.</div>
        </q-field>
        <q-field
          class="col-6 q-pa-sm"
          :error="$v.formulario.dataInicial.$error"
        >
          <q-datetime
            float-label="Data inicial"
            type="datetime"
            minimal
            modal
            color="primary"
            format="DD/MM/YYYY - HH:mm"
            format24h
            format-model="date"
            :min="inicial"
            v-model="formulario.dataInicial"
            @blur="$v.formulario.dataInicial.$touch"
          />
          <div
            slot="helper"
            v-if="!$v.formulario.dataInicial.required && $v.formulario.dataInicial.$error"
          >Campo obrigatório.</div>
        </q-field>
        <q-field
          class="col-6 q-pa-sm"
          :error="$v.formulario.dataFinal.$error"
        >
          <q-datetime
            :disable="formulario.dataInicial ? false : true"
            float-label="Data final"
            type="datetime"
            minimal
            modal
            color="primary"
            format="DD/MM/YYYY - HH:mm"
            format24h
            format-model="date"
            :min="final"
            v-model="formulario.dataFinal"
            @blur="$v.formulario.dataFinal.$touch"
            @input="VerificarData(formulario.salaId, formulario.dataInicial, formulario.dataFinal)"
          />
          <div
            slot="helper"
            v-if="!$v.formulario.dataFinal.required && $v.formulario.dataFinal.$error"
          >Campo obrigatório.</div>
        </q-field>
        <q-field
          class="col-6 q-pa-sm"
          :error="$v.recorrencia.$error"
        >
          <q-select
            :disable="duracao < 3"
            float-label="Recorrência"
            radio
            color="primary"
            v-model="recorrencia"
            :options="listaRecorrencias"
            @blur="$v.recorrencia.$touch"
          />
          <div
            slot="helper"
            v-if="!$v.recorrencia.required && $v.recorrencia.$error"
          >Campo obrigatório.</div>
        </q-field>
        <q-field
          class="col-6 q-pa-sm"
          :error="$v.formulario.recorrencia.$error"
        >
          <q-select
            :disable="recorrencia !== 1"
            float-label="Dias"
            toggle
            multiple
            color="primary"
            v-model="formulario.recorrencia"
            :options="listaDias"
            @blur="$v.formulario.recorrencia.$touch"
          />
          <div
            slot="helper"
            v-if="!$v.formulario.recorrencia.required && $v.formulario.recorrencia.$error"
          >Campo obrigatório.</div>
        </q-field>
      </q-card-main>
      <q-card-actions
        class="bg-light q-pt-lg"
        align="center"
      >
        <q-btn
          class="full-width"
          color="primary"
          label="Salvar"
          icon="save"
          size="form"
          @click="Salvar"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { date } from 'quasar'
import { required, requiredIf, minLength, maxLength } from 'vuelidate/lib/validators'
export default {
  name: 'Reserva',
  props: ['sala', 'modal'],
  data () {
    return {
      formulario: {
        usuarioId: this.$store.state.session.id,
        salaId: this.sala.id,
        nomeEvento: '',
        dataInicial: '',
        dataFinal: '',
        recorrencia: []
      },
      descricaoSala: `${this.sala.nrSala} - ${this.sala.tpSala}`.toUpperCase(),
      inicial: Date.now(),
      final: '',
      duracao: 0,
      recorrencia: '',
      listaRecorrencias: [
        {
          label: 'DIARIAMENTE',
          value: 0
        },
        {
          label: 'SEMANALMENTE',
          value: 1
        }
      ],
      listaDias: [],
      erroReserva: false
    }
  },
  validations: {
    formulario: {
      nomeEvento: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(30)
      },
      dataInicial: {
        required
      },
      dataFinal: {
        required: requiredIf(function () {
          return this.formulario.dataInicial
        })
      },
      recorrencia: {
        required: requiredIf(function () {
          return this.recorrencia === 1
        })
      }
    },
    recorrencia: {
      required: requiredIf(function () {
        return this.duracao > 2
      })
    }
  },
  watch: {
    sala (sala) {
      this.formulario.salaId = sala.id
    },
    modal (modal) {
      this.Resetar()
      if (modal) {
        this.descricaoSala = `${this.sala.nrSala} - ${this.sala.tpSala}`.toUpperCase()
        this.inicial = Date.now()
      }
    },
    'formulario.dataInicial' (dataInicial) {
      this.final = date.addToDate(dataInicial, { hours: 1 })
      if (this.final >= this.formulario.dataFinal) {
        this.formulario.dataFinal = ''
        this.$v.formulario.dataFinal.$reset()
      }
      this.duracao = date.getDateDiff(this.formulario.dataFinal, dataInicial) + 1
      this.$v.recorrencia.$reset()
    },
    'formulario.dataFinal' (dataFinal) {
      this.duracao = date.getDateDiff(dataFinal, this.formulario.dataInicial) + 1
      this.$v.recorrencia.$reset()
    },
    duracao (duracao) {
      duracao < 3 ? this.recorrencia = 0 : this.recorrencia = ''
      this.Dias(duracao, this.formulario.dataInicial)
    },
    recorrencia () {
      this.formulario.recorrencia = []
      this.$v.formulario.recorrencia.$reset()
    }
  },
  methods: {
    Dias (duracao, dataInicial) {
      let condicao = duracao < 7 ? duracao : 7
      let dias = []
      for (let i = 0; i < condicao; i++) {
        dias.push({
          label: date.formatDate(date.addToDate(dataInicial, { days: i }), 'dddd').toUpperCase(),
          value: Number(date.formatDate(date.addToDate(dataInicial, { days: i }), 'd'))
        })
      }
      this.listaDias = dias
    },
    Resetar () {
      this.formulario.nomeEvento = ''
      this.formulario.dataInicial = ''
      this.formulario.dataFinal = ''
      this.formulario.recorrencia = []
      this.recorrencia = ''
      this.$v.$reset()
    },
    VerificarData (salaId, dataInicial, dataFinal) {
      if (!this.$v.formulario.$error) {
        this.$axios.get('/reservas/verificar', {
          params: {
            salaId,
            dataInicial,
            dataFinal
          }
        }).then(Res => {
          this.erroReserva = Res.data.erroReserva
          if (Res.data.erroHora) this.$q.notify(Res.data.erroHora)
          if (Res.data.erroData) this.$q.notify(Res.data.erroData)
        })
      }
    },
    Salvar () {
      this.$v.formulario.$touch()
      this.$v.recorrencia.$touch()
      this.VerificarData(this.formulario.salaId, this.formulario.dataInicial, this.formulario.dataFinal)
      if (!this.$v.formulario.$error && !this.$v.recorrencia.$error && !this.erroReserva) {
        let formulario = JSON.parse(JSON.stringify(this.formulario))
        this.$axios.post('/reservas/salvar', formulario).then(Res => {
          this.$q.notify({
            type: 'positive',
            message: Res.data
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
