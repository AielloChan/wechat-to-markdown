import { load } from 'cheerio'
import { Status } from '../type'
import { getTurnDownService } from '../turndownCode'

export async function parseGeneralHTML(htmlRaw: string, meta: { url: string }) {
    const $ = load(htmlRaw)
    $('script').remove()
    $('[style]')
        .filter((_, el) =>
            /display\s*:\s*none/i.test($(el).attr('style') || '')
        )
        .remove()

    const title = ($('title').text() || '').trim()
    const author = ($('meta[name="author"]')?.attr('content') || '').trim()

    const html = $('body').html()
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
