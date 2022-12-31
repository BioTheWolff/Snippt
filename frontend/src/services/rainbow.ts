import type { Ref } from "vue";

const Rainbow = (window as unknown as { Rainbow: { color: Function } }).Rainbow

export function previewCode(target: Ref, code: any, language: any, addCodeWrapper = false) {
    const element = (target.value as unknown as {innerHTML: string});
    
    Rainbow.color(code, language, function(preview: string) {
        if (addCodeWrapper) {
            element.innerHTML = `<code>${preview}</code>`;
        } else {
            element.innerHTML = preview;
        }
    })
}