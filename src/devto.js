const axios = require('axios');
const cheerio = require('cheerio');

module.exports = class Devto {
    endpoint;
    
    constructor (token) {
      this.endpoint = "https://dev.to/api/"
      this.headers = {"api-key": token}
    }

    getPageSlugFromURL(url) {
        const urlArr = url.split('/'),
        pageSlug = urlArr[urlArr.length - 1]
        return pageSlug
    }

    async getMarkdownBody(url) {
        let endpoint = this.endpoint + 'articles/me'
        const response = await axios.get(endpoint, { headers: this.headers })
        if (response.status != 200) {
            throw new Error("An error occured while making request")
        }
        let slug = this.getPageSlugFromURL(url)
        let article = response.data.find(article => article.slug == slug)
        return article.body_markdown
    }
}