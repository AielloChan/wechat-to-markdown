import fs from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import transformHtml2Markdown from '.'

describe('transformHtml2Markdown 测试', () => {
    it('可以拉取文章标题', async () => {
        const url =
            'https://mp.weixin.qq.com/s?__biz=Mzg3MDAyNjE2OA%3D%3D&mid=2247491293&idx=1&sn=a35d96829938d691f80bf24b83ebb7ba&poc_token=HN_H72WjzmObCXt2GjU7xxxhDBkRcFd-Rh3ebFQe'
        const result = await transformHtml2Markdown(url)

        expect(result.success).toBe(true)
        expect(result.code).toBe(200)
        expect(result.data?.title).toBe(
            '『iBeta 体验报告』iOS 17.4 Beta 4 发布，新增电池循环次数查看等 6 条内容'
        )
    })
    it('可以拉取作者名称', async () => {
        const url = 'https://mp.weixin.qq.com/s/0TKGMCJRx6pjj3Hv7N7o7w'
        const result = await transformHtml2Markdown(url)

        console.log(result)

        expect(result.success).toBe(true)
        expect(result.code).toBe(200)
        expect(result.data?.author).toBe('Sunbelife\niBeta尝鲜派')
    })

    it('可以拉取作者和公众号的名称', async () => {
        const url = 'https://mp.weixin.qq.com/s/0TKGMCJRx6pjj3Hv7N7o7w'
        const result = await transformHtml2Markdown(url)

        expect(result.success).toBe(true)
        expect(result.code).toBe(200)
        expect(result.data?.author).toBe('蔡垒磊\n请辩')
    })

    it('可以拉取文章内容', async () => {
        const url =
            'https://mp.weixin.qq.com/s?__biz=Mzg3MDAyNjE2OA%3D%3D&mid=2247491293&idx=1&sn=a35d96829938d691f80bf24b83ebb7ba&poc_token=HN_H72WjzmObCXt2GjU7xxxhDBkRcFd-Rh3ebFQe'
        const result = await transformHtml2Markdown(url)

        expect(result.success).toBe(true)
        expect(result.code).toBe(200)
        expect(result.data?.content).toContain('## 作者 iBeta尝鲜派')
    })

    it('可以拉取文章中的视频内容', async () => {
        // const url = 'https://mp.weixin.qq.com/s/gngl6O09flZYHTMHGRk_wQ'
        const url =
            'https://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw%3D%3D&mid=2650906982&idx=1&sn=10eacf377efbd1d1fcc5f75ae0ef5691'
        const result = await transformHtml2Markdown(url)

        expect(result.success).toBe(true)
        expect(result.code).toBe(200)

        expect(result.data?.content).toContain('[![')

        await fs.writeFile('test.md', String(result.data?.content))
    })

    it('可以处理表格', async () => {
        const url =
            'https://mp.weixin.qq.com/s?__biz=MzI3NDA4ODY4MA==&mid=2653338631&idx=1&sn=be869c38549ee3e0f6fcb4c9c7169367&chksm=f0cb4b80c7bcc29619fee03b27def72a6cc9b7b9d16066e57dd2acda234d2c3ec216bfbb4cca&mpshare=1&scene=1&srcid=05166r8YtcuKY5YZluH2I4JE&sharer_sharetime=1652678632034&sharer_shareid=16362cd686fb4155d775401692935830&exportkey=A1ZrvWPUCGw9cyHeraVQQz0%3D&acctmode=0&pass_ticket=CHRad0UIoz8%2FSPboNOugxVHCcm1xuslbDDvwdEvYLiqRKwiMWxn%2B%2B5UW4IrjUmQ6&wx_header=0#rd'
        const result = await transformHtml2Markdown(url)

        expect(result.success).toBe(true)
        expect(result.code).toBe(200)

        expect(result.data?.content).toContain(
            '|   超时操作   |   日志消息描述   |   描述   |'
        )
    })

    it(
        '可以拉取过期的微信分享',
        async () => {
            const url =
                'http://mp.weixin.qq.com/s?__biz=MzI2MjM4Nzc2NA==&mid=2247497160&idx=1&sn=459629d06f15de173b061403df7608ca&chksm=ebcf2b30c5dbd85cce7b8afa5da871f28c58803173431cd7b78a868f562b62c9a090a169088d&mpshare=1&scene=1&srcid=0913vXdzPliilHLt1QHe9kBz&sharer_shareinfo=651a82c9681791d6a0b315b13f9341d8&sharer_shareinfo_first=651a82c9681791d6a0b315b13f9341d8#rd'
            const result = await transformHtml2Markdown(url)

            expect(result.success).toBe(true)
            expect(result.code).toBe(200)

            console.log(result.data?.content)
        },
        { timeout: 10000 }
    )

    it(
        '支持处理重定向请求',
        async () => {
            const url =
                'http://mp.weixin.qq.com/s?__biz=MzkyMTU4MDIyMA==&mid=2247492071&idx=1&sn=3c7df3d85f2e1565f8996676e30bfa56&chksm=c00ea1c176df04164ebf3764c0ca9569e7247eed56fdbe80421ce7ba21dd69f386f196a97920&mpshare=1&scene=1&srcid=1105HGT51CuD1H9sPOCnHthy&sharer_shareinfo=ed87e9281606c42ed0aa2a4ed81ce1da&sharer_shareinfo_first=7c96c936611ec667238354ba45527d0a#rd'
            const result = await transformHtml2Markdown(url)

            expect(result.success).toBe(true)
            expect(result.code).toBe(200)

            console.log(result.data?.content)
        },
        { timeout: 10000 }
    )
})
