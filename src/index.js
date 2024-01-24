const fs = require('fs')
const core = require('@actions/core');
const github = require('@actions/github');

const endpoint = 'https://gql.hashnode.com/'


async function publishPost (postOptions) {
    try {
        response = {
            "id": "hashnodeId",
            "url": "https://hashnode.com/nerdthejohn"
        }
        core.setOutput('id', response.id)
        core.setOutput('url', response.url)
    
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

        const markdownBody = await fs.readFile(markdownFile, 'utf8');

        const postOptions = {
            title,
            subtitle,
            publicationId,
            markdownBody,
        }

        await publishPost(postOptions)

    } catch (error) {
        core.debug(error)
        core.setFailed(error.message)
        process.exit(1)
    }
    
}

main()
