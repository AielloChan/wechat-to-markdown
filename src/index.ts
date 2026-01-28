import axios, { AxiosRequestConfig } from 'axios'
import { errObj } from './error'
import type { TurnDownResult } from './type'
import { Status } from './type'
import { parseWeChatPage } from './parsers/wechat'
import { parseGeneralHTML } from './parsers/general'

const getError = (code: number) => {
    return {
        code,
        success: false,
        msg: errObj[code],
    }
}

export { TurnDownResult, Status }

export function isWechatPage(html: string) {
    return html?.includes('res.wx.qq.com')
}

export async function parseHTML(
    html: string,
    meta: { url: string }
): Promise<TurnDownResult> {
    let result: TurnDownResult | null = null

    if (isWechatPage(html)) {
        result = await parseWeChatPage(html, meta)
    }
    if (!result) {
        // 兜底处理
        result = await parseGeneralHTML(html, meta)
    }

    if (result) {
        return result
    }

    return getError(Status.Fail)
}

export async function transformHtml2Markdown(
    html: string,
    /**
     * 这里的 url 是原始的 url，主要是用来映射内部跳转链接
     */
    url: string
): Promise<TurnDownResult> {
    try {
        return parseHTML(html, { url })
    } catch (err) {
        console.log(err)
        return getError(Status.Fail)
    }
}

/**
 * 支持添加代理服务器
 */
interface TransformHtml2MarkdownOptions {
    axiosConfig?: AxiosRequestConfig
}

export async function transformUrl2Markdown(
    url: string,
    options: TransformHtml2MarkdownOptions = {}
): Promise<TurnDownResult> {
    const { axiosConfig = {} } = options
    const { headers = {}, ...restConfig } = axiosConfig

    const u = new URL(url)
    // 移除该参数
    // 避免出现 302 跳转
    u.searchParams.delete('poc_token')

    try {
        const res = await axios.get(u.href, {
            timeout: 30000,
            maxRedirects: 5,
            headers: {
                DNT: '1',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
                ...headers,
            },
            ...restConfig,
        })

        return transformHtml2Markdown(res.data, url)
    } catch (err) {
        console.log(err)
        return getError(Status.Fail)
    }
}

export { getTurnDownService } from './turndownCode'
