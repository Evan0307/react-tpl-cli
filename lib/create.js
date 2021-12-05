const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const Generator = require('./generator')


module.exports = async function (name, options) {
  const cwd = process.cwd();
  // 需要创建的目录地址
  const targetDir = path.join(cwd, name);

  if (fs.existsSync(targetDir)) {
    // 是否为强制创建？
    if (options.force) {
      await fs.remove(targetDir);
    } else {
      const { action } = await inquirer.prompt([
        {
          name: "action",
          type: "list",
          message: "Target directory already exists Pick an action:",
          choices: [
            {
              name: "Overwrite",
              value: "overwrite",
            },
            {
              name: "Cancel",
              value: false,
            },
          ],
        },
      ]);

      if (!action) {  return; }
      if (action === "overwrite") {  fs.remove(targetDir);  }
    }
  }


    // 创建项目
    const generatorCode = new Generator(name, targetDir);

    // 开始创建项目
    generatorCode.createTemplates()






};
