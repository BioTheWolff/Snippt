<script setup lang="ts">
import { previewCode } from '@/services/rainbow';
import { ref } from 'vue';

const language = ref("html");
const content = ref("<section>test</section>");
const codePreview = ref();

function preview() {
    previewCode(codePreview, content.value, language.value);
}
</script>

<template>
    <div class="create-post">
        <section>
            <o-field label="Title">
                <o-input
                    name="title"
                    placeholder="My super title!"
                    maxlength="60"
                    required
                ></o-input>
            </o-field>
            
            <o-field label="Description">
                <o-input
                    name="description"
                    type="textarea"
                    placeholder="Your description here..."
                    maxlength="250"
                    required
                ></o-input>
            </o-field>
        </section>

        <section>
            <o-field label="Language">
                <o-input
                    name="language"
                    v-model="language"
                    placeholder="the code snippet's language"
                    maxlength="20"
                    required
                ></o-input>
            </o-field>
            
            <o-field label="Code snippet">
                <o-input
                    name="language"
                    type="textarea"
                    v-model="content"
                    placeholder="Your snippet here..."
                    maxlength="2000"
                    required
                ></o-input>
            </o-field>
        </section>

        <hr/>

        <button @click="preview()">Preview code</button>

        <section>
            <o-field label="Preview">
                <pre><code ref="codePreview">Here will be your code preview</code></pre>
            </o-field>
        </section>

        <section>
            <o-field>
                <o-button variant="info">Create post</o-button>
            </o-field>
        </section>
    </div>
</template>

<style scoped lang="sass">
.create-post
    section
        margin-bottom: 1.5em
</style>