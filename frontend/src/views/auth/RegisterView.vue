<script setup lang="ts">
import { register as apiRegister } from '@/services/auth';
import { makeRefArray, getRefFromArray, setErrorMessages } from '@/services/ref-array';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const register_text = ref("Register");

const keys = ['handle', 'display_name', 'email', 'password', 'password_confirm'];
const inputs = makeRefArray(keys);
const variants = makeRefArray(keys);
const messages = makeRefArray(keys);


async function register() {
    const result = await apiRegister({
        handle: getRefFromArray(inputs, 'handle'),
        display_name: getRefFromArray(inputs, 'display_name'),
        email: getRefFromArray(inputs, 'email'),
        password: getRefFromArray(inputs, 'password'),
        password_confirm: getRefFromArray(inputs, 'password_confirm'),
    })

    if (result === true) {
        router.push('/');
    } else {
        setErrorMessages(keys, variants, messages, result as string[]);
    }
}
</script>

<template>
    <form class="register-form" @submit.prevent="register()">
        <section class="split">
            <o-tooltip 
                position="bottom"
                label="Should only contain alphanumerical characters, underscores and dashes"
            >
                <o-field label="Handle" 
                    :variant="variants.handle" 
                    :message="messages.handle"
                >
                    <o-input 
                        name="handle" 
                        placeholder="your_handle_here" 
                        expanded
                        maxlength="30"
                        v-model="inputs.handle"
                        required
                    ></o-input>
                </o-field>
            </o-tooltip>

            <o-field label="Display name" 
                :variant="variants.display_name" 
                :message="messages.display_name"
            >
                <o-input 
                    name="name" 
                    placeholder="Your Display Name" 
                    expanded
                    maxlength="30"
                    v-model="inputs.display_name"
                    required
                ></o-input>
            </o-field>
        </section>

        <section>
            <o-field label="E-mail" 
                :variant="variants.email" 
                :message="messages.email"
            >
                <o-input
                    name="email"
                    type="email"
                    placeholder="your.email@gmail.com"
                    maxlength="80"
                    v-model="inputs.email"
                    required
                ></o-input>
            </o-field>
            
            <o-field label="Password" 
                :variant="variants.password" 
                :message="messages.password"
            >
                <o-input
                    name="password"
                    type="password"
                    placeholder="Type your password"
                    v-model="inputs.password"
                    required
                ></o-input>
            </o-field>

            <o-field label="Password confirmation" 
                :variant="variants.password_confirm" 
                :message="messages.password_confirm"
            >
                <o-input
                    name="password_confirm"
                    type="password"
                    placeholder="Confirm your password"
                    v-model="inputs.password_confirm"
                    required
                ></o-input>
            </o-field>
        </section>

        <section>
            <o-field>
                <o-input
                    name="submit"
                    type="submit"
                    v-model="register_text"
                ></o-input>
            </o-field>
        </section>
    </form>
</template>

<style scoped lang="sass">
.register-form
    section
        margin-bottom: 1.5em

        &.split
            display: flex
            gap: 1em

            *
                flex-grow: 1

    @include for-up-to-tablet
        width: 95%
        margin: 0 2.5%
</style>