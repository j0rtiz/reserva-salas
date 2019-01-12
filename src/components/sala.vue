<template>
  <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 q-pa-sm">
    <q-card
      :class="sala.status === 2 ? 'bordaVermelha non-selectable' : sala.status === 1 ? 'bordaAmarela non-selectable' : 'bordaVerde non-selectable'"
      color="light"
    >
      <q-card-title class="bg-light uppercase no-padding">
        <q-btn
          v-show="sala.status === 1"
          slot="right"
          flat
          round
          dense
          color="primary"
          icon="event_available"
          @click="AprovarReserva(reservaId)"
        />
        <q-btn
          v-show="sala.status === 1 || sala.status === 2"
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
          v-if="sala.status === 1 || sala.status === 2"
          no-border
        >
          <q-item
            class="q-px-none"
            dense
          >
            <q-item-side>
              <q-item-tile
                class="flex flex-center q-pl-md"
                icon
              >
                <img
                  v-if="sala.status === 2"
                  class="avatar-size"
                  src="../statics/images/Red-ball-48.png"
                >
                <img
                  v-else-if="sala.status === 1"
                  class="avatar-size"
                  src="../statics/images/Yellow-ball-48.png"
                >
                <img
                  v-else
                  class="avatar-size"
                  src="../statics/images/Green-ball-48.png"
                >
              </q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-item-tile label>
                <span
                  v-if="sala.status === 2"
                  class="text-primary q-subheading text-weight-bold"
                >Reservada</span>
                <span
                  v-else-if="sala.status === 1"
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
          <q-item
            class="q-px-none"
            dense
          >
            <q-item-side>
              <q-item-tile
                class="flex flex-center q-pl-md"
                icon
              >
                <img
                  class="avatar-size"
                  src="../statics/images/Green-ball-48.png"
                >
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
          {{sala.tpSala}}
        </p>
        <p>
          <strong>Andar:</strong>
          {{sala.nmPav}}
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
              <q-item-main
                class="q-body-1"
                :label="`&#10004; ${nmEquip}`"
              />
            </q-item>
          </q-list>
        </p>
        <p
          v-else
          class="no-margin q-pb-xs"
        />
      </q-card-main>
      <div
        v-if="sala.status === 1 || sala.status === 2"
        class="row bg-secondary"
      >
        <q-card-title
          class="col-6 bg-primary text-white text-center no-padding"
          style="border-radius: 0 0 0 5px"
        >
          <span class="q-body-1 text-weight-bold">{{dataInicial | FormatarData}}</span>
        </q-card-title>
        <q-card-title
          class="col-6 bg-secondary text-white text-center no-padding"
          style="border-radius: 0 0 5px 0"
        >
          <span class="q-body-1 text-weight-bold">{{dataFinal | FormatarData}}</span>
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
      dataInicial: '',
      dataFinal: ''
    }
  },
  filters: {
    FormatarData (data) {
      if (date.isValid(data)) {
        return `${date.formatDate(data, 'DD/MM/YYYY')} - ${date.formatDate(data, 'HH:mm')}h`
      }
    }
  },
  mounted () {
    this.VerificarReserva(this.sala)
  },
  watch: {
    sala: {
      deep: true,
      handler (sala) {
        this.VerificarReserva(sala)
      }
    }
  },
  methods: {
    VerificarReserva (sala) {
      if (sala.dataEvento) {
        sala.dataEvento.map(evento => {
          if (date.isBetweenDates(Date.now(), evento.dataInicial, evento.dataFinal, { inclusiveFrom: true, inclusiveTo: true })) {
            this.reservaId = sala.reservaId
            this.dataInicial = evento.dataInicial
            this.dataFinal = evento.dataFinal
          }
        })
      }
    },
    AprovarReserva (reservaId) {
      this.$axios.patch(`/reservas/${reservaId}`, {
        dataReserva: Date.now()
      }).then(Res => {
        this.$q.notify({
          type: 'positive',
          timeout: 1000,
          message: 'A reserva foi confirmada com sucesso!'
        })
        this.$emit('reserva')
      })
    },
    RemoverReserva (reservaId) {
      this.$axios.delete(`/reservas/${reservaId}`).then(Res => {
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
