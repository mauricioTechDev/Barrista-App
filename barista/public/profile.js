let lis = document.querySelectorAll("li")
let backToHomeButton = document.querySelector(".backToHomePage")



Array.from(lis).forEach(function(el){
  el.addEventListener("click", function(){
    let name = this.childNodes[1].innerText
    let order = this.childNodes[3].innerText
    let section = document.querySelector("section")
    let barista = document.querySelector("h1").innerText
    this.style.display = "none"
    fetch("completed", {
      method: "post",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'order': order,
        'barista':barista
      })
    })
    .then(response => {
      console.log(name,order)
      fetch('order', {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'name': name,
          'order': order
        })
      }).then(function (response) {
        var textNode = document.createElement("p")
        textNode.textContent = `${name}'s, ${order} made by ${barista} is ready`
        section.appendChild(textNode)
      })
    })
  })
})
