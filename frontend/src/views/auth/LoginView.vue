<script setup lang="ts">
</script>

<template>
    <div class="login-form">
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
        </section>

        <section>
            <o-field>
                <o-button variant="info">Log in</o-button>
            </o-field>
        </section>
    </div>
</template>

<style scoped lang="sass">
.login-form
    section
        margin-bottom: 1.5em
</style>