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
const inputSearch = document.getElementById('timezone');
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
        <li><a class="dropdown-item rounded-2" href="#" data-timezone="${match.timezone}" data-country="${match.country}" data-city="${match.city}">
        ${match.country}, ${match.city}
        </a></li>
    `
      )
      .join("");

    matchList.innerHTML = html;
    matchList.classList.remove("d-none");

    // 为每个链接添加点击事件监听器
    const links = matchList.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', function(event) {
        //event.preventDefault(); // 阻止默认的链接行为
        const timezone = this.getAttribute('data-timezone');
        const country = this.getAttribute('data-country');
        const city = this.getAttribute('data-city');
        console.log(country);
        performAction(timezone, country, city); // 执行你的JavaScript操作
      });
    });
  } else {
    matchList.innerHTML = "";
    matchList.classList.add("d-none");
  }
};

inputSearch.addEventListener('input', () => searchCities(inputSearch.value));

// 定义你想要执行的操作
function performAction(timezone, country, city) {
  
  matchList.innerHTML = "";
  matchList.classList.add("d-none");
  inputSearch.value = "";

  const requestUrl = `http://worldtimeapi.org/api/timezone/${timezone}`;
  console.log(requestUrl);
  fetch(requestUrl)
  .then((r) => r.json())
  .then((data) => {
    console.log(data);
    
  })
  .catch(error => console.error('Error:', error));
}


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