import { load } from 'cheerio'
import { Status } from '../type'
import { getTurnDownService } from '../turndownCode'

export async function parseWeChatPage(htmlRaw: string, meta: { url: string }) {
    const $ = load(htmlRaw)

    const title = ($('#activity-name').text() || '').trim()
    const author = Array.from(
        new Set(
            [
                $('meta[name="author"]')?.attr('content'),
                ...$('#js_name').text().split('\n'),
            ]
                .map((item) => (item ? item.trim() : ''))
                .filter(Boolean)
        )
    ).join('\n')

    const htmlEl = $('#js_content')
    const html = htmlEl.html()

    if (html?.length) {
        let res = getTurnDownService(meta).turndown(html)

        res = `## ${title} \n \n` + `## 作者 ${author} \n \n` + res

        return {
            success: true,
            code: Status.Success,
            data: {
                title,
                author,
                content: res,
            },
        }
    }

    return null
}
