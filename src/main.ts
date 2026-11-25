
import './style.css'

interface Task {
  id: number
  title: string
  course: string
  deadline: string
  completed: boolean
}

const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Membuat laporan praktikum',
    course: 'Pemrograman Web',
    deadline: '2026-11-25',
    completed: false
  },
  {
    id: 2,
    title: 'Mengerjakan tugas basis data',
    course: 'Manajemen Basis Data',
    deadline: '2026-11-27',
    completed: true
  }
]

function loadTasks(): Task[] {
  const savedTasks = localStorage.getItem('taskmate-tasks')

  if (savedTasks) {
    try {
      return JSON.parse(savedTasks) as Task[]
    } catch {
      return initialTasks
    }
  }

  return initialTasks
}

let tasks: Task[] = loadTasks()

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <header class="app-header">
    <h1>TaskMate</h1>
    <p>Kelola tugas kuliahmu dengan lebih mudah ♡</p>
  </header>

  <nav class="navbar">
    <a href="#beranda">Beranda</a>
    <a href="#tugas">Daftar Tugas</a>
  </nav>

  <main class="main-container">
    <section class="welcome-section" id="beranda">
      <h2>Halo, Mahasiswa! ♡</h2>
      <p>Selamat datang di TaskMate. Yuk, atur tugas kuliahmu agar lebih terorganisir.</p>
    </section>

    <section class="task-section" id="tugas">
      <h2>Tambah Tugas</h2>

      <form class="task-form" id="task-form">
        <input type="text" id="task-title" placeholder="Nama tugas" required>
        <input type="text" id="task-course" placeholder="Mata kuliah" required>
        <input type="date" id="task-deadline" required>
        <button type="submit" class="btn-primary">+ Tambah</button>
      </form>
    </section>

    <section class="task-section">
      <h2>Daftar Tugas</h2>
      <div class="task-list" id="task-list"></div>
    </section>
  </main>

  <footer class="app-footer">
    <p>TaskMate © 2026 | Stay organized, stay productive ♡</p>
  </footer>
`

const form = document.querySelector<HTMLFormElement>('#task-form')!
const titleInput = document.querySelector<HTMLInputElement>('#task-title')!
const courseInput = document.querySelector<HTMLInputElement>('#task-course')!
const deadlineInput = document.querySelector<HTMLInputElement>('#task-deadline')!
const taskList = document.querySelector<HTMLDivElement>('#task-list')!

function saveTasks(): void {
  localStorage.setItem('taskmate-tasks', JSON.stringify(tasks))
}

function escapeHTML(text: string): string {
  return text.replace(/[&<>"']/g, character => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }

    return entities[character]
  })
}

function renderTasks(): void {
  if (tasks.length === 0) {
    taskList.innerHTML = '<p class="empty-message">Belum ada tugas. Yuk, tambahkan tugas pertamamu!</p>'
    return
  }

  taskList.innerHTML = tasks.map(task => `
    <article class="task-card ${task.completed ? 'completed' : ''}">
      <div class="task-info">
        <h3>${escapeHTML(task.title)}</h3>
        <p>${escapeHTML(task.course)}</p>
        <p>Deadline: ${escapeHTML(task.deadline)}</p>
        <p>Status: ${task.completed ? 'Selesai' : 'Belum Selesai'}</p>
      </div>

      <div class="task-actions">
        <button class="btn-status" data-action="status" data-id="${task.id}">
          ${task.completed ? 'Belum Selesai' : 'Selesai'}
        </button>
        <button class="btn-edit" data-action="edit" data-id="${task.id}">Edit</button>
        <button class="btn-delete" data-action="delete" data-id="${task.id}">Hapus</button>
      </div>
    </article>
  `).join('')
}

form.addEventListener('submit', (event: SubmitEvent) => {
  event.preventDefault()

  const title = titleInput.value.trim()
  const course = courseInput.value.trim()
  const deadline = deadlineInput.value

  if (!title || !course || !deadline) {
    alert('Semua kolom harus diisi!')
    return
  }

  const newTask: Task = {
    id: Date.now(),
    title,
    course,
    deadline,
    completed: false
  }

  tasks.push(newTask)
  saveTasks()
  renderTasks()
  form.reset()

  alert('Tugas berhasil ditambahkan!')
})

taskList.addEventListener('click', (event: MouseEvent) => {
  const target = event.target

  if (!(target instanceof HTMLButtonElement)) return

  const action = target.dataset.action
  const id = Number(target.dataset.id)
  const task = tasks.find(item => item.id === id)

  if (!task) return

  if (action === 'status') {
    task.completed = !task.completed
  }

  if (action === 'delete') {
    const confirmed = confirm('Yakin ingin menghapus tugas ini?')

    if (!confirmed) return

    tasks = tasks.filter(item => item.id !== id)
  }

  if (action === 'edit') {
    const newTitle = prompt('Ubah nama tugas:', task.title)

    if (newTitle === null) return

    const newCourse = prompt('Ubah mata kuliah:', task.course)

    if (newCourse === null) return

    const newDeadline = prompt('Ubah deadline (YYYY-MM-DD):', task.deadline)

    if (newDeadline === null) return

    if (!newTitle.trim() || !newCourse.trim() || !newDeadline.trim()) {
      alert('Data tugas tidak boleh kosong!')
      return
    }

    task.title = newTitle.trim()
    task.course = newCourse.trim()
    task.deadline = newDeadline.trim()
  }

  saveTasks()
  renderTasks()
})

renderTasks()
