<script setup lang="ts">
import { register as apiRegister } from '@/services/auth';
import { makeRefArray, getRefFromArray, setRefFromArray } from '@/services/ref-array';
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
        setErrorMessages(result as string[]);
    }
}

function setErrorMessages(list: string[]|string) {
    // reset the variants and messages
    for (let key of keys) {
        setRefFromArray(variants, key, '');
        setRefFromArray(messages, key, '');
    }

    // set the variants and messages according to recieved error
    if (typeof list == 'string') list = [list];

    for (let message of list) {
        let split = message.toLowerCase().split(' ');

        setRefFromArray(variants, split[0], 'danger');

        let currentVal = getRefFromArray(messages, split[0]);
        setRefFromArray(messages, split[0], 
            (currentVal ? currentVal + '; ' : '') + split.slice(1).join(' ')
        );
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
                <o-field label="Username (handle)" 
                    :variant="variants.handle" 
                    :message="messages.handle"
                >
                    <o-input 
                        name="handle" 
                        placeholder="your_handle_here" 
                        expanded
                        maxlength="30"
                        v-model="inputs.handle"
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
</style>