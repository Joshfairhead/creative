document.addEventListener('DOMContentLoaded', function () {
  var cardGrid = document.getElementById('card-grid');
  if (!cardGrid) return;

  var sortMenu = document.querySelector('[data-menu="sort"]');
  var filterMenu = document.querySelector('[data-menu="filter"]');
  if (!sortMenu || !filterMenu) return;

  var sortDetails = document.querySelector('#sort-menu details');
  var filterDetails = document.querySelector('#filter-menu details');
  var cards = Array.from(cardGrid.querySelectorAll('.content-card'));
  var activeTags = new Set();
  var sortMode = 'date_desc';
  var params = new URLSearchParams(window.location.search);
  var locked = params.get('f') === '1';

  var sortLabels = {
    date_desc: 'Date (newest)',
    date_asc: 'Date (oldest)',
    title_asc: 'Title A–Z',
    tag_asc: 'Tag A–Z'
  };

  function readURL() {
    var tagsParam = params.get('tags');
    if (tagsParam) {
      tagsParam.split(',').forEach(function (t) {
        var tag = t.trim();
        if (tag) activeTags.add(tag);
      });
    }
    var sortParam = params.get('sort');
    if (sortParam && sortLabels[sortParam]) sortMode = sortParam;
  }

  function updateURL() {
    var url = new URL(window.location);
    if (activeTags.size === 0) {
      url.searchParams.delete('tags');
    } else {
      url.searchParams.set('tags', Array.from(activeTags).join(','));
    }
    if (sortMode === 'date_desc') {
      url.searchParams.delete('sort');
    } else {
      url.searchParams.set('sort', sortMode);
    }
    window.history.replaceState({}, '', url);
  }

  function getCardTags(card) {
    return (card.getAttribute('data-tags') || '')
      .split(',')
      .map(function (t) { return t.trim(); })
      .filter(function (t) { return t.length > 0; });
  }

  function getFirstTag(card) {
    var tags = getCardTags(card);
    return tags.length > 0 ? tags[0].toLowerCase() : '￿';
  }

  function getDate(card) {
    return card.getAttribute('data-date') || '';
  }

  function getTitle(card) {
    return (card.getAttribute('data-title') || '').toLowerCase();
  }

  function sortCards() {
    var sorted = cards.slice();
    if (sortMode === 'date_desc') {
      sorted.sort(function (a, b) { return getDate(b).localeCompare(getDate(a)); });
    } else if (sortMode === 'date_asc') {
      sorted.sort(function (a, b) { return getDate(a).localeCompare(getDate(b)); });
    } else if (sortMode === 'title_asc') {
      sorted.sort(function (a, b) { return getTitle(a).localeCompare(getTitle(b)); });
    } else if (sortMode === 'tag_asc') {
      sorted.sort(function (a, b) { return getFirstTag(a).localeCompare(getFirstTag(b)); });
    }
    sorted.forEach(function (card) { cardGrid.appendChild(card); });
  }

  function filterCards() {
    var showAll = activeTags.size === 0;
    cards.forEach(function (card) {
      var visible;
      if (showAll) {
        visible = true;
      } else {
        var cardTags = getCardTags(card);
        visible = Array.from(activeTags).every(function (tag) {
          return cardTags.indexOf(tag) !== -1;
        });
      }
      card.style.display = visible ? '' : 'none';
    });
  }

  function updateSortUI() {
    sortMenu.querySelectorAll('[data-sort]').forEach(function (opt) {
      opt.classList.toggle('active', opt.getAttribute('data-sort') === sortMode);
    });
  }

  function updateFilterUI() {
    var countEl = document.querySelector('[data-active-filter-count]');
    if (countEl) {
      countEl.textContent = activeTags.size > 0 ? String(activeTags.size) : '';
    }
    filterMenu.querySelectorAll('input[data-filter-tag]').forEach(function (input) {
      input.checked = activeTags.has(input.getAttribute('data-filter-tag'));
    });
  }

  function applyAll() {
    sortCards();
    filterCards();
    updateSortUI();
    updateFilterUI();
    updateURL();
  }

  if (locked) {
    if (sortDetails) sortDetails.parentElement.style.display = 'none';
    if (filterDetails) filterDetails.parentElement.style.display = 'none';
    cardGrid.querySelectorAll('[data-card-tag]').forEach(function (el) {
      el.style.cursor = 'default';
    });
  } else {
    sortMenu.querySelectorAll('[data-sort]').forEach(function (opt) {
      opt.addEventListener('click', function () {
        sortMode = opt.getAttribute('data-sort');
        applyAll();
        if (sortDetails) sortDetails.open = false;
      });
    });

    filterMenu.querySelectorAll('input[data-filter-tag]').forEach(function (input) {
      input.addEventListener('change', function () {
        var tag = input.getAttribute('data-filter-tag');
        if (input.checked) {
          activeTags.add(tag);
        } else {
          activeTags.delete(tag);
        }
        applyAll();
      });
    });

    var clearBtn = filterMenu.querySelector('[data-clear-filter]');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        activeTags.clear();
        applyAll();
      });
    }

    document.addEventListener('click', function (e) {
      [sortDetails, filterDetails].forEach(function (d) {
        if (d && d.open && !d.contains(e.target)) d.open = false;
      });
    });

    cardGrid.addEventListener('click', function (e) {
      var tagEl = e.target.closest('[data-card-tag]');
      if (tagEl) {
        e.preventDefault();
        e.stopPropagation();
        var tag = tagEl.getAttribute('data-card-tag');
        if (activeTags.has(tag)) {
          activeTags.delete(tag);
        } else {
          activeTags.add(tag);
        }
        applyAll();
      }
    });
  }

  readURL();
  applyAll();
});
