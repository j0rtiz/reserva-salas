<template>
  <q-page>
    <transition appear enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
      <q-card class="bg-white" :style="$q.screen.sm || $q.screen.xs ? 'border-radius: 0;' : ''">
        <q-card-title class="bg-secondary text-white text-center q-py-sm">
          <span class="uppercase text-weight-medium">{{id ? 'Editar' : 'Nova'}} reserva</span>
        </q-card-title>
        <q-card-main class="row">
          <q-field class="col-12 q-pa-sm" :error="$v.formulario.dtInicial.$error">
            <q-datetime float-label="Data inicial" type="datetime" minimal modal color="primary" format="DD/MM/YYYY - hh:mm" format24h format-model="date" v-model="formulario.dtInicial" @blur="$v.formulario.dtInicial.$touch" />
            <div slot="helper" v-if="!$v.formulario.dtInicial.required && $v.formulario.dtInicial.$error">Campo obrigatório.</div>
          </q-field>
          <q-field class="col-12 q-pa-sm" :error="$v.formulario.dtFinal.$error">
            <q-datetime :disable="formulario.dtInicial ? false : true" float-label="Data final" type="datetime" minimal modal color="primary" format="DD/MM/YYYY - hh:mm" format24h format-model="date" :min="dataMin" v-model="formulario.dtFinal" @blur="$v.formulario.dtFinal.$touch" />
            <div slot="helper" v-if="!$v.formulario.dtFinal.required && $v.formulario.dtFinal.$error">Campo obrigatório.</div>
          </q-field>
          <q-field class="col-12 q-pa-sm" :error="$v.formulario.nmEvento.$error">
            <q-input float-label="Evento" color="primary" clearable v-model="formulario.nmEvento" upper-case @blur="$v.formulario.nmEvento.$touch" />
            <div slot="helper" v-if="!$v.formulario.nmEvento.required && $v.formulario.nmEvento.$error">Campo obrigatório.</div>
            <div slot="helper" v-if="!$v.formulario.nmEvento.minLength && $v.formulario.nmEvento.$error">O nome do evento não pode conter menos que {{$v.formulario.nmEvento.$params.minLength.min}} caracteres.</div>
            <div slot="helper" v-if="!$v.formulario.nmEvento.maxLength && $v.formulario.nmEvento.$error">O nome do evento não pode conter mais que {{$v.formulario.nmEvento.$params.maxLength.max}} caracteres.</div>
          </q-field>
          <q-field class="col-12 q-pa-sm" :error="$v.formulario.salaId.$error">
            <q-select float-label="Sala" color="primary" v-model="formulario.salaId" :options="listaSalas" @blur="$v.formulario.salaId.$touch" />
            <div slot="helper" v-if="!$v.formulario.salaId.required && $v.formulario.salaId.$error">Campo obrigatório.</div>
          </q-field>
        </q-card-main>
        <q-card-actions class="q-pt-xl" :align="$q.screen.sm || $q.screen.xs ? 'center' : 'end'">
          <q-btn class="full-width" color="secondary" label="Salvar" icon="save" size="form" @click="Salvar(id)" />
        </q-card-actions>
      </q-card>
    </transition>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
export default {
  name: 'Reserva',
  data () {
    return {
      id: Number(this.$route.params.id),
      formulario: {
        dtReserva: Date.now(),
        dtPreReserva: Date.now(),
        dtInicial: '',
        dtFinal: '',
        nmEvento: '',
        inReserva: true,
        inPreReserva: false,
        salaId: '',
        usuarioId: this.$store.state.session.id
      },
      dataMin: '',
      listaSalas: []
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
      },
      salaId: {
        required
      }
    }
  },
  mounted () {
    this.$q.loading.show()
    this.Salas()
  },
  watch: {
    'formulario.dtInicial' (dtInicial) {
      this.dataMin = date.addToDate(dtInicial, { days: 1 })
    }
  },
  methods: {
    Salas () {
      this.$axios.get('/salas', {
        params: {
          filter: {
            include: {
              relation: 'tiposala'
            }
          }
        }
      }).then(Res => {
        this.listaSalas = []
        Res.data.forEach(sala => {
          this.listaSalas.push({
            label: `${sala.nrSala} - ${sala.tiposala.tpSala}`,
            value: sala.id
          })
        })
        this.$q.loading.hide()
      }).catch(Err => {
        let erro = Err.response.data.error.message.charAt(0).toUpperCase() + Err.response.data.error.message.substring(1)
        this.$q.notify({
          color: 'negative',
          timeout: 1000,
          message: erro
        })
      })
    },
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
