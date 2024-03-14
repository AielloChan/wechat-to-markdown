import axios from 'axios'
import { load } from 'cheerio'
import { errObj } from './error'
import { TurnDownResult, Status } from './type'
import { getTurnDownService } from './turndownCode'

const getError = (code: number) => {
    return {
        code,
        success: false,
        msg: errObj[code],
    }
}

export { TurnDownResult, Status }

export default async function transformHtml2Markdown(
    url: string
): Promise<TurnDownResult> {
    const u = new URL(url)
    // 移除该参数
    // 避免出现 302 跳转
    u.searchParams.delete('poc_token')

    let json: TurnDownResult = await axios
        .request({
            url: u.href,
            method: 'get',
            timeout: 30000,
            transformResponse(res) {
                return res
            },
        })
        .then((res) => {
            const $ = load(res['data'])

            let title = $('#activity-name').text()

            title = title.trim() || ''
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

            if (html && html.length > 0) {
                let res = getTurnDownService({ url: u.href }).turndown(html)

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

            return getError(Status.Fail)
        })
        .catch((err) => {
            console.log(err)
            return err
        })

    return json
}
