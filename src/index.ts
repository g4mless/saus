import { Hono } from 'hono'
import { html } from 'hono/html'
import fetch from 'node-fetch'

const app = new Hono()

app.get('/:screen_name/status/:id', async (c) => {
  const id = c.req.param('id')
  
  const apiUrl = `https://api.fxtwitter.com/status/${id}`
  try {
    const response = await fetch(apiUrl)
    const data: any = await response.json();

    if (typeof data !== 'object' || data === null || data.code !== 200) {
      return c.text('Not found', 404)
    }

    const actual_screen_name = data.tweet?.author?.screen_name
    let mediaUrl = ''

    if (data.tweet.media?.photos?.[0]?.url) {
        mediaUrl = data.tweet.media.photos[0].url
    } else if (data.tweet.media?.videos?.[0]?.thumbnail_url) {
        mediaUrl = data.tweet.media.videos[0].thumbnail_url
    }

    if (!mediaUrl) {
      return c.text('No media found in tweet', 404)
    }

    return c.html(html`
      <html>
        <head>
          <meta property="og:title" content="Tweet by @${actual_screen_name}" />
          <meta property="og:image" content="${mediaUrl}" />
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:creator" content="@${actual_screen_name}">
          <meta name="twitter:title" content="Tweet by @${actual_screen_name}">
          <meta name="twitter:image" content="${mediaUrl}">
        </head>
        <body>
          <h1>Tweet by @${actual_screen_name}</h1>
          <img src="${mediaUrl}" alt="Tweet media" />
        </body>
      </html>
    `)
  } catch (error) {
    console.error('Error fetching tweet data:', error)
    return c.text('Error fetching tweet data', 500)
  }
})

export default app
