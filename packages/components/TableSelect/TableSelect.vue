<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>时间段</th>
          <th v-for="day in days" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(time, rowIndex) in timeSlots" :key="rowIndex">
          <td class="time-box">{{ time }}</td>
          <td v-for="colIndex in days.length" :key="colIndex"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
defineOptions({
  name: "TableSelect",
});

const days = ref(["周一", "周二", "周三", "周四", "周五", "周六", "周日"]);
const timeSlots = ref([
  "00:00-02:00",
  "02:00-04:00",
  "04:00-06:00",
  "06:00-08:00",
  "08:00-10:00",
  "10:00-12:00",
  "12:00-14:00",
  "14:00-16:00",
  "16:00-18:00",
  "18:00-20:00",
  "20:00-22:00",
  "22:00-24:00",
]);
</script>

<style scoped>
.table-container {
  user-select: none;
}

table {
  width: 100%;
  table-layout: fixed;
}

th,
td {
  text-align: center;
  border: 1px solid #ddd;
  padding: 4px;
  cursor: pointer;
}

td.selected {
  background-color: rgba(255, 0, 0, 0.3);
  /* 选中样式 */
}

td:hover {
  background-color: rgba(0, 0, 255, 0.1);
  /* 悬停样式 */
}

.table-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: not-allowed;
  z-index: 2;
}
.time-box {
  cursor: not-allowed;
  background-color: #f5f5f5;
  color: #333;
  /* font-weight: bold; */
}
</style>
