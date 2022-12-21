
















//console.log(JSON.stringify(cleanCsv(csv)))
console.log(getTimestamps(parseCsv(csv)))
//document.body.append(createScheduleTable(parseCsv(csv)))

/*layout*/
/*v5 by me*/







let timeslots = [
     "06:00:00 to 07:00:00",
     "08:00:00 to 09:30:00",
    "09:00:00 to 10:00:00",
    "12:00:00 to 13:00:00",
    "14:00:00 to 16:00:00"
  ];

const table = createBlankTimetable({ leftHeaders: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], topHeaders: timeslots, intersection: 'X' })
document.body.append(table)
