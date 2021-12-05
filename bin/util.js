const envinfo = require("envinfo");
const validateProjectName =  require('validate-npm-package-name'); 
const https = require('https');


//To do  add  Dependencies 
const  baseDependencies = ["react", "react-dom", "react-router-dom"];



const printEnvinfo = () => {
  envinfo
    .run(
      {
        System: ["OS", "CPU"],
        Binaries: ["Node", "npm", "Yarn"],
        Browsers: ["Chrome", "Edge", "Internet Explorer", "Firefox", "Safari"],
        npmPackages: [...baseDependencies],
        npmGlobalPackages: ["cli-demo"],
      },
      {
        duplicates: true,
        showNotFound: true,
      }
    )
    .then(console.log);
};


  const   checkAppName=(appName) =>{
      //  判断创建文件名 的有效性；
    const validationResult = validateProjectName(appName);
    if (!validationResult.validForNewPackages) {
      console.error(
        chalk.red(
          `Cannot create a project named ${chalk.green(
            `"${appName}"`
          )} because of npm naming restrictions:\n`
        )
      );
      [
        ...(validationResult.errors || []),
        ...(validationResult.warnings || []),
      ].forEach(error => {
        console.error(chalk.red(`  * ${error}`));
      });
      console.error(chalk.red('\nPlease choose a different project name.'));
      process.exit(1);
    }
    const dependencies = [...baseDependencies].sort();
    if (dependencies.includes(appName)) {
      console.error(
        chalk.red(
          `Cannot create a project named ${chalk.green(
            `"${appName}"`
          )} because a dependency with the same name exists.\n` +
            `Due to the way npm works, the following names are not allowed:\n\n`
        ) +
          chalk.cyan(dependencies.map(depName => `  ${depName}`).join('\n')) +
          chalk.red('\n\nPlease choose a different project name.')
      );
      process.exit(1);
    }
  }
    
  const  checkForLatestVersion =(cli_name)=> {
    return new Promise((resolve, reject) => {
      https
        .get(
          `https://registry.npmjs.org/-/package/${cli_name}/dist-tags`,
          res => {
            if (res.statusCode === 200) {
              let body = '';
              res.on('data', data => (body += data));
              res.on('end', () => {
                resolve(JSON.parse(body).latest);
              });
            } else {
              reject();
            }
          }
        )
        .on('error', () => {
          reject();
        });
    });
  }


  const  isUsingYarn=()=> {
    return (process.env.npm_config_user_agent || '').indexOf('yarn') === 0;
  }
  
  








module.exports = {
    printEnvinfo,
    checkAppName,
    checkForLatestVersion,
    isUsingYarn
};
