<template>
  <div>
    <q-list
      class="no-padding"
      no-border
      separator
      link
    >
      <q-item
        class="q-pa-xs"
        dense
        v-for="(evento, index) in eventos"
        :key="index"
        @click.native="Eventos(evento)"
      >
        <q-item-main>
          <q-item
            class="no-padding"
            dense
          >
            <q-item-main
              class="q-caption text-weight-bold text-primary uppercase"
              label="Evento"
            />
          </q-item>
          <q-item
            class="q-px-none q-py-xs"
            dense
          >
            <q-item-main>
              <q-card
                color="blue-grey-2"
                text-color="primary"
              >
                <blockquote
                  style="border-radius: 3px 0 0 3px;"
                  class="q-body-1"
                >{{evento.nomeEvento}}</blockquote>
              </q-card>
            </q-item-main>
          </q-item>
          <q-item
            class="no-padding"
            dense
          >
            <q-item-main
              class="q-caption text-weight-bold text-primary uppercase q-pt-sm"
              label="Data"
            />
          </q-item>
          <q-item
            class="q-px-none q-py-xs"
            dense
            v-for="(data, index) in evento.dataEvento"
            :key="index"
          >
            <q-item-main>
              <q-card
                color="blue-grey-2"
                text-color="primary"
              >
                <blockquote
                  style="border-radius: 3px 0 0 3px;"
                  class="q-body-1"
                >
                  <q-icon
                    name="event"
                    color="primary"
                    size="20px"
                  />
                  {{data.dataInicial | FormatarData}}
                  <q-icon
                    name="remove"
                    color="primary"
                    size="12px"
                  />
                  {{data.dataFinal | FormatarData}}
                </blockquote>
              </q-card>
            </q-item-main>
          </q-item>
        </q-item-main>
      </q-item>
    </q-list>
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
  }
}
</script>
