<script>
  export function getPupilSize(number) {
    if (number >= 100) {
      return 1;
    } else if (number >= 75) {
      return 0.8;
    } else if (number >= 50) {
      return 0.6;
    } else if (number >= 25) {
      return 0.4;
    } else if (number >= 0) {
      return 0.2;
    } else {
      return 0;
    }
  }
</script>
