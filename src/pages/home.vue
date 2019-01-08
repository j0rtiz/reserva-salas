<template>
  <q-page class="bg-blue-grey-2 q-pa-sm">
    <div class="row">
      <q-modal
        v-if="sala"
        content-classes="col-xl-4 col-lg-5 col-md-7 col-sm-8 col-xs-11 bg-primary"
        v-model="modal"
        minimized
        :content-css="{maxWidth: '91%', maxHeight: '91%'}"
      >
        <reserva
          :sala="sala"
          :modal="modal"
          @modal="Modal"
        />
      </q-modal>
    </div>
    <div class="row">
      <sala
        v-for="sala in Cards"
        :key="sala.id"
        :sala="sala"
        @sala="Reservar"
        @reserva="Salas"
      />
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
    Reservar (sala) {
      this.modal = !this.modal
      this.sala = sala
    },
    Modal () {
      this.modal = false
      this.Salas()
    },
    Salas () {
      let filter = JSON.parse(JSON.stringify(this.filter))
      if (!filter.where.tiposalaId.inq.length || filter.where.tiposalaId.inq[0] === '') {
        delete filter.where
      }
      this.$axios.get('/salas/listar', {
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
