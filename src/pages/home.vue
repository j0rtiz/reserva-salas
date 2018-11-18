<template>
  <q-page class="row q-pa-sm bg-blue-grey-2">
    <q-modal v-if="Card" v-model="modal" content-classes="col-3 bg-primary">
      <reserva :Card="Card" :modal="modal" @modal="Modal" />
    </q-modal>
    <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 q-pa-sm" v-for="Card in Cards" :key="Card.id">
      <q-card class="non-selectable" color="white" style="border-top: 4px solid #39b54a; border-radius: 5px;">
        <q-card-title class="bg-light uppercase no-padding">
          <q-btn class="q-mr-sm" slot="right" flat round dense color="primary" icon="event" @click="Reserva(Card)" />
          <q-list v-if="Card.reservas.length" no-border>
            <q-item v-if="DataReserva(reserva.dtInicial, reserva.dtFinal)" v-for="reserva in Card.reservas" :key="reserva.id" dense>
              <q-item-side>
                <q-item-tile avatar>
                  <img v-if="reserva.inReserva" src="../statics/images/Red-ball-48.png">
                  <img v-else-if="reserva.inPreReserva" src="../statics/images/Yellow-ball-48.png">
                </q-item-tile>
              </q-item-side>
              <q-item-main>
                <q-item-tile label>
                  <span v-if="reserva.inReserva" class="text-primary q-subheading text-weight-bold">Reservada</span>
                  <span v-else-if="reserva.inPreReserva" class="text-primary q-subheading text-weight-bold">Pré reservada</span>
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
                  <span class="text-tertiary q-subheading text-weight-bold">Disponível</span>
                </q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-card-title>
        <q-card-separator class="bg-grey-4" />
        <q-card-main class="text-primary q-pb-none">
          <p>
            <strong>Sala:</strong>
            {{Card.nrSala}}
          </p>
          <p>
            <strong>Tipo:</strong>
            {{Card.tiposala.tpSala}}
          </p>
          <p>
            <strong>Andar:</strong>
            {{Card.pavimento.nmPav}}
          </p>
          <p>
            <strong>Capacidade:</strong>
            {{Card.nrCapacidade}}
          </p>
          <p class="q-mb-sm">
            <strong>Equipamentos:</strong>
            <q-list dense no-border>
              <q-item v-for="nmEquip in Card.nmEquip" :key="nmEquip.id">
                <q-item-main :label="`&#10004; ${nmEquip}`" />
              </q-item>
            </q-list>
          </p>
        </q-card-main>
        <q-card-separator class="bg-grey-4" />
        <q-card-title class="uppercase no-padding">
          <div v-if="DataReserva(reserva.dtInicial, reserva.dtFinal)" class="row text-center q-body-1" v-for="reserva in Card.reservas" :key="reserva.id">
            <strong class="col-6 bg-primary text-white">
              {{reserva.dtInicial | FormataDataInicial}}<span class="lowercase">h</span>
            </strong>
            <strong class="col-6 bg-secondary text-white">
              {{reserva.dtFinal | FormataDataFinal}}<span class="lowercase">h</span>
            </strong>
          </div>
        </q-card-title>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { CardsMixin } from '../mixins/Cards'
import reserva from '../components/reserva'
import { date } from 'quasar'
export default {
  name: 'PageHome',
  mixins: [CardsMixin],
  components: { reserva },
  props: ['leftDrawer', 'filter'],
  data () {
    return {
      modal: false,
      Card: null
    }
  },
  watch: {
    filter: {
      deep: true,
      handler (filter) {
        this.asyncReload('Cards')
      }
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
  methods: {
    DataReserva (dtInicial, dtFinal) {
      return date.isBetweenDates(Date.now(), dtInicial, dtFinal, { inclusiveFrom: true, inclusiveTo: true })
    },
    Modal () {
      this.modal = false
    },
    Reserva (Card) {
      this.modal = !this.modal
      this.Card = Card
    }
  },
  asyncData: {
    Cards () {
      return new Promise((resolve, reject) => {
        let filter = JSON.parse(JSON.stringify(this.filter))
        filter.include = [{ relation: 'pavimento' }, { relation: 'tiposala' }, { relation: 'reservas' }]
        filter.order = 'nrSala ASC'
        if (!filter.where.tiposalaId.inq.length || filter.where.tiposalaId.inq[0] === '') {
          delete filter.where
        }
        this.$axios.get('/salas', {
          params: {
            filter
          }
        }).then(Res => {
          this.Cards = Res.data
          resolve(this.Cards)
        })
      })
    }
  }
}
</script>
