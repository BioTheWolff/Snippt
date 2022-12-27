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