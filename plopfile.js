module.exports = function (plop) {
  // controller generator
  plop.setGenerator("create-module", {
    description: "Creates modules.",
    prompts: [
      {
        type: "input",
            name: "name",
            validate: (v) => {
                const isCapitalizedAndNumbersOnly = /[A-Z][a-zA-Z]+/;
                if (isCapitalizedAndNumbersOnly.test(v)) { return true };
                return "First letter must be capitalized and it shouldn't include numbers."
        },
        message: "Create a module containing state, view, and container.",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/{{name}}.js",
        templateFile: "plop-templates/controller.hbs",
      },
    ],
  });
};
