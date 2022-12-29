import type { Ref } from "vue";

const Rainbow = (window as unknown as { Rainbow: { color: Function } }).Rainbow

export function previewCode(target: Ref, code: string, language: string) {
    const element = (target.value as unknown as {innerHTML: string});
    
    Rainbow.color(code, language, function(preview: string) {
        element.innerHTML = preview;
    })
}