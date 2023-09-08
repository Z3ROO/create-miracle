#!/usr/bin/env node

const prompts = require("prompts");
const fs = require("fs/promises");
const path = require("path");
const { execSync } = require("child_process");

const cwd = process.cwd();

(async function() {
  
  const config = await prompts([{
    name: 'projectName',
    type: 'text',
    message: 'Project name',
    validate: val => val.length > 10 ? 'Name too long' : true
  }]);

  const projectDir = path.join(cwd, config.projectName);
  
  await fs.mkdir(projectDir);
  try {
    execSync(`npm init -y --name=${config.projectName}`, { cwd: projectDir });
  }
  catch(err) {
    console.log('Something went wrong when trying to create package.json');
    console.log(err);
    return;
  }
  console.log("Package.json succesfully created.");

  let packageJson = await fs.readFile(path.join(projectDir, 'package.json'), 'utf8');
    packageJson = JSON.parse(packageJson);

  packageJson.scripts = {
    test: 'test script',
    build: './node_modules/@z3ro/dist/scripts/build.js',
    dev: './node_modules/@z3ro/dist/scripts/dev.js'
  }

  packageJson.dependencies = {
    '@z3ro/miracle': '^0.1.2'
  }

  packageJson = JSON.stringify(packageJson, null, 2);

  await fs.writeFile(path.join(projectDir, 'package.json'), packageJson, 'utf8');
  
  await fs.mkdir(path.join(projectDir, 'public'));
  
  const html = `
<html>
  <head>
    <title>Miracle App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`.trim();

  await fs.writeFile(path.join(projectDir, 'public', 'index.html'), html, 'utf8');

  const indexTsx = `

import Miracle from "@z3ro/miracle";

const App = <div><h1>Teste app</h1></div>;

Miracle.render(App, document.getElementById("root"));

`.trim();

  await fs.mkdir(path.join(projectDir, 'src'));
  await fs.writeFile(path.join(projectDir, 'src', 'index.tsx'), indexTsx, 'utf8');


})();
