<template>
  <q-card color="primary">
    <q-card-title class="bg-primary text-white q-py-sm">
      <q-icon class="q-pr-sm" name="event" size="23px" />
      <span class="uppercase q-subheading text-weight-bold">Nova reserva</span>
    </q-card-title>
    <q-card-main class="row bg-light">
      <q-field class="col-12 q-pa-sm q-pt-md">
        <q-input float-label="Sala" color="primary" v-model="descSala" disable />
      </q-field>
      <q-field class="col-12 q-pa-sm" :error="$v.formulario.nmEvento.$error">
        <q-input float-label="Evento" color="primary" upper-case clearable v-model="formulario.nmEvento" @blur="$v.formulario.nmEvento.$touch" />
        <div slot="helper" v-if="!$v.formulario.nmEvento.required && $v.formulario.nmEvento.$error">Campo obrigatório.</div>
        <div slot="helper" v-if="!$v.formulario.nmEvento.minLength && $v.formulario.nmEvento.$error">O nome do evento não pode conter menos que {{$v.formulario.nmEvento.$params.minLength.min}} caracteres.</div>
        <div slot="helper" v-if="!$v.formulario.nmEvento.maxLength && $v.formulario.nmEvento.$error">O nome do evento não pode conter mais que {{$v.formulario.nmEvento.$params.maxLength.max}} caracteres.</div>
      </q-field>
      <q-field class="col-6 q-pa-sm" :error="$v.formulario.dtInicial.$error">
        <q-datetime float-label="Data inicial" type="datetime" minimal modal color="primary" format="DD/MM/YYYY - HH:mm" format24h format-model="date" :min="dtInicial" v-model="formulario.dtInicial" @blur="$v.formulario.dtInicial.$touch" />
        <div slot="helper" v-if="!$v.formulario.dtInicial.required && $v.formulario.dtInicial.$error">Campo obrigatório.</div>
      </q-field>
      <q-field class="col-6 q-pa-sm" :error="$v.formulario.dtFinal.$error">
        <q-datetime :disable="formulario.dtInicial ? false : true" float-label="Data final" type="datetime" minimal modal color="primary" format="DD/MM/YYYY - HH:mm" format24h format-model="date" :min="dtFinal" v-model="formulario.dtFinal" @blur="$v.formulario.dtFinal.$touch" @input="VerificarData(formulario.dtInicial, formulario.dtFinal, formulario.salaId)" />
        <div slot="helper" v-if="!$v.formulario.dtFinal.required && $v.formulario.dtFinal.$error">Campo obrigatório.</div>
      </q-field>
      <q-field class="col-6 q-pa-sm" :error="$v.recorrencia.$error">
        <q-select :disable="duracao < 3" float-label="Recorrência" radio color="primary" v-model="recorrencia" :options="listaRecorrencias" @blur="$v.recorrencia.$touch" />
        <div slot="helper" v-if="!$v.recorrencia.required && $v.recorrencia.$error">Campo obrigatório.</div>
      </q-field>
      <q-field class="col-6 q-pa-sm" :error="$v.dias.$error">
        <q-select :disable="recorrencia !== 1" float-label="Dias" toggle multiple color="primary" v-model="dias" :options="listaDias" @blur="$v.dias.$touch" />
        <div slot="helper" v-if="!$v.dias.required && $v.dias.$error">Campo obrigatório.</div>
      </q-field>
    </q-card-main>
    <q-card-actions class="bg-light q-pt-lg" align="center">
      <q-btn class="full-width" color="primary" label="Salvar" icon="save" size="form" @click="Salvar" />
    </q-card-actions>
  </q-card>
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
        dtPreReserva: Date.now(),
        dtInicial: '',
        dtFinal: '',
        nmEvento: '',
        inReserva: false,
        inPreReserva: true,
        salaId: this.sala.id,
        usuarioId: this.$store.state.session.id
      },
      dtInicial: Date.now(),
      dtFinal: '',
      descSala: `${this.sala.nrSala} - ${this.sala.tiposala.tpSala}`.toUpperCase(),
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
      dias: [],
      duracao: 0,
      listaDias: [],
      erroReserva: false
    }
  },
  validations: {
    formulario: {
      dtInicial: {
        required
      },
      dtFinal: {
        required: requiredIf(function () {
          return this.formulario.dtInicial
        })
      },
      nmEvento: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(30)
      }
    },
    recorrencia: {
      required: requiredIf(function () {
        return this.duracao > 2
      })
    },
    dias: {
      required: requiredIf(function () {
        return this.recorrencia === 1
      })
    }
  },
  watch: {
    sala (sala) {
      this.formulario.salaId = sala.id
      this.descSala = `${sala.nrSala} - ${sala.tiposala.tpSala}`.toUpperCase()
    },
    modal (modal) {
      this.dtInicial = Date.now()
      if (!modal) {
        this.formulario.dtInicial = ''
        this.formulario.dtFinal = ''
        this.formulario.nmEvento = ''
        this.formulario.salaId = ''
        this.recorrencia = ''
        this.dias = []
        this.$v.formulario.$reset()
        this.$v.recorrencia.$reset()
        this.$v.dias.$reset()
      }
    },
    'formulario.dtInicial' (dtInicial) {
      this.dtFinal = date.addToDate(dtInicial, { hours: 1 })
      if (dtInicial >= this.formulario.dtFinal) {
        this.formulario.dtFinal = ''
        this.$v.formulario.dtFinal.$reset()
      }
      this.$v.recorrencia.$reset()
      this.duracao = date.getDateDiff(this.formulario.dtFinal, dtInicial) + 1
    },
    'formulario.dtFinal' (dtFinal) {
      this.$v.recorrencia.$reset()
      this.duracao = date.getDateDiff(dtFinal, this.formulario.dtInicial) + 1
    },
    duracao (duracao) {
      duracao < 3 ? this.recorrencia = 0 : this.recorrencia = ''
      let condicao = duracao < 7 ? duracao : 7
      let dias = []
      for (let i = 0; i < condicao; i++) {
        dias.push({
          label: date.formatDate(date.addToDate(this.formulario.dtInicial, { days: i }), 'dddd').toUpperCase(),
          value: i
        })
      }
      this.listaDias = dias
    },
    recorrencia (recorrencia) {
      if (recorrencia) this.$v.dias.$reset()
    }
  },
  methods: {
    VerificarData (dtInicial, dtFinal, salaId) {
      if (!this.$v.formulario.$error) {
        this.$axios.get('/reservas', {
          params: {
            filter: {
              where: {
                and: [
                  {
                    or: [
                      {
                        dtInicial: {
                          between: [dtInicial, dtFinal]
                        }
                      },
                      {
                        dtFinal: {
                          between: [dtInicial, dtFinal]
                        }
                      }
                    ]
                  },
                  {
                    salaId: salaId
                  }
                ]
              }
            }
          }
        }).then(Res => {
          if (Res.data.length) {
            this.erroReserva = true
            this.$q.notify({
              type: 'negative',
              timeout: 1000,
              message: 'Data indisponível para esta sala!'
            })
          } else this.erroReserva = false
        })
      }
    },
    Salvar () {
      this.$v.formulario.$touch()
      this.$v.recorrencia.$touch()
      this.$v.dias.$touch()
      this.VerificarData(this.formulario.dtInicial, this.formulario.dtFinal, this.formulario.salaId)
      if (!this.$v.formulario.$error && !this.$v.recorrencia.$error && !this.$v.dias.$error && !this.erroReserva) {
        let formulario = JSON.parse(JSON.stringify(this.formulario))
        this.$axios.post('/reservas', formulario).then(Res => {
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
