<template>
  <div class="zoom">
    <q-btn
      class="no-shadow perfilmini"
      flat
      round
      dense
      no-ripple
    >
      <q-modal
        v-model="modal"
        minimized
        no-esc-dismiss
        no-backdrop-dismiss
      >
        <q-card
          class="non-selectable"
          flat
        >
          <q-card-main class="text-center">
            <div class="q-display-1 text-weight-medium">{{$NodePackage.productName}}</div>
            <q-chip
              class="text-weight-medium q-mb-lg"
              color="red-4"
              text-color="white"
              small
              tag
            >Versão: {{$NodePackage.version}}</q-chip>
            <div class="q-body-1 text-justify text-faded q-px-sm">
              <p class="no-margin">
                <span class="text-weight-bold ">{{$NodePackage.productName}}</span>
                <span class="lowercase"> é um software de código aberto, para gerenciamento de reserva de salas.</span>
              </p>
            </div>
          </q-card-main>
          <q-card-actions>
            <q-btn
              class="full-width primary-dark"
              color="primary"
              label="Ok"
              v-close-overlay
            />
          </q-card-actions>
        </q-card>
      </q-modal>
      <img
        v-if="$store.state.session.avatar"
        class="avatar-header"
        round
        :src="$store.state.session.avatar"
      >
      <q-btn
        v-else
        class="no-shadow"
        round
        dense
        no-ripple
      >
        <strong class="q-title text-weight-bold">{{$store.state.session.username.substring(0,1).toUpperCase()}}</strong>
      </q-btn>
      <q-popover
        self="bottom right"
        anchor="top right"
        :offset="[0, 3]"
      >
        <q-list
          class="text-primary"
          style="width: 300px;"
        >
          <q-item class="q-subheading text-weight-medium text-dark q-mb-sm">
            <q-item-side
              v-if="$store.state.session.avatar"
              :avatar="$store.state.session.avatar"
            />
            <q-item-side v-else>
              <q-btn
                class="primary-dark no-shadow q-mr-sm"
                size="xl"
                color="primary"
                round
                dense
                no-ripple
                :to="`/usuario/${$store.state.session.id}`"
              >
                <strong class="q-title text-weight-medium">{{$store.state.session.username.substring(0,1).toUpperCase()}}</strong>
              </q-btn>
            </q-item-side>
            <q-item-main>
              <q-item-tile label>{{$store.state.session.username}}</q-item-tile>
              <q-item-tile
                class="q-caption q-pt-xs"
                sublabel
              >{{$store.state.session.phone}}</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item
            class="q-body-1"
            dense
            :to="`/usuario/${$store.state.session.id}`"
          >
            <q-item-main label="Meu perfil" />
            <q-item-side
              right
              icon="keyboard_arrow_right"
              color="primary"
            />
          </q-item>
          <q-item
            class="q-body-1"
            dense
            link
            @click.native="modal = true"
          >
            <q-item-main label="Sobre" />
            <q-item-side
              right
              icon="keyboard_arrow_right"
              color="primary"
            />
          </q-item>
          <q-item
            class="q-mt-sm"
            dense
          >
            <q-item-main label="" />
            <q-item-side
              right
              icon="exit_to_app"
              color="primary"
              @click.native="$router.push('/login/logout')"
            />
          </q-item>
        </q-list>
      </q-popover>
    </q-btn>
  </div>
</template>

<script>
export default {
  data () {
    return {
      modal: false
    }
  }
}
</script>
