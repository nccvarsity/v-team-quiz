function flickSwitch() {
  const mode = document.getElementById("mode-link");
  const theme = document.getElementById("theme-link");
  if (dark) {
    theme.href = "app-dark.css";
    mode.src = "moon.png";
    document.querySelectorAll("ellipse, path").forEach(function(item, index) {
      setTimeout(function() {
        item.setAttribute("stroke", "#F7F7F7");
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
    theme.href = "app.css";
    mode.src = "sun.png";
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
    }
    
  }


}
