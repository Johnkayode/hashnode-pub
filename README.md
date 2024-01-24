# Publish Markdown to Hashnode GitHub Action

This GitHub Action allows you to automate the process of publishing a blog post to Hashnode. It simplifies the steps needed to publish a post by taking care of authentication and interaction with the Hashnode API.

## Using the action

You can use the action in your workflow by adding a step with `uses: Johnkayode/hashnode-pub@v1.0.0`

## Inputs

`title` (required)

The title of the blog post.

`subtitle` (optional)

The subtitle or description of the blog post.

`publication_id` (required)

The ID of the publication to which the post belongs.

 `markdown` (required)

Filepath to the markdown file containing the content of the blog post.

`access_token` (required)

Hashnode developer access token. Obtain this token from your Hashnode account settings.

## Outputs

`id`

The ID of the newly published blog post.

`url`

The URL of the newly published blog post.


### Example Usage:
```yaml
name: Create Post
on: push
jobs:
  create_post:
    runs-on: ubuntu-latest
    name: A job to publish markdown to Hashnode

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Publish
        id: publish
        uses: Johnkayode/hashnode-pub@v1.0.0
        with:
          title: Testing this great little action
          publication_id: '[Publication ID (from URL)]'
          markdown: '[Path to Markdown file e.g README.md]'
          access_token: '[your hashnode developer access token ]'
      - name: Get the publication url
        run: echo "The Publish url was ${{ steps.publish.outputs.url }}"
```