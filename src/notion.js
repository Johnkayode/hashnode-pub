const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require('notion-to-md');


module.exports = class Notion {
    notion;
    n2m;
    
    constructor (token) {
      this.notion = new Client({
        auth: token,
      });
      this.n2m = new NotionToMarkdown({
        notionClient: this.notion
      })
    }

    stripURLTags(url) {
        let parsedUrl = new URL(url)
        parsedUrl.search = ""
        // remove trailing slash
        if (parsedUrl.pathname.endsWith('/')) {
            parsedUrl.pathname = url.pathname.slice(0, -1);
        }
        return parsedUrl.toString()
    }

    getPageIdFromURL(url) {
        url = this.stripURLTags(url)
        const urlArr = url.split('-')
        let pageId = urlArr[urlArr.length - 1]
        return pageId
    }
  
    async getBlocks (url) {
      const pageId = this.getPageIdFromURL(url)
      const blocks = await this.n2m.pageToMarkdown(pageId);
  
      return blocks
    }
  
    async getMarkdown (source){
      let mdblocks = []
      if (typeof source === 'string') {
        const pageId = this.getPageIdFromURL(source)
        mdblocks = await this.n2m.pageToMarkdown(pageId);
      } else {
        mdblocks = source
      }
  
      return this.n2m.toMarkdownString(mdblocks);
    }
}
