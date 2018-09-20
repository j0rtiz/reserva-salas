<template>
  <q-layout view="hhh lpr fff">
    <q-layout-header>
      <q-toolbar color="dark" text-color="white" class="row">
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
              <q-field label="Filtro" label-width="12">
                <q-select class="q-my-lg" radio v-model="tpSala" color="dark" :options="lstTpSalas" placeholder="Tipo de sala" />
                <q-select class="q-my-lg" v-if="tpSala" radio v-model="nrCapacidade" color="dark" :options="lstNrCapacidades" :placeholder="lstNrCapacidades.length ? 'Capacidade' : 'Vazio'" />
                <q-select class="q-my-lg" v-if="nrCapacidade" radio v-model="nmEquip" color="dark" :options="lstNmEquipamentos" :placeholder="lstNmEquipamentos.length ? 'Equipamentos' : 'Vazio'" />
                <q-select class="q-my-lg" v-if="nmEquip" radio v-model="nrSala" color="dark" :options="lstNrSalas" :placeholder="lstNrSalas.length ? 'Sala' : 'Vazio'" />
              </q-field>
            </q-item-main>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-layout-drawer>
    <q-page-container>
      <router-view :filter="filter" :leftDrawer="leftDrawer" />
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
      titulo: this.$q.platform.is.desktop ? this.$NodePackage.author : 'Fatec SENAI',
      subtitulo: this.$NodePackage.productName,
      filter: {
        where: {
          tiposalaId: {
            inq: []
          }
        }
      },
      lstSalas: [],
      lstTpSalas: [],
      lstNrCapacidades: [],
      lstNmEquipamentos: [],
      lstNrSalas: [],
      tpSala: '',
      nrCapacidade: '',
      nmEquip: '',
      nrSala: '',
      leftDrawer: true
    }
  },
  watch: {
    'tpSala' (tpSala) {
      this.nrCapacidade = ''
      this.nmEquip = ''
      this.nrSala = ''
      this.lstSalas = []
      this.lstNrCapacidades = []
      this.lstNmEquipamentos = []
      this.lstNrSalas = []
      this.filter.where.tiposalaId.inq = []
      this.filter.where.tiposalaId.inq.push(tpSala)
      this.asyncReload('lstSalas')
    }
  },
  asyncData: {
    lstTpSalas () {
      return new Promise((resolve, reject) => {
        this.$axios.get('/tiposalas').then(Res => {
          resolve(Res.data.map(El => {
            return {
              label: El.tpSala,
              value: El.id
            }
          }))
        })
      })
    },
    lstSalas () {
      return new Promise((resolve, reject) => {
        if (this.tpSala > 0) {
          let filter = JSON.parse(JSON.stringify(this.filter))
          this.$axios.get('/salas', {
            params: {
              filter
            }
          }).then(Res => {
            Res.data.forEach(sala => {
              this.lstNrSalas = Res.data.map(El => {
                return {
                  label: String(El.nrSala),
                  value: El.id
                }
              })
              this.lstNrCapacidades = Res.data.map(El => {
                return {
                  label: String(El.nrCapacidade),
                  value: El.id
                }
              })
              this.lstNmEquipamentos = Res.data.map(El => {
                return {
                  label: El.nmEquip.join(', '),
                  value: El.id
                }
              })
            })
            resolve(Res.data)
          })
        }
      })
    }
  }
}
</script>
