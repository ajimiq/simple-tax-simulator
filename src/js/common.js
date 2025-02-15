// 数字をカンマ区切り
function formatNumber(num) {
  return num ? num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '';
}

// カンマ区切りを外す
function unFormatNumber(num) {
  return num ? num.toString().replace(/,/g, '') : '';
}
