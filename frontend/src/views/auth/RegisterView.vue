<script setup lang="ts">
</script>

<template>
    <div class="register-form">
        <section class="split">
            <o-tooltip 
                position="bottom"
                label="Should only contain alphanumerical characters, underscores and dashes"
            >
                <o-field label="Username (handle)">
                    <o-input name="handle" placeholder="your_handle_here" expanded></o-input>
                </o-field>
            </o-tooltip>

            <o-field label="Display name">
                <o-input name="name" placeholder="Your Display Name" expanded></o-input>
            </o-field>
        </section>

        <section>
            <o-field label="E-mail">
                <o-input
                    name="email"
                    type="email"
                    placeholder="your.email@gmail.com"
                ></o-input>
            </o-field>
            
            <o-field label="Password">
                <o-input
                    name="password"
                    type="password"
                    placeholder="Type your password"
                ></o-input>
            </o-field>

            <o-field label="Password confirmation">
                <o-input
                    name="password_confirm"
                    type="password"
                    placeholder="Confirm your password"
                ></o-input>
            </o-field>
        </section>

        <section>
            <o-field>
                <o-button variant="info">Register</o-button>
            </o-field>
        </section>
    </div>
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