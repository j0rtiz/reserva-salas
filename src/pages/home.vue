<template>
  <q-page class="row q-pa-sm bg-blue-grey-2">
    <q-modal v-if="sala" v-model="modal" content-classes="col-4 bg-primary">
      <reserva :sala="sala" :modal="modal" @modal="Modal" />
    </q-modal>
    <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 q-pa-sm" v-for="sala in Cards" :key="sala.id">
      <sala :sala="sala" @sala="Reservar" />
    </div>
  </q-page>
</template>

<script>
import { CardsMixin } from '../mixins/Cards'
import sala from '../components/sala'
import reserva from '../components/reserva'
export default {
  name: 'Home',
  mixins: [CardsMixin],
  components: { sala, reserva },
  props: ['leftDrawer', 'filter'],
  data () {
    return {
      modal: false,
      sala: null
    }
  },
  watch: {
    filter: {
      deep: true,
      handler (filter) {
        this.Salas()
      }
    }
  },
  mounted () {
    this.Salas()
  },
  methods: {
    Modal () {
      this.modal = false
      this.Salas()
    },
    Reservar (sala) {
      this.modal = !this.modal
      this.sala = sala
    },
    Salas () {
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
      })
    }
  }
}
</script>
