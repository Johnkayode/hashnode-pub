# Publish Markdown to Hashnode GitHub Action

This GitHub Action allows you to automate the process of publishing a blog post to Hashnode. It simplifies the steps needed to publish a post by taking care of authentication and interaction with the Hashnode API.

## Supported Platforms

- [x] Markdown
- [x] Notion


## Using the action

You can use the action in your workflow by adding a step with `uses: Johnkayode/hashnode-pub@v1.0.0`

## Inputs

`title` (required)

The title of the blog post.

`subtitle` (optional)

The subtitle or description of the blog post.

`cover_image` (optional)

The cover image URL for the post

`publication_id` (required)

The ID of the publication to which the post belongs.

`format` (required)

Format of the content to be published [markdown, notion].

`source` (required)

File path (Markdown) or URL (Notion) of the content.

`access_token` (required)

Hashnode developer access token. Obtain this token from your Hashnode account settings.

`notion_token` (optional)

Notion integration token (only required if format is notion). Read [here](https://developers.notion.com/docs/create-a-notion-integration) to create an integration.

## Outputs

`id`

The ID of the newly published blog post.

`url`

The URL of the newly published blog post.


### Example Usage:

#### Publish a markdown file
```yaml
name: Publish Post
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
          title: Publish Markdown
          publication_id: '[Publication ID (from URL)]'
          format: markdown
          source: '[Path to Markdown file e.g README.md]'
          access_token: '${{ secrets.HASHNODE_ACCESS_TOKEN }}'
      - name: Get the publication url
        run: echo "The Publish url was ${{ steps.publish.outputs.url }}"
```

#### Publish a Notion page
```yaml
name: Publish Post
on: push
jobs:
  create_post:
    runs-on: ubuntu-latest
    name: A job to publish notion page to Hashnode

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Publish
        id: publish
        uses: Johnkayode/hashnode-pub@v1.0.0
        with:
          title: Publish Notion Page
          publication_id: '[Publication ID (from URL)]'
          format: notion
          markdown: '[URL to Notion page]'
          access_token: '${{ secrets.HASHNODE_ACCESS_TOKEN }}'
          notion_token: '${{ secrets.NOTION_TOKEN }}'
      - name: Get the publication url
        run: echo "The Publish url was ${{ steps.publish.outputs.url }}"
```