// Document ready
$(function () {

  var today = formatDate();
  $('#datepicker').val(today);
  $('#datepicker').datepicker({
    language: 'en',
    autoclose: true,
    format: 'yyyy-mm-dd',
    todayHighlight: true,
    defaultDate: today
  });
  
});

/*** input city suggest */
const search = document.getElementById('timezone');
const matchList = document.getElementById('match-list');

const searchCities = async searchText => {
  const res = await fetch('../data/cityMap.json');
  const cities = await res.json();
  
  // Get matches to current text input
  let matches = cities.filter(city => {
    const regex = new RegExp(`${searchText}`, 'gi');
    return city.city.match(regex) || city.city_ascii.match(regex);
  });
  if (searchText.length === 0) {
    matches = [];
    matchList.innerHTML = '';
    matchList.classList.add('d-none');
  }

  outputHtml(matches, 10);
}

const outputHtml = (matches, maxItems = 5) => {
  const displayMatches = matches.slice(0, maxItems);
  if (displayMatches.length > 0) {
    const html = displayMatches
      .map(
        (match) => `
        <li><a class="dropdown-item rounded-2" href="#">
        ${match.country}, ${match.city}
        </a></li>
    `
      )
      .join("");

    matchList.innerHTML = html;
    matchList.classList.remove("d-none");
  } else {
    matchList.innerHTML = "";
    matchList.classList.add("d-none");
  }
};

search.addEventListener('input', () => searchCities(search.value));

function formatDate() {
  var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}