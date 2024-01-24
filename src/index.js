const fs = require('fs/promises')
const core = require('@actions/core');
const axios = require('axios');

const endpoint = 'https://gql.hashnode.com/'


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
                "tags": postOptions.tags
            }
        }
        const requestBody = {
            query,
            variables
        };
        let response = await axios.post(endpoint, requestBody, { headers: authOptions })

        core.setOutput('id', response.data.publishPost.post.id)
        core.setOutput('url', response.data.publishPost.post.url)
    
    } catch (error) {
      core.setFailed(error.message);
    }
}

async function main () {
    try {
        const accessToken = core.getInput('access_token', { required: true })
       
        const publicationId = core.getInput('publication_id', { required: true })
        const title = core.getInput('title', { required: true })
        const subtitle = core.getInput('subtitle')
        const markdownFile = core.getInput('markdown', { required: true });

        const tags = [] // TODO: Allow tags
       

        const markdownBody = await fs.readFile(markdownFile, { encoding: 'utf-8' });
        const postOptions = {
            title,
            subtitle,
            publicationId,
            markdownBody,
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
