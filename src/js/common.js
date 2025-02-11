// 数字をカンマ区切り
function formatNumber(num) {
  return num ? num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '';
}
