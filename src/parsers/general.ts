import { load } from 'cheerio'
import { JSDOM } from 'jsdom'
import { Readability } from '@mozilla/readability'
import { Status } from '../type'
import { getTurnDownService } from '../turndownCode'

export async function parseGeneralHTML(htmlRaw: string, meta: { url: string }) {
    const $ = load(htmlRaw)
    $('script').remove()
    $('style').remove()
    $('link[rel="stylesheet"]').remove()
    $('[style]')
        .filter((_, el) =>
            /display\s*:\s*none/i.test($(el).attr('style') || '')
        )
        .remove()

    const title = ($('title').text() || '').trim()
    const author = ($('meta[name="author"]')?.attr('content') || '').trim()

    let html: string | null | undefined
    try {
        const dom = new JSDOM($.html(), { url: meta.url })
        const article = new Readability(dom.window.document).parse()
        html = article?.content
    } catch {
        html = undefined
    }

    if (!html) {
        html = $('body').html()
    }
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
