/**
 *  html 转换 markdown 格式
 */
import turnDownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'
import { formatCode, figure2markdown } from './formatHtml'

interface Params {
    url: string
}

function getTurnDownService(params: Params) {
    const turndownService = new turnDownService({
        codeBlockStyle: 'fenced',
        hr: '',
    })

    turndownService.use(gfm)

    let videoCounter = 0

    // 自定义配置
    turndownService
        .addRule('pre2Code', {
            filter: ['pre'],
            replacement(content, node: any) {
                const len = content.length
                // 微信文章获取到的 content， 会出现首尾都有 '`'
                const isCode = content[0] === '`' && content[len - 1] === '`'

                let pre_Markdown = ''

                if (isCode) {
                    pre_Markdown = formatCode(node.innerHTML)
                }

                const res = isCode ? pre_Markdown : content

                return '```\n' + res + '\n```\n'
            },
        })
        .addRule('getImage', {
            filter: ['img'],
            replacement(content, node: any) {
                const src = node.getAttribute('data-src') || ''

                return src ? `\n\n![](${src}) \n\n` : ''
            },
        })
        .addRule('video', {
            filter: (node: HTMLElement) => {
                return (
                    node.tagName.toLowerCase() === 'iframe' &&
                    node.className.includes('video_iframe')
                )
            },
            replacement(content, _node: Node) {
                const node = _node as HTMLIFrameElement

                const cover = decodeURIComponent(
                    node.getAttribute('data-cover') || ''
                )

                const u = new URL(params.url)
                u.hash = `js_mp_video_container_${videoCounter++}`

                return cover ? `\n\n[![](${cover})](${u.href}) \n\n` : ''
            },
        })
        .addRule('lineBreaks', {
            filter: 'br',
            replacement: () => '\n',
        })
        .addRule('img2Code', {
            filter: ['figure'],
            replacement(content, node: any) {
                const res = figure2markdown(node.innerHTML)
                return res || ''
            },
        })

    return turndownService
}

export { getTurnDownService }
