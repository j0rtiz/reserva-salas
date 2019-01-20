<template>
  <div class="q-pa-xs">
    <q-tree
      :nodes="Nodes"
      node-key="label"
      accordion
    >
      <div
        slot="header-root"
        slot-scope="prop"
        class="row items-center"
      >
        <q-card
          color="blue-grey-2"
          text-color="primary"
        >
          <blockquote style="border-radius: 3px 0 0 3px;">
            <span class="q-subheading text-weight-bold text-primary text-no-wrap">{{ prop.node.label }}</span>
          </blockquote>
        </q-card>
      </div>
      <div
        slot="header-body"
        slot-scope="prop"
        class="row items-center"
      >
        <q-card
          class="cursor-pointer"
          color="blue-grey-2"
          text-color="primary"
          @click.native="Eventos(prop.node.reservaId)"
        >
          <blockquote style="border-radius: 3px 0 0 3px;">
            <q-icon
              :name="prop.node.icon"
              color="primary"
              size="18px"
              class="q-mr-xs"
            />
            <span class="q-caption text-weight-bold text-primary text-no-wrap">{{ prop.node.label }}</span>
          </blockquote>
        </q-card>
      </div>
    </q-tree>
  </div>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'Evento',
  props: ['eventos'],
  filters: {
    FormatarData (data) {
      if (date.isValid(data)) {
        return `${date.formatDate(data, 'DD/MM/YYYY')} - ${date.formatDate(data, 'HH:mm')}h`
      }
    }
  },
  methods: {
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
    },
    Eventos (evento) {
      this.$emit('modal')
      this.$q.actionSheet({
        title: evento.nomeEvento,
        grid: true,
        actions: [
          {
            label: 'Aprovar',
            color: 'positive',
            icon: 'event_available',
            handler: () => {
              this.AprovarReserva(evento.reservaId)
            }
          },
          {
            label: 'Remover',
            color: 'negative',
            icon: 'event_busy',
            handler: () => {
              this.RemoverReserva(evento.reservaId)
            }
          }
        ]
      })
    }
  },
  computed: {
    Nodes () {
      let nodes = []
      this.eventos.map((evento, index) => {
        nodes[index] = { label: evento.nomeEvento, header: 'root', children: [] }
        evento.dataEvento.map(reserva => {
          nodes[index].children.push({
            icon: 'event',
            label: `${date.formatDate(reserva.dataInicial, 'DD/MM/YYYY - HH:mm')}h - ${date.formatDate(reserva.dataFinal, 'DD/MM/YYYY - HH:mm')}h`,
            header: 'body',
            reservaId: evento.reservaId
          })
        })
      })
      return nodes
    }
  }
}
</script>
