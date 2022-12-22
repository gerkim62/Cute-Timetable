import { readCSV, getCourses, getDays, getFormartedTimestamps, createBlankTimetable, fillBlankTimetable, showProperties,hideProperties, showToast, showCsvUploadUI, hideCsvUploadUI, preventElementOverflow} from './functions.js'



let courses;

customBtn.addEventListener("click", function() {
  realFileBtn.click();
  
});

/*realFileBtn.addEventListener("change", async function() {
  if (realFileBtn.value) {
    customTxt.innerHTML = realFileBtn.value.match(
      /[\/\\]([\w\d\s\.\-\(\)]+)$/
    )[1];

    const csvFile = realFileBtn.files[0]



    const timetable = await new Timetable({ csvFile }).create({ themeColors, preferedCoursesIdentifier })
    //timetable.scaleToScreenWidth(timetable)
    //const html = await timetable.create({themeColors, preferedCoursesIdentifier})
    //console.log(timetable)
    timetableWrapperDiv.append(timetable)

  } else {
    customTxt.innerHTML = "No file chosen, yet.";
  }
});*/


const unscheduledLabel = 'No Class'


//const csvString = getCsvString()

const fileInput = document.getElementById('real-file');
fileInput.addEventListener('change', event => {
  const file = event.target.files[0];
  readCSV(file).then(csvString => {
    //console.log(csvString);

    courses = getCourses(csvString)
    //console.log(courses)
    const allDays = getDays(courses)
    ////console.log(allDays)
    const allTimestampsFormarted = getFormartedTimestamps(courses)
    ////console.log(allTimestampsFormarted)
    const blankTimetable = createBlankTimetable({ leftHeaders: allDays, topHeaders: allTimestampsFormarted, intersection: '<p>Time</p> <p>Days</p>', blankCellLabel: unscheduledLabel })
    ////console.log(blankTimetable)
    const finalTimetable = fillBlankTimetable(blankTimetable, courses, unscheduledLabel)

    console.log(finalTimetable)

    timetableContainer_div.append(finalTimetable)
    preventElementOverflow(finalTimetable, timetableContainer_div)
    hideCsvUploadUI()
  });
});

/*opening More properties of course*/

timetableContainer_div.addEventListener('click',e=>{
  const target = e.target
  target.classList.contains('scheduled')?showProperties(target.innerText.trim(), courses):target.classList.contains('unscheduled')?showToast('No class at that time.'):'';
  
})

/*ui elements*/

newTimetable_li.addEventListener('click',showCsvUploadUI)

closePropertiesCard_button.addEventListener('click', hideProperties)
propertiesCardOverlay_div.addEventListener('click', hideProperties)

