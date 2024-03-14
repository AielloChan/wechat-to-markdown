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
        const url = 'https://mp.weixin.qq.com/s/gngl6O09flZYHTMHGRk_wQ'
        const result = await transformHtml2Markdown(url)

        expect(result.success).toBe(true)
        expect(result.code).toBe(200)

        expect(result.data?.content).toContain('[![')
    })
})
