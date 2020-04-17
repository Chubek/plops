module.exports = function (plop) {
  plop.addHelper("lowerCase", (text) => text.toLowerCase());
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
        path: "./modules/{{lowerCase name}}/{{name}}Constants.js",
        templateFile: "plop-templates/ConstantsTemplate.hbs",
      },
      {
        type: "add",
        path: "./modules/{{lowerCase name}}/{{name}}State.js",
        templateFile: "plop-templates/StateTemplate.hbs",
      },
      {
        type: "modify",
        path: "./modules/{{lowerCase name}}/{{name}}State.js",
        transform(fileContents, data) {
          return fileContents.replace(/NAME/g, name);
        },
      },
      {
        type: "add",
        path: "./modules/{{lowerCase name}}/{{name}}View.js",
        templateFile: "plop-templates/ViewTemplate.hbs",
      },
      {
        type: "modify",
        path: "./modules/{{lowerCase name}}/{{name}}View.js",
        transform(fileContents, data) {
          return fileContents.replace(/NAME/g, name);
        },
      },
      {
        type: "add",
        path: "./modules/{{lowerCase name}}/{{name}}ViewContainer.js",
        templateFile: "plop-templates/ViewContainerTemplate.hbs",
      },
      {
        type: "modify",
        path: "./modules/{{lowerCase name}}/{{name}}ViewContainer.js",
        transform(fileContents, data) {
          return fileContents.replace(/NAME/g, name);
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
        path: "./redux/reducer.js",
        templateFile: "plop-templates/ReducerTemplate.hbs",
      },
      {
        type: "add",
        path: "./redux/store.js",
        templateFile: "plop-templates/StoreTemplate.hbs",
      },
    ],
  });
  module.exports = function (plop) {
    // controller generator
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
        () => {
          process.chdir(plop.getPlopfilePath());
          const fs = require("fs");

          let data = fs
            .readFileSync("./redux/reducer.js")
            .toString()
            .split("\n");
          let importsLine = null;
          let combinesLine = null;

          data.forEach((datum, index) => {
            if (datum === "//imports") {
              importsLine = index;
            } else if (datum === "//combines") {
              combinesLine = index;
            }
          });

          data.splice(
            importsLine,
            1,
            `import ${reducerAlias} from "../modules/${moduleName.toLowerCase()}/${moduleName}State`
          );
          data.splice(combinesLine, 1, reducerAlias);

          const text = data.join("\n");

          fs.writeFile("./redux/reducer.js", text, function (err) {
            if (err) return console.log(err);
          });
        },
      ],
    });
  };
};
