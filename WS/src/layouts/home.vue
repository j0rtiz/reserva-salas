<template>
  <q-layout view="hhh lpr fff">
    <q-layout-header>
      <q-toolbar color="dark" text-color="light" class="row">
        <q-btn flat round dense icon="menu" @click="leftDrawer = !leftDrawer" />
        <q-toolbar-title>
          {{titulo}}
          <span slot="subtitle">
            {{subtitulo}}
          </span>
        </q-toolbar-title>
        <!-- <div :class="desktop ? 'col-md-2' : 'col-xs-5'">
          <q-search v-model="filter.where.nrSala.like" clearable inverted color="none" placeholder="Pesquisar" />
        </div> -->
        <!-- <perfilmini/> -->
      </q-toolbar>
    </q-layout-header>
    <q-layout-drawer side="left" v-model="leftDrawer">
      <q-scroll-area class="fit q-pa-sm">
        <q-list no-border>
          <q-item>
            <q-item-main>
              <q-select class="q-mb-lg" radio v-model="nmPav" color="dark" :options="lstNmPavs" placeholder="Pavimento" />
              <q-select class="q-mb-lg" v-if="nmPav" radio v-model="tpSala" color="dark" :options="lstTpSalas" :placeholder="lstTpSalas.length ? 'Tipo de sala' : 'Vazio'" />
              <q-select class="q-mb-lg" v-if="tpSala" radio v-model="nrCapacidade" color="dark" :options="lstNrCapacidades" :placeholder="lstNrCapacidades.length ? 'Capacidade' : 'Vazio'" />
              <q-select class="q-mb-lg" v-if="nrCapacidade" radio v-model="nmEquip" color="dark" :options="lstNmEquipamentos" :placeholder="lstNmEquipamentos.length ? 'Equipamentos' : 'Vazio'" />
              <q-select class="q-mb-lg" v-if="nmEquip" radio v-model="nrSala" color="dark" :options="lstNrSalas" :placeholder="lstNrSalas.length ? 'Sala' : 'Vazio'" />
            </q-item-main>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-layout-drawer>
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
// import perfilmini from '../components/perfilmini'
export default {
  name: 'LayoutHome',
  // components: { perfilmini },
  data () {
    return {
      desktop: this.$q.platform.is.desktop,
      titulo: (this.$q.platform.is.desktop) ? this.$NodePackage.author : 'Fatec SENAI',
      subtitulo: this.$NodePackage.productName,
      filter: {
        where: {
          pavimentoId: {
            inq: []
          },
          tiposalaId: {
            inq: []
          },
          id: {
            inq: []
          }
        }
      },
      Salas: [],
      lstNmPavs: [],
      lstTpSalas: [],
      lstNrCapacidades: [],
      lstNmEquipamentos: [],
      lstNrSalas: [],
      nmPav: '',
      tpSala: '',
      nrCapacidade: '',
      nmEquip: '',
      nrSala: '',
      leftDrawer: true
    }
  },
  watch: {
    'nmPav' (nmPav) {
      this.tpSala = ''
      this.nrCapacidade = ''
      this.nmEquip = ''
      this.nrSala = ''
      this.filter.where.pavimentoId.inq = []
      this.filter.where.pavimentoId.inq.push(nmPav)
      this.asyncReload('lstTpSalas')
    },
    'tpSala' (tpSala) {
      this.nrCapacidade = ''
      this.nmEquip = ''
      this.nrSala = ''
      this.filter.where.tiposalaId.inq = []
      this.filter.where.tiposalaId.inq.push(tpSala)
      this.asyncReload('lstNrCapacidades')
    },
    'nrCapacidade' (nrCapacidade) {
      this.nmEquip = ''
      this.nrSala = ''
      this.filter.where.id.inq = []
      this.filter.where.id.inq.push(nrCapacidade)
      this.asyncReload('lstNmEquipamentos')
    },
    'nmEquip' (nmEquip) {
      this.nrSala = ''
      this.filter.where.id.inq = []
      this.filter.where.id.inq.push(nmEquip)
      this.asyncReload('lstNrSalas')
    }
  },
  asyncData: {
    lstNmPavs () {
      return new Promise((resolve, reject) => {
        this.$axios.get('/pavimentos').then(Res => {
          resolve(Res.data.map(El => {
            return {
              label: El.nmPav,
              value: El.id
            }
          }))
        })
      })
    },
    lstTpSalas () {
      return new Promise((resolve, reject) => {
        if (this.nmPav > 0) {
          let filter = JSON.parse(JSON.stringify(this.filter))
          filter.fields = ['id', 'tpSala']
          delete filter.where.tiposalaId
          delete filter.where.id
          this.$axios.get('/tiposalas', {
            params: {
              filter
            }
          }).then(Res => {
            resolve(Res.data.map(El => {
              return {
                label: El.tpSala,
                value: El.id
              }
            }))
          })
        }
      })
    },
    lstNrCapacidades () {
      return new Promise((resolve, reject) => {
        if (this.tpSala > 0) {
          let filter = JSON.parse(JSON.stringify(this.filter))
          filter.fields = ['id', 'nrCapacidade']
          delete filter.where.id
          this.$axios.get('/salas', {
            params: {
              filter
            }
          }).then(Res => {
            resolve(Res.data.map(El => {
              return {
                label: String(El.nrCapacidade),
                value: El.id
              }
            }))
          })
        }
      })
    },
    lstNmEquipamentos () {
      return new Promise((resolve, reject) => {
        if (this.nrCapacidade > 0) {
          let filter = JSON.parse(JSON.stringify(this.filter))
          filter.fields = ['id', 'nmEquip']
          delete filter.where.pavimentoId
          delete filter.where.tiposalaId
          this.$axios.get('/salas', {
            params: {
              filter
            }
          }).then(Res => {
            resolve(Res.data.map(El => {
              return {
                label: El.nmEquip.join(', '),
                value: El.id
              }
            }))
          })
        }
      })
    },
    lstNrSalas () {
      return new Promise((resolve, reject) => {
        if (this.nmEquip > 0) {
          let filter = JSON.parse(JSON.stringify(this.filter))
          filter.fields = ['id', 'nrSala']
          delete filter.where.pavimentoId
          delete filter.where.tiposalaId
          this.$axios.get('/salas', {
            params: {
              filter
            }
          }).then(Res => {
            resolve(Res.data.map(El => {
              return {
                label: String(El.nrSala),
                value: El.id
              }
            }))
          })
        }
      })
    }
  }
}
</script>
