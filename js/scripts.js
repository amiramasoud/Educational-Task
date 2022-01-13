//variables
let answerIcon = document.querySelectorAll(".answer__icon"),
  answerIconArray = Array.from(answerIcon),
  showAnswerIcon = document.querySelector(".footer__icon--2"),
  options = document.querySelectorAll(".option"),
  optionsArray = Array.from(options),
  correctOptions = document.querySelectorAll(".option__correct"),
  correctOptionsArray = Array.from(correctOptions),
  answersCells = document.querySelectorAll(".answer"),
  answerCellsArray = Array.from(answersCells),
  audio = document.querySelector("audio"),
  optionsParent = document.querySelector(".options"),
  answers = document.querySelector(".answers"),
  refreshIcon = document.querySelector(".footer__icon--1"),
  loader = document.getElementById("loader"),
  closeIcon = document.querySelector(".close-icon"),
  helpIcon = document.querySelector(".help-icon"),
  resourceIcon = document.querySelector(".resource-icon"),
  whiteWindow = document.querySelector(".white-window"),
  helpContent = document.querySelector(".help-content"),
  resourceImage = document.querySelector(".resource-image")

//start preloading
window.onload = function () {
  loader.classList.add("disapear")
}
// end preloading

///////////////////// start resizing the page////////////////

var pageWidth, pageHeight

var basePage = {
  width: 800,
  height: 600,
  scale: 1,
  scaleX: 1,
  scaleY: 1
}

$(function () {
  var $page = $(".page_content")

  getPageSize()
  scalePages($page, pageWidth, pageHeight)

  $(window).resize(
    _.debounce(function () {
      getPageSize()
      scalePages($page, pageWidth, pageHeight)
    }, 150)
  )

  function getPageSize() {
    pageHeight = $("#container").height()
    pageWidth = $("#container").width()
  }

  function scalePages(page, maxWidth, maxHeight) {
    var scaleX = 1,
      scaleY = 1
    scaleX = maxWidth / basePage.width
    scaleY = maxHeight / basePage.height
    basePage.scaleX = scaleX
    basePage.scaleY = scaleY
    basePage.scale = scaleX > scaleY ? scaleY : scaleX

    var newLeftPos = Math.abs(Math.floor((basePage.width * basePage.scale - maxWidth) / 2))

    page.attr("style", "-webkit-transform:scale(" + basePage.scale + ");left:" + newLeftPos + "px;top:" + 0 + "px;")
  }
})
//////////////// end resizing the page////////////////////

//////////////// start adding answers //////////////////////

function startAnswer() {
  for (i = 0; i < optionsArray.length; i++) {
    optionsArray[i].classList.add("not-selected")
    optionsArray[i].onclick = function () {
      removeActive()
      //add active class to selected option
      this.classList.add("active")
      //send selected option
      addAnswer(this)
    }
  }
}

startAnswer()
//remove active
function removeActive() {
  for (i = 0; i < optionsArray.length; i++) {
    optionsArray[i].classList.remove("active")
  }
}

//////////////////add selected option to an answer cell /////////////

function addAnswer(selectedOption) {
  answerCellsArray.map(cell => {
    cell.parentElement.classList.remove("stop")
    cell.style.cursor = "pointer"
    let optionAttribute = selectedOption.getAttribute("data-option")
    cell.onclick = function () {
      cell.setAttribute("data-option", optionAttribute)
      let imgIcon = document.createElement("img")

      let optionValue = selectedOption.innerHTML
      cell.innerHTML = optionValue
      cell.appendChild(imgIcon)
      if (cell.dataset.option === "correct") {
        selectedOption.style.visibility = "hidden"
        imgIcon.setAttribute("src", "assets/imgs/tikMark-small.png")
        imgIcon.setAttribute("class", "correct-icon")
        cell.parentElement.classList.add("stop")
        selectedOption.classList.remove("not-selected")
        audio.src = "assets/audios/correct.mp3"
        audio.play()
        cell.classList.add("stop")
      } else {
        imgIcon.setAttribute("src", "assets/imgs/crossMark-small.png")
        imgIcon.setAttribute("class", "incorrect-icon")
        audio.src = "assets/audios/incorrect.mp3"
        cell.parentElement.classList.add("stop")
        imgIcon.classList.add("animate")
        audio.play()
        setTimeout(() => {
          cell.parentElement.classList.remove("stop")
          cell.innerHTML = ""
        }, 500)
      }

      let notSelectedOptions = []
      for (i = 0; i < optionsArray.length; i++) {
        if (optionsArray[i].classList.contains("not-selected")) {
          notSelectedOptions.push(optionsArray[i])
        }
      }

      if (notSelectedOptions.length == 3) {
        notSelectedOptions.map(option => {
          option.classList.add("prevent")
          option.classList.remove("not-selected")
        })
        showAnswerIcon.classList.add("prevent")
      }
    }
  })
}

/////////////////show answers ////////////////////////

showAnswerIcon.onclick = function () {
  showAnswers(correctOptionsArray)
  showAnswerIcon.classList.add("prevent")
  answers.classList.add("stop")
  removeActive()
}

function showAnswers(options) {
  let answersValues = []
  for (i = 0; i <= options.length - 1; i++) {
    answersValues.push(options[i].innerHTML)
    options[i].style.visibility = "hidden"
    options[i].parentElement.classList.add("prevent")
  }
  addAnswers(answerCellsArray, answersValues)
  function addAnswers(cells, values) {
    for (i = 0; i <= cells.length - 1; i++) {
      cells[i].innerHTML = values[i] + '<img src="assets/imgs/tikMark-small.png" alt="" class="correct-icon" />'
    }
  }
}
////////////////end show answers ///////////////////

/////////////////start refresh button///////////////

refreshIcon.onclick = function () {
  showAnswerIcon.classList.remove("prevent")
  answerCellsArray.map(cell => {
    cell.innerHTML = ""
    cell.classList.remove("stop")
  })

  optionsArray.map(option => {
    answers.classList.add("stop")
    option.style.visibility = "visible"
    option.parentElement.classList.remove("prevent")
    option.classList.remove("prevent")
    option.classList.remove("active")
    option.classList.add("not-selected")
  })
}

///////////////end refresh button////////////////////

////////////// start header icons functions////////////

resourceIcon.onclick = function () {
  whiteWindow.style.display = "flex"
  helpContent.style.display = "none"
  resourceImage.style.display = "block"
}
helpIcon.onclick = function () {
  whiteWindow.style.display = "flex"
  resourceImage.style.display = "none"
  helpContent.style.display = "block"
}

closeIcon.onclick = closeWindow
function closeWindow() {
  whiteWindow.style.display = "none"
}

////////////// end header icons functions////////////
