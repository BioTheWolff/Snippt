<script setup lang="ts">
import { getRefFromArray, makeRefArray, setErrorMessages, setRefFromArray, setSuccessMessages } from '@/services/ref-array';
import { updateEmail as apiUpdateEmail, updateDetails as apiUpdateDetails, updatePassword as apiUpdatePassword } from '@/services/users';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';

const props = defineProps({
    handle: String,
    loading: {
        type: Boolean,
        default: false,
    }
})

const currentUser = useUserStore();
const admin_editing = !(currentUser.handle === props.handle);
const submit_text = ref("Update");

const keys = ['handle', 'display_name', 'email', 'password', 'new_password', 'new_password_confirm'];
const inputs = makeRefArray(keys);
const variants = makeRefArray(keys);
const messages = makeRefArray(keys);

async function updateEmail() {
    const result = await apiUpdateEmail(currentUser.handle, { 
        email: getRefFromArray(inputs, 'email') 
    });

    if (result === true) {
        setSuccessMessages(['email'], variants, messages);
    } else {
        setErrorMessages(['email'], variants, messages, result as string[]);
    }
}

async function updateDetails() {
    const result = await apiUpdateDetails(currentUser.handle, { 
        handle: getRefFromArray(inputs, 'handle'),
        display_name: getRefFromArray(inputs, 'display_name'), 
    });

    if (result === true) {
        setSuccessMessages(['handle', 'display_name'], variants, messages);
    } else {
        setErrorMessages(['handle', 'display_name'], variants, messages, result as string[]);
    }
}

async function updatePassword() {
    const _keys = ['password', 'new_password', 'new_password_confirm'];
    const result = await apiUpdatePassword(currentUser.handle, { 
        password: getRefFromArray(inputs, 'password'),
        new_password: getRefFromArray(inputs, 'new_password'), 
        new_password_confirm: getRefFromArray(inputs, 'new_password_confirm'), 
    });

    if (result === true) {
        setSuccessMessages(_keys, variants, messages);
    } else {
        setErrorMessages(_keys, variants, messages, result as string[]);
    }
}

if (!admin_editing) {
    setRefFromArray(inputs, 'handle', currentUser.handle);
    setRefFromArray(inputs, 'display_name', currentUser.display_name);
    setRefFromArray(inputs, 'email', currentUser.email);
}

</script>

<template>
    <div class="user-settings">
        <form class="s-form" @submit.prevent="updateDetails()">
            <h2>Public Details</h2>

            <section class="split">
                <o-tooltip 
                    position="bottom"
                    label="Should only contain alphanumerical characters, underscores and dashes"
                >
                    <o-field 
                        label="Username (handle)"
                        :variant="variants.handle"
                        :message="messages.handle"
                    >
                        <o-input 
                            name="handle" 
                            v-model.trim="inputs.handle"
                            placeholder="your_handle_here" 
                            expanded
                            required
                        ></o-input>
                    </o-field>
                </o-tooltip>

                <o-field 
                    label="Display name"
                    :variant="variants.display_name"
                    :message="messages.display_name"
                >
                    <o-input 
                        name="name" 
                        v-model.trim="inputs.display_name"
                        placeholder="Your Display Name" 
                        expanded
                        required
                    ></o-input>
                </o-field>
            </section>

            <section>
                <o-input
                    name="submit"
                    v-model="submit_text"
                    type="submit"
                ></o-input>
            </section>
        </form>

        <form class="s-form" @submit.prevent="updateEmail()">
            <h2>E-mail</h2>

            <section>
                <o-field 
                    label="E-mail"
                    :variant="variants.email"
                    :message="messages.email"
                >
                    <o-input
                        name="email"
                        v-model="inputs.email"
                        type="email"
                        placeholder="your.email@gmail.com"
                        :disabled="admin_editing"
                        required
                    ></o-input>
                </o-field>
            </section>

            <section v-if="!admin_editing">
                <o-field>
                    <o-input
                        name="submit"
                        v-model="submit_text"
                        type="submit"
                    ></o-input>
                </o-field>
            </section>
        </form>

        <form class="s-form" v-if="!admin_editing" @submit.prevent="updatePassword()">
            <h2>Privacy & Security</h2>

            <section>
                <o-field 
                    label="Current password"
                    :variant="variants.password"
                    :message="messages.password"
                >
                    <o-input
                        name="password"
                        type="password"
                        v-model="inputs.password"
                        placeholder="Type your current password"
                        required
                    ></o-input>
                </o-field>
            </section>

            <section class="split">
                <o-field 
                    label="Password"
                    :variant="variants.new_password"
                    :message="messages.new_password"
                >
                    <o-input
                        name="new_password"
                        type="password"
                        v-model="inputs.new_password"
                        placeholder="Type your new password"
                        required
                    ></o-input>
                </o-field>
                
                <o-field 
                    label="Confirmation"
                    :variant="variants.new_password_confirm"
                    :message="messages.new_password_confirm"
                >
                    <o-input
                        name="new_password_confirm"
                        type="password"
                        v-model="inputs.new_password_confirm"
                        placeholder="Confirm your new password"
                        required
                    ></o-input>
                </o-field>
            </section>

            <section>
                <o-field>
                    <o-input
                        name="submit"
                        v-model="submit_text"
                        type="submit"
                    ></o-input>
                </o-field>
            </section>
        </form>
    </div>
</template>

<style scoped lang="sass">
.user-settings
    .s-form
        &:nth-child(1)
            h2
                margin-top: 0

        h2
            font-size: 1.5em
            margin: 1em 0 15px 0

        section
            margin-bottom: 1em

            &.split
                display: flex
                gap: 1em

                *
                    flex-grow: 1
</style>