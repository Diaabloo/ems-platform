const fs = require("fs");

console.log("🚀 PRE-BUILD: Removing .babelrc to force SWC...");

// Delete .babelrc if it exists
if (fs.existsSync(".babelrc")) {
  fs.unlinkSync(".babelrc");
  console.log("✅ .babelrc deleted");
} else {
  console.log("ℹ️ No .babelrc found");
}

// Also delete any other babel configs
[".babelrc.js", "babel.config.js", "babel.config.json"].forEach((file) => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`✅ ${file} deleted`);
  }
});

console.log("✅ PRE-BUILD completed - SWC will be used");
