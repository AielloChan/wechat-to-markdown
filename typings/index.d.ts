declare module 'html2markdown' {
    export default function html2md(string): string
}

declare module '@guyplusplus/turndown-plugin-gfm' {
    export function gfm(turndown: turnDownService): void
}
