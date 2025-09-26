import { Hono } from 'hono'

const app = new Hono()

const welcomeStrings = [
  'Hello Hono!'
]

app.get('/', (c) => {
  return c.text(welcomeStrings.join('\n\n'))
})

export default app
