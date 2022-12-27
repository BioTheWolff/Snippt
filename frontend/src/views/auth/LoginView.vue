<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login as apiLogin, userStore } from '@/services/auth';

const router = useRouter();

const log_in_text = ref("Log in");
const variant = ref("");
const message = ref("");

const email = ref("");
const password = ref("");

async function login() {
    const res = await apiLogin({ email: email.value, password: password.value });
    if (res) {
        router.push('/');
    } else {
        variant.value = "danger";
        message.value = "Email or password incorrect";
    }
}
</script>

<template>
    <form class="login-form" @submit.prevent="login()">
        <section>
            <o-field label="E-mail" :variant="variant" :message="message">
                <o-input
                    name="email"
                    type="email"
                    placeholder="your.email@gmail.com"
                    v-model="email"
                ></o-input>
            </o-field>
            
            <o-field label="Password" :variant="variant" :message="message">
                <o-input
                    name="password"
                    type="password"
                    placeholder="Type your password"
                    v-model="password"
                ></o-input>
            </o-field>
        </section>

        <section>
            <o-field>
                <o-input
                    name="submit"
                    type="submit"
                    v-model="log_in_text"
                ></o-input>
            </o-field>
        </section>
    </form>

    <div>
        <div>handle: {{ userStore.handle }}</div>
        <div>name: {{ userStore.display_name }}</div>
        <div>email: {{ userStore.email }}</div>
    </div>
</template>

<style scoped lang="sass">
.login-form
    section
        margin-bottom: 1.5em
</style>