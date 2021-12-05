const program = require("commander");
const chalk = require("chalk");
const figlet = require("figlet");
const semver = require('semver');

const commander = require("commander");

const packageJson = require("../package.json");
const { printEnvinfo } = require("./util");

function init() {
  let projectName;

  const program = new commander.Command(packageJson.name)
    .version(packageJson.version, "-v, --version") //create-react-app -v 时候输出的值 packageJson 来自上面 const packageJson = require('./package.json');
    .arguments("<project-directory>") //定义 project-directory ，必填项
    .usage(`${chalk.green("<project-directory>")} [options]`)
    .action((name) => {
      projectName = name; //获取用户的输入，存为 projectName
    })
    .option("--verbose", "print additional logs")
    .option("--info", "print environment debug info")
    .option("--use-npm")
    .allowUnknownOption()
    .on("--help", () => {
      // on('option', cb) 语法，输入 create-react-app --help 自动执行后面的操作输出帮助
      console.log(
        `    Only ${chalk.green("<project-directory>")} is required.`
      );

      console.log(
        "\r\n" +
          figlet.textSync("web", {
            font: "Ghost",
            horizontalLayout: "default",
            verticalLayout: "default",
            width: 100,
            whitespaceBreak: true,
          })
      );
    })
    .parse(process.argv);

  if (program.info) {
    console.log(
      `\n  current version of ${packageJson.name}: ${packageJson.version}`
    );
    printEnvinfo();
    return;
  }

  if (typeof projectName === "undefined") {
    console.error("Please specify the project directory:");
    console.log(
      `  ${chalk.cyan(program.name())} ${chalk.green("<project-directory>")}`
    );
    process.exit(1);
  }


  checkForLatestVersion(packageJson.name)
  .catch(()=>{
    try{

     return execSync('npm view create-react-app version').toString().trim();

    }catch(err){
       return null
    }
  }).then(latest=>{
    if (latest && semver.lt(packageJson.version, latest)) {
      console.log();
      console.error(
        chalk.yellow(
          `You are running \`create-react-app\` ${packageJson.version}, which is behind the latest release (${latest}).\n\n` +
            'We no longer support global installation of Create React App.'
        )
      );
      console.log();
      console.log(
        'Please remove any global installs with one of the following commands:\n' +
          '- npm uninstall -g create-react-app\n' +
          '- yarn global remove create-react-app'
      );
      console.log();
      console.log(
        'The latest instructions for creating a new app can be found here:\n' +
          'https://create-react-app.dev/docs/getting-started/'
      );
      console.log();
      process.exit(1);
    } else {
      const useYarn = isUsingYarn();
      createApp(
        projectName,
        program.verbose,
        program.scriptsVersion,
        program.template,
        useYarn,
        program.usePnp
      );
    }



  })





}

program
  .command("create <app-name>")
  .description("create a new project")
  // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
  .option("-f, --force", "overwrite target directory if it exist")
  .action((name, options) => {
    require("../lib/create.js")(name, options);
  });

program.on("--help", () => {
  // 使用 figlet 绘制 Logo
  console.log(
    "\r\n" +
      figlet.textSync("web", {
        font: "Ghost",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 100,
        whitespaceBreak: true,
      })
  );

  console.log(
    `\r\n Run ${chalk.cyan(
      `wb <command> --help`
    )} for detailed usage of given command\r\n`
  );
});

module.exports = {
  init,
};
