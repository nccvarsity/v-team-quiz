function flickSwitch() {
  // Select the stylesheet <link>
  const theme = document.getElementById("theme-link");
  if (dark) {
    // ... then switch it to "dark-theme.css"
    theme.href = "app-dark.css";
    document.querySelectorAll("ellipse, path").forEach(function(item, index) {
      setTimeout(function() {
        item.setAttribute("stroke", "white");
      }, 50 * (index + 1));
    });
    document.querySelectorAll("button").forEach(function(item) {
      item.classList.remove("border-black");
      item.classList.add("border-white");
    });
    try {
      document.getElementById("go-to-start").classList.replace("border-black", "text-primary");
    } catch (e) {
      // do nothing
    };
  } else {
    // ... switch it to "light-theme.css"
    theme.href = "app.css";
    document.querySelectorAll("ellipse, path").forEach(function(item, index) {
      setTimeout(function() {
        item.setAttribute("stroke", "rgb(25,25,27)");
      }, 50 * (index + 1));
    });
    document.querySelectorAll("button").forEach(function(item) {
      item.classList.remove("border-white");
      item.classList.add("border-black");
    });
    try {
      document.getElementById("go-to-start").classList.replace("border-black", "text-primary");
    } catch (e) {
      // do nothing
    }
    
  }


}
