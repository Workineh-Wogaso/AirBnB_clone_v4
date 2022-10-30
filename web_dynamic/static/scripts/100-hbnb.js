document.addEventListener('DOMContentLoaded', function () {
  let localhost = true;
  let urlPrefix = 'http://0.0.0.0';
  let $h4Amenities = $('div.amenities h4');
  let $h4Locations = $('div.locations h4');
  let amenitiesFilter = [];
  let statesFilter = [];
  let citiesFilter = [];

  if (localhost) {
    urlPrefix = 'http://localhost';
  }

  // sort places in alphabetical order
  function compare (a, b) {
    if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
    if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
    return 0;
  }

  // display places according to all filters
  $('button').click(function () {
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: urlPrefix + ':5001/api/v1/places_search/',
      data: JSON.stringify({'amenities': amenitiesFilter, 'states': statesFilter, 'cities': citiesFilter}),
      success: function (data) {
        emptyPlaces();
        data.sort(compare);
        populatePlaces(data);
      }

    });
  });

  // amenities checkboxes
  $('div.amenities input').each(function (idx, ele) {
    let id = $(this).attr('data-id');
    let name = $(this).attr('data-name');

    // set change method on checkboxes
    $(ele).change(function () {
      let delimiter = '<span class="delim">, </span>';
      $('div.amenities h4 span.delim').remove();

      if (this.checked) {
        $h4Amenities.append('<span id=' + id + '>' + name + '</span>');
        amenitiesFilter.push(id);
      } else {
        $('span#' + id).remove();
        amenitiesFilter.splice(amenitiesFilter.indexOf(id), 1);
      }

      // add delimeter
      let length = $('div.amenities h4 > span').length;
      $('div.amenities h4 span').each(function (idx, ele) {
        if (idx < length - 1) {
          $(this).append(delimiter);
        }
      });
    });
  });

  // location checkboxes
  $('div.locations input').each(function (idx, ele) {
    let id = $(this).attr('data-id');
    let name = $(this).attr('data-name');
    let isClass = $(this).attr('data-class');

    // set change method on checkboxes
    $(ele).change(function () {
      let delimiter = '<span class="delim">, </span>';
      $('div.locations h4 span.delim').remove();

      if (this.checked) {
        $h4Locations.append('<span id=' + id + '>' + name + '</span>');
        if (isClass === 'State') {
          statesFilter.push(id);
        } else {
          citiesFilter.push(id);
        }
      } else {
        $('span#' + id).remove();
        if (isClass === 'State') {
          statesFilter.splice(statesFilter.indexOf(id), 1);
        } else {
          citiesFilter.splice(citiesFilter.indexOf(id), 1);
        }
      }

