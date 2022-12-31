export function cleanCsv(csv) {
  // Split the CSV into an array of rows
  const rows = csv.split('\n');

  // Initialize an array to store the cleaned rows
  const cleanedRows = [];

  // Iterate through the rows
  for (const row of rows) {
    // Remove the redundant quotation marks
    let cleanedRow = row.replace(/"/g, '');

    // Remove empty rows
    if (cleanedRow.trim() !== '') {
      cleanedRows.push(cleanedRow);
    }
  }

  // Join the cleaned rows into a single CSV string
  const cleanedCsv = cleanedRows.join('\n');

  return cleanedCsv;
}

export function getDays(courses) {
  const days = new Set();
  const order = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  for (const course of courses) {
    for (const day of course.days) {
      days.add(day.name);
    }
  }
  return Array.from(days).sort((a, b) => order.indexOf(a) - order.indexOf(b));
}
export function getTimestamps(courses) {
  const timestamps = [];
  courses.forEach(course => {
    course.days.forEach((day) => {
      const timestamp = {
        start: day.timestamps.start,
        end: day.timestamps.end
      };

      if (!timestamps.some(currentTimestamp => currentTimestamp.start === timestamp.start && currentTimestamp.end === timestamp.end)) {
        timestamps.push(timestamp);
      }
    });
  });
  return timestamps;
}

export const formatTimestamp = timestamp => {
  const start = convertTo12HourFormat(timestamp.start);
  const end = convertTo12HourFormat(timestamp.end);
  return `<p>${start}</p> <p>${end}</p>`;
};

export const convertTo12HourFormat = time => {
  let hours = Number(time.slice(0, 2));
  const minutes = time.slice(3, 5);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = hours < 10 ? `0${hours}` : hours;
  return `${hours}:${minutes}${ampm}`;
};

export function getFieldIndices(headerLine) {
  // Split the header line into fields
  const headerFields = headerLine.split(',');
  // Create a map of field indices
  const fieldIndices = {};
  for (let i = 0; i < headerFields.length; i++) {
    fieldIndices[headerFields[i].trim()] = i;
  }

  return fieldIndices;
}

export function getCourses(csv) {
  // Split the CSV into an array of rows
  const rows = cleanCsv(csv).split('\n');
  // Initialize an array to store the parsed objects
  const parsedObjects = [];

  const fieldIndices = getFieldIndices(rows[0])
  // Iterate through the rows, starting at the second row (since the first row contains the field names)
  for (let i = 1; i < rows.length; i++) {
    // Split the row into an array of values
    const values = rows[i].split(',');

    // Create a new object with the code and days fields
    const parsedObject = {
      code: values[fieldIndices['Course Code']],
      title: values[fieldIndices['Course Title']],
      instructor: values[fieldIndices['Instructor']],
      option: values[fieldIndices['Option']],
      venue: values[fieldIndices['Venue']],
      location: values[fieldIndices['Location']],
      building: values[fieldIndices['Building']],
      days: [
        values[fieldIndices['Mo']] === 'true' ? { name: 'Mo', timestamps: { start: values[0], end: values[1] } } : null,
        values[fieldIndices['Tu']] === 'true' ? { name: 'Tu', timestamps: { start: values[0], end: values[1] } } : null,
        values[fieldIndices['We']] === 'true' ? { name: 'We', timestamps: { start: values[0], end: values[1] } } : null,
        values[fieldIndices['Th']] === 'true' ? { name: 'Th', timestamps: { start: values[0], end: values[1] } } : null,
        values[fieldIndices['Fr']] === 'true' ? { name: 'Fr', timestamps: { start: values[0], end: values[1] } } : null,
        values[fieldIndices['Sa']] === 'true' ? { name: 'Sa', timestamps: { start: values[0], end: values[1] } } : null,
        values[fieldIndices['Su']] === 'true' ? { name: 'Su', timestamps: { start: values[0], end: values[1] } } : null
      ].filter(day => day !== null)
    };
    parsedObject.color = `  --color-course-${i}`
    // Push the object to the array
    parsedObjects.push(parsedObject);
  }
  return parsedObjects;
}

export function createBlankTimetable({ leftHeaders, topHeaders, intersection, blankCellLabel }) {
  const timetable_table = document.createElement('table')

  const topHeaders_tr = document.createElement('tr')
  const intersection_th = document.createElement('th')
  intersection_th.innerHTML = intersection
  topHeaders_tr.append(intersection_th)

  timetable_table.append(topHeaders_tr)

  topHeaders.forEach(topHeader => {
    const topHeader_th = document.createElement('th')
    topHeader_th.innerHTML = topHeader
    topHeaders_tr.append(topHeader_th)
  })

  leftHeaders.forEach(leftHeader => {
    const leftHeader_tr = document.createElement('tr')

    const headerName_th = document.createElement('th')
    headerName_th.innerHTML = leftHeader
    leftHeader_tr.append(headerName_th)

    topHeaders.forEach(topHeader => {
      const cell_td = document.createElement('td')
      cell_td.setAttribute(`data-top-header`, topHeader);
      cell_td.setAttribute(`data-left-header`, leftHeader);
      cell_td.innerHTML = blankCellLabel
      leftHeader_tr.append(cell_td)
      timetable_table.append(leftHeader_tr)
    })
  })

  return timetable_table
}

export function getCsvString() {
  const csv = `"Start","End","Mo","Tu","We","Th","Fr","Su","Lab","Lab","Course Code","Course Title","Instructor","Option","Venue","Location","Building"
06:00:00,07:00:00,true,false,true,false,true,false,false,false,"ENGL105","Writing Skills","Mungengo Baongoli  ","Group B","Amphitheater","Amphitheater",Library
08:00:00,09:30:00,false,true,false,true,false,false,false,false,"INSY119","Business Information Processing and Applications","Njoroge Roseline Nyamwamu ","Group B","L105A (Computer Lab A)","Information Systems and Computing ",Library
08:00:00,09:00:00,false,false,false,false,true,false,false,false,"PEAC107","Physical and Recreational Activities","Dr. Kinuthia Benson Ngigi ","Group C","Field","On or Off Campus",Open Field
08:00:00,09:00:00,true,false,true,false,false,false,false,false,"SOCI121","Introduction to Sociology","Dr. Odek Salome","Group B","Amphitheater","Amphitheater",Library
12:00:00,13:00:00,true,false,true,false,false,false,false,false,"RELH155","Adventist Heritage","Laurent Bisogho Kasay","Group B","H207A","First Floor",Humanities
12:00:00,13:00:00,false,true,false,true,false,false,false,false,"LITE151","Introduction to Literary Appreciation","Dr. Mooka Edward Erwin ","Group B","H207A","First Floor",Humanities
14:00:00,16:00:00,true,false,true,false,false,false,false,false,"ACCT111","Fundamentals Of Accounting I","Sharon Waley","Group C","H102","Ground Floor",Humanities

`

  const csv2 = `Start,End,Mo,Tu,We,Th,Fr,Sa,Su,Lab,Lab,Course Code,Course Title,Instructor,Option,Venue,Location,Building
09:00:00,10:30:00,true,true,true,true,true,true,true,false,false,"MATH120","Calculus I","Dr. Smith","Group A","H101","Ground Floor","Math Building"
11:00:00,12:30:00,true,true,true,true,true,true,true,false,false,"CHEM101","Introduction to Chemistry","Dr. Johnson","Group A","L101 (Lab A)","Ground Floor","Science Building"
13:00:00,14:30:00,true,true,true,true,true,true,true,false,false,"BIOL105","Introduction to Biology","Dr. Williams","Group B","L102 (Lab B)","Ground Floor","Science Building"
15:00:00,16:30:00,true,true,true,true,true,true,true,false,false,"PHYS101","Introduction to Physics","Dr. Brown","Group A","H202","Second Floor","Science Building"
17:00:00,18:30:00,true,true,true,true,true,true,true,false,false,"CSCI105","Introduction to Computer Science","Dr. Davis","Group B","L103 (Lab C)","Ground Floor","Computer Science Building"
`


  return csv
}

export function getFormartedTimestamps(courses) {
  const timestamps = getTimestamps(courses)

  return timestamps.map(timestamp => formatTimestamp(timestamp))
}

export function fillBlankTimetable(blankTimetable, courses, unscheduledLabel) {
  const finalTimetable = blankTimetable.cloneNode(true)
  courses.forEach(course => {
    course.days.forEach(day => {
      const formartedTimestamp = formatTimestamp(day.timestamps)

      const target_td = finalTimetable.querySelector(`[data-top-header="${formartedTimestamp}"][data-left-header="${day.name}"]`);
      target_td.textContent = course.code
      target_td.setAttribute(`data-color`, course.color);
      target_td.style.backgroundColor = `var(${course.color})`
    })
  })

  addStylingClasses(finalTimetable, unscheduledLabel)
  return finalTimetable
}

function addStylingClasses(table, unscheduledLabel) {
  //  const unscheduledLabel = 'No Class'
  const rows = table.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");

    for (let j = 0; j < cells.length; j++) {
      if (cells[j].innerHTML.trim() !== unscheduledLabel) {
        cells[j].classList.add('scheduled')
      }

      if (cells[j].innerHTML.trim() === unscheduledLabel) {
        cells[j].classList.add("unscheduled");
      }

      if (cells[j - 1] && cells[j - 1].innerHTML.trim() === unscheduledLabel && cells[j].innerHTML.trim() === unscheduledLabel || cells[j - 1] && cells[j - 1].innerHTML.trim() === cells[j].innerHTML.trim()) {
        cells[j].classList.add("following-unscheduled");
      }

      if (i > 1 && rows[i - 1] && rows[i - 1].getElementsByTagName("td")[j].innerHTML.trim() === unscheduledLabel && cells[j].innerHTML.trim() === unscheduledLabel) {
        cells[j].classList.add("below-unscheduled");
      }


    }
  }
}

export function readCSV(file) {
 // console.log('reading file')
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => resolve(event.target.result);
    reader.onerror = error => reject(error);
    reader.readAsText(file);
    console.log(reader.result)
  });
}

let showingPropertiesFor = null
export async function showProperties(courseCode, courses) {
  propertiesCard_div.classList.add('hidden')
  if (!showingPropertiesFor) propertiesCard_div.style.opacity = 0.2
  const alreadyShowing = courseCode === showingPropertiesFor
  propertiesCard_div.classList.remove('hidden')
  propertiesCardOverlay_div.classList.remove('hidden')
  //console.log(courseCode, courses)
  ;
  (!alreadyShowing || !showingPropertiesFor === null) ? await fadeOut(propertiesCard_div): ""
  courses.forEach(course => {
    if (course.code === courseCode) {
      courseCode_p.innerHTML = course.code
      courseGroup_p.innerHTML = course.option
      courseTitle_p.innerHTML = course.title
      courseVenue_p.innerHTML = course.venue
      courseBuilding_p.innerHTML = course.building
      courseLocation_p.innerHTML = course.location
      courseInstructor_p.innerHTML = course.instructor

    }
  });
  (!alreadyShowing || showingPropertiesFor === null) ? await fadeIn(propertiesCard_div): ""
  showingPropertiesFor = courseCode
  propertiesCard_div.style.opacity = 1

}

export function showCsvUploadUI() {
  fileUploadUI_div.classList.remove('hidden')
}

export function hideCsvUploadUI() {
  fileUploadUI_div.classList.add('hidden')
}

export function showToast(message, duration = 3000) {
  const animationDuration = 500
  propertiesCard_div.classList.add('hidden')
  const toastDurationInMillisecond = duration + animationDuration
  console.log({ duration })
  const toast = document.createElement('div');
  toast.innerText = message
  toast.className = 'show toast'
  document.body.append(toast)
  setTimeout(() => {
    toast.remove()
  }, toastDurationInMillisecond);
}

export async function fadeOut(element) {
  // element.classList.remove('fade-in')
  //console.log("out fade")

  return new Promise((resolve, reject) => {
    if (!showingPropertiesFor) return resolve()
    element.classList.add('fade-out')
    element.addEventListener('animationend', () => {
      //console.log("out fade after event")
      element.classList.remove('fade-out')

      resolve()
    })
  })
}

export async function fadeIn(element) {
  //element.classList.remove('fade-out')
  //console.log("fade in")
  return new Promise((resolve, reject) => {
    element.classList.add('fade-in')
    element.addEventListener('animationend', () => {
      element.classList.remove('fade-in')
      //console.log('end')
      resolve()
    })
  })
}

export async function hideProperties() {
  await fadeOut(propertiesCard_div)
  propertiesCard_div.classList.add('hidden')
  propertiesCardOverlay_div.classList.add('hidden')
  showingPropertiesFor = null
}



export function storeTimetable(timetable) {
  let storedTimetables = JSON.parse(localStorage.getItem('timetables'));
  if (!storedTimetables) {
    storedTimetables = [];
  }
  storedTimetables.push(timetable);
  localStorage.setItem('timetables', JSON.stringify(storedTimetables));
}

export const retrieveTimetables = () => JSON.parse(localStorage.getItem('timetables')) || [];


export async function convertElementToImage(element, options) {
  try {
    //alert('starting to call domtoimage')
    const dataUrl = await domtoimage.toPng(element, options);
    return dataUrl;
  } catch (error) {
    console.error(error);
  }
}

function isOverflowing(element) {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

function getWidth(element) {
  // Get the computed style of the element
  let computedStyle = window.getComputedStyle(element);

  // Get the style property for width
  let width = element.style.width
  // Get the offset width of the element
  let offsetWidth = element.offsetWidth;

  // Get the client width of the element
  let clientWidth = element.clientWidth;

  // Calculate the width using all possible methods
  let widthCalculated = Math.min(
    parseInt(computedStyle.width),
    offsetWidth,
    clientWidth
  );

  // Return the width
  //console.log({widthCalculated})
  return widthCalculated;
}


function getScaleToFit(parent) {
  // Check if the element is overflowing its container
  if (isOverflowing(parent)) {
    // Calculate the scale factor to fit the parent within its container
    const scaleX = getWidth(parent) / parent.scrollWidth;
    const scaleY = Infinity //parent.clientHeight / parent.scrollHeight;
    const scale = Math.min(scaleX, scaleY);

    // Return the scale factor
    return scale;
  }

  // Return 1 if the parent is not overflowing its container
  return 1;
}

export function preventElementOverflow(element, parent) {

  const scale = getScaleToFit(parent)
  //console.log(scale, element)
  element.style.transform = `scale(${scale/1.1})`

}

export function show(element) {
  element.classList.remove('hidden')
}

export function hide(element) {
  element.classList.add('hidden')
}

export function downloadImage(dataUrl, name) {
  // Sanitize the file name
  const fileName = sanitizeName(name);

  // Create a link element
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;

  // Append the link to the DOM
  document.body.appendChild(link);

  // Click the link to download the image
  link.click();

  // Remove the link from the DOM
  document.body.removeChild(link);
}

function sanitizeName(name) {
  // Remove any characters that are not letters, numbers, periods, underscores, or hyphens
  let sanitizedName = name.replace(/[^a-zA-Z0-9\.\_\-]/g, '');

  // Replace all dots except the last one with spaces
  sanitizedName = sanitizedName.replace(/\./g, (match, offset, string) => {
    return offset === string.lastIndexOf('.') ? match : ' ';
  });

  // Add the .png extension if it is not already included
  return sanitizedName.endsWith('.png') ? sanitizedName : `${sanitizedName}.png`;
}


export function showLoader() {
  show(loader_div)
}
export function hideLoader() {
  hide(loader_div)
}

export function showCustomInstallPrompt(event) {
  customInstallUI.classList.remove('hidden');
  notNowButton.addEventListener('click', () => {
    customInstallUI.classList.add('hidden');
    console.log('clicked not now')
  })
  customInstallButton.addEventListener('click', () => {
    event.prompt();
    customInstallUI.classList.add('hidden');
    event.userChoice.then((choice) => {

      if (choice.outcome === 'accepted') {
        console.log('The app was installed');
      } else {
        console.log('The app was not installed');
      }
      customInstallUI.classList.add('hidden');
    });
  });
}

function showTimetable(timetable) {
  const allDays = getDays(timetable.courses)
  if (allDays.length === 0) return showToast('Oops! That CSV does not seem to contain a valid timetable.', 5000)
  ////console.log(allDays)
  const allTimestampsFormarted = getFormartedTimestamps(courses)
  ////console.log(allTimestampsFormarted)
  const blankTimetable = createBlankTimetable({ leftHeaders: allDays, topHeaders: allTimestampsFormarted, intersection: '<p>Time</p> <p>Days</p>', blankCellLabel: unscheduledLabel })
  ////console.log(blankTimetable)
  const finalTimetable = fillBlankTimetable(blankTimetable, courses, unscheduledLabel)
}

export function showSavedTimetables() {
  const timetables = retrieveTimetables()


}

export function createThemeInputs(themesContainer, themes) {
  themes.forEach(theme => {
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'theme';
    input.value = theme;
    themesContainer.appendChild(input);
  });
}

// Function to store the current theme in local storage
export function storeCurrentTheme(theme) {
  localStorage.setItem('currentTheme', theme);
}

// Function to retrieve the current theme from local storage
export function getCurrentTheme() {
  return localStorage.getItem('currentTheme');
}
