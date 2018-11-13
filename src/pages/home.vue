<template>
  <q-page class="row q-pa-sm bg-light">
    <div :class="leftDrawer ? 'col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 q-pa-sm' : 'col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 q-pa-sm'" v-for="Card in Cards" :key="Card.id">
      <q-card class="bg-white">
        <q-card-title class="bg-secondary text-tertiary uppercase q-pa-none">
          <q-btn class="q-mr-sm" slot="right" flat round dense color="tertiary" icon="event" to="/reserva/0" />
          <q-list v-if="Card.reservas.length" no-border>
            <q-item v-for="reserva in Card.reservas" :key="reserva.id" dense>
              <strong>
                {{reserva.dtInicial}}
                <br />
                {{reserva.dtFinal}}
              </strong>
              <q-item-side>
                <q-item-tile avatar>
                  <img v-if="reserva.inReserva" src="../statics/images/Red-ball-48.png">
                  <img v-else-if="reserva.inPreReserva" src="../statics/images/Yellow-ball-48.png">
                </q-item-tile>
              </q-item-side>
              <q-item-main>
                <q-item-tile label>
                  <strong v-if="reserva.inReserva">Reservada</strong>
                  <strong v-else-if="reserva.inPreReserva">Pré reservada</strong>
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
                  <strong>Disponível</strong>
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
    <!-- <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn round size="lg" color="dark" icon="add" />
    </q-page-sticky> -->
  </q-page>
</template>

<script>
import { CardsMixin } from '../mixins/Cards'
export default {
  name: 'PageHome',
  mixins: [CardsMixin],
  props: ['leftDrawer', 'filter'],
  data () {
    return {
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
