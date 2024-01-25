const fs = require('fs/promises')
const core = require('@actions/core');
const axios = require('axios');

const Notion = require('./notion')
const endpoint = 'https://gql.hashnode.com/'


/**
 * Read Markdown file into a string.
 *
 * @param {Object} source - Filepath to Markdown.
 */
async function MarkdownToMdString (source) {
    const markdownBody = await fs.readFile(source, { encoding: 'utf-8' });
    return markdownBody
}

/**
 * Convert Notion document to markdown.
 *
 * @param {Object} token - Notion token.
 * @param {Object} source - Notion document url.
 */
async function NotionToMdString (token, source) {
    try {
        notion = new Notion(token)
        const blocks = await this.notion.getBlocks(source)
        // transform blocks to markdown
        let markdownObj = await this.notion.getMarkdown(blocks)
        let markdown = Object.values(markdownObj)
        markdown = markdown.join("\n")
        return markdown
    } catch( error ) {
        core.debug(error)
        core.setFailed(error.message)
        process.exit(1)
    }
   
}

/**
 * Publishes a post using Hashnode GraphQL API.
 *
 * @param {Object} authOptions - Authentication options, containing an Authorization header.
 * @param {Object} postOptions - Options for the post to be published.
 */
async function publishPost (authOptions, postOptions) {
    try {
        const query = `
            mutation PublishPost($input: PublishPostInput!) {
                publishPost(input: $input) {
                post {
                    id
                    slug
                    url
                }
                }
            }
        `;
        const variables = {
            "input": {
                "title": postOptions.title,
                "subtitle": postOptions.subtitle,
                "publicationId": postOptions.publicationId,
                "contentMarkdown": postOptions.markdownBody,
                "coverImageOptions": { coverImageURL: postOptions.coverImageURL },
                "tags": postOptions.tags   
            }
        }
        const requestBody = {
            query,
            variables
        };
        const response = await axios.post(endpoint, requestBody, { headers: authOptions })

        if (response.data.errors) { 
            errorMsgs = response.data.errors.map(error => error.message)
            core.setFailed( errorMsgs ) 
        } else {
            core.setOutput('id', response.data.data.publishPost.post.id)
            core.setOutput('url', response.data.data.publishPost.post.url)
        }
    } catch (error) {
      core.setFailed(error.message);
    }
}

/**
 * Main function to read inputs and trigger the post publishing process.
 */
async function main () {
    try {
        const accessToken = core.getInput('access_token', { required: true })
       
        const publicationId = core.getInput('publication_id', { required: true })
        const title = core.getInput('title', { required: true })
        const subtitle = core.getInput('subtitle')
        const coverImageURL = core.getInput('cover_image')
        const tags = [] // TODO: Allow tags

        let format = core.getInput('format', { required: true })
        const source = core.getInput('source', { required: true })
        const notionToken = core.getInput('notion_token')


        format = format.toLowerCase();

        // check required inputs
        if (format === 'notion' && !notionToken) {
            core.setFailed("Required Input(s) missing")
            process.exit(1)
        }

        const markdownBody = 
        format === 'notion'
        ? await NotionToMdString(notionToken, source)
        : format === 'markdown'
        ? await MarkdownToMdString(source)
        : null;
        
        const postOptions = {
            title,
            subtitle,
            publicationId,
            markdownBody,
            coverImageURL,
            tags
        }
        authOptions = { "Authorization": accessToken }
        publishPost(authOptions, postOptions)

    } catch (error) {
        core.debug(error)
        core.setFailed(error.message)
        process.exit(1)
    }
    
}

main()
