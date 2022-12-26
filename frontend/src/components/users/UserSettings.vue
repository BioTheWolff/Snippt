<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    handle: String,
    loading: {
        type: Boolean,
        default: false,
    }
})

const userSettings = ref({
    handle: "test_handle",
    display_name: "Test Display Name",
    email: "test@example.com",
    admin_editing: true,
})
</script>

<template>
    <div class="user-settings">
        <section class="s-form">
            <h2>Public Details</h2>

            <section class="split">
                <o-tooltip 
                    position="bottom"
                    label="Should only contain alphanumerical characters, underscores and dashes"
                >
                    <o-field label="Username (handle)">
                        <o-input 
                            name="handle" 
                            v-model.trim="userSettings.handle"
                            placeholder="your_handle_here" 
                            expanded
                        ></o-input>
                    </o-field>
                </o-tooltip>

                <o-field label="Display name">
                    <o-input 
                        name="name" 
                        v-model.trim="userSettings.display_name"
                        placeholder="Your Display Name" 
                        expanded
                    ></o-input>
                </o-field>
            </section>

            <section>
                <o-field>
                    <o-button variant="info">Change public details</o-button>
                </o-field>
            </section>
        </section>

        <section class="s-form">
            <h2>E-mail</h2>

            <section>
                <o-field label="E-mail">
                    <o-input
                        name="email"
                        v-model="userSettings.email"
                        type="email"
                        placeholder="your.email@gmail.com"
                        :disabled="userSettings.admin_editing"
                    ></o-input>
                </o-field>
            </section>

            <section v-if="!userSettings.admin_editing">
                <o-field>
                    <o-button variant="info">Change email</o-button>
                </o-field>
            </section>
        </section>

        <section class="s-form" v-if="!userSettings.admin_editing">
            <h2>Privacy & Security</h2>

            <section>
                <o-field label="Current password">
                    <o-input
                        name="password"
                        type="password"
                        placeholder="Type your current password"
                    ></o-input>
                </o-field>
            </section>

            <section class="split">
                <o-field label="Password">
                    <o-input
                        name="new_password"
                        type="password"
                        placeholder="Type your new password"
                    ></o-input>
                </o-field>
                
                <o-field label="Password confirmation">
                    <o-input
                        name="new_password_confirm"
                        type="password"
                        placeholder="Confirm your new password"
                    ></o-input>
                </o-field>
            </section>

            <section>
                <o-field>
                    <o-button variant="info">Change password</o-button>
                </o-field>
            </section>
        </section>
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