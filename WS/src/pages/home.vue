<template>
  <q-page class="row q-pa-sm bg-grey-4">
    {{filter.where}}
    <div :class="leftDrawer ? 'col-xs-12 col-sm-6 col-md-4 q-pa-md' : 'col-xs-12 col-sm-6 col-md-3 q-pa-md'" v-for="Card in CardPagination.Cards" :key="Card.id">
      <q-card class="bg-white q-pa-sm" style="height: 300px;">
        <!-- <q-card-media>
          <q-carousel v-if="Card.urlImagem.length" color="white" autoplay infinite arrows height="300px">
            <q-carousel-slide v-for="(imagem, index) in Card.urlImagem" :key="index" :img-src="`/api/containers/locais/download/${imagem}`" />
          </q-carousel>
          <img v-else :src="'statics/404image.png'">
        </q-card-media> -->
        <q-card-title class="bg-dark text-white uppercase">
          <strong>Livre</strong>
        </q-card-title>
        <q-card-main class="q-mt-md">
          <p>Sala:
            <strong>{{Card.nrSala}}</strong>
          </p>
          <p>Tipo:
            <strong>{{Card.tiposala.tpSala}}</strong>
          </p>
          <p>Andar:
            <strong>{{Card.pavimento.nmPav}}</strong>
          </p>
          <p>Capacidade:
            <strong>{{Card.nrCapacidade}}</strong>
          </p>
          <p>Equipamentos:
            <strong>{{Card.nmEquip.join(', ')}}</strong>
          </p>
        </q-card-main>
        <!-- <q-card-separator />
        <q-card-actions align="end">
          <q-btn color="dark" icon="edit" />
          <q-btn color="negative" icon="delete" />
        </q-card-actions> -->
      </q-card>
    </div>
    <!-- <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn round size="lg" color="dark" icon="add" />
    </q-page-sticky> -->
  </q-page>
</template>

<script>
import { CoreCardPaginationMixin } from '../mixins/CardPagination'
export default {
  name: 'PageHome',
  mixins: [CoreCardPaginationMixin],
  props: ['leftDrawer', 'filter'],
  data () {
    return {
      fields: ['id', 'nrCapacidade', 'nmEquip', 'nrSala', 'pavimentoId', 'tiposalaId'],
      include: [
        {
          relation: 'pavimento',
          scope: {
            fields: ['nmPav']
          }
        },
        {
          relation: 'tiposala',
          scope: {
            fields: ['tpSala']
          }
        }
      ]
    }
  },
  watch: {
    filter: {
      deep: true,
      handler (filter) {
        this.asyncReload('CardPagination')
      }
    }
  },
  asyncData: {
    CardPagination () {
      return new Promise((resolve, reject) => {
        let filter = JSON.parse(JSON.stringify(this.filter))
        filter.fields = this.fields
        filter.include = this.include
        if (!filter.where.pavimentoId.inq.length) {
          delete filter.where.pavimentoId
        }
        if (!filter.where.tiposalaId.inq.length) {
          delete filter.where.tiposalaId
        }
        if (!filter.where.id.inq.length) {
          delete filter.where.id
        }
        this.$axios.get('/salas', {
          params: {
            filter
          }
        }).then(Res => {
          this.CardPagination.Cards = Res.data
          resolve(this.CardPagination)
        })
      })
    }
  }
}
</script>
