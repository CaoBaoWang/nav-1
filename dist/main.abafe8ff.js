// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var isIOS = false;
var isAndroid = false;

if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
  //移动端
  isIOS = true;
  $('#searchForm').attr('target', '_blank');
}

if (/(Android)/i.test(navigator.userAgent)) {
  //移动端
  isAndroid = true;
}

var $siteList = $('.siteList');
var $lastLi = $siteList.find('li.last');
localStorage.setItem('x', null);
var x = localStorage.getItem('x');
var xObject = JSON.parse(x);
var hashMap = xObject || [{
  logo: 'B',
  url: 'https://www.baidu.com',
  queryPath: '/s?',
  queryKey: 'wd'
}, {
  logo: 'G',
  url: 'https://www.google.com',
  queryPath: '/search?',
  queryKey: 'q'
}, {
  logo: 'Z',
  url: 'https://www.zhihu.com',
  queryPath: '/search?',
  queryKey: 'q'
}, {
  logo: 'B',
  url: 'https://search.bilibili.com',
  queryPath: '/all?',
  queryKey: 'keyword'
}, {
  logo: 'D',
  url: 'https://www.douban.com',
  queryPath: '/search?',
  queryKey: 'q'
}, {
  logo: 'Y',
  url: 'https://www.youtube.com',
  queryPath: '/results?',
  queryKey: 'search_query'
}, {
  logo: 'G',
  url: 'https://www.github.com',
  queryPath: '/search?',
  queryKey: 'q'
}, {
  logo: 'M',
  url: 'https://developer.mozilla.org',
  queryPath: '/search?',
  queryKey: 'q'
}, {
  logo: 'T',
  url: 'https://s.taobao.com',
  queryPath: '/search?',
  queryKey: 'q'
}, {
  logo: 'W',
  url: 'https://zh.wikipedia.org',
  queryPath: '/wiki/',
  queryKey: ''
} // https://s.weibo.com/weibo?q=fuck
];
var lastSelected = localStorage.getItem('lastSelected');
lastSelected = lastSelected || 1; // 防止删除后越界

lastSelected = lastSelected > hashMap.length ? 0 : lastSelected;

var simplifyUrl = function simplifyUrl(url) {
  return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, ''); // 删除 / 开头的内容
};

var render = function render() {
  $siteList.find('li:not(.last)').remove();
  hashMap.forEach(function (node, index) {
    var active = index + 1 === parseInt(lastSelected) ? 'active' : '';
    var $li = $("<li>\n      <div class=\"site ".concat(active, "\">\n        <div class=\"logo\">").concat(node.logo, "</div>\n        <div class=\"link \">").concat(simplifyUrl(node.url), "</div>\n        <div class=\"close\">\n          <svg class=\"icon\">\n            <use xlink:href=\"#icon-close\"></use>\n          </svg>\n        </div>\n      </div>\n    </li>")).insertBefore($lastLi);
    $li.on('click', function () {
      openOrSearchWith(node, index);
    });
    $li.on('click', '.close', function (e) {
      e.stopPropagation(); // 阻止冒泡

      hashMap.splice(index, 1);
      render();
    });
  });
  openOrSearchWith(hashMap[lastSelected - 1], lastSelected - 1);
};

function openOrSearchWith(sideItem, index) {
  console.log(index);
  console.log(sideItem);
  var selector = ".siteList :nth-child(".concat(index + 1, ") .site");
  $('.siteList .active').removeClass('active');
  $(selector).addClass('active');
  lastSelected = index + 1;
  localStorage.setItem('lastSelected', lastSelected);

  if (sideItem.queryPath) {
    // todo 使用当前url 搜索
    $('#searchForm').attr('action', sideItem.url + sideItem.queryPath);
    $('#searchInput').attr('name', sideItem.queryKey);
  }
}

render();
$('.addButton').on('click', function () {
  $('.add-site-wrapper').addClass('active');
  return;
  var url = window.prompt('请问你要添加的网址是啥？');

  if (url.indexOf('http') !== 0) {
    url = 'https://' + url;
  }

  console.log(url);
  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    url: url
  });
  render();
});

window.onbeforeunload = function () {
  var string = JSON.stringify(hashMap);
  localStorage.setItem('x', string);
  localStorage.setItem('lastSelected', lastSelected);
};

$('.add-site-wrapper').on('click', function (e) {
  e.stopPropagation();
  if (e.currentTarget === e.target) $(e.currentTarget).removeClass('active');
});
$('#searchForm').on('submit', function (e) {
  var action = $('#searchForm').attr('action');

  if (action.indexOf('wikipedia') > -1) {
    e.preventDefault();
    window.location = action + $('#searchInput').val();
  }
});
$(document).on('keypress', function (e) {
  // document.querySelector('#searchInput')
  if (document.activeElement.id === 'searchInput') {
    return;
  }

  var key = e.key;

  for (var i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      // window.open(hashMap[i].url)
      if (i + 1 === lastSelected) {
        continue;
      }

      openOrSearchWith(hashMap[i], i);
      break;
    }
  }
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.abafe8ff.js.map