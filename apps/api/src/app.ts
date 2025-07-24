import createApp from '@/lib/create-app'
import index from '@/routes/index.route'
import auth from '@/routes/auth/auth.index'

const app = createApp()

app.route('/', index)
app.route('/api/auth', auth)

export default app