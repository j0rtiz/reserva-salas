<template>
  <q-card class="non-selectable" color="light" style="border-top: 4px solid #39b54a; border-radius: 5px;">
    <q-card-title class="bg-light uppercase no-padding">
      <q-btn class="q-mr-sm" slot="right" flat round dense color="primary" icon="event" @click="$emit('sala', sala)" />
      <q-list v-if="sala.reservas.length" no-border>
        <q-item v-for="reserva in sala.reservas" :key="reserva.id" dense>
          <q-item-side>
            <q-item-tile avatar>
              <img v-if="reserva.inReserva && DataReserva(reserva.dtInicial, reserva.dtFinal)" src="../statics/images/Red-ball-48.png">
              <img v-else-if="reserva.inPreReserva && DataReserva(reserva.dtInicial, reserva.dtFinal)" src="../statics/images/Yellow-ball-48.png">
              <img v-else src="../statics/images/Green-ball-48.png">
            </q-item-tile>
          </q-item-side>
          <q-item-main>
            <q-item-tile label>
              <span v-if="reserva.inReserva && DataReserva(reserva.dtInicial, reserva.dtFinal)" class="text-primary q-subheading text-weight-bold">Reservada</span>
              <span v-else-if="reserva.inPreReserva && DataReserva(reserva.dtInicial, reserva.dtFinal)" class="text-primary q-subheading text-weight-bold">Pré reservada</span>
              <span v-else class="text-primary q-subheading text-weight-bold">Disponível</span>
            </q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>
      <q-list v-else no-border>
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
      <p v-if="sala.nmEquip.length" class="no-margin q-pb-sm">
        <strong>Equipamentos:</strong>
        <q-list dense no-border>
          <q-item v-for="nmEquip in sala.nmEquip" :key="nmEquip.id">
            <q-item-main :label="`&#10004; ${nmEquip}`" />
          </q-item>
        </q-list>
      </p>
      <p v-else class="no-margin q-pb-xs" />
    </q-card-main>
    <div v-if="DataReserva(reserva.dtInicial, reserva.dtFinal)" class="row bg-secondary" v-for="reserva in sala.reservas" :key="reserva.id">
      <q-card-title class="col-6 bg-primary text-white text-center uppercase no-padding" style="border-radius: 0 0 0 5px">
        <span class="q-body-1 text-weight-bold">
          {{reserva.dtInicial | FormataDataInicial}}<span class="lowercase">h</span>
        </span>
      </q-card-title>
      <q-card-title class="col-6 bg-secondary text-white text-center uppercase no-padding" style="border-radius: 0 0 5px 0">
        <span class="q-body-1 text-weight-bold">
          {{reserva.dtFinal | FormataDataFinal}}<span class="lowercase">h</span>
        </span>
      </q-card-title>
    </div>
  </q-card>
</template>

<script>
import reserva from '../components/reserva'
import { date } from 'quasar'
export default {
  name: 'Sala',
  components: { reserva },
  props: ['sala'],
  filters: {
    FormataDataInicial (dtInicial) {
      return `${date.formatDate(dtInicial, 'DD/MM/YYYY')} - ${date.formatDate(dtInicial, 'HH:mm')}`
    },
    FormataDataFinal (dtFinal) {
      return `${date.formatDate(dtFinal, 'DD/MM/YYYY')} - ${date.formatDate(dtFinal, 'HH:mm')}`
    }
  },
  methods: {
    DataReserva (dtInicial, dtFinal) {
      return date.isBetweenDates(Date.now(), dtInicial, dtFinal, { inclusiveFrom: true, inclusiveTo: true })
    }
  }
}
</script>
