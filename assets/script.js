$(document).ready(function () {

    var searchHistory = [];

    const momentDay = moment().format('dddd, MMMM Do');
    $('.todayDate').prepend(momentDay);


    $('form').on('submit', function (event) {
        event.preventDefault();
        let city = $('input').val();
        if (city === '') {

        }
        call();

    });


    $('.searchHistoryEl').on('click', '.historyBtn', function (event) {
        event.preventDefault();
        let btnCityName = $(this).text();
        call(btnCityName);
    });

    $('#clearBtn').on('click', function (event) {
        window.localStorage.clear();
        $('.searchHistoryEl').empty();
        searchHistory = [];
        renderButtons();
    });

    const storeCities = () =>
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    const renderButtons = () => {

        $('.searchHistoryEl').html('');
        for (var j = 0; j < searchHistory.length; j++) {
            let cityName1 = searchHistory[j];
            let historyBtn = $(
                '<button type="button" class="btn btn-primary btn-lg btn-block historyBtn">'
            ).text(cityName1);
            $('.searchHistoryEl').prepend(historyBtn);
        }
    };


    const init = () => {
        let storedCities = JSON.parse(localStorage.getItem('searchHistory'));
        if (storedCities !== null) {
            searchHistory = storedCities;
        }
        renderButtons();
    };





    const call = (btnCityName) => {
        let cityName = btnCityName || $('input').val();
        let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=77cb488591d883bec900753d1136d81c`;
        $.ajax({
            url: queryURL,
            method: 'GET',
        })
            .then(function (response) {
                if (!btnCityName) {
                    searchHistory.unshift(cityName);
                    storeCities();
                    renderButtons();
                }

                var lon = response.coord.lon;
                var lat = response.coord.lat;

                $('#cityName').text(response.name);
                $('#currentImg').attr(
                    'src',
                    `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
                );
                $('#tempData').html(`${response.main.temp} &#8457;`);
                $('#humidData').html(`${response.main.humidity}%`);
                $('#windData').html(`${response.wind.speed} mph`);
                $('#windArrow').css({
                    transform: `rotate(${response.wind.deg}deg)`,
                });
            })

    };

    call(searchHistory[0]);
});

init();