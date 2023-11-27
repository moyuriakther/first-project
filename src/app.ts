import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import globalErrorHandler from './app/middleware/globalErrorHandler'
import notFound from './app/middleware/notFound'
import router from './app/routes'

const app: Application = express()
// const port = 3000;

//parser
app.use(express.json())
app.use(cors())

//application routes
app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.use(globalErrorHandler)

// not found
app.use(notFound)

export default app
