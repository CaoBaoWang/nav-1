
let isIOS = false;
let isAndroid  = false

if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //移动端
  isIOS = true
  $('#searchForm').attr('target','_blank')

}
if (/(Android)/i.test(navigator.userAgent)) { //移动端
  isAndroid = true
}

const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')
localStorage.setItem('x',null)
const x = localStorage.getItem('x')

const xObject = JSON.parse(x)
const hashMap = xObject || [
  {logo: 'B', url: 'https://www.baidu.com',queryPath:'/s?',queryKey:'wd'},
  {logo: 'G', url: 'https://www.google.com',queryPath:'/search?',queryKey:'q'},
  {logo: 'Z', url: 'https://www.zhihu.com',queryPath:'/search?',queryKey:'q'},
  {logo: 'B', url: 'https://search.bilibili.com',queryPath:'/all?',queryKey:'keyword'},
  {logo: 'D', url: 'https://www.douban.com',queryPath:'/search?',queryKey:'q'},
  {logo: 'Y', url: 'https://www.youtube.com',queryPath:'/results?',queryKey:'search_query'},
  // {logo: 'G', url: 'https://www.github.com',queryPath:'/search?',queryKey:'q'},
  // https://s.weibo.com/weibo?q=fuck


]
let lastSelected = localStorage.getItem('lastSelected')
lastSelected = lastSelected || 1
// 防止删除后越界
lastSelected= lastSelected > hashMap.length ? 0 : lastSelected


const simplifyUrl = (url) => {
  return url.replace('https://', '')
    .replace('http://', '')
    .replace('www.', '')
    .replace(/\/.*/, '') // 删除 / 开头的内容
}

const render = () => {
  $siteList.find('li:not(.last)').remove()
  hashMap.forEach((node, index) => {
    const active = (index+1 === parseInt(lastSelected)) ? 'active': ''
    const $li = $(`<li>
      <div class="site ${active}">
        <div class="logo">${node.logo}</div>
        <div class="link ">${simplifyUrl(node.url)}</div>
        <div class="close">
          <svg class="icon">
            <use xlink:href="#icon-close"></use>
          </svg>
        </div>
      </div>
    </li>`).insertBefore($lastLi)
    $li.on('click', () => {
      openOrSearchWith(node,index)

    })
    $li.on('click', '.close', (e) => {
      e.stopPropagation() // 阻止冒泡
      hashMap.splice(index, 1)
      render()
    })
  })
  openOrSearchWith(hashMap[lastSelected-1],lastSelected-1)
}

function openOrSearchWith(sideItem,index){
  console.log(index )
  console.log(sideItem )

  let selector = `.siteList :nth-child(${index+1}) .site`
  $('.siteList .active').removeClass('active')
  $(selector).addClass('active')
  lastSelected = index+1
  localStorage.setItem('lastSelected',lastSelected)

  if(sideItem.queryPath &&sideItem.queryKey) {
    // todo 使用当前url 搜索
    $('#searchForm').attr('action', sideItem.url + sideItem.queryPath)
    $('#searchInput').attr('name',sideItem.queryKey)

  }

}

render()

$('.addButton').on('click', () => {

  $('.add-site-wrapper').addClass('active')
  return


  let url = window.prompt('请问你要添加的网址是啥？')
  if (url.indexOf('http') !== 0) {
    url = 'https://' + url
  }
  console.log(url)
  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    url: url
  })
  render()
})

window.onbeforeunload = () => {
  const string = JSON.stringify(hashMap)
  localStorage.setItem('x', string)
  localStorage.setItem('lastSelected', lastSelected)

}

$('.add-site-wrapper').on('click',function (e) {
  e.stopPropagation()
  if(e.currentTarget === e.target)
  $(e.currentTarget).removeClass('active')
})

$(document).on('keypress', (e) => {
  // document.querySelector('#searchInput')


  if(document.activeElement.id  === 'searchInput') {
    return
  }
  const {key} = e
  for (let i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      // window.open(hashMap[i].url)
      if(i+1 === lastSelected ){
        continue
      }
      openOrSearchWith(hashMap[i],i)
      break
    }
  }
})
