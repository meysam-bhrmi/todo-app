import connectDb from '../../../lib/connectDb';
import Todo from '../../../models/Todo';
import { httpRequestDurationMicroseconds } from '../../../lib/metrics';

export default async function handler(req, res) {
  const end = httpRequestDurationMicroseconds.startTimer();
  const { method, query: { id }, body } = req;

  await connectDb();

  try {
    switch (method) {
      case 'PUT':
        const todo = await Todo.findById(id);
        if (!todo) {
          res.status(404).json({ success: false, message: 'Todo not found' });
        } else {
          todo.completed = body.completed !== undefined ? body.completed : todo.completed;
          todo.important = body.important !== undefined ? body.important : todo.important;
          await todo.save();
          res.status(200).json({ success: true, data: todo });
        }
        break;

      // Handle other methods (GET, DELETE, etc.) here

      default:
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    end({ method, route: `/api/todo/${id}`, status_code: res.statusCode });
  }
}

