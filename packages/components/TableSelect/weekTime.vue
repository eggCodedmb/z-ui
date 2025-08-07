<template>
  <!-- 操作区 -->
  <div style="margin-bottom: 10px;">
      <a-form-model>
        <a-form-model-item>
          <a-row>
            <a-col>
              <a-select
                :disabled="isDisabled"
                v-model="templateID"
                style="width: 200px; margin-right: 10px"
                @change="selectTemplate"
                placeholder="请选择模板"
                default-value=""
              >
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="(item, index) in options" :key="index" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
              <a-button :disabled="isDisabled" type="primary" @click="openModal('save')" style="margin-right: 10px">
                保存模板
              </a-button>
              <a-button :disabled="isDisabled" type="primary" @click="openModal('update')" style="margin-right: 10px">
                修改
              </a-button>
              <a-button :disabled="isDisabled" type="danger" @click="delTemplate" style="margin-right: 10px">
                删除
              </a-button>
              <a-button :disabled="isDisabled" type="primary" @click="clearSelection"> 清空选择</a-button>
            </a-col>
          </a-row>
        </a-form-model-item>
      </a-form-model>

    <div class="table-container" @mousedown="handleMouseDown">
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
            <td
              v-for="colIndex in days.length"
              :key="colIndex"
              :class="{ selected: isSelected(rowIndex, colIndex) }"
              @mousedown="startSelection(rowIndex, colIndex)"
              @mousemove="handleMouseMove(rowIndex, colIndex)"
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 遮罩层 -->
    <div v-if="isDisabled" class="table-mask"></div>
    <!-- 创建模板弹窗 -->
    <a-modal v-model="visible" :title="title" @ok="saveTemplate" style="width: 800px">
      <a-form-model ref="form" :model="model" :rules="rules" layout="inline">
        <a-form-model-item label="模板名称" prop="name">
          <a-input v-model="model.name"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  emits: ['update', 'delete', 'save', 'load', 'select', 'clear', 'drag'],
  props: {
    options: {
      type: Array,
      default: () => [],
      required: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: '',
      required: false,
    },
    template: {
      type: Object,
      default: () => ({}),
      required: false,
    },
  },
  data() {
    return {
      visible: false,
      model: {
        name: '',
      },
      type: 'save',
      title: '创建模板',
      days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      timeSlots: [
        '00:00-02:00',
        '02:00-04:00',
        '04:00-06:00',
        '06:00-08:00',
        '08:00-10:00',
        '10:00-12:00',
        '12:00-14:00',
        '14:00-16:00',
        '16:00-18:00',
        '18:00-20:00',
        '20:00-22:00',
        '22:00-24:00',
      ],
      selectedCells: [], // 存储选中路径的单元格
      isMouseDown: false, // 鼠标是否按下
      selectedTimes: {...this.template} || {}, // 选中的时间段
      templateID: this.id || '', // 模板ID
    }
  },
  watch: {
    id: {
      handler(newVal) {
        this.templateID = newVal
      }
    }
  },
  methods: {
    // 打开模板弹窗
    openModal(type) {
      if (type === 'update') {
        if (!this.templateID) return this.$message.error('请选择模板')
        this.title = '修改模板'
        this.type = 'update'
        this.model.name = this.options.find((item) => item.id === this.templateID).name
      } else {
        this.title = '创建模板'
        this.model.name = ''
        this.type = 'save'
      }
      this.visible = true
    },

    //是否选中
    isSelected(rowIndex, colIndex) {
      return this.selectedCells.some((cell) => cell.rowIndex === rowIndex && cell.colIndex === colIndex)
    },

    // 开始选中
    startSelection(rowIndex, colIndex) {
      this.isMouseDown = true
      if (!this.isExist(rowIndex, colIndex)) {
        this.selectedCells.push({ rowIndex, colIndex })
      } else {
        this.selectedCells = this.selectedCells.filter(
          (cell) => cell.rowIndex !== rowIndex || cell.colIndex !== colIndex
        )
      }
    },

    // 鼠标按下
    handleMouseDown() {
      this.isMouseDown = true
    },

    // 鼠标抬起
    handleMouseUp() {
      this.isMouseDown = false
      this.getSelectedTimes()
    },

    // 鼠标移动
    handleMouseMove(rowIndex, colIndex) {
      if (!this.isMouseDown) {
        return
      }

      if (rowIndex === -1 || colIndex === -1 || rowIndex === undefined || colIndex === undefined) {
        return
      }

      if (this.isMouseDown) {
        // 判断是否存在当前单元格
        if (!this.isExist(rowIndex, colIndex)) {
          this.selectedCells.push({ rowIndex, colIndex })
        }
      }
    },

    // 判断rowIndex, colIndex是否在选中的单元格中
    isExist(rowIndex, colIndex) {
      return this.selectedCells.some((cell) => cell.rowIndex === rowIndex && cell.colIndex === colIndex)
    },

    // 获取选中的时间段{周一: ['00:00-02:00', '02:00-04:00']}
    getSelectedTimes() {
      let day = this.days
      let time = this.timeSlots
      let selectedTimes = {}
      this.selectedCells.forEach((cell) => {
        let dayIndex = cell.colIndex - 1
        let timeIndex = cell.rowIndex
        let dayKey = day[dayIndex]
        let timeKey = time[timeIndex]
        if (selectedTimes[dayKey]) {
          selectedTimes[dayKey].push(timeKey)
        } else {
          selectedTimes[dayKey] = [timeKey]
        }
      })
      // 对选中的时间段进行排序
      for (let key in selectedTimes) {
        selectedTimes[key].sort((a, b) => time.indexOf(a) - time.indexOf(b))
      }
      this.selectedTimes = selectedTimes
      if (this.templateID === '') {
        this.$emit('drag', selectedTimes)
      }
    },

    // 通过时间段获取单元格{周一: ['00:00-02:00', '02:00-04:00']}
    getCellsByTime(selectedTimes) {
      if (!selectedTimes) {
        return
      }
      let day = this.days
      let time = this.timeSlots
      let selectedCells = []
      for (let key in selectedTimes) {
        let dayIndex = day.indexOf(key) + 1
        selectedTimes[key].forEach((timeKey) => {
          let timeIndex = time.indexOf(timeKey)
          selectedCells.push({ rowIndex: timeIndex, colIndex: dayIndex })
        })
      }
      this.selectedCells = selectedCells
    },

    /**
     * 自定义事件
     * dmb: 2024-12-21
     */

    // 清空选择
    clearSelection() {
      this.selectedCells = []
      this.selectedTimes = {}
      this.$emit('clear')
    },

    // 选择模板
    selectTemplate() {
      this.$emit('select', this.templateID)
      this.selectedCells = []
      this.selectedTimes = {}
      const template = this.options.find((item) => item.id === this.templateID)
      this.getCellsByTime(template.timeDura)
    },

    // 保存/修改模板
    saveTemplate() {
      const params = {
        name: this.model.name,
        timeDura: this.selectedTimes,
      }
      if (this.type === 'update') {
        // 加入id
        params.id = this.templateID
        this.$emit('save', params)
      } else {
        this.$emit('save', params)
      }
      this.templateID = ''
      this.visible = false
      this.$emit('load')
    },

    delTemplate() {
      if (!this.templateID) return this.$message.error('请选择模板')
      this.$confirm({
        title: '请谨慎删除，可能会影响其他任务',
        onOk: () => {
          this.$emit('delete', this.templateID)
          this.$emit('load')
          this.templateID = ''
          this.selectedTimes = {}
          this.selectedCells = []
        },
      })
    },
  },
  mounted() {
    this.$emit('load')
    if (this.id) {
      // 加载模板
      const myTemp = this.options.find((item) => item.id === this.templateID)
      // 加载模板
      this.getCellsByTime(myTemp.timeDura)
    } else {
      // 加载默认模板
      this.getCellsByTime(this.template)
    }

    // 添加全局鼠标抬起事件监听器
    document.addEventListener('mouseup',()=>{
      this.handleMouseUp()
    })
  },

  // 组件销毁时移除全局鼠标抬起事件监听器
  beforeDestroy() {
    // 移除全局鼠标抬起事件监听器
    document.removeEventListener('mouseup', this.handleMouseUp)
  },
}
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
