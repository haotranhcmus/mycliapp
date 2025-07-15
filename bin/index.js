#!/usr/bin/env node
// bin/index.js

const { program } = require("commander");

// Ví dụ gọi lệnh todo
program
  .command("todo")
  .description("Todo manager")
  .action(() => {
    require("../src/commands/todo")();
  });

// Thêm các lệnh khác tương tự...
program.parse();
