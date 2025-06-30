import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  tasks: { id: number; title: string; description: string; completed: boolean; editing: boolean }[] = [];
  newTask: string = '';
  isAuthenticated = false;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.isAuthenticated = !!localStorage.getItem('token');
    if (this.isAuthenticated) {
      this.fetchTasks();
    }

    // Request notification permission from the user
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    setInterval(() => {
      this.showTaskNotification();
    }, 3600000); // Every 60 mins
  }

    fetchTasks() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    this.http.get<any>('http://localhost:3002/api/tasks', { headers }).subscribe({
      next: (response) => {
        // On récupère le tableau dans response.tasks
        this.tasks = response.tasks.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          completed: task.completed,
          editing: false
        }));
      },
      error: () => {
        this.tasks = [];
      }
    });
  }

  private showTaskNotification() {
    const userName = localStorage.getItem('userName') || 'User';
    const appName = localStorage.getItem('appName') || 'Todo App';

    if (Notification.permission === "granted") {
      let notificationMessage = '';

      if (this.remainingTasks > 0) {
        notificationMessage = `Hey ${userName}, you have ${this.remainingTasks} tasks to complete! ✅`;
      } else {
        notificationMessage = `Hey ${userName}, you have no tasks! Add new tasks in "${appName}" to stay productive. 🚀`;
      }

      const notification = new Notification("🚀 Reminder!", {
        body: notificationMessage,
        icon: "/favicon.png"
      });

      notification.onclick = () => {
        window.focus();
        this.router.navigate(['/todos']);
      };
    } else {
      if ("Notification" in window) {
        Notification.requestPermission();
      }
    }
  }

  addTask() {
    if (this.newTask.trim()) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      this.http.post<any>('http://localhost:3002/api/tasks', {
        title: this.newTask,
        description: '',
        completed: false
      }, { headers }).subscribe({
        next: (createdTask) => {
          this.tasks.unshift({
            id: createdTask.task.id,
            title: createdTask.task.title,
            description: createdTask.task.description,
            completed: createdTask.task.completed,
            editing: false
          });
          this.newTask = '';
        },
        error: () => {
          alert('Erreur lors de la création de la tâche');
        }
      });
    }
  }

  toggleTaskCompletion(index: number) {
    const task = this.tasks[index];
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.put<any>(`http://localhost:3002/api/tasks/${task.id}`, {
      completed: !task.completed
    }, { headers }).subscribe({
      next: (updatedTask) => {
        this.tasks[index].completed = updatedTask.completed;
      },
      error: () => {
        alert('Erreur lors de la mise à jour de la tâche');
      }
    });
  }

  toggleEditTask(index: number) {
    if (this.tasks[index].editing) {
      // Save changes
      const task = this.tasks[index];
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      this.http.put<any>(`http://localhost:3002/api/tasks/${task.id}`, {
        title: task.title,
        description: task.description
      }, { headers }).subscribe({
        next: () => {
          this.tasks[index].editing = false;
        },
        error: () => {
          alert('Erreur lors de la modification de la tâche');
        }
      });
    } else {
      this.tasks[index].editing = true;
    }
  }

  deleteTask(index: number) {
    const task = this.tasks[index];
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.delete<any>(`http://localhost:3002/api/tasks/${task.id}`, { headers }).subscribe({
      next: () => {
        this.tasks.splice(index, 1);
      },
      error: () => {
        alert('Erreur lors de la suppression de la tâche');
      }
    });
  }

  get remainingTasks() {
    return this.tasks.filter(task => !task.completed).length;
  }

  get completedTasks() {
    return this.tasks.filter(task => task.completed).length;
  }
}