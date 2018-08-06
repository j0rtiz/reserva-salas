<template>
  <q-page class="bg-grey-4 flex flex-center">
    <q-card class="bg-white">
      <q-card-title align="center">
        <img src="statics/images/senai.png">
      </q-card-title>
      <q-card-main class="q-mx-md">
        <q-input class="q-mt-lg" v-model="Form.email" type="email" float-label="E-mail" color="faded" suffix="@senairs.org.br" autofocus />
        <q-input class="q-mt-lg" v-model="Form.senha" type="password" float-label="Senha" color="faded" />
      </q-card-main>
      <q-card-actions class="q-my-lg" align="around">
        <q-btn class="q-mb-sm" size="md" color="white" text-color="faded" label="Esqueceu a senha?" flat no-ripple no-caps/>
        <q-btn class="q-mb-sm" size="md" color="faded" label="Entrar" @click="$router.push('/painel')" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'PageLogin',
  data () {
    return {
      Form: {
        email: '',
        senha: ''
      }
    }
  }
}
</script>
