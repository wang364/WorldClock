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
        performAction(timezone, country, city); // 执行你的JavaScript操作
      });
    });
  } else {
    matchList.innerHTML = "";
    matchList.classList.add("d-none");
  }
};

inputSearch.addEventListener('input', () => searchCities(inputSearch.value));
inputSearch.addEventListener('keydown', function (event) {
  // 检查是否按下了回车键
  if (event.key === 'Enter') {
    event.preventDefault(); // 阻止默认的提交表单行为

    // 在这里执行你想要的操作
    if (matchList.firstElementChild) {
      const itm = matchList.firstElementChild.querySelector('a');
      const timezone = itm.getAttribute('data-timezone');
      const country = itm.getAttribute('data-country');
      const city = itm.getAttribute('data-city');

      performAction(timezone, country, city); // 执行你的JavaScript操作
    }
  }
});

// 定义你想要执行的操作
function performAction(timezone, country, city) {
  
  matchList.innerHTML = "";
  matchList.classList.add("d-none");
  inputSearch.value = "";

  const requestUrl = `http://worldtimeapi.org/api/timezone/${timezone}`;

  fetch(requestUrl)
  .then((r) => r.json())
  .then((data) => {
    addCity(data, country, city);
  })
  .catch(error => console.error('Error:', error));
}

function formatDate(isoString) {
  if (isoString === undefined) {
    var d = new Date();
  } else {
    var d = new Date(isoString);
  }
    var month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

function getLocalDate(isoString) {
  var datePart = isoString.match(/^(\d{4}-\d{2}-\d{2})/)[1];
  // 正则表达式匹配时间部分
  var timePart = isoString.match(/T(\d{2}:\d{2}:\d{2}\.\d+)/)[1];

  // 创建一个新的Date对象，这里不需要包含时区偏移
  return new Date(`/${datePart} ${timePart}`);
}

function formatTime(isoString) {
  
  var date = getLocalDate(isoString);

  return date.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" });
}

function formatWeek(isoString) {
  var date = getLocalDate(isoString);
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString("en-US", options);
}

// Add city to city list
const cityList = document.getElementById('city-list');

function addCity(data, country, city) {
  // 判断城市是否已经在城市列表里
  // 添加城市
  var time = formatTime(data.datetime);
  var week = formatWeek(data.datetime);
  const htmlCity = `
  <div class="row align-items-center">
        <div class="col-auto col-pad"> <!-- up down arrow -->
          <div class="d-grid">
            <button type="button" class="btn btn-default btn-sm btn-pad" >
              <i class="fa fa-sort-asc" aria-hidden="true"></i>
            </button>
            <button type="button" class="btn btn-default btn-sm btn-pad" >
              <i class="fa fa-sort-desc" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <div class="col-3"> <!-- city country -->
          <div ><b>${city}</b> <span class="fs-sm align-top">${data.abbreviation}</span></div>
          <div class="fs-sm">${country}</div>
        </div>
        <div class="col-auto"> <!-- date time -->
          <div class="text-end fw-bold">${time}</div>
          <div class="text-end fs-sm">${week}</div>
        </div>
        <div class="col"> <!-- 24 hours -->
          <div class="row justify-content-center hours-24">
            <div class="col-auto hour hour-1"><b>1</b></div>
            <div class="col-auto hour hour-1"><b>2</b></div>
            <div class="col-auto hour hour-1"><b>3</b></div>
            <div class="col-auto hour hour-1"><b>4</b></div>
            <div class="col-auto hour hour-1"><b>5</b></div>
            <div class="col-auto hour hour-6"><b>6</b></div>
            <div class="col-auto hour hour-7"><b>7</b></div>
            <div class="col-auto hour hour-9"><b>8</b></div>
            <div class="col-auto hour hour-9"><b>9</b></div>
            <div class="col-auto hour"><b>10</b></div>
            <div class="col-auto hour"><b>11</b></div>
            <div class="col-auto hour"><b>12</b></div>
            <div class="col-auto hour"><b>13</b></div>
            <div class="col-auto hour"><b>14</b></div>
            <div class="col-auto hour"><b>15</b></div>
            <div class="col-auto hour"><b>16</b></div>
            <div class="col-auto hour"><b>17</b></div>
            <div class="col-auto hour"><b>18</b></div>
            <div class="col-auto hour"><b>19</b></div>
            <div class="col-auto hour"><b>20</b></div>
            <div class="col-auto hour"><b>21</b></div>
            <div class="col-auto hour"><b>22</b></div>
            <div class="col-auto hour"><b>23</b></div>
            <div class="col-auto hour"><b>24</b></div>
          </div>
        </div>
        <div class="col-auto">
          <button type="button" class="btn btn-default">
            <i class="fa fa-trash-o" aria-hidden="true"></i>
          </button>
        </div>
      </div>
  `;

  cityList.insertAdjacentHTML('beforeend', htmlCity);
}
