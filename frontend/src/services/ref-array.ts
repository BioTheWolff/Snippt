import { ref, type Ref } from "vue";


export type RefArrayType = Ref<{ [key: string]: Ref<any> }>;

export function makeRefArray(keys: string[]): RefArrayType {
    const refs: RefArrayType = ref({});
    for (let key of keys) {
        refs.value[key] = ref("");
    }
    return refs;
}

export function getRefFromArray(refArray: RefArrayType, key: string) {
    return (refArray.value as { [key: string]: Ref<any> })[key];
}

export function setRefFromArray(refArray: RefArrayType, key: string, value: any) {
    (refArray.value as { [key: string]: Ref<any> })[key] = value;
}

export function setErrorMessages(keys: string[], variants: RefArrayType, messages: RefArrayType, list: string[]|string, setToGlobal = false) {
    // reset the variants and messages
    resetMessages(keys, variants, messages);

    // set the variants and messages according to recieved error
    if (typeof list == 'string') list = [list];

    for (let message of list) {
        let split = message.toLowerCase().split(' ');

        if (setToGlobal) {
            // set to all the keys at the same time
            for (let key of keys) {
                setRefFromArray(variants, key, 'danger');

                let currentVal = getRefFromArray(messages, key);
                setRefFromArray(messages, key, 
                    (currentVal ? currentVal + '; ' : '') + split.join(' ')
                );
            }
        } else {
            setRefFromArray(variants, split[0], 'danger');

            let currentVal = getRefFromArray(messages, split[0]);
            setRefFromArray(messages, split[0], 
                (currentVal ? currentVal + '; ' : '') + split.slice(1).join(' ')
            );
        }
    }
}

export function setSuccessMessages(keys: string[], variants: RefArrayType, messages: RefArrayType) {
    for (let key of keys) {
        setRefFromArray(variants, key, 'success');
        setRefFromArray(messages, key, `Successfully updated ${key}`);
    }
    setTimeout(() => resetMessages(keys, variants, messages), 5000);
}

export function resetMessages(keys: string[], variants: RefArrayType, messages: RefArrayType) {
    for (let key of keys) {
        setRefFromArray(variants, key, '');
        setRefFromArray(messages, key, '');
    }
}