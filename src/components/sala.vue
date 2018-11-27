<template>
  <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 q-pa-sm">
    <q-card
      :class="inReserva ? 'bordaVermelha non-selectable' : inPreReserva ? 'bordaAmarela non-selectable' : 'bordaVerde non-selectable'"
      color="light"
    >
      <q-card-title class="bg-light uppercase no-padding">
        <q-btn
          v-show="inPreReserva"
          slot="right"
          flat
          round
          dense
          color="primary"
          icon="event_available"
          @click="AprovarReserva(reservaId)"
        />
        <q-btn
          v-show="inPreReserva || inReserva"
          slot="right"
          flat
          round
          dense
          color="primary"
          icon="event_busy"
          @click="RemoverReserva(reservaId)"
        />
        <q-btn
          class="q-mr-sm"
          slot="right"
          flat
          round
          dense
          color="primary"
          icon="event"
          @click="$emit('sala', sala)"
        />
        <q-list
          v-if="sala.reservas.length"
          no-border
        >
          <q-item dense>
            <q-item-side>
              <q-item-tile avatar>
                <img
                  v-if="inReserva"
                  src="../statics/images/Red-ball-48.png"
                >
                <img
                  v-else-if="inPreReserva"
                  src="../statics/images/Yellow-ball-48.png"
                >
                <img
                  v-else
                  src="../statics/images/Green-ball-48.png"
                >
              </q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-item-tile label>
                <span
                  v-if="inReserva"
                  class="text-primary q-subheading text-weight-bold"
                >Reservada</span>
                <span
                  v-else-if="inPreReserva"
                  class="text-primary q-subheading text-weight-bold"
                >Pré reservada</span>
                <span
                  v-else
                  class="text-primary q-subheading text-weight-bold"
                >Disponível</span>
              </q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
        <q-list
          v-else
          no-border
        >
          <q-item dense>
            <q-item-side>
              <q-item-tile avatar>
                <img src="../statics/images/Green-ball-48.png">
              </q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-item-tile label>
                <span class="text-primary q-subheading text-weight-bold">Disponível</span>
              </q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
      </q-card-title>
      <q-card-separator class="bg-grey-4" />
      <q-card-main class="bg-white text-primary q-pb-none">
        <p>
          <strong>Sala:</strong>
          {{sala.nrSala}}
        </p>
        <p>
          <strong>Tipo:</strong>
          {{sala.tiposala.tpSala}}
        </p>
        <p>
          <strong>Andar:</strong>
          {{sala.pavimento.nmPav}}
        </p>
        <p>
          <strong>Capacidade:</strong>
          {{sala.nrCapacidade}}
        </p>
        <p
          v-if="sala.nmEquip.length"
          class="no-margin q-pb-sm"
        >
          <strong>Equipamentos:</strong>
          <q-list
            dense
            no-border
          >
            <q-item
              v-for="nmEquip in sala.nmEquip"
              :key="nmEquip.id"
            >
              <q-item-main :label="`&#10004; ${nmEquip}`" />
            </q-item>
          </q-list>
        </p>
        <p
          v-else
          class="no-margin q-pb-xs"
        />
      </q-card-main>
      <div
        v-if="inReserva || inPreReserva"
        class="row bg-secondary"
      >
        <q-card-title
          class="col-6 bg-primary text-white text-center uppercase no-padding"
          style="border-radius: 0 0 0 5px"
        >
          <span class="q-body-1 text-weight-bold">
            {{dtInicial | FormataDataInicial}}<span class="lowercase">h</span>
          </span>
        </q-card-title>
        <q-card-title
          class="col-6 bg-secondary text-white text-center uppercase no-padding"
          style="border-radius: 0 0 5px 0"
        >
          <span class="q-body-1 text-weight-bold">
            {{dtFinal | FormataDataFinal}}<span class="lowercase">h</span>
          </span>
        </q-card-title>
      </div>
    </q-card>
  </div>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'Sala',
  props: ['sala'],
  data () {
    return {
      reservaId: '',
      inReserva: false,
      inPreReserva: false,
      dtInicial: '',
      dtFinal: ''
    }
  },
  filters: {
    FormataDataInicial (dtInicial) {
      return `${date.formatDate(dtInicial, 'DD/MM/YYYY')} - ${date.formatDate(dtInicial, 'HH:mm')}`
    },
    FormataDataFinal (dtFinal) {
      return `${date.formatDate(dtFinal, 'DD/MM/YYYY')} - ${date.formatDate(dtFinal, 'HH:mm')}`
    }
  },
  watch: {
    sala: {
      deep: true,
      handler (sala) {
        this.VerificarReserva(sala)
      }
    }
  },
  mounted () {
    this.VerificarReserva(this.sala)
  },
  methods: {
    VerificarReserva (sala) {
      let dtInicial = []
      let dtFinal = []
      sala.reservas.forEach(reserva => {
        reserva.datas.forEach(data => {
          dtInicial.push(new Date(data.dtInicial))
          dtFinal.push(new Date(data.dtFinal))
        })
        if (date.isBetweenDates(date.formatDate(Date.now(), 'YYYY-MM-DD'), date.formatDate(date.getMinDate(...dtInicial), 'YYYY-MM-DD'), date.formatDate(date.getMinDate(...dtFinal), 'YYYY-MM-DD'), { inclusiveFrom: true, inclusiveTo: true }) && reserva.inReserva) {
          this.inReserva = true
          this.dtInicial = date.formatDate(date.getMinDate(...dtInicial), 'YYYY-MM-DD')
          this.dtFinal = date.formatDate(date.getMinDate(...dtFinal), 'YYYY-MM-DD')
          this.reservaId = reserva.id
        } else if (date.isBetweenDates(date.formatDate(Date.now(), 'YYYY-MM-DD'), date.formatDate(date.getMinDate(...dtInicial), 'YYYY-MM-DD'), date.formatDate(date.getMinDate(...dtFinal), 'YYYY-MM-DD'), { inclusiveFrom: true, inclusiveTo: true }) && reserva.inPreReserva) {
          this.inPreReserva = true
          this.dtInicial = date.formatDate(date.getMinDate(...dtInicial), 'YYYY-MM-DD')
          this.dtFinal = date.formatDate(date.getMinDate(...dtFinal), 'YYYY-MM-DD')
          this.reservaId = reserva.id
        }
      })
    },
    AprovarReserva (id) {
      this.$axios.patch(`/reservas/${id}`, {
        dtReserva: Date.now(),
        inReserva: true,
        inPreReserva: false
      }).then(Res => {
        this.inReserva = true
        this.inPreReserva = false
        this.$q.notify({
          type: 'positive',
          timeout: 1000,
          message: 'A reserva foi confirmada com sucesso!'
        })
        this.$emit('reserva')
      })
    },
    RemoverReserva (id) {
      this.$axios.delete(`/reservas/${id}`).then(Res => {
        this.inReserva = false
        this.inPreReserva = false
        this.$q.notify({
          type: 'positive',
          timeout: 1000,
          message: 'A reserva foi removida com sucesso!'
        })
        this.$emit('reserva')
      })
    }
  }
}
</script>
