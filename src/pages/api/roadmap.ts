import puppeteer from 'puppeteer'

let browser = null
let page = null
let content = null

async function getRoadmap() {
    if (!browser) browser = await puppeteer.launch()
    if (!page) {
        page = await browser.newPage()
        await page.goto('https://roadmap.productboard.com/db30b8da-a4a8-4b18-aa73-da7be8971171')
    }
    if (!content) {
        content = await page.$eval('body', (element) => element.innerHTML)
    }
    return content
}
getRoadmap()

export default async function handler(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.status(200)
    res.write(await getRoadmap());
    res.end()
}