<script setup lang="ts">
import { redirectUnlessLoggedIn } from '@/services/auth';
import { createPost, getAllowedLanguages } from '@/services/posts';
import { previewCode } from '@/services/rainbow';
import { getRefFromArray, makeRefArray, setErrorMessages, setRefFromArray } from '@/services/ref-array';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const keys = ['title', 'description', 'language', 'content'];
const inputs = makeRefArray(keys);
const variants = makeRefArray(keys);
const messages = makeRefArray(keys);

const submit_text = ref("Create new post");
const codePreview = ref();
const router = useRouter();

function preview() {
    previewCode(
        codePreview, 
        getRefFromArray(inputs, 'content'), 
        getRefFromArray(inputs, 'language')
    );
}

redirectUnlessLoggedIn();
const languages = await getAllowedLanguages();
setRefFromArray(inputs, 'language', 'text');

async function submit() {
    const result = await createPost({
        title: getRefFromArray(inputs, 'title'),
        description: getRefFromArray(inputs, 'description'),
        language: getRefFromArray(inputs, 'language'),
        content: getRefFromArray(inputs, 'content'),
    })

    if (result === true) {
        router.push('/');
    } else {
        setErrorMessages(keys, variants, messages, result as string[]);
    }
}
</script>

<template>
    <form class="create-post" @submit.prevent="submit()">
        <section>
            <o-field label="Title"
                :variant="variants.title"
                :message="messages.title"
            >
                <o-input
                    name="title"
                    placeholder="My super title!"
                    maxlength="60"
                    required
                    v-model="inputs.title"
                ></o-input>
            </o-field>
            
            <o-field 
                label="Description" 
                :variant="variants.description" 
                :message="messages.description"
            >
                <o-input
                    name="description"
                    type="textarea"
                    placeholder="Your description here..."
                    maxlength="250"
                    required
                    v-model="inputs.description"
                ></o-input>
            </o-field>
        </section>

        <section>
            <o-field label="Language"
                :variant="variants.language"
                :message="messages.language"
            >
                <o-select placeholder="Select a language" v-model="inputs.language">
                    <option
                        v-for="language, key of languages"
                        :key="key"
                        :value="key"
                    >{{ language }}</option>
                </o-select>
            </o-field>
            
            <o-field label="Code snippet"
                :variant="variants.content"
                :message="messages.content"
            >
                <o-input
                    name="content"
                    type="textarea"
                    v-model="inputs.content"
                    placeholder="Your snippet here..."
                    maxlength="2000"
                    required
                ></o-input>
            </o-field>
        </section>

        <hr/>

        <section>
            <o-button 
                @click="preview()"
                variant="primary"
            >Preview code</o-button>
            <o-field label="Preview">
                <pre><code ref="codePreview">Here will be your code preview</code></pre>
            </o-field>
        </section>

        <section>
            <o-field>
                <o-input
                    name="submit"
                    type="submit"
                    v-model="submit_text"
                ></o-input>
            </o-field>
        </section>
    </form>
</template>

<style scoped lang="sass">
.create-post
    section
        margin-bottom: 1.5em

    @include for-up-to-tablet
        width: 95%
        margin: 0 2.5%
</style>