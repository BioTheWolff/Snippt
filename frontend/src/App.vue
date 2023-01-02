<script setup lang="ts">
import { RouterView } from 'vue-router';
import SiteHeader from './components/utils/SiteHeader.vue';

</script>

<template>
    <SiteHeader></SiteHeader>

    <main>
        <div class="filler"></div>
        <div class="filler right"></div>
        <div id="site-content">
            <Suspense>
                <RouterView />

                <template #fallback>
                    Loading...
                </template>
            </Suspense>
        </div> 
    </main>
</template>

<style scoped lang="sass">
main
    display: flex
    min-height: calc(100vh - $header-height-full)

    .filler
        width: 30vw
        &.right
            order: 3

        @include for-up-to-tablet
            display: none
    
    #site-content
        flex-grow: 1

        @include for-up-to-tablet
            flex-grow: 0
            width: 100vw
</style>
