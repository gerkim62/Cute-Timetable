import { readCSV, getCourses, getDays, getFormartedTimestamps, createBlankTimetable, fillBlankTimetable, showProperties, hideProperties, showToast, showCsvUploadUI, hideCsvUploadUI, preventElementOverflow, hide, show, convertElementToImage, downloadImage, showLoader, hideLoader, showCustomInstallPrompt, storeTimetable, retrieveTimetables, createThemeInputs, getCurrentTheme, storeCurrentTheme } from './functions.js'

console.log(retrieveTimetables(), 'updated')
showToast('loaded')
let courses;

customBtn.addEventListener("click", function() {
  realFileBtn.click();

});


show(propertiesCard_div)
const unscheduledLabel = 'No Class'


//const csvString = getCsvString()

const fileInput = document.getElementById('real-file');
fileInput.addEventListener('change', event => {
  const file = event.target.files[0];
  console.log(file)
  readCSV(file).then((csvString,error) => {
    console.log({csvString,error});

    courses = getCourses(csvString)
    console.log(courses)


    //console.log(courses)
    const allDays = getDays(courses)
    if (allDays.length === 0) return showToast('Oops! That CSV does not seem to contain a valid timetable.', 5000)
    ////console.log(allDays)
    const allTimestampsFormarted = getFormartedTimestamps(courses)
    ////console.log(allTimestampsFormarted)
    const blankTimetable = createBlankTimetable({ leftHeaders: allDays, topHeaders: allTimestampsFormarted, intersection: '<p>Time</p> <p>Days</p>', blankCellLabel: unscheduledLabel })
    ////console.log(blankTimetable)
    const finalTimetable = fillBlankTimetable(blankTimetable, courses, unscheduledLabel)

    const timetable = {
      name: '',
      id: 1,
      courses,
      allDays,
      allTimestampsFormarted
    }

    storeTimetable(timetable)

    console.log(finalTimetable)

    timetableContainer_div.append(finalTimetable)
    preventElementOverflow(finalTimetable, timetableContainer_div)
    hideCsvUploadUI()
    show(cta_div)
  });
});

/*opening More properties of course*/

timetableContainer_div.addEventListener('click', e => {

  const target = e.target
  target.classList.contains('scheduled') ? showProperties(target.innerText.trim(), courses) : target.classList.contains('unscheduled') ? showToast('No class at that time.') : '';



})

/*ui elements*/

newTimetable_li.addEventListener('click', showCsvUploadUI)

closePropertiesCard_button.addEventListener('click', hideProperties)
propertiesCardOverlay_div.addEventListener('click', hideProperties, showLoader, hideLoader)

save_button.addEventListener('click', async () => {
  console.log('click')
  showLoader()
  hideProperties()
  showToast('Convertion started...')
  const timetable = timetableContainer_div
  const scale = 5
  const imageStyle = {
    transform: 'scale(' + scale + ')',
    transformOrigin: 'top left',
    width: timetable.offsetWidth + "px",
    height: timetable.offsetHeight + "px"
  }

  const imageOptions = {
    width: timetable.offsetWidth * scale,
    height: timetable.offsetHeight * scale,
    quality: 1,
    style: imageStyle
  }

  const timetableDataUrl = await convertElementToImage(timetable, imageOptions)

  //console.log(timetableDataUrl)
  downloadImage(timetableDataUrl, 'timetable.png')
  hideLoader()
  showToast('Convertion complete')
})

discard_button.addEventListener('click', () => {
  showCsvUploadUI()
  hide(cta_div)
  timetableContainer_div.querySelector('table').remove()
})

//service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/serviceWorker.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

//deferred events for sw
let prompted = false
window.addEventListener('beforeinstallprompt', (event) => {
  if (prompted) return
  event.preventDefault();
  showCustomInstallPrompt(event);
  prompted = true
});



/*themes*/

const themes = ['ocean-theme', 'desert-theme', 'forest-theme', 'teal-theme', 'olive-theme', 'maroon-theme', 'lime-theme', 'orange-theme', 'coral-theme', 'navy-theme', 'purple-theme', 'turquoise-theme', 'pink-theme', 'plum-theme', 'sky-theme', 'gold-theme', 'purple-sunshine'];

createThemeInputs(themesContainer_div, themes);

// Retrieve the current theme from local storage and apply it
const currentTheme = getCurrentTheme();
console.log(currentTheme)
if (currentTheme) {
  document.querySelector(`input[value="${currentTheme}"`).setAttribute('checked', true);
}

// Store the current theme in local storage when it changes
document.querySelectorAll('input[name="theme"]').forEach(input => {
  input.addEventListener('change', event => {
    storeCurrentTheme(event.target.value);
  });
});