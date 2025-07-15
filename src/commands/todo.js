#!/usr/bin/env node

const { program } = require("commander");
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "tasks.json");

// Khởi tạo file nếu chưa tồn tại
function loadTasks() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf-8");
}

// 📌 Lệnh: `add`
program
  .command("add <task>")
  .description("Thêm task mới")
  .action((task) => {
    const tasks = loadTasks();
    const id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    tasks.push({ id: id, task: task, done: false });
    saveTasks(tasks);
    console.log(`✅ Đã thêm: [${id}] ${task}`);
  });

// 📌 Lệnh: `list`
program
  .command("list")
  .description("Hiển thị danh sách task")
  .action(() => {
    const tasks = loadTasks();
    if (tasks.length === 0) {
      console.log("📭 Danh sách rỗng!");
      return;
    }
    tasks.forEach((t) => {
      const status = t.done ? "✅" : "❌";
      console.log(`[${t.id}] ${status} ${t.task}`);
    });
  });

// 📌 Lệnh: `done <id>`
program
  .command("done <id>")
  .description("Đánh dấu task đã hoàn thành")
  .action((id) => {
    const tasks = loadTasks();
    const task = tasks.find((t) => t.id === parseInt(id));
    if (!task) {
      console.log(`❗ Không tìm thấy task ID ${id}`);
      return;
    }
    task.done = true;
    saveTasks(tasks);
    console.log(`👍 Đã đánh dấu hoàn thành: [${id}] ${task.task}`);
  });

// 📌 Lệnh: `remove <id>`
program
  .command("remove <id>")
  .description("Xoá task theo ID")
  .action((id) => {
    let tasks = loadTasks();
    const before = tasks.length;
    tasks = tasks.filter((t) => t.id !== parseInt(id));
    if (tasks.length === before) {
      console.log(`❗ Không tìm thấy task ID ${id}`);
    } else {
      saveTasks(tasks);
      console.log(`🗑️ Đã xoá task ID ${id}`);
    }
  });

program.parse();
