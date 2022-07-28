function flickSwitch() {
  // Select the stylesheet <link>
  const theme = document.getElementById("theme-link");
  if (dark) {
    // ... then switch it to "dark-theme.css"
    theme.href = "app-dark.css";
    document.querySelectorAll("ellipse, path").forEach(function(item, index) {
      setTimeout(function() {
        item.setAttribute("stroke", "white");
      }, 30 * (index + 1));
    });
    document.querySelectorAll("button").forEach(function(item) {
      item.classList.toggle("border-black");
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
        item.setAttribute("stroke", "black");
      }, 30 * (index + 1));
    });
    document.querySelectorAll("button").forEach(function(item) {
      item.classList.toggle("border-black");
    });
    try {
      document.getElementById("go-to-start").classList.replace("border-black", "text-primary");
    } catch (e) {
      // do nothing
    }
    
  }


}
