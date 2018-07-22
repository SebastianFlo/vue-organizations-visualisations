<script>
  export const currency = function (value) {
    if (!value) return ''
    value = value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return value + ' £';
  };

  export const formatDate = function (value) {
    if (!value) return ''
    value = value.substring(0, 4);
    return value;
  };

  export default {};
</script>
