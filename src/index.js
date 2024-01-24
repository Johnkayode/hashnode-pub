const fs = require('fs/promises')
const core = require('@actions/core');
const axios = require('axios');

const endpoint = 'https://gql.hashnode.com/'

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
       
        core.setOutput('id', response.data.data.publishPost.post.id)
        core.setOutput('url', response.data.data.publishPost.post.url)
    
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
        const markdownFile = core.getInput('markdown', { required: true });
        const subtitle = core.getInput('subtitle')
        const coverImageURL = core.getInput('cover_image')

        const tags = [] // TODO: Allow tags

        const markdownBody = await fs.readFile(markdownFile, { encoding: 'utf-8' });
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
