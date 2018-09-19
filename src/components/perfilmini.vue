<template>
  <q-btn flat>
    <q-popover self="top left">
      <q-card>
        <q-card-main>
          <q-item>
            <q-item-side v-if="$store.state.session.avatar">
              <img class="avatar" round :src="$store.state.session.avatar">
              </q-item-side>
            <q-item-side v-else inverted color="secondary" :letter="$store.state.session.username.substring(0,1).toUpperCase()" />

            <q-item-main>
              <q-item-tile label v-html="$store.state.session.username" />
              <q-item-tile sublabel v-html="$store.state.session.email" />
            </q-item-main>
          </q-item>
        </q-card-main>

        <q-card-actions align="around">
          <q-btn flat round dense icon="face" color="primary" :to="`/Usuarios/Editar/${$store.state.session.id}`" />
          <q-btn flat round dense icon="exit to app" to="/Login/Logout" />
        </q-card-actions>
      </q-card>
    </q-popover>
    <img v-if="$store.state.session.avatar" :src="$store.state.session.avatar" class="avatar-header" round>
    <q-item-side v-else inverted color="secondary" :letter="$store.state.session.username.substring(0,1).toUpperCase()" />
  </q-btn>
</template>
