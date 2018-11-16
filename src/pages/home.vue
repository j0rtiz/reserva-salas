<template>
  <q-page class="row q-pa-sm bg-blue-grey-2">
    <q-modal v-model="reserva" minimized>
      <reserva />
    </q-modal>
    <div class="col-4 q-pa-sm" v-for="Card in Cards" :key="Card.id">
      <q-card class="bg-white">
        <q-card-title class="bg-secondary text-tertiary uppercase q-pa-none">
          <q-btn class="q-mr-sm" slot="right" flat round dense color="tertiary" icon="event" @click="reserva = !reserva" />
          <q-list v-if="Card.reservas.length" no-border>
            <q-item v-for="reserva in Card.reservas" :key="reserva.id" dense>
              <q-item-side>
                <q-item-tile avatar>
                  <img v-if="reserva.inReserva && DataReserva(reserva.dtInicial, reserva.dtFinal)" src="../statics/images/Red-ball-48.png">
                  <img v-else-if="reserva.inPreReserva && DataReserva(reserva.dtInicial, reserva.dtFinal)" src="../statics/images/Yellow-ball-48.png">
                </q-item-tile>
              </q-item-side>
              <q-item-main>
                <q-item-tile label>
                  <span v-if="reserva.inReserva && DataReserva(reserva.dtInicial, reserva.dtFinal)" class="text-tertiary q-subheading text-weight-bold">Reservada</span>
                  <span v-else-if="reserva.inPreReserva && DataReserva(reserva.dtInicial, reserva.dtFinal)" class="text-tertiary q-subheading text-weight-bold">Pré reservada</span>
                </q-item-tile>
                <q-item-tile class="text-no-wrap no-margin" sublabel>
                  <span class="text-tertiary q-caption">{{reserva.dtInicial, reserva.dtFinal | FormataData}}</span>
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
        <q-card-main class="q-mt-md text-tertiary">
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
          <p>
            <strong>Equipamentos:</strong>
            <q-list no-border>
              <q-item v-for="nmEquip in Card.nmEquip" :key="nmEquip.id" dense>
                <q-item-main :label="'&#10004; ' + nmEquip" />
              </q-item>
            </q-list>
          </p>
        </q-card-main>
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
      reserva: false,
      include: [
        {
          relation: 'pavimento'
        },
        {
          relation: 'tiposala'
        },
        {
          relation: 'reservas'
        }
      ]
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
    FormataData (dtInicial, dtFinal) {
      return `de ${date.formatDate(dtInicial, 'DD/MM/YYYY')} - ${date.formatDate(dtInicial, 'hh:mm')}h até ${date.formatDate(dtFinal, 'DD/MM/YYYY')} - ${date.formatDate(dtFinal, 'hh:mm')}h`
    }
  },
  methods: {
    DataReserva (dtInicial, dtFinal) {
      return date.isBetweenDates(Date.now(), dtInicial, dtFinal, { inclusiveFrom: true, inclusiveTo: true })
    }
  },
  asyncData: {
    Cards () {
      return new Promise((resolve, reject) => {
        let filter = JSON.parse(JSON.stringify(this.filter))
        filter.include = this.include
        if (!filter.where.tiposalaId.inq.length || filter.where.tiposalaId.inq[0] === '') {
          delete filter.where.tiposalaId
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
