import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  function updateTodo(todo: Schema["Todo"]["type"]) {
    const updatedContent = window.prompt("Enter the updated todo content", todo.content);
    if (updatedContent && updatedContent !== todo.content) {
      client.models.Todo.update({
        id: todo.id,
        content: updatedContent,
      });
    }
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content"), });
  }

  return (
    <Authenticator>
      <main>
        <h1>My todos</h1>
        <button onClick={createTodo}>+ new</button>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <span>{todo.content}</span>
              <div className="todo-actions">
                <button onClick={() => updateTodo(todo)}>✏️</button>
                <button onClick={() => deleteTodo(todo.id)}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </Authenticator>
  );
}