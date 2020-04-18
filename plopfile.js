module.exports = function (plop) {
  plop.addHelper("lowerCase", (text) => {
    return text
      .split(/(?=[A-Z])/)
      .join("-")
      .toLowerCase();
  });
  plop.setGenerator("create-module", {
    description:
      "Creates a module including State, Constants, View and Container.",
    prompts: [
      {
        type: "input",
        name: "name",
        validate: (v) => {
          const pattern = /[A-Z][a-zA-Z]+/;
          if (pattern.test(v)) {
            return true;
          }
          return "First letter must be capitalized. Can't contain numbers or special characters.";
        },
        message: "Module name. Must be capitalized and can't contain numbers.",
      },
    ],
    actions: [
      {
        type: "add",
        path: "./src/modules/{{lowerCase name}}/{{name}}Constants.js",
        templateFile: "plop-templates/ConstsTemplate.hbs",
      },
      {
        type: "add",
        path: "./src/modules/{{lowerCase name}}/{{name}}State.js",
        templateFile: "plop-templates/StateTemplate.hbs",
      },
      {
        type: "modify",
        path: "./src/modules/{{lowerCase name}}/{{name}}State.js",
        transform(fileContents, data) {
          return fileContents.replace(/NAME/g, data.name);
        },
      },
      {
        type: "add",
        path: "./src/modules/{{lowerCase name}}/{{name}}View.js",
        templateFile: "plop-templates/ViewTemplate.hbs",
      },
      {
        type: "modify",
        path: "./src/modules/{{lowerCase name}}/{{name}}View.js",
        transform(fileContents, data) {
          return fileContents.replace(/NAME/g, data.name);
        },
      },
      {
        type: "add",
        path: "./src/modules/{{lowerCase name}}/{{name}}ViewContainer.js",
        templateFile: "plop-templates/ViewContainerTemplate.hbs",
      },
      {
        type: "modify",
        path: "./src/modules/{{lowerCase name}}/{{name}}ViewContainer.js",
        transform(fileContents, data) {
          return fileContents.replace(/NAME/g, data.name);
        },
      },
    ],
  });

  plop.setGenerator("create-component", {
    description: "Creates component.",
    prompts: [
      {
        type: "input",
        name: "name",
        validate: (v) => {
          const pattern = /[A-Z][a-zA-Z]+/;
          if (pattern.test(v)) {
            return true;
          }
          return "First letter must be capitalized. Can't contain numbers or special characters.";
        },
        message:
          "Component name. Must be capitalized and can't contain numbers.",
      },
    ],
    actions: [
      {
        type: "add",
        path: "./src/components/{{name}}.js",
        templateFile: "plop-templates/StatelessComponentTemplate.hbs",
      },
      {
        type: "modify",
        path: "./src/components/{{name}}.js",
        transform(fileContents, data) {
          return fileContents.replace(/NAME/g, data.name);
        },
      },
    ],
  });

  plop.setGenerator("create-redux", {
    description: "Creates redux folder.",
    prompts: [],
    actions: [
      {
        type: "add",
        path: "./src/redux/reducer.js",
        templateFile: "plop-templates/ReducerTemplate.hbs",
      },
      {
        type: "add",
        path: "./src/redux/store.js",
        templateFile: "plop-templates/StoreTemplate.hbs",
      },
    ],
  });
  plop.setGenerator("append-reducer", {
    description: "Append your module to reducer file.",
    prompts: [
      {
        type: "input",
        name: "moduleName",
        validate: (v) => {
          const pattern = /[A-Z][a-zA-Z]+/;
          if (pattern.test(v)) {
            return true;
          }
          return "First letter must be capitalized. Can't contain numbers or special characters.";
        },
        message:
          "Name of your module. Just like you entered it. It must be capitalized, and have no numbers or special characters",
      },
      {
        type: "input",
        name: "reducerAlias",
        message: "Alias for your reducer",
      },
    ],
    actions: [
      (vars) => {
        process.chdir(plop.getPlopfilePath());
        const fs = require("fs");

        let data = fs
          .readFileSync("./src/redux/reducer.js")
          .toString()
          .split("\n");
        let importsLine = null;
        let combinesLine = null;

        data.forEach((datum, index) => {
          if (datum.match(/\/\/imports/)) {
            importsLine = index;
          } else if (datum.match(/\/\/combines/)) {
            combinesLine = index;
          }
        });

        data.splice(
          importsLine + 2,
          0,
          `import ${vars.reducerAlias} from "../src/modules/${vars.moduleName
            .split(/(?=[A-Z])/)
            .join("-")
            .toLowerCase()}/${vars.moduleName}State";`
        );
        data.splice(combinesLine + 2, 0, vars.reducerAlias + ",");

        const text = data.join("\n");

        fs.writeFile("./src/redux/reducer.js", text, function (err) {
          if (err) return console.error(err);
          return console.log(
            plop.renderString(
              "Module {{moduleName}} added to reducer.js as {{reducerAlias}}.",
              vars
            )
          );
        });
      },
    ],
  });
};
