import { load } from 'cheerio'
import { Window } from 'happy-dom'
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
        const window = new Window({ url: meta.url })
        window.document.write($.html())
        window.document.close()
        const article = new Readability(
            window.document as unknown as Document
        ).parse()
        html = article?.content
    } catch {
        html = undefined
    }

    if (!html) {
        html = $('body').html()
    }
    if (html?.length) {
        const content = getTurnDownService(meta).turndown(html)

        return {
            success: true,
            code: Status.Success,
            data: {
                title,
                author,
                content,
            },
        }
    }

    return null
}
